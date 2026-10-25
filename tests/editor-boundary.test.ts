import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {expect, it} from 'vitest';

it('loads the distributed AR extension without an editor engine or GUI', () => {
  const source = readFileSync(new URL('../dist/ar.js', import.meta.url), 'utf8');
  expect(source).not.toMatch(/compileSchemaBundle|require_ajv|Ajv2020|ajv implementation error/u);
  let registrations = 0;
  const Scratch = {
    extensions: {unsandboxed: true, register() {registrations++;}},
    vm: {runtime: {on() {}, off() {}}}
  };
  vm.runInNewContext(source, {Scratch, TextEncoder}, {timeout: 5000});
  expect(registrations).toBe(1);
});
