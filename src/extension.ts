import {extensionConfig} from './config';
import definitions from './block-definitions.json';

type BlockTypeName = 'COMMAND' | 'REPORTER' | 'BOOLEAN' | 'HAT';
type ArgumentTypeName = 'STRING' | 'NUMBER' | 'BOOLEAN';
type ARStatus = 'idle' | 'starting' | 'running' | 'no-camera-source' | 'camera-error';
type AREventType = 'found' | 'lost';
type Axis = 'x' | 'y' | 'z';
type Vec3 = {x: number; y: number; z: number};

interface DefinitionArgument {
  type: ArgumentTypeName;
  defaultValue?: string | number | boolean;
}

interface BlockDefinition {
  opcode: string;
  blockType: BlockTypeName;
  text: string;
  description: string;
  arguments: Record<string, DefinitionArgument>;
}

interface CameraFrameSource {
  readonly kind: 'video';
  readonly element: HTMLVideoElement;
  readonly width: number;
  readonly height: number;
  /**
   * How Camera Source is drawing its own preview of these frames.
   *
   * A flip is a rendering choice and never reaches the pixels, so the background shown here is
   * turned over to match what the operator is already looking at rather than because the frames
   * arrived that way.
   */
  readonly previewFlip: PreviewFlip;
  readonly deviceId: string;
}

/** The flip vocabulary Camera Source publishes on a frame source. */
type PreviewFlip = 'none' | 'horizontal' | 'vertical' | 'both';

/** Matches the background to the preview. An unknown value leaves the image as it arrived. */
function backgroundTransform(flip: PreviewFlip | undefined): string {
  const horizontal = flip === 'horizontal' || flip === 'both';
  const vertical = flip === 'vertical' || flip === 'both';
  if (horizontal && vertical) return 'scale(-1, -1)';
  if (horizontal) return 'scaleX(-1)';
  if (vertical) return 'scaleY(-1)';
  return '';
}

interface CameraLease {
  getFrameSource(): CameraFrameSource;
  release(): Promise<void>;
}

interface CameraSourceRuntime {
  acquireCamera(options: {
    owner?: string;
    cameraId?: string;
    deviceId?: string;
    previewFlip?: PreviewFlip;
  }): Promise<CameraLease>;
}

interface ARTargetState {
  id: string;
  visible: boolean;
  confidence: number;
  position: Vec3;
  rotation: Vec3;
  attachedSelectors: Set<string>;
}

interface ARTargetEvent {
  type: AREventType;
  targetId: string;
}

interface ARSession {
  cameraId: string;
  layer: string;
  lease: CameraLease;
  background: HTMLElement | null;
}

const blockDefinitions = definitions.blocks as readonly BlockDefinition[];
const CAMERA_SOURCE_RUNTIME_ID = 'ext_kubohiroyacamerasource';
const EXTENSION_OWNER = 'turbowarp-ar';

export class TurboWarpARExtension implements TurboWarpExtension {
  private readonly targets = new Map<string, ARTargetState>();
  private readonly targetEvents: ARTargetEvent[] = [];
  private status: ARStatus = 'idle';
  private session: ARSession | null = null;
  private sceneGeneration = 0;

  public getInfo(): Record<string, unknown> {
    return {
      id: extensionConfig.id,
      name: Scratch.translate(definitions.extensionName),
      docsURI: extensionConfig.docsURI,
      blockIconURI: extensionConfig.blockIconURI,
      blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
    };
  }

  public async createARScene(args: {CAMERA_ID: unknown; LAYER: unknown}): Promise<void> {
    await this.stopARScene();
    const cameraSource = this.cameraSource();
    if (cameraSource === null) {
      this.status = 'no-camera-source';
      return;
    }

    const cameraId = this.normalizeId(Scratch.Cast.toString(args.CAMERA_ID), 'default');
    const layer = this.normalizeLayer(Scratch.Cast.toString(args.LAYER));
    const generation = ++this.sceneGeneration;
    let lease: CameraLease | null = null;
    let background: HTMLElement | null = null;
    this.status = 'starting';

    try {
      lease = await cameraSource.acquireCamera({owner: EXTENSION_OWNER, cameraId});
      if (generation !== this.sceneGeneration) {
        await this.releaseLease(lease);
        return;
      }

      background = this.createBackground(lease.getFrameSource(), cameraId, layer);
      if (generation !== this.sceneGeneration) {
        background?.remove();
        await this.releaseLease(lease);
        return;
      }

      this.session = {cameraId, layer, lease, background};
      this.status = 'running';
      this.syncAllAttachments();
    } catch {
      background?.remove();
      if (lease !== null) {
        await this.releaseLease(lease);
      }
      if (generation === this.sceneGeneration) {
        this.status = 'camera-error';
        this.session = null;
      }
    }
  }

