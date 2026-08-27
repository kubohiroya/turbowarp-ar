// Name: TurboWarp-AR
// ID: kubohiroyaar
// Description: A TurboWarp extension for camera-source based AR target state.
// By: Hiroya Kubo
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  const extensionConfig = {
    id: "kubohiroyaar",
    name: "TurboWarp-AR",
    docsURI: "https://kubohiroya.github.io/turbowarp-ar/",
    blockIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHJlY3QgeD0iNCIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE0IiByeD0iMyIgZmlsbD0iIzRDOTdGRiIvPjxyZWN0IHg9IjI2IiB5PSI4IiB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHJ4PSIzIiBmaWxsPSIjNTlDMDU5Ii8+PHJlY3QgeD0iMTUiIHk9IjI2IiB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHJ4PSIzIiBmaWxsPSIjRkZBQjE5Ii8+PC9zdmc+"
  };
  const extensionName = "TurboWarp-AR";
  const blocks = [{ "opcode": "createARScene", "blockType": "COMMAND", "text": "create AR scene with camera [CAMERA_ID] layer [LAYER]", "description": "Starts an AR session by acquiring a shared camera-source camera lease.", "arguments": { "CAMERA_ID": { "type": "STRING", "defaultValue": "default" }, "LAYER": { "type": "STRING", "defaultValue": "above-stage" } } }, { "opcode": "stopARScene", "blockType": "COMMAND", "text": "stop AR scene", "description": "Stops the AR session and releases the shared camera lease.", "arguments": {} }, { "opcode": "arStatus", "blockType": "REPORTER", "text": "AR status", "description": "Returns the AR session status.", "arguments": {} }, { "opcode": "isARSceneRunning", "blockType": "BOOLEAN", "text": "AR scene is running?", "description": "Reports whether the AR session is running.", "arguments": {} }, { "opcode": "defineARTarget", "blockType": "COMMAND", "text": "define AR target [TARGET_ID]", "description": "Creates or resets a named AR target state.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" } } }, { "opcode": "setARTargetVisible", "blockType": "COMMAND", "text": "set AR target [TARGET_ID] visible [VISIBLE] confidence [CONFIDENCE]", "description": "Updates a target's visibility and confidence using the manual MVP backend.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" }, "VISIBLE": { "type": "BOOLEAN", "defaultValue": true }, "CONFIDENCE": { "type": "NUMBER", "defaultValue": 1 } } }, { "opcode": "setARTargetPosition", "blockType": "COMMAND", "text": "set AR target [TARGET_ID] position x [X] y [Y] z [Z]", "description": "Updates a target's position in AR scene coordinates.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" }, "X": { "type": "NUMBER", "defaultValue": 0 }, "Y": { "type": "NUMBER", "defaultValue": 0 }, "Z": { "type": "NUMBER", "defaultValue": -1 } } }, { "opcode": "setARTargetRotation", "blockType": "COMMAND", "text": "set AR target [TARGET_ID] rotation x [X] y [Y] z [Z]", "description": "Updates a target's Euler rotation in degrees.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" }, "X": { "type": "NUMBER", "defaultValue": 0 }, "Y": { "type": "NUMBER", "defaultValue": 0 }, "Z": { "type": "NUMBER", "defaultValue": 0 } } }, { "opcode": "isARTargetVisible", "blockType": "BOOLEAN", "text": "AR target [TARGET_ID] is visible?", "description": "Reports whether the target is currently visible.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" } } }, { "opcode": "arTargetConfidence", "blockType": "REPORTER", "text": "AR target [TARGET_ID] confidence", "description": "Returns the target confidence from 0 to 1.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" } } }, { "opcode": "arTargetPosition", "blockType": "REPORTER", "text": "AR target [TARGET_ID] position [AXIS]", "description": "Returns one axis of the target position.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" }, "AXIS": { "type": "STRING", "defaultValue": "x" } } }, { "opcode": "arTargetRotation", "blockType": "REPORTER", "text": "AR target [TARGET_ID] rotation [AXIS]", "description": "Returns one axis of the target rotation.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" }, "AXIS": { "type": "STRING", "defaultValue": "y" } } }, { "opcode": "whenARTargetFound", "blockType": "HAT", "text": "when AR target [TARGET_ID] found", "description": "Fires once when a target transitions from hidden to visible.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" } } }, { "opcode": "whenARTargetLost", "blockType": "HAT", "text": "when AR target [TARGET_ID] lost", "description": "Fires once when a target transitions from visible to hidden.", "arguments": { "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" } } }, { "opcode": "attachSelectorToARTarget", "blockType": "COMMAND", "text": "attach selector [SELECTOR] to AR target [TARGET_ID]", "description": "Synchronizes matching DOM or A-Frame nodes to an AR target pose.", "arguments": { "SELECTOR": { "type": "STRING", "defaultValue": "#card" }, "TARGET_ID": { "type": "STRING", "defaultValue": "marker-1" } } }, { "opcode": "detachSelectorFromARTarget", "blockType": "COMMAND", "text": "detach selector [SELECTOR] from AR target", "description": "Stops synchronizing a selector to any AR target.", "arguments": { "SELECTOR": { "type": "STRING", "defaultValue": "#card" } } }];
  const definitions = {
    extensionName,
    blocks
  };
  const blockDefinitions = definitions.blocks;
  const CAMERA_SOURCE_RUNTIME_ID = "ext_kubohiroyacamerasource";
  const EXTENSION_OWNER = "turbowarp-ar";
  class TurboWarpARExtension {
    constructor() {
      this.targets = /* @__PURE__ */ new Map();
      this.targetEvents = [];
      this.status = "idle";
      this.session = null;
      this.sceneGeneration = 0;
    }
    getInfo() {
      return {
        id: extensionConfig.id,
        name: Scratch.translate(definitions.extensionName),
        docsURI: extensionConfig.docsURI,
        blockIconURI: extensionConfig.blockIconURI,
        blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
      };
    }
    async createARScene(args) {
      await this.stopARScene();
      const cameraSource = this.cameraSource();
      if (cameraSource === null) {
        this.status = "no-camera-source";
        return;
      }
      const cameraId = this.normalizeId(Scratch.Cast.toString(args.CAMERA_ID), "default");
      const layer = this.normalizeLayer(Scratch.Cast.toString(args.LAYER));
      const generation = ++this.sceneGeneration;
      let lease = null;
      let background = null;
      this.status = "starting";
      try {
        lease = await cameraSource.acquireCamera({ owner: EXTENSION_OWNER, cameraId });
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
        this.session = { cameraId, layer, lease, background };
        this.status = "running";
        this.syncAllAttachments();
      } catch {
        background?.remove();
        if (lease !== null) {
          await this.releaseLease(lease);
        }
        if (generation === this.sceneGeneration) {
          this.status = "camera-error";
          this.session = null;
        }
      }
    }
    async stopARScene() {
      this.sceneGeneration++;
      const current = this.session;
      this.session = null;
      current?.background?.remove();
      if (current !== null) {
        await this.releaseLease(current.lease);
      }
      this.status = "idle";
    }
    arStatus() {
      return this.status;
    }
    isARSceneRunning() {
      return this.status === "running" && this.session !== null;
    }
    defineARTarget(args) {
      const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
      target.visible = false;
      target.confidence = 0;
      target.position = { x: 0, y: 0, z: 0 };
      target.rotation = { x: 0, y: 0, z: 0 };
      this.syncTargetAttachments(target);
    }
    setARTargetVisible(args) {
      const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
      const nextVisible = Scratch.Cast.toBoolean(args.VISIBLE);
      const previousVisible = target.visible;
      target.visible = nextVisible;
      target.confidence = this.clamp01(Scratch.Cast.toNumber(args.CONFIDENCE));
      if (!previousVisible && nextVisible) {
        this.targetEvents.push({ type: "found", targetId: target.id });
      } else if (previousVisible && !nextVisible) {
        this.targetEvents.push({ type: "lost", targetId: target.id });
      }
      this.syncTargetAttachments(target);
    }
    setARTargetPosition(args) {
      const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
      target.position = this.argsToVec3(args);
      this.syncTargetAttachments(target);
    }
    setARTargetRotation(args) {
      const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
      target.rotation = this.argsToVec3(args);
      this.syncTargetAttachments(target);
    }
    isARTargetVisible(args) {
      return this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)))?.visible ?? false;
    }
    arTargetConfidence(args) {
      return this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)))?.confidence ?? 0;
    }
    arTargetPosition(args) {
      const target = this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)));
      return target?.position[this.normalizeAxis(Scratch.Cast.toString(args.AXIS))] ?? 0;
    }
    arTargetRotation(args) {
      const target = this.targets.get(this.normalizeId(Scratch.Cast.toString(args.TARGET_ID)));
      return target?.rotation[this.normalizeAxis(Scratch.Cast.toString(args.AXIS))] ?? 0;
    }
    whenARTargetFound(args) {
      return this.consumeTargetEvent("found", Scratch.Cast.toString(args.TARGET_ID));
    }
    whenARTargetLost(args) {
      return this.consumeTargetEvent("lost", Scratch.Cast.toString(args.TARGET_ID));
    }
    attachSelectorToARTarget(args) {
      const selector = Scratch.Cast.toString(args.SELECTOR).trim();
      if (selector.length === 0) return;
      const target = this.ensureTarget(Scratch.Cast.toString(args.TARGET_ID));
      target.attachedSelectors.add(selector);
      this.syncTargetAttachments(target);
    }
    detachSelectorFromARTarget(args) {
      const selector = Scratch.Cast.toString(args.SELECTOR).trim();
      if (selector.length === 0) return;
      for (const target of this.targets.values()) {
        target.attachedSelectors.delete(selector);
      }
    }
    snapshot() {
      return {
        status: this.status,
        session: this.session === null ? null : {
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
    cameraSource() {
      const candidate = Scratch.vm.runtime[CAMERA_SOURCE_RUNTIME_ID];
      if (typeof candidate === "object" && candidate !== null && "acquireCamera" in candidate && typeof candidate.acquireCamera === "function") {
        return candidate;
      }
      return null;
    }
    async releaseLease(lease) {
      try {
        await lease.release();
      } catch {
      }
    }
    createBackground(source, cameraId, layer) {
      if (typeof document === "undefined") return null;
      const existing = document.getElementById("tw-ar-root");
      existing?.remove();
      const host = document.createElement("div");
      host.id = "tw-ar-root";
      host.dataset["twArCameraId"] = cameraId;
      host.dataset["twArLayer"] = layer;
      host.style.position = "absolute";
      host.style.inset = "0";
      host.style.overflow = "hidden";
      host.style.pointerEvents = "none";
      host.style.zIndex = layer === "below-stage" ? "0" : "9";
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.srcObject = source.element.srcObject;
      video.dataset["twArBackground"] = "true";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.style.transform = source.mirrored ? "scaleX(-1)" : "";
      host.append(video);
      document.body.append(host);
      void video.play();
      return host;
    }
    ensureTarget(value) {
      const id = this.normalizeId(value);
      const existing = this.targets.get(id);
      if (existing !== void 0) return existing;
      const target = {
        id,
        visible: false,
        confidence: 0,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        attachedSelectors: /* @__PURE__ */ new Set()
      };
      this.targets.set(id, target);
      return target;
    }
    consumeTargetEvent(type, targetId) {
      const normalizedId = this.normalizeId(targetId);
      const index = this.targetEvents.findIndex(
        (event) => event.type === type && event.targetId === normalizedId
      );
      if (index < 0) return false;
      this.targetEvents.splice(index, 1);
      return true;
    }
    syncAllAttachments() {
      for (const target of this.targets.values()) {
        this.syncTargetAttachments(target);
      }
    }
    syncTargetAttachments(target) {
      if (typeof document === "undefined") return;
      for (const selector of target.attachedSelectors) {
        for (const element of this.elementsForSelector(selector)) {
          element.setAttribute("visible", String(target.visible));
          element.setAttribute("position", this.formatVec3(target.position));
          element.setAttribute("rotation", this.formatVec3(target.rotation));
          element.setAttribute("data-ar-target", target.id);
          element.setAttribute("data-ar-confidence", String(target.confidence));
        }
      }
    }
    elementsForSelector(selector) {
      try {
        return [...document.querySelectorAll(selector)];
      } catch {
        return [];
      }
    }
    argsToVec3(args) {
      return {
        x: Scratch.Cast.toNumber(args.X),
        y: Scratch.Cast.toNumber(args.Y),
        z: Scratch.Cast.toNumber(args.Z)
      };
    }
    formatVec3(value) {
      return `${value.x} ${value.y} ${value.z}`;
    }
    normalizeAxis(value) {
      const axis = value.trim().toLowerCase();
      return axis === "y" || axis === "z" ? axis : "x";
    }
    normalizeLayer(value) {
      return value.trim() === "below-stage" ? "below-stage" : "above-stage";
    }
    normalizeId(value, fallback = "target") {
      return value.trim().replace(/[^a-zA-Z0-9_-]/g, "-") || fallback;
    }
    clamp01(value) {
      if (!Number.isFinite(value)) return 0;
      return Math.max(0, Math.min(1, value));
    }
    toScratchBlock(block) {
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
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`${extensionConfig.name} must run unsandboxed.`);
  }
  Scratch.extensions.register(new TurboWarpARExtension());

})(Scratch);
