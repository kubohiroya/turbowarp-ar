import {TurboWarpARExtension} from '../src/extension.js';
import {expect, it, vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {createFixedInputEditor} from '@kubohiroya/turbowarp-extension-data-editor';
import type {FixedBlockSnapshot, FixedInputEditorOptions, FixedInputDraft, JsonValue, LiteralValue, ArgumentSlot} from '@kubohiroya/turbowarp-extension-data-editor';
import {compileSchemaBundle} from '@kubohiroya/turbowarp-extension-data-editor/schema';
import {createBlockEditorService} from '@kubohiroya/turbowarp-extension-data-editor/rjsf';
import {fixedInputEditors, registerFixedInputEditors} from '../src/fixed-input-editors.js';
import document from '../schemas/block-editor-fixed-inputs.schema.json' with {type:'json'};
import definitions from '../src/block-definitions.json' with {type:'json'};
const targets = {"editable": ["createARScene.LAYER", "setARTargetVisible.CONFIDENCE", "setARTargetPosition.X", "setARTargetPosition.Y", "setARTargetPosition.Z", "setARTargetRotation.X", "setARTargetRotation.Y", "setARTargetRotation.Z", "arTargetPosition.AXIS", "arTargetRotation.AXIS"], "readonly": ["setARTargetVisible.VISIBLE"]};
const numeric = fixedInputEditors.flatMap(option=>option.bindings.filter(b=>b.control?.kind==='number').map(b=>({option,binding:b})));
const definitionsByOpcode = definitions.blocks as readonly {opcode:string; arguments?:Readonly<Record<string,{defaultValue?:LiteralValue}>>}[];
function fixture(option:FixedInputEditorOptions, values:Readonly<Record<string,LiteralValue|{kind:'reporter'}>>={}) {
  const def=createFixedInputEditor(option);
  const opcode=option.opcodes[0]!.slice(option.extensionId.length+1);
  const block=definitionsByOpcode.find(b=>b.opcode===opcode)!;
  const args:Record<string,ArgumentSlot>=Object.fromEntries(Object.entries(block.arguments??{}).map(([k,a])=>[k,{kind:'literal',value:a.defaultValue??''}]));
  args.UNBOUND={kind:'literal',value:'  keep original  '};
  for(const[k,v]of Object.entries(values)) args[k]=typeof v==='object'?v:{kind:'literal',value:v};
  const inputs:Record<string,FixedBlockSnapshot['fixedContext']['inputs'][string]>={};
  for(const arg of [...def.editableArguments,...def.readOnlyArguments]) inputs[arg]={role:def.editableArguments.includes(arg)?'editable':'readonly',source:args[arg]?.kind==='literal'?'shadow':'reporter',identity:arg,
    ...(args[arg]?.kind==='literal'?{field:{blockId:'shadow-'+arg,name:'TEXT',type:'text'}}:{})};
  const snapshot:FixedBlockSnapshot={targetId:'target',blockId:'block',revision:'r1',opcode:option.opcodes[0]!,arguments:args,
    fixedContext:{contractId:option.contractId,contractRevision:option.contractRevision,generation:'g1',readOnlyArguments:def.readOnlyArguments,dependencies:def.dependencies,inputs}};
  return {def,snapshot,draft:def.readFixed(snapshot) as FixedInputDraft};
}
function changed(f:ReturnType<typeof fixture>, values:Readonly<Record<string,JsonValue>>) {
 const inputs={...f.draft.inputs};for(const[k,value]of Object.entries(values)) inputs[k]={value,changed:true};
 return f.def.prepareFixedSave({...f.draft,inputs},f.snapshot);
}
it('covers the exact planned editable and readonly arguments without changing block shapes',()=>{
 const actual=fixedInputEditors.flatMap(o=>o.opcodes.flatMap(op=>o.bindings.map(b=>op.slice(o.extensionId.length+1)+'.'+b.argument))).sort();
 expect(actual).toEqual(targets.editable.slice().sort());
 expect(fixedInputEditors.flatMap(o=>(o.readOnlyArguments??[]).map(arg=>o.opcodes[0]!.slice(o.extensionId.length+1)+'.'+arg)).sort()).toEqual(targets.readonly.slice().sort());
 for(const id of [...targets.editable,...targets.readonly]) {const [opcode,arg]=id.split('.');expect(definitionsByOpcode.find(b=>b.opcode===opcode)?.arguments).toHaveProperty(arg!);}
});
it('compiles every single-field bundle and resolves its exact canonical JSON pointer',()=>{
 for(const option of fixedInputEditors)for(const b of option.bindings){expect(compileSchemaBundle(b.schemaBundle).kind).toBe('compiled');const pointer=b.schemaBundle.root.artifact.source.symbol!;let at:unknown=document;for(const token of pointer.slice(2).split('/'))at=(at as Record<string,unknown>)[token];expect(at).toEqual(b.schemaBundle.root.document);}
});
it('preserves old numeric aliases and unknown enums without no-op re-encoding',()=>{
 for(const option of fixedInputEditors) for(const b of option.bindings){const raw=b.control?.kind==='number'?'0x10':' unknown current ';const f=fixture(option,{[b.argument]:raw});const r=f.def.prepareFixedSave(f.draft,f.snapshot);expect(r).toMatchObject({kind:'ready',changes:[]});expect(f.snapshot.arguments[b.argument]).toEqual({kind:'literal',value:raw});}
});
it('keeps reporter inputs readonly and never invents a value or changes unrelated arguments',()=>{
 for(const option of fixedInputEditors)for(const b of option.bindings){const f=fixture(option,{[b.argument]:{kind:'reporter'}});expect(f.def.describeFixed!(f.draft,f.snapshot).inputs[b.argument]?.state).toBe('readonly');expect(f.def.prepareFixedSave(f.draft,f.snapshot)).toMatchObject({kind:'ready',changes:[]});expect(changed(f,{[b.argument]:'1'}).kind).toBe('invalid');expect(f.snapshot.arguments.UNBOUND).toEqual({kind:'literal',value:'  keep original  '});}
});
it('accepts explicit known enum repair but rejects arbitrary new strings',()=>{
 for(const option of fixedInputEditors)for(const b of option.bindings.filter(x=>x.control?.kind==='enum')){const known=b.control!.choices![0]!.value;const f=fixture(option,{[b.argument]:'unknown old'});expect(changed(f,{[b.argument]:known}).kind).toBe('ready');expect(changed(f,{[b.argument]:'unknown new'}).kind).toBe('invalid');}
});
it('rejects new numeric grammar bypasses and nonfinite/blank input even without a buffer',()=>{
 for(const {option,binding}of numeric)for(const raw of ['', ' ', '+1','001','0x10','1.','1e','Infinity','NaN']) expect(changed(fixture(option),{[binding.argument]:raw}).kind).toBe('invalid');
});
it('keeps nonrepresentable old numeric values readonly while preserving their raw no-op',()=>{
 for(const {option,binding}of numeric)for(const raw of ['', '  ',Infinity]){const f=fixture(option,{[binding.argument]:raw});expect(f.draft.inputs[binding.argument]).toEqual({readOnly:true});expect(f.def.prepareFixedSave(f.draft,f.snapshot)).toMatchObject({kind:'ready',changes:[]});}
});

it('optional API absence or wrong version never registers',()=>{
 for(const host of [{},{gui:{blockEditors:{apiVersion:0,registerFixedInputEditor:()=>{throw Error('must not call');}}}},{gui:{blockEditors:{apiVersion:1}}}])expect(()=>registerFixedInputEditors(host,fixedInputEditors)()).not.toThrow();
});
it('actual common service protects duplicates and leaves the first registration intact',()=>{
 const service=createBlockEditorService({fixedInputs:true});const host={gui:{blockEditors:service.api}};const remove=registerFixedInputEditors(host,fixedInputEditors);expect(()=>registerFixedInputEditors(host,fixedInputEditors)).toThrow();for(const o of fixedInputEditors)for(const op of o.opcodes)expect(service.registry.resolve(op)?.editorId).toBe(o.editorId);remove();remove();for(const o of fixedInputEditors)expect(service.registry.resolve(o.opcodes[0]!)).toBeUndefined();
});
it('runtime exit and repeated dispose unregister once, and failed partial registration rolls back',()=>{
 const listeners=new Set<()=>void>();let removed=0;const host={gui:{blockEditors:{apiVersion:1,registerFixedInputEditor:()=>()=>{removed++;}}},vm:{runtime:{on:(_e:string,f:()=>void)=>listeners.add(f),off:(_e:string,f:()=>void)=>listeners.delete(f)}}};const remove=registerFixedInputEditors(host,fixedInputEditors);for(const f of [...listeners])f();remove();expect(removed).toBe(fixedInputEditors.length);expect(listeners.size).toBe(0);
 let calls=0;let cleaned=0;const broken={gui:{blockEditors:{apiVersion:1,registerFixedInputEditor:()=>{if(++calls===2)throw Error('second failed');return()=>{cleaned++;};}}}};expect(()=>registerFixedInputEditors(broken,[fixedInputEditors[0]!,fixedInputEditors[0]!])).toThrow();expect(cleaned).toBe(1);
});
it('the stable docsURI block anchors contain fixed-form help and the generated Schema equals the canonical source',()=>{
 const html=readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');for(const option of fixedInputEditors){const opcode=option.opcodes[0]!.slice(option.extensionId.length+1);expect(html).toContain('id="block-'+opcode+'"');expect(html).toContain('id="fixed-input-'+opcode+'"');}expect(JSON.parse(readFileSync(new URL('../docs/schemas/block-editor-fixed-inputs.schema.json',import.meta.url),'utf8'))).toEqual(document);
});

it('repairs unrepresentable existing numeric raw only with explicit repair and exact new tokens',()=>{
 for(const {option,binding}of numeric){const opcode=option.opcodes[0]!.slice(option.extensionId.length+1);const original=definitionsByOpcode.find(b=>b.opcode===opcode)!.arguments![binding.argument]!.defaultValue!;const f=fixture(option,{[binding.argument]:''});const inputs={...f.draft.inputs,[binding.argument]:{value:String(original),changed:true,repair:true as const}};const r=f.def.prepareFixedSave({...f.draft,inputs},f.snapshot);expect(r.kind).toBe('ready');if(r.kind==='ready')expect(r.changes).toContainEqual({argument:binding.argument,value:String(original)});}
});

function scratchHost(api:unknown) {
 const callbacks=new Map<string,Set<()=>void>>();
 const runtime={on:(event:string,f:()=>void)=>{const list=callbacks.get(event)??new Set<()=>void>();list.add(f);callbacks.set(event,list);},off:(event:string,f:()=>void)=>callbacks.get(event)?.delete(f)};
 return {callbacks,vm:{runtime},gui:{blockEditors:api},BlockType:{COMMAND:'command',REPORTER:'reporter',BOOLEAN:'boolean'},ArgumentType:{STRING:'string',NUMBER:'number'},translate:(s:string)=>s,Cast:{toString:(v:unknown)=>String(v??''),toNumber:(v:unknown)=>Number(v),toBoolean:(v:unknown)=>Boolean(v)}};
}
it('actual constructor registers only existing getInfo opcodes once and runtime exit removes all fixed registrations',()=>{
 const service=createBlockEditorService({fixedInputs:true});const host=scratchHost(service.api);vi.stubGlobal('Scratch',host);
 try {const instance=new TurboWarpARExtension();const info=instance.getInfo();expect(instance.getInfo()).toEqual(info);const opcodes=new Set((info.blocks as Array<{opcode:string}>).map(b=>b.opcode));for(const o of fixedInputEditors)expect(Boolean(service.registry.resolve(o.opcodes[0]!))).toBe(opcodes.has(o.opcodes[0]!.slice(o.extensionId.length+1)));for(const f of [...host.callbacks.get('RUNTIME_DISPOSED')??[]])f();for(const o of fixedInputEditors)expect(service.registry.resolve(o.opcodes[0]!)).toBeUndefined();}
 finally {vi.unstubAllGlobals();}
});

it('matches owner numeric range boundaries without strengthening clamp or runtime-only preconditions',()=>{
 const cases = [{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetVisible","argument":"CONFIDENCE","value":"100","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"X","value":"100","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Y","value":"100","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetPosition","argument":"Z","value":"100","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"X","value":"100","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Y","value":"100","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"-1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"0","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"0.1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"1","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"1.5","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"10","expected":true,"relatedCandidates":{}},{"opcode":"setARTargetRotation","argument":"Z","value":"100","expected":true,"relatedCandidates":{}}];
 for(const row of cases){const option=fixedInputEditors.find(o=>o.opcodes.some(op=>op.endsWith('_'+row.opcode)))!;const f=fixture(option,{COLUMNS:'3',ROWS:'3',SQUARE_METERS:'0.04',MARKER_METERS:'0.03',MEASURED_BY:'tape'});const result=changed(f,{...row.relatedCandidates,[row.argument]:row.value});expect(result.kind==='ready',row.opcode+'.'+row.argument+'='+row.value).toBe(row.expected);}
});