  public async stopARScene(): Promise<void> {
    this.sceneGeneration++;
    const current = this.session;
    this.session = null;
    current?.background?.remove();
    if (current !== null) {
      await this.releaseLease(current.lease);
    }
    this.status = 'idle';
  }

  public arStatus(): string {
    return this.status;
  }

  public isARSceneRunning(): boolean {
    return this.status === 'running' && this.session !== null;
  }

  public defineARTarget(args: {TARGET_ID: unknown}): void {
    const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
    target.visible = false;
    target.confidence = 0;
    target.position = {x: 0, y: 0, z: 0};
    target.rotation = {x: 0, y: 0, z: 0};
    this.syncTargetAttachments(target);
  }

  public setARTargetVisible(args: {
    TARGET_ID: unknown;
    VISIBLE: unknown;
    CONFIDENCE: unknown;
  }): void {
    const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
    const nextVisible = Scratch.Cast.toBoolean(args.VISIBLE);
    const previousVisible = target.visible;
    target.visible = nextVisible;
    target.confidence = this.clamp01(Scratch.Cast.toNumber(args.CONFIDENCE));

    if (!previousVisible && nextVisible) {
      this.targetEvents.push({type: 'found', targetId: target.id});
    } else if (previousVisible && !nextVisible) {
      this.targetEvents.push({type: 'lost', targetId: target.id});
    }
    this.syncTargetAttachments(target);
  }

  public setARTargetPosition(args: {
    TARGET_ID: unknown;
    X: unknown;
    Y: unknown;
    Z: unknown;
  }): void {
    const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
    target.position = this.argsToVec3(args);
    this.syncTargetAttachments(target);
  }

  public setARTargetRotation(args: {
    TARGET_ID: unknown;
    X: unknown;
    Y: unknown;
    Z: unknown;
  }): void {
    const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
    target.rotation = this.argsToVec3(args);
    this.syncTargetAttachments(target);
  }

  public isARTargetVisible(args: {TARGET_ID: unknown}): boolean {
    return this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)))?.visible ?? false;
  }

  public arTargetConfidence(args: {TARGET_ID: unknown}): number {
    return this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)))?.confidence ?? 0;
  }

  public arTargetPosition(args: {TARGET_ID: unknown; AXIS: unknown}): number {
    const target = this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)));
    return target?.position[this.normalizeAxis(Scratch.Cast.toString(args.AXIS))] ?? 0;
  }

  public arTargetRotation(args: {TARGET_ID: unknown; AXIS: unknown}): number {
    const target = this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)));
    return target?.rotation[this.normalizeAxis(Scratch.Cast.toString(args.AXIS))] ?? 0;
  }

  public whenARTargetFound(args: {TARGET_ID: unknown}): boolean {
    return this.consumeTargetEvent('found', Scratch.Cast.toString(args.TARGET_ID));
  }

  public whenARTargetLost(args: {TARGET_ID: unknown}): boolean {
    return this.consumeTargetEvent('lost', Scratch.Cast.toString(args.TARGET_ID));
  }

  public attachSelectorToARTarget(args: {SELECTOR: unknown; TARGET_ID: unknown}): void {
    const selector = Scratch.Cast.toString(args.SELECTOR).trim();
    if (selector.length === 0) return;
    const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
    target.attachedSelectors.add(selector);
    this.syncTargetAttachments(target);
  }

  public detachSelectorFromARTarget(args: {SELECTOR: unknown}): void {
    const selector = Scratch.Cast.toString(args.SELECTOR).trim();
    if (selector.length === 0) return;
    for (const target of this.targets.values()) {
      target.attachedSelectors.delete(selector);
    }
  }

  public snapshot(): Record<string, unknown> {
    return {
      status: this.status,
      session:
        this.session === null
          ? null
          : {
              cameraId: this.session.cameraId,
              layer: this.session.layer
            },
      targets: [...this.targets.values()].map((target) => ({
        id: target.id,
        visible: target.visible,
        confidence: target.confidence,
        position: target.position,
        rotation: target.rotation,
        attachedSelectors: [...target.attachedSelectors].sort()
      }))
    };
  }

  private cameraSource(): CameraSourceRuntime | null {
    const candidate = Scratch.vm.runtime[CAMERA_SOURCE_RUNTIME_ID];
    if (
      typeof candidate === 'object' &&
      candidate !== null &&
      'acquireCamera' in candidate &&
      typeof candidate.acquireCamera === 'function'
    ) {
      return candidate as CameraSourceRuntime;
    }
    return null;
  }

  private async releaseLease(lease: CameraLease): Promise<void> {
    try {
      await lease.release();
    } catch {
      // Release failures should not leave Scratch-visible AR state half-updated.
    }
  }

  private createBackground(
    source: CameraFrameSource,
    cameraId: string,
    layer: string
  ): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    const existing = document.getElementById('tw-ar-root');
    existing?.remove();

    const host = document.createElement('div');
    host.id = 'tw-ar-root';
    host.dataset['twArCameraId'] = cameraId;
    host.dataset['twArLayer'] = layer;
    host.style.position = 'absolute';
    host.style.inset = '0';
    host.style.overflow = 'hidden';
    host.style.pointerEvents = 'none';
    host.style.zIndex = layer === 'below-stage' ? '0' : '9';

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.srcObject = source.element.srcObject;
    video.dataset['twArBackground'] = 'true';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.transform = backgroundTransform(source.previewFlip);
    host.append(video);
    document.body.append(host);
    void video.play();
    return host;
  }

  private ensureTarget(value: string): ARTargetState {
    const id = this.normalizeId(value);
    const existing = this.targets.get(id);
    if (existing !== undefined) return existing;
    const target: ARTargetState = {
      id,
      visible: false,
      confidence: 0,
      position: {x: 0, y: 0, z: 0},
      rotation: {x: 0, y: 0, z: 0},
      attachedSelectors: new Set()
    };
    this.targets.set(id, target);
    return target;
  }

  private consumeTargetEvent(type: AREventType, targetId: string): boolean {
    const normalizedId = this.normalizeId(targetId);
    const index = this.targetEvents.findIndex(
      (event) => event.type === type && event.targetId === normalizedId
    );
    if (index < 0) return false;
    this.targetEvents.splice(index, 1);
    return true;
  }

  private syncAllAttachments(): void {
    for (const target of this.targets.values()) {
      this.syncTargetAttachments(target);
    }
  }

  private syncTargetAttachments(target: ARTargetState): void {
    if (typeof document === 'undefined') return;
    for (const selector of target.attachedSelectors) {
      for (const element of this.elementsForSelector(selector)) {
        element.setAttribute('visible', String(target.visible));
        element.setAttribute('position', this.formatVec3(target.position));
        element.setAttribute('rotation', this.formatVec3(target.rotation));
        element.setAttribute('data-ar-target', target.id);
        element.setAttribute('data-ar-confidence', String(target.confidence));
      }
    }
  }

  private elementsForSelector(selector: string): Element[] {
    try {
      return [...document.querySelectorAll(selector)];
    } catch {
      return [];
    }
  }

  private argsToVec3(args: {X: unknown; Y: unknown; Z: unknown}): Vec3 {
    return {
      x: Scratch.Cast.toNumber(args.X),
      y: Scratch.Cast.toNumber(args.Y),
      z: Scratch.Cast.toNumber(args.Z)
    };
  }

  private formatVec3(value: Vec3): string {
    return `${value.x} ${value.y} ${value.z}`;
  }

  private normalizeAxis(value: string): Axis {
    const axis = value.trim().toLowerCase();
    return axis === 'y' || axis === 'z' ? axis : 'x';
  }

  private normalizeLayer(value: string): string {
    return value.trim() === 'below-stage' ? 'below-stage' : 'above-stage';
  }

  private normalizeId(value: string, fallback = 'target'): string {
    return value.trim().replace(/[^a-zA-Z0-9_-]/g, '-') || fallback;
  }

  private clamp01(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(1, value));
  }

  private toScratchBlock(block: BlockDefinition): Record<string, unknown> {
    return {
      opcode: block.opcode,
      blockType: Scratch.BlockType[block.blockType],
      text: Scratch.translate(block.text),
      arguments: Object.fromEntries(
        Object.entries(block.arguments).map(([name, argument]) => [
          name,
          {
            type: Scratch.ArgumentType[argument.type],
            defaultValue: argument.defaultValue
          }
        ])
      )
    };
  }
}
