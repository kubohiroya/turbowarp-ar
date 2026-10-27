// Name: TurboWarp-A-Frame
// ID: turbowarpaframe
// Description: A TurboWarp extension for declarative A-Frame scene graphs.
// By: Hiroya Kubo
// License: MPL-2.0

(function (Scratch) {
  'use strict';

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var extensionConfig = {
	id: "turbowarpaframe",
	slug: "turbowarp-aframe",
	name: "TurboWarp-A-Frame",
	description: "A TurboWarp extension for declarative A-Frame scene graphs.",
	author: "Hiroya Kubo",
	license: "MPL-2.0",
	unsandboxed: true,
	docsURI: "https://kubohiroya.github.io/turbowarp-aframe/",
	blockIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHJlY3QgeD0iNiIgeT0iOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzEyMTgyNiIvPjxwYXRoIGQ9Ik0xNCAzMmw5LTE4IDkgMThoLTRsLTItNWgtNmwtMiA1aC00Wm03LjQtOGgzLjJsLTEuNi00LjEtMS42IDQuMVoiIGZpbGw9IiM0Q0ZGQjAiLz48Y2lyY2xlIGN4PSIzNiIgY3k9IjE0IiByPSI0IiBmaWxsPSIjRkZBQjE5Ii8+PC9zdmc+"
};
var JsonSnapshotError = class extends Error {
	constructor(kind, dataPath) {
		super("JSON snapshot failed.");
		this.kind = kind;
		this.dataPath = dataPath;
	}
};
function appendPointer(path, key) {
	return `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`;
}
/** Copy JSON values without invoking accessors, toJSON, or input iterators. */
function snapshotJson(value) {
	const active = /* @__PURE__ */ new WeakSet();
	let remaining = 1e5;
	const visit = (input, path, depth) => {
		if (--remaining < 0 || depth > 128) throw new JsonSnapshotError("limit", path);
		if (input === null || typeof input === "string" || typeof input === "boolean") return input;
		if (typeof input === "number" && Number.isFinite(input)) return input;
		if (typeof input !== "object" || input === null || active.has(input)) throw new JsonSnapshotError("invalid", path);
		const array = Array.isArray(input);
		const prototype = Object.getPrototypeOf(input);
		if (!array && prototype !== null && prototype !== Object.prototype) throw new JsonSnapshotError("invalid", path);
		if (Object.getOwnPropertySymbols(input).length) throw new JsonSnapshotError("invalid", path);
		active.add(input);
		try {
			if (array) {
				const length = input.length;
				if (!Number.isSafeInteger(length) || length > remaining) throw new JsonSnapshotError("limit", path);
				const result = [];
				for (let i = 0; i < length; i++) {
					const child = appendPointer(path, String(i));
					const descriptor = Object.getOwnPropertyDescriptor(input, i);
					if (!descriptor || !("value" in descriptor)) throw new JsonSnapshotError("invalid", child);
					result.push(visit(descriptor.value, child, depth + 1));
				}
				for (const key of Object.keys(input)) if (!/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= length) throw new JsonSnapshotError("invalid", appendPointer(path, key));
				return result;
			}
			const result = {};
			for (const key of Object.keys(input)) {
				const child = appendPointer(path, key);
				const descriptor = Object.getOwnPropertyDescriptor(input, key);
				if (!descriptor || !("value" in descriptor)) throw new JsonSnapshotError("invalid", child);
				Object.defineProperty(result, key, {
					value: visit(descriptor.value, child, depth + 1),
					enumerable: true,
					writable: true,
					configurable: true
				});
			}
			return result;
		} finally {
			active.delete(input);
		}
	};
	return visit(value, "", 0);
}
function isJsonRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
var require_code$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
var require_scope = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$1();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
var require_codegen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$1();
	var scope_1 = require_scope();
	var code_2 = require_code$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen();
	var code_1 = require_code$1();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
var require_names = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
var require_boolSchema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
var require_applicability = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
var require_dataType = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules();
	var applicability_1 = require_applicability();
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	var util_2 = require_util();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var code_1 = require_code();
	var errors_1 = require_errors();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
var require_subschema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
var require_json_schema_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) {
					if (ref[0] === "#") {
						checkAmbiguosRef(sch, localRefs[ref], ref);
						localRefs[ref] = sch;
					} else this.refs[ref] = fullPath;
				}
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults();
	var keyword_1 = require_keyword();
	var subschema_1 = require_subschema();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var errors_1 = require_errors();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
var require_validation_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
var require_ref_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
var require_compile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen();
	var validation_error_1 = require_validation_error();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var validate_1 = require_validate();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$11,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description,
	properties: () => properties$10,
	required: () => required,
	type: () => type$10
}), $id$11, description, type$10, required, properties$10, data_default;
var init_data = __esmMin((() => {
	$id$11 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$10 = "object";
	required = ["$data"];
	properties$10 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$11,
		description,
		type: type$10,
		required,
		properties: properties$10,
		additionalProperties: false
	};
}));
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isPort = RegExp.prototype.test.bind(/^\d*$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
	/** @type {(value: string) => boolean} */
	var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
	/** @type {(value: string) => boolean} */
	var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
	var BYTE_HEX = new Array(256);
	{
		const HEX_DIGITS = "0123456789ABCDEF";
		for (let i = 0; i < 256; i++) BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
	}
	function percentEncodeNonAscii(cp) {
		if (cp < 2048) return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
		if (cp < 65536) return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
		return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
	}
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/** @type {(value: string) => boolean} */
	var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
	/** @type {(value: string) => boolean} */
	var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
	/** @type {(value: string) => boolean} */
	var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {string} zone
	* @returns {boolean}
	*/
	function isZoneIdentifier(zone) {
		if (zone.length === 0) return false;
		for (let i = 0; i < zone.length; i++) {
			if (isZoneCharacter(zone[i])) continue;
			if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
				i += 2;
				continue;
			}
			return false;
		}
		return true;
	}
	/**
	* Compresses the longest run of zero hextets to "::" per RFC 5952. A run of a
	* single zero hextet is left uncompressed. On ties the leftmost run wins.
	*
	* @param {string[]} hextets
	* @returns {string}
	*/
	function compressIPv6ZeroRun(hextets) {
		let bestStart = -1;
		let bestLength = 0;
		let runStart = -1;
		let runLength = 0;
		for (let i = 0; i < hextets.length; i++) if (hextets[i] === "0") {
			if (runStart === -1) runStart = i;
			runLength++;
			if (runLength > bestLength) {
				bestLength = runLength;
				bestStart = runStart;
			}
		} else {
			runStart = -1;
			runLength = 0;
		}
		if (bestLength < 2) return hextets.join(":");
		const head = hextets.slice(0, bestStart).join(":");
		const tail = hextets.slice(bestStart + bestLength).join(":");
		return head + "::" + tail;
	}
	/**
	* Validates an IPv6 address against the alternatives in RFC 3986 section
	* 3.2.2 and returns the same address with leading hextet zeroes removed.
	* An embedded IPv4 address counts as two hextets and is only valid at the end.
	*
	* @param {string} input
	* @returns {string|undefined}
	*/
	function normalizeIPv6Address(input) {
		const compression = input.indexOf("::");
		if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
		const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
		const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
		if (compression !== -1) {
			if (left.length === 1 && left[0] === "") left.length = 0;
			if (right.length === 1 && right[0] === "") right.length = 0;
		}
		const parts = left.concat(right);
		let hextetCount = 0;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part === "") return void 0;
			if (part.indexOf(".") !== -1) {
				if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
				hextetCount += 2;
				continue;
			}
			if (!isHextet(part)) return void 0;
			parts[i] = parseInt(part, 16).toString(16);
			hextetCount++;
		}
		if (compression === -1) {
			if (hextetCount !== 8) return void 0;
			return compressIPv6ZeroRun(parts);
		}
		if (hextetCount >= 8) return void 0;
		const expanded = parts.slice(0, left.length);
		for (let i = hextetCount; i < 8; i++) expanded.push("0");
		for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
		return compressIPv6ZeroRun(expanded);
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	* @property {boolean} [isIPVFuture] - Indicates if the host is an IPvFuture literal.
	* @property {boolean} [error] - Indicates if a bracketed IP literal is malformed.
	*/
	/**
	* Validates and normalizes a bracketed IP literal. Raw zone separators remain
	* accepted for backwards compatibility, while encoded separators and zone
	* contents follow RFC 6874.
	*
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		const bracketed = host[0] === "[" && host[host.length - 1] === "]";
		if ((host[0] === "[" || host[host.length - 1] === "]") && !bracketed) return {
			host,
			isIPV6: false,
			error: true
		};
		let input = bracketed ? host.slice(1, -1) : host;
		if (bracketed && isIPvFuture(input)) {
			input = input.toLowerCase();
			return {
				host: `[${input}]`,
				escapedHost: input,
				isIPV6: false,
				isIPVFuture: true
			};
		}
		if (findToken(input, ":") < 2) return {
			host,
			isIPV6: false,
			error: bracketed
		};
		let zoneIdentifier = "";
		const zoneSeparator = input.indexOf("%");
		if (zoneSeparator !== -1) {
			const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
			zoneIdentifier = input.slice(zoneSeparator + separatorLength);
			if (!isZoneIdentifier(zoneIdentifier)) return {
				host,
				isIPV6: false,
				error: true
			};
			input = input.slice(0, zoneSeparator);
		}
		const address = normalizeIPv6Address(input);
		if (address === void 0) return {
			host,
			isIPV6: false,
			error: true
		};
		return {
			host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
			escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
			isIPV6: true
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) {
				if (input === ".") break;
				else if (input === "/") {
					output.push("/");
					break;
				} else {
					output.push(input);
					break;
				}
			} else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` stay escaped; `%2E` is unreserved.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Serializes a path without rewriting reserved data. Raw RFC 3986 path
	* characters remain literal, valid escapes are preserved and uppercased, and
	* everything else is UTF-8 percent-encoded. In a path-noscheme, a colon in the
	* first segment must be escaped so the result cannot be parsed as a scheme.
	*
	* @param {string} input
	* @param {boolean} [pathNoScheme=false]
	* @returns {string}
	*/
	function serializePathEncoding(input, pathNoScheme = false) {
		let output = "";
		let firstSegment = pathNoScheme && input[0] !== "/";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			if (ch === "/") firstSegment = false;
			if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Percent-encodes a URI component using its RFC 3986 literal character set.
	* Existing valid escapes are preserved and normalized to uppercase hex.
	*
	* @param {string} input
	* @param {(value: string) => boolean} isAllowed
	* @returns {string}
	*/
	function encodeComponent(input, isAllowed) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			if (isAllowed(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Encodes userinfo while preserving its RFC 3986 §3.2.1 literal characters.
	* In particular, authority delimiters such as `@`, `/`, `?`, and `#` are data.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeUserinfo(input) {
		return encodeComponent(input, isUserinfoCharacter);
	}
	/**
	* Encodes query data using the RFC 3986 §3.4 grammar. A literal `#` must be
	* escaped because it would otherwise begin the fragment component.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeQuery(input) {
		return encodeComponent(input, isQueryFragmentCharacter);
	}
	/**
	* Encodes fragment data using the RFC 3986 §3.5 grammar.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeFragment(input) {
		return encodeComponent(input, isQueryFragmentCharacter);
	}
	function isEscapeSafe(cp) {
		return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
	}
	/**
	* Normalizes the percent-encoding of a query or fragment component.
	*
	* Like `normalizePathEncoding`, but uses the query/fragment character set
	* (which additionally allows `?`) and decodes `.` since it has no dot-segment
	* meaning outside of a path.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizeQueryFragmentEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isQueryFragmentCharacter(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(encodeUserinfo(component.userinfo));
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = component.host;
			if (!isIPv4(host)) {
				let ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
					host = normalizePercentEncoding(host, true);
					ipV6res = normalizeIPv6(host);
				}
				if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			const port = String(component.port);
			if (!isPort(port)) throw new TypeError("URI port is malformed.");
			uriTokens.push(":");
			uriTokens.push(port);
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		serializePathEncoding,
		normalizeQueryFragmentEncoding,
		encodeUserinfo,
		encodeQuery,
		encodeFragment,
		escapePreservingEscapes,
		removeDotSegments,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
var require_schemes$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils$1();
	var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const queryIndex = wsComponent.resourceName.indexOf("?");
			const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches && matches[0] === urnComponent.path) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
var require_fast_uri$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils$1();
	var { SCHEMES, getSchemeHandler } = require_schemes$1();
	var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
	var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
	/**
	* @param {string} scheme
	* @returns {string}
	*/
	function decodeValidScheme(scheme) {
		const decodedScheme = unescape(String(scheme));
		if (!VALID_SCHEME.test(decodedScheme)) throw new TypeError(MALFORMED_SCHEME_ERROR);
		return decodedScheme;
	}
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed, malformedPercentEncoding: baseMalformedPercentEncoding, malformedSchemeSpecific: baseMalformedSchemeSpecific, malformedHost: baseMalformedHost, malformedScheme: baseMalformedScheme } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed, malformedPercentEncoding: relativeMalformedPercentEncoding, malformedSchemeSpecific: relativeMalformedSchemeSpecific, malformedHost: relativeMalformedHost, malformedScheme: relativeMalformedScheme } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
		const resolvedHost = resolved.host;
		const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
		canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
		const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !/\P{ASCII}/u.test(resolvedHost);
		if (resolved.error && !encodedASCIIHost) throw new Error(resolved.error);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		if (component.scheme) component.scheme = decodeValidScheme(component.scheme);
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
		const pathNoScheme = !options.skipEscape && component.scheme === void 0 && !hasAuthority;
		if (component.path !== void 0) {
			if (!options.skipEscape) component.path = serializePathEncoding(component.path, pathNoScheme);
			else component.path = normalizePercentEncoding(component.path);
		}
		if (options.reference !== "suffix" && component.scheme) {
			component.scheme = decodeValidScheme(component.scheme);
			uriTokens.push(component.scheme, ":");
		}
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = removeDotSegments(s);
			if (pathNoScheme) s = serializePathEncoding(s, true);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", encodeQuery(component.query));
		if (component.fragment !== void 0) uriTokens.push("#", encodeFragment(component.fragment));
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* Checks percent syntax without decoding the represented octets. RFC 3986
	* percent-encoding is byte-oriented, so sequences such as `%FF` are valid even
	* though they are not independently valid UTF-8.
	*
	* @param {string|undefined} component
	* @returns {boolean}
	*/
	function hasMalformedPercentEncoding(component) {
		if (component === void 0) return false;
		let percent = component.indexOf("%");
		while (percent !== -1) {
			if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) return true;
			percent = component.indexOf("%", percent + 3);
		}
		return false;
	}
	/**
	* Whether the host is a bracketed IP literal (RFC 3986 `IP-literal`).
	* An unterminated `[` is not a literal, so it must still be validated as a
	* reg-name instead of being waved through as an IP.
	*
	* @param {string} host
	* @returns {boolean}
	*/
	function isIPLiteral(host) {
		return host[0] === "[" && host[host.length - 1] === "]";
	}
	/**
	* @param {RegExpMatchArray} matches
	* @returns {boolean}
	*/
	function hasMalformedComponentPercentEncoding(matches) {
		const host = matches[4];
		return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
	}
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean, unicodeSupport?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean} whether host conversion failed
	*/
	function canonicalizeHost(parsed, options, schemeHandler, isIP) {
		if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) try {
			parsed.host = new URL("http://" + parsed.host).hostname;
		} catch (e) {
			parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
			return true;
		}
		return false;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let malformedPercentEncoding = false;
		let malformedSchemeSpecific = false;
		let malformedHost = false;
		let malformedIPLiteral = false;
		let malformedScheme = false;
		let isIP = false;
		if (options.reference === "suffix") {
			if (options.scheme) uri = options.scheme + ":" + uri;
			else uri = "//" + uri;
		}
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (parsed.scheme !== void 0) {
				const decodedScheme = unescape(parsed.scheme);
				if (VALID_SCHEME.test(decodedScheme)) parsed.scheme = decodedScheme.toLowerCase();
				else {
					parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
					malformedScheme = true;
				}
			}
			malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
			if (malformedPercentEncoding) parsed.error = parsed.error || "URI contains malformed percent-encoding.";
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) {
				if (isIPv4(parsed.host) === false) {
					const bracketedIPLiteral = isIPLiteral(parsed.host);
					const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
					const ipv6result = normalizeIPv6(parsed.host);
					isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
					malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
					parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
					if (malformedIPLiteral) {
						parsed.error = parsed.error || "URI host is malformed.";
						malformedAuthorityOrPort = true;
					}
				} else isIP = true;
			}
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!malformedIPLiteral) malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
			if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
				let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
				if (!isIP) host = normalizePercentEncoding(host.toLowerCase());
				parsed.host = reescapeHostDelimiters(host, isIP);
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.query) parsed.query = normalizeQueryFragmentEncoding(parsed.query);
				if (parsed.fragment) parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
			}
			if (schemeHandler && schemeHandler.parse) {
				schemeHandler.parse(parsed, options);
				if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) malformedSchemeSpecific = true;
			}
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri !== "string" && typeof uri !== "object") return;
		let value;
		try {
			value = typeof uri === "string" ? uri : serialize(uri, opts);
		} catch {
			return;
		}
		const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
		return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri$1();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	var ref_error_1 = require_ref_error();
	var rules_1 = require_rules();
	var compile_1 = require_compile();
	var codegen_2 = require_codegen();
	var resolve_1 = require_resolve();
	var dataType_1 = require_dataType();
	var util_1 = require_util();
	var $dataRefSchema = (init_data(), __toCommonJS(data_exports).default);
	var uri_1 = require_uri();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
var require_ref = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error();
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var util_1 = require_util();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) {
				if (schEvaluated && !schEvaluated.dynamicProps) {
					if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
				} else {
					const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
					it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
				}
			}
			if (it.items !== true) {
				if (schEvaluated && !schEvaluated.dynamicItems) {
					if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
				} else {
					const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
					it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
				}
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id();
	var ref_1 = require_ref();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
var require_limitNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
var require_multipleOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
var require_ucs2length = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
var require_limitLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var ucs2length_1 = require_ucs2length();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var util_1 = require_util();
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
var require_limitProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
var require_required = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
var require_limitItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
var require_uniqueItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
var require_const = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
var require_enum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber();
	var multipleOf_1 = require_multipleOf();
	var limitLength_1 = require_limitLength();
	var pattern_1 = require_pattern();
	var limitProperties_1 = require_limitProperties();
	var required_1 = require_required();
	var limitItems_1 = require_limitItems();
	var uniqueItems_1 = require_uniqueItems();
	var const_1 = require_const();
	var enum_1 = require_enum();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
var require_additionalItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
var require_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
var require_items2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var additionalItems_1 = require_additionalItems();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
var require_contains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
var require_dependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
var require_propertyNames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
var require_additionalProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var util_1 = require_util();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
var require_properties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate();
	var code_1 = require_code();
	var util_1 = require_util();
	var additionalProperties_1 = require_additionalProperties();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
var require_patternProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var util_2 = require_util();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
var require_anyOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
var require_oneOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
var require_allOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
var require_if = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
var require_thenElse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems();
	var prefixItems_1 = require_prefixItems();
	var items_1 = require_items();
	var items2020_1 = require_items2020();
	var contains_1 = require_contains();
	var dependencies_1 = require_dependencies();
	var propertyNames_1 = require_propertyNames();
	var additionalProperties_1 = require_additionalProperties();
	var properties_1 = require_properties();
	var patternProperties_1 = require_patternProperties();
	var not_1 = require_not();
	var anyOf_1 = require_anyOf();
	var oneOf_1 = require_oneOf();
	var allOf_1 = require_allOf();
	var if_1 = require_if();
	var thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
var require_format$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
var require_discriminator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var types_1 = require_types();
	var compile_1 = require_compile();
	var ref_error_1 = require_ref_error();
	var util_1 = require_util();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
var json_schema_draft_07_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$10,
	$schema: () => $schema$10,
	default: () => json_schema_draft_07_default,
	definitions: () => definitions,
	properties: () => properties$9,
	title: () => title$10,
	type: () => type$9
});
var $schema$10, $id$10, title$10, definitions, type$9, properties$9, json_schema_draft_07_default;
var init_json_schema_draft_07 = __esmMin((() => {
	$schema$10 = "http://json-schema.org/draft-07/schema#";
	$id$10 = "http://json-schema.org/draft-07/schema#";
	title$10 = "Core schema meta-schema";
	definitions = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type$9 = ["object", "boolean"];
	properties$9 = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default = {
		$schema: $schema$10,
		$id: $id$10,
		title: title$10,
		definitions,
		type: type$9,
		properties: properties$9,
		"default": true
	};
}));
var require_ajv = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$1();
	var draft7_1 = require_draft7();
	var discriminator_1 = require_discriminator();
	var draft7MetaSchema = (init_json_schema_draft_07(), __toCommonJS(json_schema_draft_07_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
var require_dynamicAnchor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dynamicAnchor = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var ref_1 = require_ref();
	var def = {
		keyword: "$dynamicAnchor",
		schemaType: "string",
		code: (cxt) => dynamicAnchor(cxt, cxt.schema)
	};
	function dynamicAnchor(cxt, anchor) {
		const { gen, it } = cxt;
		it.schemaEnv.root.dynamicAnchors[anchor] = true;
		const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
		const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
		gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
	}
	exports.dynamicAnchor = dynamicAnchor;
	function _getValidate(cxt) {
		const { schemaEnv, schema, self } = cxt.it;
		const { root, baseId, localRefs, meta } = schemaEnv.root;
		const { schemaId } = self.opts;
		const sch = new compile_1.SchemaEnv({
			schema,
			schemaId,
			root,
			baseId,
			localRefs,
			meta
		});
		compile_1.compileSchema.call(self, sch);
		return (0, ref_1.getValidate)(cxt, sch);
	}
	exports.default = def;
}));
var require_dynamicRef = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dynamicRef = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var ref_1 = require_ref();
	var def = {
		keyword: "$dynamicRef",
		schemaType: "string",
		code: (cxt) => dynamicRef(cxt, cxt.schema)
	};
	function dynamicRef(cxt, ref) {
		const { gen, keyword, it } = cxt;
		if (ref[0] !== "#") throw new Error(`"${keyword}" only supports hash fragment reference`);
		const anchor = ref.slice(1);
		if (it.allErrors) _dynamicRef();
		else {
			const valid = gen.let("valid", false);
			_dynamicRef(valid);
			cxt.ok(valid);
		}
		function _dynamicRef(valid) {
			if (it.schemaEnv.root.dynamicAnchors[anchor]) {
				const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
				gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
			} else _callRef(it.validateName, valid)();
		}
		function _callRef(validate, valid) {
			return valid ? () => gen.block(() => {
				(0, ref_1.callRef)(cxt, validate);
				gen.let(valid, true);
			}) : () => (0, ref_1.callRef)(cxt, validate);
		}
	}
	exports.dynamicRef = dynamicRef;
	exports.default = def;
}));
var require_recursiveAnchor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicAnchor_1 = require_dynamicAnchor();
	var util_1 = require_util();
	exports.default = {
		keyword: "$recursiveAnchor",
		schemaType: "boolean",
		code(cxt) {
			if (cxt.schema) (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
			else (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
		}
	};
}));
var require_recursiveRef = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicRef_1 = require_dynamicRef();
	exports.default = {
		keyword: "$recursiveRef",
		schemaType: "string",
		code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
	};
}));
var require_dynamic = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicAnchor_1 = require_dynamicAnchor();
	var dynamicRef_1 = require_dynamicRef();
	var recursiveAnchor_1 = require_recursiveAnchor();
	var recursiveRef_1 = require_recursiveRef();
	exports.default = [
		dynamicAnchor_1.default,
		dynamicRef_1.default,
		recursiveAnchor_1.default,
		recursiveRef_1.default
	];
}));
var require_dependentRequired = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dependencies_1 = require_dependencies();
	exports.default = {
		keyword: "dependentRequired",
		type: "object",
		schemaType: "object",
		error: dependencies_1.error,
		code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
	};
}));
var require_dependentSchemas = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dependencies_1 = require_dependencies();
	exports.default = {
		keyword: "dependentSchemas",
		type: "object",
		schemaType: "object",
		code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
	};
}));
var require_limitContains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["maxContains", "minContains"],
		type: "array",
		schemaType: "number",
		code({ keyword, parentSchema, it }) {
			if (parentSchema.contains === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
		}
	};
}));
var require_next = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dependentRequired_1 = require_dependentRequired();
	var dependentSchemas_1 = require_dependentSchemas();
	var limitContains_1 = require_limitContains();
	exports.default = [
		dependentRequired_1.default,
		dependentSchemas_1.default,
		limitContains_1.default
	];
}));
var require_unevaluatedProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.default = {
		keyword: "unevaluatedProperties",
		type: "object",
		schemaType: ["boolean", "object"],
		trackErrors: true,
		error: {
			message: "must NOT have unevaluated properties",
			params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
		},
		code(cxt) {
			const { gen, schema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, props } = it;
			if (props instanceof codegen_1.Name) gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
			else if (props !== true) gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
			it.props = true;
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function unevaluatedPropCode(key) {
				if (schema === false) {
					cxt.setParams({ unevaluatedProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (!(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					cxt.subschema({
						keyword: "unevaluatedProperties",
						dataProp: key,
						dataPropType: util_1.Type.Str
					}, valid);
					if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
				}
			}
			function unevaluatedDynamic(evaluatedProps, key) {
				return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
			}
			function unevaluatedStatic(evaluatedProps, key) {
				const ps = [];
				for (const p in evaluatedProps) if (evaluatedProps[p] === true) ps.push((0, codegen_1._)`${key} !== ${p}`);
				return (0, codegen_1.and)(...ps);
			}
		}
	};
}));
var require_unevaluatedItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "unevaluatedItems",
		type: "array",
		schemaType: ["boolean", "object"],
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			const items = it.items || 0;
			if (items === true) return;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			if (schema === false) {
				cxt.setParams({ len: items });
				cxt.fail((0, codegen_1._)`${len} > ${items}`);
			} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
				const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
				gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
				cxt.ok(valid);
			}
			it.items = true;
			function validateItems(valid, from) {
				gen.forRange("i", from, len, (i) => {
					cxt.subschema({
						keyword: "unevaluatedItems",
						dataProp: i,
						dataPropType: util_1.Type.Num
					}, valid);
					if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
				});
			}
		}
	};
}));
var require_unevaluated = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var unevaluatedProperties_1 = require_unevaluatedProperties();
	var unevaluatedItems_1 = require_unevaluatedItems();
	exports.default = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
}));
var require_draft2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var dynamic_1 = require_dynamic();
	var next_1 = require_next();
	var unevaluated_1 = require_unevaluated();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		dynamic_1.default,
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(true),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary,
		next_1.default,
		unevaluated_1.default
	];
}));
var schema_exports = /* @__PURE__ */ __exportAll({
	$comment: () => $comment,
	$dynamicAnchor: () => $dynamicAnchor$7,
	$id: () => $id$9,
	$schema: () => $schema$9,
	$vocabulary: () => $vocabulary$7,
	allOf: () => allOf,
	default: () => schema_default,
	properties: () => properties$8,
	title: () => title$9,
	type: () => type$8
});
var $schema$9, $id$9, $vocabulary$7, $dynamicAnchor$7, title$9, allOf, type$8, $comment, properties$8, schema_default;
var init_schema = __esmMin((() => {
	$schema$9 = "https://json-schema.org/draft/2020-12/schema";
	$id$9 = "https://json-schema.org/draft/2020-12/schema";
	$vocabulary$7 = {
		"https://json-schema.org/draft/2020-12/vocab/core": true,
		"https://json-schema.org/draft/2020-12/vocab/applicator": true,
		"https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
		"https://json-schema.org/draft/2020-12/vocab/validation": true,
		"https://json-schema.org/draft/2020-12/vocab/meta-data": true,
		"https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
		"https://json-schema.org/draft/2020-12/vocab/content": true
	};
	$dynamicAnchor$7 = "meta";
	title$9 = "Core and Validation specifications meta-schema";
	allOf = [
		{ "$ref": "meta/core" },
		{ "$ref": "meta/applicator" },
		{ "$ref": "meta/unevaluated" },
		{ "$ref": "meta/validation" },
		{ "$ref": "meta/meta-data" },
		{ "$ref": "meta/format-annotation" },
		{ "$ref": "meta/content" }
	];
	type$8 = ["object", "boolean"];
	$comment = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.";
	properties$8 = {
		"definitions": {
			"$comment": "\"definitions\" has been replaced by \"$defs\".",
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"deprecated": true,
			"default": {}
		},
		"dependencies": {
			"$comment": "\"dependencies\" has been split and replaced by \"dependentSchemas\" and \"dependentRequired\" in order to serve their differing semantics.",
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$dynamicRef": "#meta" }, { "$ref": "meta/validation#/$defs/stringArray" }] },
			"deprecated": true,
			"default": {}
		},
		"$recursiveAnchor": {
			"$comment": "\"$recursiveAnchor\" has been replaced by \"$dynamicAnchor\".",
			"$ref": "meta/core#/$defs/anchorString",
			"deprecated": true
		},
		"$recursiveRef": {
			"$comment": "\"$recursiveRef\" has been replaced by \"$dynamicRef\".",
			"$ref": "meta/core#/$defs/uriReferenceString",
			"deprecated": true
		}
	};
	schema_default = {
		$schema: $schema$9,
		$id: $id$9,
		$vocabulary: $vocabulary$7,
		$dynamicAnchor: $dynamicAnchor$7,
		title: title$9,
		allOf,
		type: type$8,
		$comment,
		properties: properties$8
	};
}));
var applicator_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$3,
	$dynamicAnchor: () => $dynamicAnchor$6,
	$id: () => $id$8,
	$schema: () => $schema$8,
	$vocabulary: () => $vocabulary$6,
	default: () => applicator_default,
	properties: () => properties$7,
	title: () => title$8,
	type: () => type$7
});
var $schema$8, $id$8, $vocabulary$6, $dynamicAnchor$6, title$8, type$7, properties$7, $defs$3, applicator_default;
var init_applicator = __esmMin((() => {
	$schema$8 = "https://json-schema.org/draft/2020-12/schema";
	$id$8 = "https://json-schema.org/draft/2020-12/meta/applicator";
	$vocabulary$6 = { "https://json-schema.org/draft/2020-12/vocab/applicator": true };
	$dynamicAnchor$6 = "meta";
	title$8 = "Applicator vocabulary meta-schema";
	type$7 = ["object", "boolean"];
	properties$7 = {
		"prefixItems": { "$ref": "#/$defs/schemaArray" },
		"items": { "$dynamicRef": "#meta" },
		"contains": { "$dynamicRef": "#meta" },
		"additionalProperties": { "$dynamicRef": "#meta" },
		"properties": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependentSchemas": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" },
			"default": {}
		},
		"propertyNames": { "$dynamicRef": "#meta" },
		"if": { "$dynamicRef": "#meta" },
		"then": { "$dynamicRef": "#meta" },
		"else": { "$dynamicRef": "#meta" },
		"allOf": { "$ref": "#/$defs/schemaArray" },
		"anyOf": { "$ref": "#/$defs/schemaArray" },
		"oneOf": { "$ref": "#/$defs/schemaArray" },
		"not": { "$dynamicRef": "#meta" }
	};
	$defs$3 = { "schemaArray": {
		"type": "array",
		"minItems": 1,
		"items": { "$dynamicRef": "#meta" }
	} };
	applicator_default = {
		$schema: $schema$8,
		$id: $id$8,
		$vocabulary: $vocabulary$6,
		$dynamicAnchor: $dynamicAnchor$6,
		title: title$8,
		type: type$7,
		properties: properties$7,
		$defs: $defs$3
	};
}));
var unevaluated_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$5,
	$id: () => $id$7,
	$schema: () => $schema$7,
	$vocabulary: () => $vocabulary$5,
	default: () => unevaluated_default,
	properties: () => properties$6,
	title: () => title$7,
	type: () => type$6
});
var $schema$7, $id$7, $vocabulary$5, $dynamicAnchor$5, title$7, type$6, properties$6, unevaluated_default;
var init_unevaluated = __esmMin((() => {
	$schema$7 = "https://json-schema.org/draft/2020-12/schema";
	$id$7 = "https://json-schema.org/draft/2020-12/meta/unevaluated";
	$vocabulary$5 = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": true };
	$dynamicAnchor$5 = "meta";
	title$7 = "Unevaluated applicator vocabulary meta-schema";
	type$6 = ["object", "boolean"];
	properties$6 = {
		"unevaluatedItems": { "$dynamicRef": "#meta" },
		"unevaluatedProperties": { "$dynamicRef": "#meta" }
	};
	unevaluated_default = {
		$schema: $schema$7,
		$id: $id$7,
		$vocabulary: $vocabulary$5,
		$dynamicAnchor: $dynamicAnchor$5,
		title: title$7,
		type: type$6,
		properties: properties$6
	};
}));
var content_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$4,
	$id: () => $id$6,
	$schema: () => $schema$6,
	$vocabulary: () => $vocabulary$4,
	default: () => content_default,
	properties: () => properties$5,
	title: () => title$6,
	type: () => type$5
});
var $schema$6, $id$6, $vocabulary$4, $dynamicAnchor$4, title$6, type$5, properties$5, content_default;
var init_content = __esmMin((() => {
	$schema$6 = "https://json-schema.org/draft/2020-12/schema";
	$id$6 = "https://json-schema.org/draft/2020-12/meta/content";
	$vocabulary$4 = { "https://json-schema.org/draft/2020-12/vocab/content": true };
	$dynamicAnchor$4 = "meta";
	title$6 = "Content vocabulary meta-schema";
	type$5 = ["object", "boolean"];
	properties$5 = {
		"contentEncoding": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentSchema": { "$dynamicRef": "#meta" }
	};
	content_default = {
		$schema: $schema$6,
		$id: $id$6,
		$vocabulary: $vocabulary$4,
		$dynamicAnchor: $dynamicAnchor$4,
		title: title$6,
		type: type$5,
		properties: properties$5
	};
}));
var core_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$2,
	$dynamicAnchor: () => $dynamicAnchor$3,
	$id: () => $id$5,
	$schema: () => $schema$5,
	$vocabulary: () => $vocabulary$3,
	default: () => core_default,
	properties: () => properties$4,
	title: () => title$5,
	type: () => type$4
});
var $schema$5, $id$5, $vocabulary$3, $dynamicAnchor$3, title$5, type$4, properties$4, $defs$2, core_default;
var init_core = __esmMin((() => {
	$schema$5 = "https://json-schema.org/draft/2020-12/schema";
	$id$5 = "https://json-schema.org/draft/2020-12/meta/core";
	$vocabulary$3 = { "https://json-schema.org/draft/2020-12/vocab/core": true };
	$dynamicAnchor$3 = "meta";
	title$5 = "Core vocabulary meta-schema";
	type$4 = ["object", "boolean"];
	properties$4 = {
		"$id": {
			"$ref": "#/$defs/uriReferenceString",
			"$comment": "Non-empty fragments not allowed.",
			"pattern": "^[^#]*#?$"
		},
		"$schema": { "$ref": "#/$defs/uriString" },
		"$ref": { "$ref": "#/$defs/uriReferenceString" },
		"$anchor": { "$ref": "#/$defs/anchorString" },
		"$dynamicRef": { "$ref": "#/$defs/uriReferenceString" },
		"$dynamicAnchor": { "$ref": "#/$defs/anchorString" },
		"$vocabulary": {
			"type": "object",
			"propertyNames": { "$ref": "#/$defs/uriString" },
			"additionalProperties": { "type": "boolean" }
		},
		"$comment": { "type": "string" },
		"$defs": {
			"type": "object",
			"additionalProperties": { "$dynamicRef": "#meta" }
		}
	};
	$defs$2 = {
		"anchorString": {
			"type": "string",
			"pattern": "^[A-Za-z_][-A-Za-z0-9._]*$"
		},
		"uriString": {
			"type": "string",
			"format": "uri"
		},
		"uriReferenceString": {
			"type": "string",
			"format": "uri-reference"
		}
	};
	core_default = {
		$schema: $schema$5,
		$id: $id$5,
		$vocabulary: $vocabulary$3,
		$dynamicAnchor: $dynamicAnchor$3,
		title: title$5,
		type: type$4,
		properties: properties$4,
		$defs: $defs$2
	};
}));
var format_annotation_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$2,
	$id: () => $id$4,
	$schema: () => $schema$4,
	$vocabulary: () => $vocabulary$2,
	default: () => format_annotation_default,
	properties: () => properties$3,
	title: () => title$4,
	type: () => type$3
});
var $schema$4, $id$4, $vocabulary$2, $dynamicAnchor$2, title$4, type$3, properties$3, format_annotation_default;
var init_format_annotation = __esmMin((() => {
	$schema$4 = "https://json-schema.org/draft/2020-12/schema";
	$id$4 = "https://json-schema.org/draft/2020-12/meta/format-annotation";
	$vocabulary$2 = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": true };
	$dynamicAnchor$2 = "meta";
	title$4 = "Format vocabulary meta-schema for annotation results";
	type$3 = ["object", "boolean"];
	properties$3 = { "format": { "type": "string" } };
	format_annotation_default = {
		$schema: $schema$4,
		$id: $id$4,
		$vocabulary: $vocabulary$2,
		$dynamicAnchor: $dynamicAnchor$2,
		title: title$4,
		type: type$3,
		properties: properties$3
	};
}));
var meta_data_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$1,
	$id: () => $id$3,
	$schema: () => $schema$3,
	$vocabulary: () => $vocabulary$1,
	default: () => meta_data_default,
	properties: () => properties$2,
	title: () => title$3,
	type: () => type$2
});
var $schema$3, $id$3, $vocabulary$1, $dynamicAnchor$1, title$3, type$2, properties$2, meta_data_default;
var init_meta_data = __esmMin((() => {
	$schema$3 = "https://json-schema.org/draft/2020-12/schema";
	$id$3 = "https://json-schema.org/draft/2020-12/meta/meta-data";
	$vocabulary$1 = { "https://json-schema.org/draft/2020-12/vocab/meta-data": true };
	$dynamicAnchor$1 = "meta";
	title$3 = "Meta-data vocabulary meta-schema";
	type$2 = ["object", "boolean"];
	properties$2 = {
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"deprecated": {
			"type": "boolean",
			"default": false
		},
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"writeOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		}
	};
	meta_data_default = {
		$schema: $schema$3,
		$id: $id$3,
		$vocabulary: $vocabulary$1,
		$dynamicAnchor: $dynamicAnchor$1,
		title: title$3,
		type: type$2,
		properties: properties$2
	};
}));
var validation_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$1,
	$dynamicAnchor: () => $dynamicAnchor,
	$id: () => $id$2,
	$schema: () => $schema$2,
	$vocabulary: () => $vocabulary,
	default: () => validation_default,
	properties: () => properties$1,
	title: () => title$2,
	type: () => type$1
});
var $schema$2, $id$2, $vocabulary, $dynamicAnchor, title$2, type$1, properties$1, $defs$1, validation_default;
var init_validation = __esmMin((() => {
	$schema$2 = "https://json-schema.org/draft/2020-12/schema";
	$id$2 = "https://json-schema.org/draft/2020-12/meta/validation";
	$vocabulary = { "https://json-schema.org/draft/2020-12/vocab/validation": true };
	$dynamicAnchor = "meta";
	title$2 = "Validation vocabulary meta-schema";
	type$1 = ["object", "boolean"];
	properties$1 = {
		"type": { "anyOf": [{ "$ref": "#/$defs/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/$defs/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"const": true,
		"enum": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/$defs/nonNegativeInteger" },
		"minLength": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"maxItems": { "$ref": "#/$defs/nonNegativeInteger" },
		"minItems": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"maxContains": { "$ref": "#/$defs/nonNegativeInteger" },
		"minContains": {
			"$ref": "#/$defs/nonNegativeInteger",
			"default": 1
		},
		"maxProperties": { "$ref": "#/$defs/nonNegativeInteger" },
		"minProperties": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/$defs/stringArray" },
		"dependentRequired": {
			"type": "object",
			"additionalProperties": { "$ref": "#/$defs/stringArray" }
		}
	};
	$defs$1 = {
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": {
			"$ref": "#/$defs/nonNegativeInteger",
			"default": 0
		},
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	validation_default = {
		$schema: $schema$2,
		$id: $id$2,
		$vocabulary,
		$dynamicAnchor,
		title: title$2,
		type: type$1,
		properties: properties$1,
		$defs: $defs$1
	};
}));
var require_json_schema_2020_12 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var metaSchema = (init_schema(), __toCommonJS(schema_exports).default);
	var applicator = (init_applicator(), __toCommonJS(applicator_exports).default);
	var unevaluated = (init_unevaluated(), __toCommonJS(unevaluated_exports).default);
	var content = (init_content(), __toCommonJS(content_exports).default);
	var core = (init_core(), __toCommonJS(core_exports).default);
	var format = (init_format_annotation(), __toCommonJS(format_annotation_exports).default);
	var metadata = (init_meta_data(), __toCommonJS(meta_data_exports).default);
	var validation = (init_validation(), __toCommonJS(validation_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	function addMetaSchema2020($data) {
		[
			metaSchema,
			applicator,
			unevaluated,
			content,
			core,
			with$data(this, format),
			metadata,
			with$data(this, validation)
		].forEach((sch) => this.addMetaSchema(sch, void 0, false));
		return this;
		function with$data(ajv, sch) {
			return $data ? ajv.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
		}
	}
	exports.default = addMetaSchema2020;
}));
var require__2020 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
	var core_1 = require_core$1();
	var draft2020_1 = require_draft2020();
	var discriminator_1 = require_discriminator();
	var json_schema_2020_12_1 = require_json_schema_2020_12();
	var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
	var Ajv2020 = class extends core_1.default {
		constructor(opts = {}) {
			super({
				...opts,
				dynamicRef: true,
				next: true,
				unevaluated: true
			});
		}
		_addVocabularies() {
			super._addVocabularies();
			draft2020_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			const { $data, meta } = this.opts;
			if (!meta) return;
			json_schema_2020_12_1.default.call(this, $data);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv2020 = Ajv2020;
	module.exports = exports = Ajv2020;
	module.exports.Ajv2020 = Ajv2020;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv2020;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
	function fmtDef(validate, compare) {
		return {
			validate,
			compare
		};
	}
	exports.fullFormats = {
		date: fmtDef(date, compareDate),
		time: fmtDef(time, compareTime),
		"date-time": fmtDef(date_time, compareDateTime),
		duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
		uri,
		"uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
		"uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
		url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
		email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
		hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
		ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
		ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
		regex,
		uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
		"json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
		"json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
		"relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
		byte,
		int32: {
			type: "number",
			validate: validateInt32
		},
		int64: {
			type: "number",
			validate: validateInt64
		},
		float: {
			type: "number",
			validate: validateNumber
		},
		double: {
			type: "number",
			validate: validateNumber
		},
		password: true,
		binary: true
	};
	exports.fastFormats = {
		...exports.fullFormats,
		date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
		time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareTime),
		"date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
		uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
		"uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
		email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
	};
	exports.formatNames = Object.keys(exports.fullFormats);
	function isLeapYear(year) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}
	var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
	var DAYS = [
		0,
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	function date(str) {
		const matches = DATE.exec(str);
		if (!matches) return false;
		const year = +matches[1];
		const month = +matches[2];
		const day = +matches[3];
		return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
	}
	function compareDate(d1, d2) {
		if (!(d1 && d2)) return void 0;
		if (d1 > d2) return 1;
		if (d1 < d2) return -1;
		return 0;
	}
	var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
	function time(str, withTimeZone) {
		const matches = TIME.exec(str);
		if (!matches) return false;
		const hour = +matches[1];
		const minute = +matches[2];
		const second = +matches[3];
		const timeZone = matches[5];
		return (hour <= 23 && minute <= 59 && second <= 59 || hour === 23 && minute === 59 && second === 60) && (!withTimeZone || timeZone !== "");
	}
	function compareTime(t1, t2) {
		if (!(t1 && t2)) return void 0;
		const a1 = TIME.exec(t1);
		const a2 = TIME.exec(t2);
		if (!(a1 && a2)) return void 0;
		t1 = a1[1] + a1[2] + a1[3] + (a1[4] || "");
		t2 = a2[1] + a2[2] + a2[3] + (a2[4] || "");
		if (t1 > t2) return 1;
		if (t1 < t2) return -1;
		return 0;
	}
	var DATE_TIME_SEPARATOR = /t|\s/i;
	function date_time(str) {
		const dateTime = str.split(DATE_TIME_SEPARATOR);
		return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1], true);
	}
	function compareDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
		const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
		const res = compareDate(d1, d2);
		if (res === void 0) return void 0;
		return res || compareTime(t1, t2);
	}
	var NOT_URI_FRAGMENT = /\/|:/;
	var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
	function uri(str) {
		return NOT_URI_FRAGMENT.test(str) && URI.test(str);
	}
	var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
	function byte(str) {
		BYTE.lastIndex = 0;
		return BYTE.test(str);
	}
	var MIN_INT32 = -(2 ** 31);
	var MAX_INT32 = 2 ** 31 - 1;
	function validateInt32(value) {
		return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
	}
	function validateInt64(value) {
		return Number.isInteger(value);
	}
	function validateNumber() {
		return true;
	}
	var Z_ANCHOR = /[^\\]\\Z/;
	function regex(str) {
		if (Z_ANCHOR.test(str)) return false;
		try {
			new RegExp(str);
			return true;
		} catch (e) {
			return false;
		}
	}
}));
var require_limit = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatLimitDefinition = void 0;
	var ajv_1 = require_ajv();
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		formatMaximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		formatMinimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		formatExclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		formatExclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.formatLimitDefinition = {
		keyword: Object.keys(KWDs),
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => codegen_1.str`should be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => codegen_1._`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, keyword, it } = cxt;
			const { opts, self } = it;
			if (!opts.validateFormats) return;
			const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
			if (fCxt.$data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fmt = gen.const("fmt", codegen_1._`${fmts}[${fCxt.schemaCode}]`);
				cxt.fail$data(codegen_1.or(codegen_1._`typeof ${fmt} != "object"`, codegen_1._`${fmt} instanceof RegExp`, codegen_1._`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
			}
			function validateFormat() {
				const format = fCxt.schema;
				const fmtDef = self.formats[format];
				if (!fmtDef || fmtDef === true) return;
				if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
				const fmt = gen.scopeValue("formats", {
					key: format,
					ref: fmtDef,
					code: opts.code.formats ? codegen_1._`${opts.code.formats}${codegen_1.getProperty(format)}` : void 0
				});
				cxt.fail$data(compareCode(fmt));
			}
			function compareCode(fmt) {
				return codegen_1._`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
			}
		},
		dependencies: ["format"]
	};
	var formatLimitPlugin = (ajv) => {
		ajv.addKeyword(exports.formatLimitDefinition);
		return ajv;
	};
	exports.default = formatLimitPlugin;
}));
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var formats_1 = require_formats();
	var limit_1 = require_limit();
	var codegen_1 = require_codegen();
	var fullName = new codegen_1.Name("fullFormats");
	var fastName = new codegen_1.Name("fastFormats");
	var formatsPlugin = (ajv, opts = { keywords: true }) => {
		if (Array.isArray(opts)) {
			addFormats(ajv, opts, formats_1.fullFormats, fullName);
			return ajv;
		}
		const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		addFormats(ajv, opts.formats || formats_1.formatNames, formats, exportName);
		if (opts.keywords) limit_1.default(ajv);
		return ajv;
	};
	formatsPlugin.get = (name, mode = "full") => {
		const f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name];
		if (!f) throw new Error(`Unknown format "${name}"`);
		return f;
	};
	function addFormats(ajv, list, fs, exportName) {
		var _a;
		var _b;
		(_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 || (_b.formats = codegen_1._`require("ajv-formats/dist/formats").${exportName}`);
		for (const f of list) ajv.addFormat(f, fs[f]);
	}
	module.exports = exports = formatsPlugin;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = formatsPlugin;
}));
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isPort = RegExp.prototype.test.bind(/^\d*$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
	/** @type {(value: string) => boolean} */
	var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
	/** @type {(value: string) => boolean} */
	var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
	var BYTE_HEX = new Array(256);
	{
		const HEX_DIGITS = "0123456789ABCDEF";
		for (let i = 0; i < 256; i++) BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
	}
	function percentEncodeNonAscii(cp) {
		if (cp < 2048) return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
		if (cp < 65536) return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
		return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
	}
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/** @type {(value: string) => boolean} */
	var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
	/** @type {(value: string) => boolean} */
	var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
	/** @type {(value: string) => boolean} */
	var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {string} zone
	* @returns {boolean}
	*/
	function isZoneIdentifier(zone) {
		if (zone.length === 0) return false;
		for (let i = 0; i < zone.length; i++) {
			if (isZoneCharacter(zone[i])) continue;
			if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
				i += 2;
				continue;
			}
			return false;
		}
		return true;
	}
	/**
	* Compresses the longest run of zero hextets to "::" per RFC 5952. A run of a
	* single zero hextet is left uncompressed. On ties the leftmost run wins.
	*
	* @param {string[]} hextets
	* @returns {string}
	*/
	function compressIPv6ZeroRun(hextets) {
		let bestStart = -1;
		let bestLength = 0;
		let runStart = -1;
		let runLength = 0;
		for (let i = 0; i < hextets.length; i++) if (hextets[i] === "0") {
			if (runStart === -1) runStart = i;
			runLength++;
			if (runLength > bestLength) {
				bestLength = runLength;
				bestStart = runStart;
			}
		} else {
			runStart = -1;
			runLength = 0;
		}
		if (bestLength < 2) return hextets.join(":");
		const head = hextets.slice(0, bestStart).join(":");
		const tail = hextets.slice(bestStart + bestLength).join(":");
		return head + "::" + tail;
	}
	/**
	* Validates an IPv6 address against the alternatives in RFC 3986 section
	* 3.2.2 and returns the same address with leading hextet zeroes removed.
	* An embedded IPv4 address counts as two hextets and is only valid at the end.
	*
	* @param {string} input
	* @returns {string|undefined}
	*/
	function normalizeIPv6Address(input) {
		const compression = input.indexOf("::");
		if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
		const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
		const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
		if (compression !== -1) {
			if (left.length === 1 && left[0] === "") left.length = 0;
			if (right.length === 1 && right[0] === "") right.length = 0;
		}
		const parts = left.concat(right);
		let hextetCount = 0;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part === "") return void 0;
			if (part.indexOf(".") !== -1) {
				if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
				hextetCount += 2;
				continue;
			}
			if (!isHextet(part)) return void 0;
			parts[i] = parseInt(part, 16).toString(16);
			hextetCount++;
		}
		if (compression === -1) {
			if (hextetCount !== 8) return void 0;
			return compressIPv6ZeroRun(parts);
		}
		if (hextetCount >= 8) return void 0;
		const expanded = parts.slice(0, left.length);
		for (let i = hextetCount; i < 8; i++) expanded.push("0");
		for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
		return compressIPv6ZeroRun(expanded);
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	* @property {boolean} [isIPVFuture] - Indicates if the host is an IPvFuture literal.
	* @property {boolean} [error] - Indicates if a bracketed IP literal is malformed.
	*/
	/**
	* Validates and normalizes a bracketed IP literal. Raw zone separators remain
	* accepted for backwards compatibility, while encoded separators and zone
	* contents follow RFC 6874.
	*
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		const bracketed = host[0] === "[" && host[host.length - 1] === "]";
		if ((host[0] === "[" || host[host.length - 1] === "]") && !bracketed) return {
			host,
			isIPV6: false,
			error: true
		};
		let input = bracketed ? host.slice(1, -1) : host;
		if (bracketed && isIPvFuture(input)) {
			input = input.toLowerCase();
			return {
				host: `[${input}]`,
				escapedHost: input,
				isIPV6: false,
				isIPVFuture: true
			};
		}
		if (findToken(input, ":") < 2) return {
			host,
			isIPV6: false,
			error: bracketed
		};
		let zoneIdentifier = "";
		const zoneSeparator = input.indexOf("%");
		if (zoneSeparator !== -1) {
			const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
			zoneIdentifier = input.slice(zoneSeparator + separatorLength);
			if (!isZoneIdentifier(zoneIdentifier)) return {
				host,
				isIPV6: false,
				error: true
			};
			input = input.slice(0, zoneSeparator);
		}
		const address = normalizeIPv6Address(input);
		if (address === void 0) return {
			host,
			isIPV6: false,
			error: true
		};
		return {
			host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
			escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
			isIPV6: true
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) {
				if (input === ".") break;
				else if (input === "/") {
					output.push("/");
					break;
				} else {
					output.push(input);
					break;
				}
			} else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Removes dot segments from the path of a relative reference (a path that does
	* not start with "/") without changing what it resolves to against any base.
	* Unlike `removeDotSegments`, leading ".." segments that cannot be collapsed
	* are kept, the result never becomes root-relative, and a result that would be
	* empty or start with an empty segment is prefixed with "." (an empty path
	* means "same document" and a leading "//" would introduce an authority).
	*
	* @param {string} path
	* @returns {string}
	*/
	function removeDotSegmentsRelative(path) {
		if (path === "" || path[0] === "/") return removeDotSegments(path);
		const segments = path.split("/");
		const last = segments.length - 1;
		/** @type {string[]} */
		const output = [];
		let trailingDirectory = false;
		for (let i = 0; i <= last; i++) {
			const segment = segments[i];
			if (segment === "." || segment === "..") {
				if (segment === "..") {
					if (output.length !== 0 && output[output.length - 1] !== "..") output.pop();
					else output.push("..");
				}
				trailingDirectory = i === last;
			} else output.push(segment);
		}
		if (trailingDirectory && output[output.length - 1] !== "..") output.push("");
		if (output.length === 0 || output[0] === "" || output[0].includes(":")) output.unshift(".");
		return output.join("/");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` stay escaped; `%2E` is unreserved.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Serializes a path without rewriting reserved data. Raw RFC 3986 path
	* characters remain literal, valid escapes are preserved and uppercased, and
	* everything else is UTF-8 percent-encoded. In a path-noscheme, a colon in the
	* first segment must be escaped so the result cannot be parsed as a scheme.
	*
	* @param {string} input
	* @param {boolean} [pathNoScheme=false]
	* @returns {string}
	*/
	function serializePathEncoding(input, pathNoScheme = false) {
		let output = "";
		let firstSegment = pathNoScheme && input[0] !== "/";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			if (ch === "/") firstSegment = false;
			if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Percent-encodes a URI component using its RFC 3986 literal character set.
	* Existing valid escapes are preserved and normalized to uppercase hex.
	*
	* @param {string} input
	* @param {(value: string) => boolean} isAllowed
	* @returns {string}
	*/
	function encodeComponent(input, isAllowed) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			if (isAllowed(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Encodes userinfo while preserving its RFC 3986 §3.2.1 literal characters.
	* In particular, authority delimiters such as `@`, `/`, `?`, and `#` are data.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeUserinfo(input) {
		return encodeComponent(input, isUserinfoCharacter);
	}
	/**
	* Encodes query data using the RFC 3986 §3.4 grammar. A literal `#` must be
	* escaped because it would otherwise begin the fragment component.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeQuery(input) {
		return encodeComponent(input, isQueryFragmentCharacter);
	}
	/**
	* Encodes fragment data using the RFC 3986 §3.5 grammar.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeFragment(input) {
		return encodeComponent(input, isQueryFragmentCharacter);
	}
	function isEscapeSafe(cp) {
		return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
	}
	/**
	* Normalizes the percent-encoding of a query or fragment component.
	*
	* Like `normalizePathEncoding`, but uses the query/fragment character set
	* (which additionally allows `?`) and decodes `.` since it has no dot-segment
	* meaning outside of a path.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizeQueryFragmentEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isQueryFragmentCharacter(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(encodeUserinfo(component.userinfo));
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = component.host;
			if (!isIPv4(host)) {
				let ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
					host = normalizePercentEncoding(host, true);
					ipV6res = normalizeIPv6(host);
				}
				if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			const port = String(component.port);
			if (!isPort(port)) throw new TypeError("URI port is malformed.");
			uriTokens.push(":");
			uriTokens.push(port);
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		serializePathEncoding,
		normalizeQueryFragmentEncoding,
		encodeUserinfo,
		encodeQuery,
		encodeFragment,
		escapePreservingEscapes,
		removeDotSegments,
		removeDotSegmentsRelative,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils();
	var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const queryIndex = wsComponent.resourceName.indexOf("?");
			const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches && matches[0] === urnComponent.path) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	var { SCHEMES, getSchemeHandler } = require_schemes();
	var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
	var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
	var MALFORMED_HOST_ERROR = "URI host is malformed.";
	var FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
	/**
	* RFC 3986 section 3.1 does not allow percent-encoding in a scheme, so the
	* scheme is validated as-is and never decoded. Decoding would let inert input
	* such as `%6Aavascript:` become a live `javascript:` scheme.
	*
	* @param {string} scheme
	* @returns {string}
	*/
	function validateScheme(scheme) {
		const stringScheme = String(scheme);
		if (!VALID_SCHEME.test(stringScheme)) throw new TypeError(MALFORMED_SCHEME_ERROR);
		return stringScheme;
	}
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed, malformedPercentEncoding: baseMalformedPercentEncoding, malformedSchemeSpecific: baseMalformedSchemeSpecific, malformedHost: baseMalformedHost, malformedScheme: baseMalformedScheme } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed, malformedPercentEncoding: relativeMalformedPercentEncoding, malformedSchemeSpecific: relativeMalformedSchemeSpecific, malformedHost: relativeMalformedHost, malformedScheme: relativeMalformedScheme } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
		const resolvedHost = resolved.host;
		const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
		if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) throw new Error(MALFORMED_HOST_ERROR);
		canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
		const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !/\P{ASCII}/u.test(resolvedHost);
		if (resolved.error && !encodedASCIIHost) throw new Error(resolved.error);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						const baseHasAuthority = base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0;
						if (baseHasAuthority && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = base.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		if (component.scheme) component.scheme = validateScheme(component.scheme);
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
		const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
		const pathNoScheme = !options.skipEscape && schemelessReference;
		if (component.path !== void 0) {
			if (!options.skipEscape) component.path = serializePathEncoding(component.path, pathNoScheme);
			else component.path = normalizePercentEncoding(component.path);
		}
		if (options.reference !== "suffix" && component.scheme) {
			component.scheme = validateScheme(component.scheme);
			uriTokens.push(component.scheme, ":");
		}
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
			if (schemelessReference) s = serializePathEncoding(s, true);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", encodeQuery(component.query));
		if (component.fragment !== void 0) uriTokens.push("#", encodeFragment(component.fragment));
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* Checks percent syntax without decoding the represented octets. RFC 3986
	* percent-encoding is byte-oriented, so sequences such as `%FF` are valid even
	* though they are not independently valid UTF-8.
	*
	* @param {string|undefined} component
	* @returns {boolean}
	*/
	function hasMalformedPercentEncoding(component) {
		if (component === void 0) return false;
		let percent = component.indexOf("%");
		while (percent !== -1) {
			if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) return true;
			percent = component.indexOf("%", percent + 3);
		}
		return false;
	}
	/**
	* Whether the host is a bracketed IP literal (RFC 3986 `IP-literal`).
	* An unterminated `[` is not a literal, so it must still be validated as a
	* reg-name instead of being waved through as an IP.
	*
	* @param {string} host
	* @returns {boolean}
	*/
	function isIPLiteral(host) {
		return host[0] === "[" && host[host.length - 1] === "]";
	}
	/**
	* @param {RegExpMatchArray} matches
	* @returns {boolean}
	*/
	function hasMalformedComponentPercentEncoding(matches) {
		const host = matches[4];
		return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
	}
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean, unicodeSupport?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean} whether host conversion failed
	*/
	function canonicalizeHost(parsed, options, schemeHandler, isIP) {
		if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP)) {
			parsed.error = parsed.error || MALFORMED_HOST_ERROR;
			return true;
		}
		if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
			let url;
			try {
				url = new URL("http://" + parsed.host);
			} catch (e) {
				parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				return true;
			}
			if (!isHostOnlyURL(url)) {
				parsed.error = parsed.error || MALFORMED_HOST_ERROR;
				return true;
			}
			parsed.host = url.hostname;
		}
		return false;
	}
	/**
	* Whether a domain host contains an ASCII character that RFC 3986 does not
	* allow in a reg-name (unreserved, sub-delims, or pct-encoded). Such a host is
	* rejected instead of being handed to the WHATWG URL parser, which would treat
	* "@" as a userinfo delimiter (silently dropping the data before it) and strip
	* TAB, LF, and CR. Non-ASCII characters remain allowed for IDNs.
	*
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean}
	*/
	function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP) {
		return Boolean(parsed.host && isIP === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host));
	}
	/**
	* @param {URL} url
	* @returns {boolean}
	*/
	function isHostOnlyURL(url) {
		return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let malformedPercentEncoding = false;
		let malformedSchemeSpecific = false;
		let malformedHost = false;
		let malformedIPLiteral = false;
		let malformedScheme = false;
		let isIP = false;
		if (options.reference === "suffix") {
			if (options.scheme) uri = options.scheme + ":" + uri;
			else uri = "//" + uri;
		}
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (parsed.scheme !== void 0) {
				if (VALID_SCHEME.test(parsed.scheme)) parsed.scheme = parsed.scheme.toLowerCase();
				else {
					parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
					malformedScheme = true;
				}
			}
			malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
			if (malformedPercentEncoding) parsed.error = parsed.error || "URI contains malformed percent-encoding.";
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) {
				if (isIPv4(parsed.host) === false) {
					const bracketedIPLiteral = isIPLiteral(parsed.host);
					const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
					const ipv6result = normalizeIPv6(parsed.host);
					isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
					malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
					parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
					if (malformedIPLiteral) {
						parsed.error = parsed.error || MALFORMED_HOST_ERROR;
						malformedAuthorityOrPort = true;
					}
				} else isIP = true;
			}
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!malformedIPLiteral) malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
			if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
				let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
				if (!isIP) host = normalizePercentEncoding(host.toLowerCase());
				parsed.host = isIP || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP) : host;
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.query) parsed.query = normalizeQueryFragmentEncoding(parsed.query);
				if (parsed.fragment) parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
			}
			if (schemeHandler && schemeHandler.parse) {
				schemeHandler.parse(parsed, options);
				if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) malformedSchemeSpecific = true;
			}
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri !== "string" && typeof uri !== "object") return;
		let value;
		try {
			value = typeof uri === "string" ? uri : serialize(uri, opts);
		} catch {
			return;
		}
		const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
		return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
var import_ajv = require_ajv();
var import__2020 = require__2020();
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
var import_fast_uri = /* @__PURE__ */ __toESM(require_fast_uri(), 1);
var DIALECT_07 = "http://json-schema.org/draft-07/schema#";
var DIALECT_2020 = "https://json-schema.org/draft/2020-12/schema";
var { parse, resolve, normalize } = import_fast_uri.default;
var maps = [
	"$defs",
	"definitions",
	"properties",
	"patternProperties",
	"dependentSchemas",
	"dependencies"
];
var singles = [
	"additionalProperties",
	"additionalItems",
	"contains",
	"propertyNames",
	"not",
	"if",
	"then",
	"else",
	"unevaluatedProperties",
	"unevaluatedItems",
	"contentSchema"
];
var arrays = [
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
];
var BundleError = class extends Error {
	constructor(code) {
		super("Invalid schema bundle.");
		this.code = code;
	}
};
function fail(code) {
	throw new BundleError(code);
}
var ownString = (value, name) => {
	const descriptor = Object.getOwnPropertyDescriptor(value, name);
	return descriptor && "value" in descriptor && typeof descriptor.value === "string" ? descriptor.value : void 0;
};
var freezeIdentity = (identity) => Object.freeze({ ...identity });
function scopeFor(value) {
	const fallback = freezeIdentity({
		ownerId: "unknown",
		contractId: "unknown",
		revision: "unknown",
		variantId: "default"
	});
	try {
		if (!isJsonRecord(value)) return Object.freeze({ identity: fallback });
		const descriptor = Object.getOwnPropertyDescriptor(value, "identity");
		const id = descriptor && "value" in descriptor ? descriptor.value : null;
		if (!isJsonRecord(id)) return Object.freeze({ identity: fallback });
		const ownerId = ownString(id, "ownerId"), contractId = ownString(id, "contractId");
		const revision = ownString(id, "revision"), variantId = ownString(id, "variantId");
		if (ownerId === void 0 || contractId === void 0 || revision === void 0 || variantId === void 0) return Object.freeze({ identity: fallback });
		return Object.freeze({ identity: freezeIdentity({
			ownerId,
			contractId,
			revision,
			variantId
		}) });
	} catch (_a) {
		return Object.freeze({ identity: fallback });
	}
}
function dialectFor(uri) {
	if (typeof uri !== "string") return void 0;
	const canonical = uri.replace(/#$/, "").replace(/^https:/, "http:");
	if (canonical === "http://json-schema.org/draft-07/schema") return "draft-07";
	if (canonical === "http://json-schema.org/draft/2020-12/schema") return "2020-12";
}
var normalizeUri = (uri) => normalize(uri).replace(/#$/, "");
function absoluteUri(uri, fragments) {
	if (typeof uri !== "string" || !uri) return fail("resource-invalid");
	const parsed = parse(uri);
	if (parsed.error || !parsed.scheme || !fragments && parsed.fragment !== void 0) return fail("resource-invalid");
	return normalizeUri(uri);
}
function referenceKey(value) {
	var _a;
	if (!isJsonRecord(value) || typeof value.repository !== "string" || typeof value.path !== "string") return fail("artifact-role-invalid");
	for (const key of [
		"symbol",
		"version",
		"sha256"
	]) if (key in value && typeof value[key] !== "string") return fail("artifact-role-invalid");
	return JSON.stringify([
		value.repository,
		value.path,
		(_a = value.symbol) !== null && _a !== void 0 ? _a : null
	]);
}
/** Check declared provenance only; paths and retrieval URIs are never fetched. */
function validateArtifacts(bundle) {
	const provenance = bundle.provenance;
	if (!isJsonRecord(provenance)) fail("artifact-role-invalid");
	const roles = /* @__PURE__ */ new Map();
	for (const role of [
		"canonicalSources",
		"generatedFiles",
		"referenceSchemas",
		"generationSources"
	]) {
		const refs = provenance[role];
		if (!Array.isArray(refs) || role === "canonicalSources" && refs.length === 0) fail("artifact-role-invalid");
		for (const ref of refs) {
			const key = referenceKey(ref);
			if (roles.has(key)) fail("artifact-role-invalid");
			roles.set(key, role);
		}
	}
	for (const resource of [bundle.root, ...bundle.resources]) {
		if (!isJsonRecord(resource) || !isJsonRecord(resource.artifact)) fail("artifact-role-invalid");
		const artifact = resource.artifact;
		const key = referenceKey(artifact.source);
		if (artifact.role === "canonical-schema") {
			if (roles.get(key) !== "canonicalSources") fail("artifact-role-invalid");
		} else if (artifact.role === "generated-schema") {
			if (roles.get(key) !== "generatedFiles" || !Array.isArray(artifact.generatedFrom) || !artifact.generatedFrom.length) fail("artifact-role-invalid");
			for (const ref of artifact.generatedFrom) if (roles.get(referenceKey(ref)) !== "canonicalSources") fail("artifact-role-invalid");
		} else fail("artifact-role-invalid");
	}
}
function prepare(bundle, ajv) {
	const registry = /* @__PURE__ */ new Map();
	const nodes = [];
	const register = (id, location) => {
		const key = normalizeUri(id), previous = registry.get(key);
		if (previous !== void 0 && previous !== location) fail("resource-id-conflict");
		registry.set(key, location);
	};
	const resources = [];
	const walk = (node, base, location) => {
		if (typeof node === "boolean") return;
		if (!isJsonRecord(node)) return;
		if ("$schema" in node) {
			const dialect = dialectFor(node.$schema);
			if (!dialect) fail("dialect-unsupported");
			if (dialect !== bundle.dialect) fail("dialect-conflict");
			node.$schema = dialect === "draft-07" ? DIALECT_07 : DIALECT_2020;
		}
		if ("$id" in node) {
			if (typeof node.$id !== "string") fail("schema-invalid");
			base = absoluteUri(resolve(base, node.$id), true);
			register(base, location);
			node.$id = base;
		}
		for (const key of ["$anchor", "$dynamicAnchor"]) if (typeof node[key] === "string") register(`${base.replace(/#.*$/, "")}#${node[key]}`, location);
		nodes.push({
			node,
			base
		});
		if (node.$async === true) fail("schema-invalid");
		if (typeof node.format === "string" && !ajv.formats[node.format]) fail("schema-invalid");
		for (const key of maps) if (isJsonRecord(node[key])) {
			for (const [name, child] of Object.entries(node[key])) if (typeof child === "boolean" || isJsonRecord(child)) walk(child, base, appendPointer(appendPointer(location, key), name));
		}
		for (const key of singles) if (typeof node[key] === "boolean" || isJsonRecord(node[key])) walk(node[key], base, `${location}/${key}`);
		for (const key of [...arrays, "items"]) {
			const children = node[key];
			if (Array.isArray(children)) children.forEach((child, index) => walk(child, base, `${location}/${key}/${index}`));
			else if (key === "items" && (typeof children === "boolean" || isJsonRecord(children))) walk(children, base, `${location}/${key}`);
		}
	};
	const supplied = [bundle.root, ...bundle.resources];
	for (let index = 0; index < supplied.length; index++) {
		const resource = supplied[index];
		if (!isJsonRecord(resource) || typeof resource.document !== "boolean" && !isJsonRecord(resource.document)) fail("resource-invalid");
		const uri = absoluteUri(resource.retrievalUri, false);
		register(uri, `${index}`);
		walk(resource.document, uri, `${index}`);
		resources.push({
			uri,
			document: resource.document
		});
	}
	for (const { node, base } of nodes) if (typeof node.$ref === "string") {
		const absolute = normalizeUri(resolve(base, node.$ref));
		let location = registry.get(absolute);
		if (location === void 0) {
			const hash = absolute.indexOf("#");
			const resource = registry.get(hash < 0 ? absolute : absolute.slice(0, hash));
			const fragment = hash < 0 ? "" : decodeURIComponent(absolute.slice(hash + 1));
			if (resource !== void 0 && (fragment === "" || fragment.startsWith("/"))) location = resource + fragment;
		}
		if (location !== void 0) {
			const slash = location.indexOf("/");
			node.$ref = resources[Number(slash < 0 ? location : location.slice(0, slash))].uri + "#" + encodeURIComponent(slash < 0 ? "" : location.slice(slash)).replace(/%2F/g, "/");
		} else node.$ref = absolute.includes("#") ? absolute : absolute + "#";
	}
	return {
		root: resources[0].uri,
		resources,
		registry,
		nodes
	};
}
function structuralDiagnostics(errors, scope, rootUri) {
	return Object.freeze(errors.map((error) => {
		let dataPath = error.instancePath;
		if (error.keyword === "required" && typeof error.params.missingProperty === "string") dataPath = appendPointer(dataPath, error.params.missingProperty);
		if (error.keyword === "additionalProperties" && typeof error.params.additionalProperty === "string") dataPath = appendPointer(dataPath, error.params.additionalProperty);
		const hash = error.schemaPath.indexOf("#");
		const resourceUri = hash > 0 ? error.schemaPath.slice(0, hash) : rootUri;
		const schemaPath = decodeURIComponent(hash >= 0 ? error.schemaPath.slice(hash + 1) : error.schemaPath);
		return Object.freeze({
			scope,
			phase: "structure",
			code: "schema-data-invalid",
			dataPath,
			schemaPath,
			resourceUri,
			keyword: error.keyword
		});
	}));
}
function makeValidator(validate, scope, dialect, rootUri) {
	return Object.freeze({
		identity: scope.identity,
		dialect,
		validate(data, context) {
			var _a;
			let currentScope = scope;
			try {
				if (context !== void 0) {
					if (!isJsonRecord(context)) throw new Error();
					const consumerId = ownString(context, "consumerId");
					if (consumerId === void 0) throw new Error();
					currentScope = Object.freeze({
						...scope,
						consumerId
					});
				}
				if (validate(snapshotJson(data))) return Object.freeze({
					kind: "valid",
					diagnostics: Object.freeze([])
				});
				const diagnostics = structuralDiagnostics((_a = validate.errors) !== null && _a !== void 0 ? _a : [], currentScope, rootUri);
				if (!diagnostics.length) throw new Error();
				return Object.freeze({
					kind: "invalid",
					diagnostics
				});
			} catch (error) {
				if (error instanceof JsonSnapshotError && error.kind === "invalid") return Object.freeze({
					kind: "invalid",
					diagnostics: Object.freeze([Object.freeze({
						scope: currentScope,
						phase: "structure",
						code: "input-not-json",
						dataPath: error.dataPath
					})])
				});
				return Object.freeze({
					kind: "execution-error",
					diagnostics: Object.freeze([Object.freeze({
						scope: currentScope,
						phase: "execution",
						operation: "structure",
						code: error instanceof JsonSnapshotError && error.kind === "limit" || error instanceof RangeError ? "limit-exceeded" : "engine-failed"
					})])
				});
			}
		}
	});
}
/** Compile an isolated synchronous validator from an immutable private snapshot. */
function compileSchemaBundle(input) {
	const scope = scopeFor(input);
	try {
		if (!isJsonRecord(input)) fail("resource-invalid");
		const declaredDialect = Object.getOwnPropertyDescriptor(input, "dialect");
		if (!declaredDialect || "value" in declaredDialect && declaredDialect.value === void 0) fail("dialect-required");
		if (!("value" in declaredDialect)) fail("resource-invalid");
		if (declaredDialect.value !== "draft-07" && declaredDialect.value !== "2020-12") fail("dialect-unsupported");
		const candidate = snapshotJson(input);
		if (!isJsonRecord(candidate) || !isJsonRecord(candidate.identity)) fail("resource-invalid");
		for (const key of [
			"ownerId",
			"contractId",
			"revision",
			"variantId"
		]) if (typeof candidate.identity[key] !== "string") fail("resource-invalid");
		if (!candidate.dialect) fail("dialect-required");
		if (candidate.dialect !== "draft-07" && candidate.dialect !== "2020-12") fail("dialect-unsupported");
		if (!Array.isArray(candidate.resources) || !isJsonRecord(candidate.root)) fail("resource-invalid");
		const bundle = candidate;
		validateArtifacts(bundle);
		const options = {
			allErrors: true,
			coerceTypes: false,
			useDefaults: false,
			removeAdditional: false,
			strict: false,
			logger: false,
			ownProperties: true
		};
		const ajv = bundle.dialect === "draft-07" ? new import_ajv.Ajv(options) : new import__2020.Ajv2020(options);
		import_dist.default.default(ajv);
		const prepared = prepare(bundle, ajv);
		for (const resource of prepared.resources) {
			if (!ajv.validateSchema(resource.document)) fail("schema-invalid");
			ajv.addSchema(resource.document, resource.uri);
		}
		const validate = ajv.getSchema(prepared.root);
		if (!validate || "$async" in validate && validate.$async) fail("schema-invalid");
		return Object.freeze({
			kind: "compiled",
			validator: makeValidator(validate, scope, bundle.dialect, prepared.root),
			diagnostics: Object.freeze([])
		});
	} catch (error) {
		let code;
		if (error instanceof BundleError) code = error.code;
		else if (error instanceof import_ajv.MissingRefError) code = "ref-unresolved";
		else if (error instanceof JsonSnapshotError && error.kind === "invalid") code = "resource-invalid";
		else if (error instanceof SyntaxError) code = "schema-invalid";
		if (code) return Object.freeze({
			kind: "schema-error",
			diagnostics: Object.freeze([Object.freeze({
				scope,
				phase: "compile",
				code
			})])
		});
		return Object.freeze({
			kind: "execution-error",
			diagnostics: Object.freeze([Object.freeze({
				scope,
				phase: "execution",
				operation: "compile",
				code: error instanceof JsonSnapshotError && error.kind === "limit" || error instanceof RangeError ? "limit-exceeded" : "engine-failed"
			})])
		});
	}
}
var numberToken = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$/u;
var invalidNumber = Object.freeze({
	kind: "invalid",
	code: "fixed-number-input-invalid"
});
/**
* Parse a NEW numeric draft according to NP-finite-new-input-v1.
* Never apply this to opening/no-op raw values or use it as an owner validator.
* Keep the validated token so negative zero, precision and exponent spelling survive.
*/
function parseFixedNumberInput(input) {
	if (typeof input === "number") {
		if (!Number.isFinite(input)) return invalidNumber;
		return Object.freeze({
			kind: "valid",
			token: Object.is(input, -0) ? "-0" : String(input),
			value: input
		});
	}
	if (typeof input !== "string") return invalidNumber;
	const token = input.trim();
	if (!numberToken.test(token)) return invalidNumber;
	const value = Number(token);
	return Number.isFinite(value) ? Object.freeze({
		kind: "valid",
		token,
		value
	}) : invalidNumber;
}
var block_editor_fixed_inputs_schema_default = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://kubohiroya.github.io/turbowarp-aframe/schemas/block-editor-fixed-inputs.schema.json",
	title: "turbowarp-aframe fixed input registration schema",
	$defs: {
		"createScene": {
			"type": "object",
			"properties": { "LAYER": {
				"type": "string",
				"enum": ["above-stage", "below-stage"]
			} }
		},
		"setPosition": {
			"type": "object",
			"properties": {
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				}
			}
		},
		"moveBy": {
			"type": "object",
			"properties": {
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				}
			}
		},
		"setRotation": {
			"type": "object",
			"properties": {
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				}
			}
		},
		"createAnimationClip": {
			"type": "object",
			"properties": { "DURATION": {
				"type": "number",
				"minimum": -1,
				"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
			} }
		},
		"addVectorKeyframeTrack": {
			"type": "object",
			"properties": { "PATH": {
				"type": "string",
				"enum": [".position", ".scale"]
			} }
		},
		"addQuaternionKeyframeTrack": {
			"type": "object",
			"properties": { "PATH": {
				"type": "string",
				"enum": [".quaternion"]
			} }
		},
		"addEulerRotationKeyframeTrack": {
			"type": "object",
			"properties": {
				"PATH": {
					"type": "string",
					"enum": [".quaternion"]
				},
				"UNIT": {
					"type": "string",
					"enum": ["degrees", "radians"]
				}
			}
		},
		"addPositionKeyframe": {
			"type": "object",
			"properties": {
				"TIME": {
					"type": "number",
					"minimum": 0,
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				}
			}
		},
		"addScaleKeyframe": {
			"type": "object",
			"properties": {
				"TIME": {
					"type": "number",
					"minimum": 0,
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				}
			}
		},
		"addEulerRotationKeyframe": {
			"type": "object",
			"properties": {
				"TIME": {
					"type": "number",
					"minimum": 0,
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"UNIT": {
					"type": "string",
					"enum": ["degrees", "radians"]
				}
			}
		},
		"setAnimationTimeScale": {
			"type": "object",
			"properties": { "SCALE": {
				"type": "number",
				"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
			} }
		},
		"setVrmBoneRotation": {
			"type": "object",
			"properties": {
				"X": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Y": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				},
				"Z": {
					"type": "number",
					"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
				}
			}
		},
		"setVrmExpression": {
			"type": "object",
			"properties": { "WEIGHT": {
				"type": "number",
				"$comment": "New finite numeric input uses NP-finite-new-input-v1. Existing raw is preserved on no-op; runtime clamp/floor is not applied to stored raw."
			} }
		}
	}
};
/** Owner canonical fragments, distinct from older SOURCE/editor schemas. */
function fixedInputBundle(opcode, argument) {
	const source = {
		repository: "turbowarp-aframe",
		path: "schemas/block-editor-fixed-inputs.schema.json",
		symbol: `#/$defs/${opcode}/properties/${argument}`
	};
	const fragment = block_editor_fixed_inputs_schema_default.$defs[opcode].properties[argument];
	return {
		identity: {
			ownerId: "turbowarp-aframe",
			contractId: "fixed-inputs",
			revision: "1",
			variantId: `${opcode}.${argument}`
		},
		dialect: "2020-12",
		root: {
			retrievalUri: block_editor_fixed_inputs_schema_default.$id,
			document: fragment,
			artifact: {
				role: "canonical-schema",
				source
			}
		},
		resources: [],
		provenance: {
			canonicalSources: [source, {
				repository: "turbowarp-aframe",
				path: "src/extension.ts",
				symbol: opcode
			}],
			generatedFiles: [],
			referenceSchemas: [],
			generationSources: []
		}
	};
}
block_editor_fixed_inputs_schema_default.$defs;
var existingNumber = (value) => {
	if (typeof value !== "number" && typeof value !== "string" || typeof value === "string" && value.trim() === "") throw new TypeError("Expected a numeric literal.");
	const number = Number(value);
	if (!Number.isFinite(number)) throw new TypeError("Expected a finite number.");
	return number;
};
var newNumber = (value) => {
	const parsed = parseFixedNumberInput(value);
	if (parsed.kind !== "valid") throw new TypeError("Invalid new numeric input.");
	return parsed.token;
};
function binding(opcode, argument, values) {
	return {
		argument,
		schemaBundle: fixedInputBundle(opcode, argument),
		control: values ? {
			kind: "enum",
			choices: values.map((value) => ({ value }))
		} : { kind: "number" },
		read(value) {
			if (!values) return existingNumber(value);
			if (typeof value !== "string") throw new TypeError("Expected a string.");
			return projectEnum(opcode, argument, value);
		},
		encode(value) {
			if (!values) return newNumber(value);
			if (typeof value !== "string" || !values.includes(value)) throw new TypeError("Invalid selection.");
			return value;
		},
		validateCandidate(value) {
			try {
				if (!values) existingNumber(value);
				else if (typeof value !== "string" || !values.includes(value)) throw new TypeError("Invalid selection.");
				return [];
			} catch {
				return [{ message: "Invalid fixed input." }];
			}
		}
	};
}
function projectEnum(_opcode, argument, value) {
	return argument === "UNIT" ? value.trim().toLowerCase() : value.trim();
}
var fixedInputEditors = [
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-createScene",
		opcodes: ["turbowarpaframe_createScene"],
		contractId: "turbowarp-aframe/createScene",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("createScene", "LAYER", ["above-stage", "below-stage"])]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-setPosition",
		opcodes: ["turbowarpaframe_setPosition"],
		contractId: "turbowarp-aframe/setPosition",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("setPosition", "X"),
			binding("setPosition", "Y"),
			binding("setPosition", "Z")
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-moveBy",
		opcodes: ["turbowarpaframe_moveBy"],
		contractId: "turbowarp-aframe/moveBy",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("moveBy", "X"),
			binding("moveBy", "Y"),
			binding("moveBy", "Z")
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-setRotation",
		opcodes: ["turbowarpaframe_setRotation"],
		contractId: "turbowarp-aframe/setRotation",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("setRotation", "X"),
			binding("setRotation", "Y"),
			binding("setRotation", "Z")
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-createAnimationClip",
		opcodes: ["turbowarpaframe_createAnimationClip"],
		contractId: "turbowarp-aframe/createAnimationClip",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("createAnimationClip", "DURATION")]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-addVectorKeyframeTrack",
		opcodes: ["turbowarpaframe_addVectorKeyframeTrack"],
		contractId: "turbowarp-aframe/addVectorKeyframeTrack",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("addVectorKeyframeTrack", "PATH", [".position", ".scale"])]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-addQuaternionKeyframeTrack",
		opcodes: ["turbowarpaframe_addQuaternionKeyframeTrack"],
		contractId: "turbowarp-aframe/addQuaternionKeyframeTrack",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("addQuaternionKeyframeTrack", "PATH", [".quaternion"])]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-addEulerRotationKeyframeTrack",
		opcodes: ["turbowarpaframe_addEulerRotationKeyframeTrack"],
		contractId: "turbowarp-aframe/addEulerRotationKeyframeTrack",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("addEulerRotationKeyframeTrack", "PATH", [".quaternion"]), binding("addEulerRotationKeyframeTrack", "UNIT", ["degrees", "radians"])]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-addPositionKeyframe",
		opcodes: ["turbowarpaframe_addPositionKeyframe"],
		contractId: "turbowarp-aframe/addPositionKeyframe",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("addPositionKeyframe", "TIME"),
			binding("addPositionKeyframe", "X"),
			binding("addPositionKeyframe", "Y"),
			binding("addPositionKeyframe", "Z")
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-addScaleKeyframe",
		opcodes: ["turbowarpaframe_addScaleKeyframe"],
		contractId: "turbowarp-aframe/addScaleKeyframe",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("addScaleKeyframe", "TIME"),
			binding("addScaleKeyframe", "X"),
			binding("addScaleKeyframe", "Y"),
			binding("addScaleKeyframe", "Z")
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-addEulerRotationKeyframe",
		opcodes: ["turbowarpaframe_addEulerRotationKeyframe"],
		contractId: "turbowarp-aframe/addEulerRotationKeyframe",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("addEulerRotationKeyframe", "TIME"),
			binding("addEulerRotationKeyframe", "X"),
			binding("addEulerRotationKeyframe", "Y"),
			binding("addEulerRotationKeyframe", "Z"),
			binding("addEulerRotationKeyframe", "UNIT", ["degrees", "radians"])
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-setAnimationTimeScale",
		opcodes: ["turbowarpaframe_setAnimationTimeScale"],
		contractId: "turbowarp-aframe/setAnimationTimeScale",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("setAnimationTimeScale", "SCALE")]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-setVrmBoneRotation",
		opcodes: ["turbowarpaframe_setVrmBoneRotation"],
		contractId: "turbowarp-aframe/setVrmBoneRotation",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [
			binding("setVrmBoneRotation", "X"),
			binding("setVrmBoneRotation", "Y"),
			binding("setVrmBoneRotation", "Z")
		]
	},
	{
		apiVersion: 1,
		extensionId: "turbowarpaframe",
		editorId: "fixed-setVrmExpression",
		opcodes: ["turbowarpaframe_setVrmExpression"],
		contractId: "turbowarp-aframe/setVrmExpression",
		contractRevision: "1",
		validationContext: () => ({
			consumerId: "turbowarp-aframe",
			nowMs: 0,
			settings: null
		}),
		bindings: [binding("setVrmExpression", "WEIGHT")]
	}
];
/** Register only currently declared opcodes; release obsolete feature-flag scopes. */
function fixedInputRegistration(scratch) {
	const host = typeof scratch === "object" && scratch !== null ? scratch : {};
	let active;
	let activeOpcodes = "";
	const removers = [];
	let disposed = false;
	const dispose = () => {
		host.vm?.runtime?.off?.("RUNTIME_DISPOSED", shutdown);
		for (const remove of removers.splice(0).reverse()) remove();
		active = void 0;
		activeOpcodes = "";
	};
	const shutdown = () => {
		disposed = true;
		dispose();
	};
	return {
		ensure(opcodes) {
			const api = host.gui?.blockEditors;
			const signature = [...new Set(opcodes)].sort().join("\0");
			if (disposed || api === active && signature === activeOpcodes) return;
			dispose();
			if (api?.apiVersion !== 1 || typeof api.registerFixedInputEditor !== "function") return;
			try {
				for (const definition of fixedInputEditors) if (definition.opcodes.every((opcode) => opcodes.includes(opcode))) {
					const remove = api.registerFixedInputEditor.call(api, definition);
					if (typeof remove !== "function") throw new TypeError("Invalid fixed registration cleanup.");
					removers.push(remove);
				}
				active = api;
				activeOpcodes = signature;
				host.vm?.runtime?.on?.("RUNTIME_DISPOSED", shutdown);
			} catch (error) {
				dispose();
				throw error;
			}
		},
		dispose: shutdown
	};
}
function deepFreeze(value) {
	if (value !== null && typeof value === "object") {
		Object.values(value).forEach(deepFreeze);
		Object.freeze(value);
	}
	return value;
}
function ownerFailure(scope, code) {
	return Object.freeze({
		kind: "execution-error",
		diagnostics: Object.freeze([Object.freeze({
			scope,
			phase: "execution",
			operation: "semantic",
			code
		})])
	});
}
function asyncResult(value) {
	try {
		Promise.prototype.then.call(value, () => void 0, () => void 0);
		return true;
	} catch (_a) {}
	return "then" in value;
}
/** Validate one protected candidate/context snapshot, then invoke a synchronous owner at most once. */
function validateSchemaInput(compiled, data, options) {
	let scope = scopeFor(compiled);
	let context;
	let owner;
	try {
		if (!isJsonRecord(options)) return ownerFailure(scope, "owner-context-invalid");
		const descriptor = Object.getOwnPropertyDescriptor(options, "context");
		if (!descriptor || !("value" in descriptor)) return ownerFailure(scope, "owner-context-invalid");
		const candidate = snapshotJson(descriptor.value);
		if (!isJsonRecord(candidate) || typeof candidate.consumerId !== "string" || typeof candidate.nowMs !== "number" || !Number.isFinite(candidate.nowMs) || !Object.hasOwn(candidate, "settings")) return ownerFailure(scope, "owner-context-invalid");
		context = deepFreeze(candidate);
		scope = Object.freeze({
			...scope,
			consumerId: context.consumerId
		});
		const ownerDescriptor = Object.getOwnPropertyDescriptor(options, "ownerValidate");
		if (ownerDescriptor && !("value" in ownerDescriptor)) return ownerFailure(scope, "owner-result-invalid");
		owner = ownerDescriptor === null || ownerDescriptor === void 0 ? void 0 : ownerDescriptor.value;
		if (owner !== void 0 && typeof owner !== "function") return ownerFailure(scope, "owner-result-invalid");
	} catch (_a) {
		return ownerFailure(scope, "owner-context-invalid");
	}
	let input;
	try {
		input = deepFreeze(snapshotJson(data));
		const structural = compiled.validate(input, { consumerId: context.consumerId });
		if (!isJsonRecord(structural) || !Array.isArray(structural.diagnostics) || (structural.kind === "valid" ? structural.diagnostics.length !== 0 : structural.diagnostics.length === 0) || ![
			"valid",
			"invalid",
			"execution-error"
		].includes(structural.kind)) throw new Error();
		if (structural.kind !== "valid") return structural;
	} catch (error) {
		if (error instanceof JsonSnapshotError && error.kind === "invalid") return Object.freeze({
			kind: "invalid",
			diagnostics: Object.freeze([Object.freeze({
				scope,
				phase: "structure",
				code: "input-not-json",
				dataPath: error.dataPath
			})])
		});
		return Object.freeze({
			kind: "execution-error",
			diagnostics: Object.freeze([Object.freeze({
				scope,
				phase: "execution",
				operation: "structure",
				code: error instanceof JsonSnapshotError && error.kind === "limit" || error instanceof RangeError ? "limit-exceeded" : "engine-failed"
			})])
		});
	}
	if (!owner) return Object.freeze({
		kind: "valid",
		diagnostics: Object.freeze([])
	});
	let result;
	try {
		result = owner(input, context);
	} catch (_b) {
		return ownerFailure(scope, "owner-validation-failed");
	}
	try {
		if (result !== null && (typeof result === "object" || typeof result === "function") && asyncResult(result)) return ownerFailure(scope, "async-owner-unsupported");
		const snapshot = snapshotJson(result);
		if (!isJsonRecord(snapshot) || !Array.isArray(snapshot.issues)) return ownerFailure(scope, "owner-result-invalid");
		if (snapshot.kind === "valid" && snapshot.issues.length === 0) return Object.freeze({
			kind: "valid",
			diagnostics: Object.freeze([])
		});
		if (snapshot.kind !== "invalid" || snapshot.issues.length === 0) return ownerFailure(scope, "owner-result-invalid");
		const diagnostics = [];
		for (const issue of snapshot.issues) {
			if (!isJsonRecord(issue) || typeof issue.dataPath !== "string" || issue.dataPath !== "" && !issue.dataPath.startsWith("/") || /~(?:[^01]|$)/u.test(issue.dataPath) || typeof issue.ruleId !== "string") return ownerFailure(scope, "owner-result-invalid");
			diagnostics.push(Object.freeze({
				scope,
				phase: "semantic",
				code: "owner-input-invalid",
				dataPath: issue.dataPath,
				ruleId: issue.ruleId
			}));
		}
		return Object.freeze({
			kind: "invalid",
			diagnostics: Object.freeze(diagnostics)
		});
	} catch (_c) {
		return ownerFailure(scope, "owner-result-invalid");
	}
}
var block_editor_template_compat_schema_default = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://kubohiroya.github.io/turbowarp-aframe/schemas/block-editor-template-compat.schema.json",
	title: "A-Frame existing parser compatible template",
	type: "object",
	additionalProperties: false,
	properties: {
		"type": { "type": "string" },
		"id": { "type": "string" },
		"class": { "oneOf": [{ "type": "string" }, {
			"type": "array",
			"items": { "type": "string" }
		}] },
		"classes": {
			"type": "array",
			"items": { "type": "string" }
		},
		"data": {
			"type": "object",
			"additionalProperties": true
		},
		"attributes": {
			"type": "object",
			"additionalProperties": true
		},
		"children": {
			"type": "array",
			"items": { "$ref": "#" }
		}
	}
};
var TEMPLATE_NODE_KEYS = /* @__PURE__ */ new Set([
	"attributes",
	"children",
	"class",
	"classes",
	"data",
	"id",
	"type"
]);
function validateTemplateNode(value, path) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError(`A-Frame ${path} must be an object.`);
	const node = value;
	for (const key of Object.keys(node)) if (!TEMPLATE_NODE_KEYS.has(key)) throw new TypeError(`A-Frame ${path}.${key} is not supported.`);
	validateOptionalString(node["type"], `${path}.type`);
	validateOptionalString(node["id"], `${path}.id`);
	validateTemplateClass(node["class"], `${path}.class`);
	validateOptionalStringArray(node["classes"], `${path}.classes`);
	validateStringRecord(node["data"], `${path}.data`);
	validateStringRecord(node["attributes"], `${path}.attributes`);
	const children = node["children"];
	if (children === void 0) return;
	if (!Array.isArray(children)) throw new TypeError(`A-Frame ${path}.children must be an array.`);
	children.forEach((child, index) => {
		validateTemplateNode(child, `${path}.children[${index}]`);
	});
}
function validateTemplateClass(value, path) {
	if (value === void 0 || typeof value === "string") return;
	if (Array.isArray(value) && value.every((item) => typeof item === "string")) return;
	throw new TypeError(`A-Frame ${path} must be a string or string array.`);
}
function validateOptionalStringArray(value, path) {
	if (value === void 0) return;
	if (Array.isArray(value) && value.every((item) => typeof item === "string")) return;
	throw new TypeError(`A-Frame ${path} must be a string array.`);
}
function validateOptionalString(value, path) {
	if (value === void 0 || typeof value === "string") return;
	throw new TypeError(`A-Frame ${path} must be a string.`);
}
function validateStringRecord(value, path) {
	if (value === void 0) return;
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError(`A-Frame ${path} must be an object.`);
	for (const [key, recordValue] of Object.entries(value)) {
		if (key.trim().length === 0) throw new TypeError(`A-Frame ${path} keys must be non-empty strings.`);
		if (recordValue === void 0) throw new TypeError(`A-Frame ${path}.${key} must not be undefined.`);
	}
}
var source = {
	repository: "turbowarp-aframe",
	path: "schemas/block-editor-template-compat.schema.json"
};
/** Parser-compatible gate; the older strict public schema is reference material only. */
var templateSchemaBundle = {
	identity: {
		ownerId: "turbowarp-aframe",
		contractId: "aframe-template",
		revision: "parser-v0.7.0",
		variantId: "template-json"
	},
	dialect: "2020-12",
	root: {
		retrievalUri: block_editor_template_compat_schema_default.$id,
		document: block_editor_template_compat_schema_default,
		artifact: {
			role: "canonical-schema",
			source
		}
	},
	resources: [],
	provenance: {
		canonicalSources: [source, {
			repository: "turbowarp-aframe",
			path: "src/template-validation.ts",
			symbol: "validateTemplateNode"
		}],
		generatedFiles: [],
		referenceSchemas: [{
			repository: "turbowarp-aframe",
			path: "schemas/aframe-template.schema.json"
		}],
		generationSources: []
	}
};
var validateTemplateInput = (data) => {
	try {
		validateTemplateNode(data, "template");
		return {
			kind: "valid",
			issues: []
		};
	} catch {
		return {
			kind: "invalid",
			issues: [{
				dataPath: "",
				ruleId: "existing-template-parser"
			}]
		};
	}
};
function decodeTemplateSource(source) {
	return {
		source,
		format: "json",
		variantId: "template-json",
		data: JSON.parse(source)
	};
}
var sourceCompilation = compileSchemaBundle(templateSchemaBundle);
/** Safe source boundary: preserve raw input separately from diagnostics and normalized values. */
function validateTemplateSource(source, context) {
	let consumerId;
	try {
		const descriptor = Object.getOwnPropertyDescriptor(context, "consumerId");
		if (descriptor && "value" in descriptor && typeof descriptor.value === "string") consumerId = descriptor.value;
	} catch {}
	let decoded;
	try {
		decoded = decodeTemplateSource(source);
	} catch (error) {
		const code = error instanceof TypeError && error.message === "Unrecognized camera profile variant." ? "variant-unrecognized" : "input-format-invalid";
		return {
			source,
			result: {
				kind: "invalid",
				diagnostics: [{
					scope: {
						identity: templateSchemaBundle.identity,
						...consumerId === void 0 ? {} : { consumerId }
					},
					phase: "decode",
					code,
					dataPath: ""
				}]
			}
		};
	}
	const compilation = sourceCompilation;
	if (compilation.kind !== "compiled") return {
		...decoded,
		result: compilation
	};
	return {
		...decoded,
		result: validateSchemaInput(compilation.validator, decoded.data, {
			context,
			ownerValidate: validateTemplateInput
		})
	};
}
function checkedSource(value) {
	return value.result.kind === "valid" ? {
		source: value.source,
		result: {
			kind: "valid",
			diagnostics: []
		}
	} : {
		source: value.source,
		result: {
			kind: value.result.kind,
			diagnostics: value.result.diagnostics
		}
	};
}
function createSourceEditorOptions(nowMs = Date.now) {
	const context = () => ({
		consumerId: extensionConfig.id,
		nowMs: nowMs(),
		settings: null
	});
	return [{
		apiVersion: 1,
		extensionId: extensionConfig.id,
		editorId: "template-source",
		opcodes: ["loadTemplate"].map((opcode) => `${extensionConfig.id}_${opcode}`),
		bindings: [{
			argument: "SOURCE",
			variants: [{
				variantId: "template-json",
				format: "json",
				schemaBundle: templateSchemaBundle
			}],
			decode: (source) => {
				const decoded = decodeTemplateSource(source);
				return {
					...decoded,
					data: decoded.data
				};
			},
			validateSource: (source, context) => checkedSource(validateTemplateSource(source, context))
		}],
		validationContext: context
	}];
}
/** Optional capability: old GUIs continue executing blocks without editor registration. */
function registerSourceEditors(scratch, nowMs = Date.now) {
	const api = scratch?.gui?.blockEditors;
	if (api?.apiVersion !== 1 || typeof api.registerSourceEditor !== "function") return () => {};
	const removers = [];
	try {
		for (const options of createSourceEditorOptions(nowMs)) removers.push(api.registerSourceEditor(options));
	} catch {
		for (const remove of removers.reverse()) remove();
		return () => {};
	}
	let active = true;
	return () => {
		if (active) {
			active = false;
			for (const remove of removers.reverse()) remove();
		}
	};
}
var block_definitions_default = {
	extensionName: "TurboWarp-A-Frame",
	blocks: [
		{
			"opcode": "createScene",
			"blockType": "COMMAND",
			"text": "create 3D scene with layer [LAYER] mode [MODE]",
			"description": "Loads A-Frame 1.8.0 from jsDelivr when the page does not have it, initializes the A-Frame scene host, and emits the scene ready event.",
			"arguments": {
				"LAYER": {
					"type": "STRING",
					"defaultValue": "above-stage"
				},
				"MODE": {
					"type": "STRING",
					"defaultValue": "3d"
				}
			}
		},
		{
			"opcode": "loadTemplate",
			"blockType": "COMMAND",
			"text": "load template [ID] from JSON [SOURCE]",
			"description": "Stores a declarative scene graph template for later instantiation.",
			"arguments": {
				"ID": {
					"type": "STRING",
					"defaultValue": "monster"
				},
				"SOURCE": {
					"type": "STRING",
					"defaultValue": "{\"type\":\"box\",\"id\":\"body\",\"attributes\":{\"color\":\"#4cffb0\"}}"
				}
			}
		},
		{
			"opcode": "createNode",
			"blockType": "COMMAND",
			"text": "create [TYPE] node id [ID] under [PARENT]",
			"description": "Creates a primitive, model, text, light, camera, or group node.",
			"arguments": {
				"TYPE": {
					"type": "STRING",
					"defaultValue": "box"
				},
				"ID": {
					"type": "STRING",
					"defaultValue": "card"
				},
				"PARENT": {
					"type": "STRING",
					"defaultValue": "#scene"
				}
			}
		},
		{
			"opcode": "createFromTemplate",
			"blockType": "COMMAND",
			"text": "create template [TEMPLATE] as [INSTANCE] under [PARENT]",
			"description": "Instantiates a stored template under the first node matching the parent selector.",
			"arguments": {
				"TEMPLATE": {
					"type": "STRING",
					"defaultValue": "monster"
				},
				"INSTANCE": {
					"type": "STRING",
					"defaultValue": "monster-1"
				},
				"PARENT": {
					"type": "STRING",
					"defaultValue": "#scene"
				}
			}
		},
		{
			"opcode": "setPosition",
			"blockType": "COMMAND",
			"text": "set selector [SELECTOR] position x [X] y [Y] z [Z]",
			"description": "Sets local position on every node matching the selector.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 1
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": -3
				}
			}
		},
		{
			"opcode": "moveBy",
			"blockType": "COMMAND",
			"text": "move selector [SELECTOR] by x [X] y [Y] z [Z]",
			"description": "Offsets local position on every node matching the selector.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": 1
				}
			}
		},
		{
			"opcode": "setRotation",
			"blockType": "COMMAND",
			"text": "set selector [SELECTOR] rotation x [X] y [Y] z [Z]",
			"description": "Sets local Euler rotation in degrees on every node matching the selector.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 45
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": 0
				}
			}
		},
		{
			"opcode": "addClass",
			"blockType": "COMMAND",
			"text": "add class [CLASS] to selector [SELECTOR]",
			"description": "Adds a CSS-style class to every node matching the selector.",
			"arguments": {
				"CLASS": {
					"type": "STRING",
					"defaultValue": "monster"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				}
			}
		},
		{
			"opcode": "setData",
			"blockType": "COMMAND",
			"text": "set selector [SELECTOR] data [KEY] to [VALUE]",
			"description": "Sets a data-* value on every node matching the selector.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				},
				"KEY": {
					"type": "STRING",
					"defaultValue": "zone"
				},
				"VALUE": {
					"type": "STRING",
					"defaultValue": "field"
				}
			}
		},
		{
			"opcode": "setAttribute",
			"blockType": "COMMAND",
			"text": "set selector [SELECTOR] attribute [NAME] to [VALUE]",
			"description": "Sets an A-Frame component or HTML attribute on every node matching the selector.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				},
				"NAME": {
					"type": "STRING",
					"defaultValue": "visible"
				},
				"VALUE": {
					"type": "STRING",
					"defaultValue": "true"
				}
			}
		},
		{
			"opcode": "deleteSelector",
			"blockType": "COMMAND",
			"text": "delete selector [SELECTOR]",
			"description": "Deletes every non-root node matching the selector and its descendants.",
			"arguments": { "SELECTOR": {
				"type": "STRING",
				"defaultValue": "#card"
			} }
		},
		{
			"opcode": "countSelector",
			"blockType": "REPORTER",
			"text": "count selector [SELECTOR]",
			"description": "Returns the number of nodes matching a limited selector.",
			"arguments": { "SELECTOR": {
				"type": "STRING",
				"defaultValue": ".monster"
			} }
		},
		{
			"opcode": "eventTargetId",
			"blockType": "REPORTER",
			"text": "event target id",
			"description": "Returns the id of the most recently handled 3D event target.",
			"arguments": {}
		},
		{
			"opcode": "emitEvent",
			"blockType": "COMMAND",
			"text": "emit 3D event [TYPE] from selector [SELECTOR] with data [DATA]",
			"description": "Queues and dispatches a 3D event from the first node matching the selector.",
			"arguments": {
				"TYPE": {
					"type": "STRING",
					"defaultValue": "attack"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#card"
				},
				"DATA": {
					"type": "STRING",
					"defaultValue": "{}"
				}
			}
		},
		{
			"opcode": "whenSceneReady",
			"blockType": "HAT",
			"text": "when 3D scene ready",
			"description": "Fires once after create 3D scene initializes the scene host.",
			"arguments": {}
		},
		{
			"opcode": "whenEventOnSelector",
			"blockType": "HAT",
			"text": "when event [TYPE] on selector [SELECTOR]",
			"description": "Fires when a queued 3D event of the given type targets a node matching the selector.",
			"arguments": {
				"TYPE": {
					"type": "STRING",
					"defaultValue": "attack"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": ".monster"
				}
			}
		},
		{
			"opcode": "createAnimationClip",
			"blockType": "COMMAND",
			"text": "create 3D animation clip [NAME] duration [DURATION]",
			"description": "Creates or replaces a Three.js AnimationClip definition.",
			"arguments": {
				"NAME": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"DURATION": {
					"type": "NUMBER",
					"defaultValue": -1
				}
			}
		},
		{
			"opcode": "deleteAnimationClip",
			"blockType": "COMMAND",
			"text": "delete 3D animation clip [NAME]",
			"description": "Deletes a stored 3D animation clip definition and stops its active actions.",
			"arguments": { "NAME": {
				"type": "STRING",
				"defaultValue": "wave"
			} }
		},
		{
			"opcode": "addVectorKeyframeTrack",
			"blockType": "COMMAND",
			"text": "add vector keyframe track to clip [CLIP] path [PATH] times [TIMES] values [VALUES]",
			"description": "Adds a Three.js VectorKeyframeTrack definition with x y z values.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "move-up"
				},
				"PATH": {
					"type": "STRING",
					"defaultValue": ".position"
				},
				"TIMES": {
					"type": "STRING",
					"defaultValue": "0,0.5,1"
				},
				"VALUES": {
					"type": "STRING",
					"defaultValue": "0,1,-3, 0,1.5,-3, 0,1,-3"
				}
			}
		},
		{
			"opcode": "addQuaternionKeyframeTrack",
			"blockType": "COMMAND",
			"text": "add quaternion keyframe track to clip [CLIP] path [PATH] times [TIMES] values [VALUES]",
			"description": "Adds a Three.js QuaternionKeyframeTrack definition with x y z w values.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"PATH": {
					"type": "STRING",
					"defaultValue": ".quaternion"
				},
				"TIMES": {
					"type": "STRING",
					"defaultValue": "0,0.5,1"
				},
				"VALUES": {
					"type": "STRING",
					"defaultValue": "0,0,0,1, 0,0,0.389,0.921, 0,0,0,1"
				}
			}
		},
		{
			"opcode": "addEulerRotationKeyframeTrack",
			"blockType": "COMMAND",
			"text": "add euler rotation keyframe track to clip [CLIP] path [PATH] times [TIMES] values [VALUES] unit [UNIT]",
			"description": "Adds a quaternion track converted from Euler x y z rotation values.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"PATH": {
					"type": "STRING",
					"defaultValue": ".quaternion"
				},
				"TIMES": {
					"type": "STRING",
					"defaultValue": "0,0.25,0.5,0.75,1"
				},
				"VALUES": {
					"type": "STRING",
					"defaultValue": "0,0,0, 0,0,0.8, 0,0,0, 0,0,-0.8, 0,0,0"
				},
				"UNIT": {
					"type": "STRING",
					"defaultValue": "radians"
				}
			}
		},
		{
			"opcode": "addPositionKeyframe",
			"blockType": "COMMAND",
			"text": "add position keyframe to clip [CLIP] at [TIME] x [X] y [Y] z [Z]",
			"description": "Adds or replaces one position keyframe on the clip.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "move-up"
				},
				"TIME": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 1
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": -3
				}
			}
		},
		{
			"opcode": "addScaleKeyframe",
			"blockType": "COMMAND",
			"text": "add scale keyframe to clip [CLIP] at [TIME] x [X] y [Y] z [Z]",
			"description": "Adds or replaces one scale keyframe on the clip.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "pulse"
				},
				"TIME": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 1
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 1
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": 1
				}
			}
		},
		{
			"opcode": "addEulerRotationKeyframe",
			"blockType": "COMMAND",
			"text": "add euler rotation keyframe to clip [CLIP] at [TIME] x [X] y [Y] z [Z] unit [UNIT]",
			"description": "Adds or replaces one Euler rotation keyframe converted to quaternion values.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"TIME": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": .8
				},
				"UNIT": {
					"type": "STRING",
					"defaultValue": "radians"
				}
			}
		},
		{
			"opcode": "playAnimationClip",
			"blockType": "COMMAND",
			"text": "play 3D animation clip [CLIP] on selector [SELECTOR] loop [LOOP]",
			"description": "Plays a stored 3D animation clip on every matching node.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#leftArm"
				},
				"LOOP": {
					"type": "BOOLEAN",
					"defaultValue": true
				}
			}
		},
		{
			"opcode": "stopAnimationClip",
			"blockType": "COMMAND",
			"text": "stop 3D animation clip [CLIP] on selector [SELECTOR]",
			"description": "Stops a stored 3D animation clip on every matching node.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#leftArm"
				}
			}
		},
		{
			"opcode": "pauseAnimationClip",
			"blockType": "COMMAND",
			"text": "pause 3D animation clip [CLIP] on selector [SELECTOR]",
			"description": "Pauses a stored 3D animation clip on every matching node.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#leftArm"
				}
			}
		},
		{
			"opcode": "resumeAnimationClip",
			"blockType": "COMMAND",
			"text": "resume 3D animation clip [CLIP] on selector [SELECTOR]",
			"description": "Resumes a paused 3D animation clip on every matching node.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#leftArm"
				}
			}
		},
		{
			"opcode": "setAnimationTimeScale",
			"blockType": "COMMAND",
			"text": "set 3D animation clip [CLIP] on selector [SELECTOR] time scale [SCALE]",
			"description": "Sets the playback speed for a stored 3D animation clip on every matching node.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#leftArm"
				},
				"SCALE": {
					"type": "NUMBER",
					"defaultValue": 1
				}
			}
		},
		{
			"opcode": "isAnimationClipPlaying",
			"blockType": "BOOLEAN",
			"text": "is 3D animation clip [CLIP] playing on selector [SELECTOR]?",
			"description": "Reports whether any matching node has the stored 3D animation clip playing.",
			"arguments": {
				"CLIP": {
					"type": "STRING",
					"defaultValue": "wave"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#leftArm"
				}
			}
		},
		{
			"opcode": "loadVrm",
			"blockType": "COMMAND",
			"text": "load VRM [URL] onto [SELECTOR]",
			"description": "Loads a VRM avatar with three-vrm on the A-Frame Three.js and attaches it to the first matching node. The block waits until the model is ready.",
			"arguments": {
				"URL": {
					"type": "STRING",
					"defaultValue": "avatar.vrm"
				},
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#avatar"
				}
			}
		},
		{
			"opcode": "setVrmBoneRotation",
			"blockType": "COMMAND",
			"text": "set VRM [SELECTOR] bone [BONE] rotation x [X] y [Y] z [Z]",
			"description": "Sets the Euler rotation in degrees of a normalized VRM humanoid bone, relative to the T-pose, on every matching node whose VRM is ready.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#avatar"
				},
				"BONE": {
					"type": "STRING",
					"defaultValue": "leftUpperArm"
				},
				"X": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Y": {
					"type": "NUMBER",
					"defaultValue": 0
				},
				"Z": {
					"type": "NUMBER",
					"defaultValue": -60
				}
			}
		},
		{
			"opcode": "vrmBoneNames",
			"blockType": "REPORTER",
			"text": "VRM [SELECTOR] humanoid bones",
			"description": "Returns the humanoid bone names of the first matching node's VRM as a JSON array.",
			"arguments": { "SELECTOR": {
				"type": "STRING",
				"defaultValue": "#avatar"
			} }
		},
		{
			"opcode": "setVrmExpression",
			"blockType": "COMMAND",
			"text": "set VRM [SELECTOR] expression [NAME] to [WEIGHT]",
			"description": "Sets the weight, clamped to 0 through 1, of a preset or custom VRM expression such as happy or blink on every matching node whose VRM is ready.",
			"arguments": {
				"SELECTOR": {
					"type": "STRING",
					"defaultValue": "#avatar"
				},
				"NAME": {
					"type": "STRING",
					"defaultValue": "happy"
				},
				"WEIGHT": {
					"type": "NUMBER",
					"defaultValue": 1
				}
			}
		},
		{
			"opcode": "vrmExpressionNames",
			"blockType": "REPORTER",
			"text": "VRM [SELECTOR] expressions",
			"description": "Returns the preset and custom expression names of the first matching node's VRM as a JSON array.",
			"arguments": { "SELECTOR": {
				"type": "STRING",
				"defaultValue": "#avatar"
			} }
		},
		{
			"opcode": "vrmState",
			"blockType": "REPORTER",
			"text": "VRM [SELECTOR] state",
			"description": "Returns none, loading, ready, or error with its reason for the first matching node.",
			"arguments": { "SELECTOR": {
				"type": "STRING",
				"defaultValue": "#avatar"
			} }
		}
	]
};
var runtimeCapabilityKey = "turbowarpAFrameCapability";
function createRuntimeCapability(scene, assertActive) {
	const scenePort = {
		async createScene(layer, mode) {
			assertActive();
			await scene.createScene(layer, mode);
		},
		createNode(type, id, parent) {
			assertActive();
			scene.createNode(type, id, parent);
		},
		addClass(className, selector) {
			assertActive();
			scene.addClass(className, selector);
		},
		loadTemplate(id, source) {
			assertActive();
			scene.loadTemplate(id, source);
		},
		createFromTemplate(template, instance, parent) {
			assertActive();
			scene.createFromTemplate(template, instance, parent);
		},
		setPosition(selector, x, y, z) {
			assertActive();
			scene.setPosition(selector, x, y, z);
		},
		setRotation(selector, x, y, z) {
			assertActive();
			scene.setRotation(selector, x, y, z);
		},
		setAttribute(selector, name, value) {
			assertActive();
			scene.setAttribute(selector, name, value);
		},
		setData(selector, key, value) {
			assertActive();
			scene.setData(selector, key, value);
		},
		emitEvent(type, selector, data) {
			assertActive();
			scene.emitEvent(type, selector, data);
		},
		deleteSelector(selector) {
			assertActive();
			scene.deleteSelector(selector);
		},
		countSelector(selector) {
			assertActive();
			return scene.countSelector(selector);
		}
	};
	const vrmPort = {
		async loadVrm(url, selector) {
			assertActive();
			await scene.loadVrm(url, selector);
		},
		setVrmBoneRotation(selector, bone, x, y, z) {
			assertActive();
			scene.setVrmBoneRotation(selector, bone, x, y, z);
		},
		vrmBoneNames(selector) {
			assertActive();
			return scene.vrmBoneNames(selector);
		},
		vrmStatus(selector) {
			assertActive();
			return scene.vrmStatus(selector);
		},
		setVrmExpression(selector, name, weight) {
			assertActive();
			scene.setVrmExpression(selector, name, weight);
		},
		vrmExpressionNames(selector) {
			assertActive();
			return scene.vrmExpressionNames(selector);
		}
	};
	const capability = Object.freeze({
		version: 2,
		requireVersion(version) {
			assertActive();
			if (version !== 2) throw new Error(`Unsupported A-Frame runtime capability version: ${version}; supported version is 2.`);
			return capability;
		},
		...scenePort,
		...vrmPort
	});
	return capability;
}
/** The A-Frame this extension is built and tested against, including three-vrm on its Three.js. */
var aframeVersion = "1.8.0";
var aframeUrl = `https://cdn.jsdelivr.net/npm/aframe@${aframeVersion}/dist/aframe-v${aframeVersion}.min.js`;
/** Subresource integrity of `aframeUrl`, so a changed file on the CDN is refused. */
var aframeIntegrity = "sha384-d2HJ2eWTxYenz2Vcmsy7gDZW7G2Gq51k1M15G7vv2O/S60nSNYZVjtgGzPnd3sG+";
var loadTimeoutMs = 3e4;
/**
* Makes sure A-Frame 1.8.0 is on the page, loading it from jsDelivr when it is not.
*
* A page that already has A-Frame 1.8.0, such as an offline venue that serves its own copy,
* loads nothing. Any other A-Frame version is refused, because a second copy cannot be
* loaded beside it and three-vrm is verified on 1.8.0 only. Without a document, as in tests
* and non-browser runtimes, the scene graph works without A-Frame and nothing is loaded.
*/
async function ensureAFrame() {
	const state = globalThis;
	if (state.AFRAME !== void 0) {
		requireVersion(state.AFRAME);
		return;
	}
	const head = typeof document === "undefined" ? void 0 : document.head;
	if (head === void 0 || head === null) return;
	state.__twAframeLoading ?? (state.__twAframeLoading = load(head).catch((error) => {
		delete state.__twAframeLoading;
		throw error;
	}));
	await state.__twAframeLoading;
}
function load(head) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		const fail = (reason) => {
			clearTimeout(timer);
			script.remove();
			reject(/* @__PURE__ */ new Error(`Could not load A-Frame ${aframeVersion} from ${aframeUrl}: ${reason}`));
		};
		const timer = setTimeout(() => fail(`no response in ${loadTimeoutMs / 1e3} s`), loadTimeoutMs);
		script.src = aframeUrl;
		script.integrity = aframeIntegrity;
		script.crossOrigin = "anonymous";
		script.onload = () => {
			clearTimeout(timer);
			const loaded = globalThis.AFRAME;
			if (loaded === void 0) {
				reject(/* @__PURE__ */ new Error(`A-Frame ${aframeVersion} loaded but did not define AFRAME.`));
				return;
			}
			try {
				requireVersion(loaded);
				resolve();
			} catch (error) {
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		};
		script.onerror = () => fail("the request failed or the file did not match its integrity hash");
		head.append(script);
	});
}
function requireVersion(aframe) {
	if (aframe.version !== "1.8.0") throw new Error(`A-Frame ${aframe.version ?? "(unknown version)"} is already on the page; TurboWarp-A-Frame needs ${aframeVersion}.`);
}
function createThreeVrm(__THREE__) {
	const THREE = __THREE__, THREE4 = __THREE__, THREE2 = __THREE__, THREE3 = __THREE__, THREE5 = __THREE__, THREE6 = __THREE__, THREE7 = __THREE__, THREE8 = __THREE__, THREE11 = __THREE__, THREE9 = __THREE__, THREE10 = __THREE__, THREE13 = __THREE__, THREE12 = __THREE__, THREE14 = __THREE__, THREE15 = __THREE__, THREE16 = __THREE__, THREE52 = __THREE__, THREE22 = __THREE__, THREE17 = __THREE__, THREE42 = __THREE__, THREE32 = __THREE__, THREE18 = __THREE__, THREE19 = __THREE__, THREE33 = __THREE__, THREE23 = __THREE__, THREE43 = __THREE__, THREE53 = __THREE__, THREE72 = __THREE__, THREE20 = __THREE__, THREE24 = __THREE__, THREE34 = __THREE__, THREE44 = __THREE__, THREE54 = __THREE__, THREE62 = __THREE__, THREE92 = __THREE__, THREE82 = __THREE__, THREE102 = __THREE__, THREE132 = __THREE__, THREE122 = __THREE__, THREE112 = __THREE__, THREE142 = __THREE__, THREE21 = __THREE__, THREE27 = __THREE__, THREE25 = __THREE__, THREE26 = __THREE__, THREE28 = __THREE__, THREE29 = __THREE__;
	const { BufferAttribute: BufferAttribute9 } = __THREE__;
	/*!
	* @pixiv/three-vrm v3.5.5
	* VRM file loader for three.js.
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	var __async = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	var __async2 = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	var VRMExpression = class extends THREE.Object3D {
		constructor(expressionName) {
			super();
			this.weight = 0;
			this.isBinary = false;
			this.overrideBlink = "none";
			this.overrideLookAt = "none";
			this.overrideMouth = "none";
			this._binds = [];
			this.name = `VRMExpression_${expressionName}`;
			this.expressionName = expressionName;
			this.type = "VRMExpression";
			this.visible = false;
		}
		/**
		* Binds that this expression influences.
		*/
		get binds() {
			return this._binds;
		}
		/**
		* A value represents how much it should override blink expressions.
		* `0.0` == no override at all, `1.0` == completely block the expressions.
		*/
		get overrideBlinkAmount() {
			if (this.overrideBlink === "block") return 0 < this.outputWeight ? 1 : 0;
			else if (this.overrideBlink === "blend") return this.outputWeight;
			else return 0;
		}
		/**
		* A value represents how much it should override lookAt expressions.
		* `0.0` == no override at all, `1.0` == completely block the expressions.
		*/
		get overrideLookAtAmount() {
			if (this.overrideLookAt === "block") return 0 < this.outputWeight ? 1 : 0;
			else if (this.overrideLookAt === "blend") return this.outputWeight;
			else return 0;
		}
		/**
		* A value represents how much it should override mouth expressions.
		* `0.0` == no override at all, `1.0` == completely block the expressions.
		*/
		get overrideMouthAmount() {
			if (this.overrideMouth === "block") return 0 < this.outputWeight ? 1 : 0;
			else if (this.overrideMouth === "blend") return this.outputWeight;
			else return 0;
		}
		/**
		* An output weight of this expression, considering the {@link isBinary}.
		*/
		get outputWeight() {
			if (this.isBinary) return this.weight > .5 ? 1 : 0;
			return this.weight;
		}
		/**
		* Add an expression bind to the expression.
		*
		* @param bind A bind to add
		*/
		addBind(bind) {
			this._binds.push(bind);
		}
		/**
		* Delete an expression bind from the expression.
		*
		* @param bind A bind to delete
		*/
		deleteBind(bind) {
			const index = this._binds.indexOf(bind);
			if (index >= 0) this._binds.splice(index, 1);
		}
		/**
		* Apply weight to every assigned blend shapes.
		* Should be called every frame.
		*/
		applyWeight(options) {
			var _a;
			let actualWeight = this.outputWeight;
			actualWeight *= (_a = options == null ? void 0 : options.multiplier) != null ? _a : 1;
			if (this.isBinary && actualWeight < 1) actualWeight = 0;
			this._binds.forEach((bind) => bind.applyWeight(actualWeight));
		}
		/**
		* Clear previously assigned blend shapes.
		*/
		clearAppliedWeight() {
			this._binds.forEach((bind) => bind.clearAppliedWeight());
		}
	};
	function extractPrimitivesInternal(gltf, nodeIndex, node) {
		var _a, _b;
		const json = gltf.parser.json;
		const schemaNode = (_a = json.nodes) == null ? void 0 : _a[nodeIndex];
		if (schemaNode == null) {
			console.warn(`extractPrimitivesInternal: Attempt to use nodes[${nodeIndex}] of glTF but the node doesn't exist`);
			return null;
		}
		const meshIndex = schemaNode.mesh;
		if (meshIndex == null) return null;
		const schemaMesh = (_b = json.meshes) == null ? void 0 : _b[meshIndex];
		if (schemaMesh == null) {
			console.warn(`extractPrimitivesInternal: Attempt to use meshes[${meshIndex}] of glTF but the mesh doesn't exist`);
			return null;
		}
		const primitiveCount = schemaMesh.primitives.length;
		const primitives = [];
		node.traverse((object) => {
			if (primitives.length < primitiveCount) {
				if (object.isMesh) primitives.push(object);
			}
		});
		return primitives;
	}
	function gltfExtractPrimitivesFromNode(gltf, nodeIndex) {
		return __async2(this, null, function* () {
			return extractPrimitivesInternal(gltf, nodeIndex, yield gltf.parser.getDependency("node", nodeIndex));
		});
	}
	function gltfExtractPrimitivesFromNodes(gltf) {
		return __async2(this, null, function* () {
			const nodes = yield gltf.parser.getDependencies("node");
			const map = /* @__PURE__ */ new Map();
			nodes.forEach((node, index) => {
				const result = extractPrimitivesInternal(gltf, index, node);
				if (result != null) map.set(index, result);
			});
			return map;
		});
	}
	var VRMExpressionPresetName = {
		Aa: "aa",
		Ih: "ih",
		Ou: "ou",
		Ee: "ee",
		Oh: "oh",
		Blink: "blink",
		Happy: "happy",
		Angry: "angry",
		Sad: "sad",
		Relaxed: "relaxed",
		LookUp: "lookUp",
		Surprised: "surprised",
		LookDown: "lookDown",
		LookLeft: "lookLeft",
		LookRight: "lookRight",
		BlinkLeft: "blinkLeft",
		BlinkRight: "blinkRight",
		Neutral: "neutral"
	};
	function saturate(value) {
		return Math.max(Math.min(value, 1), 0);
	}
	var VRMExpressionManager = class _VRMExpressionManager {
		/**
		* Create a new {@link VRMExpressionManager}.
		*/
		constructor() {
			this.blinkExpressionNames = [
				"blink",
				"blinkLeft",
				"blinkRight"
			];
			this.lookAtExpressionNames = [
				"lookLeft",
				"lookRight",
				"lookUp",
				"lookDown"
			];
			this.mouthExpressionNames = [
				"aa",
				"ee",
				"ih",
				"oh",
				"ou"
			];
			this._expressions = [];
			this._expressionMap = {};
		}
		get expressions() {
			return this._expressions.concat();
		}
		get expressionMap() {
			return Object.assign({}, this._expressionMap);
		}
		/**
		* A map from name to expression, but excluding custom expressions.
		*/
		get presetExpressionMap() {
			const result = {};
			const presetNameSet = new Set(Object.values(VRMExpressionPresetName));
			Object.entries(this._expressionMap).forEach(([name, expression]) => {
				if (presetNameSet.has(name)) result[name] = expression;
			});
			return result;
		}
		/**
		* A map from name to expression, but excluding preset expressions.
		*/
		get customExpressionMap() {
			const result = {};
			const presetNameSet = new Set(Object.values(VRMExpressionPresetName));
			Object.entries(this._expressionMap).forEach(([name, expression]) => {
				if (!presetNameSet.has(name)) result[name] = expression;
			});
			return result;
		}
		/**
		* Copy the given {@link VRMExpressionManager} into this one.
		* @param source The {@link VRMExpressionManager} you want to copy
		* @returns this
		*/
		copy(source) {
			this._expressions.concat().forEach((expression) => {
				this.unregisterExpression(expression);
			});
			source._expressions.forEach((expression) => {
				this.registerExpression(expression);
			});
			this.blinkExpressionNames = source.blinkExpressionNames.concat();
			this.lookAtExpressionNames = source.lookAtExpressionNames.concat();
			this.mouthExpressionNames = source.mouthExpressionNames.concat();
			return this;
		}
		/**
		* Returns a clone of this {@link VRMExpressionManager}.
		* @returns Copied {@link VRMExpressionManager}
		*/
		clone() {
			return new _VRMExpressionManager().copy(this);
		}
		/**
		* Return a registered expression.
		* If it cannot find an expression, it will return `null` instead.
		*
		* @param name Name or preset name of the expression
		*/
		getExpression(name) {
			var _a;
			return (_a = this._expressionMap[name]) != null ? _a : null;
		}
		/**
		* Register an expression.
		*
		* @param expression {@link VRMExpression} that describes the expression
		*/
		registerExpression(expression) {
			this._expressions.push(expression);
			this._expressionMap[expression.expressionName] = expression;
		}
		/**
		* Unregister an expression.
		*
		* @param expression The expression you want to unregister
		*/
		unregisterExpression(expression) {
			const index = this._expressions.indexOf(expression);
			if (index === -1) console.warn("VRMExpressionManager: The specified expressions is not registered");
			this._expressions.splice(index, 1);
			delete this._expressionMap[expression.expressionName];
		}
		/**
		* Get the current weight of the specified expression.
		* If it doesn't have an expression of given name, it will return `null` instead.
		*
		* @param name Name of the expression
		*/
		getValue(name) {
			var _a;
			const expression = this.getExpression(name);
			return (_a = expression == null ? void 0 : expression.weight) != null ? _a : null;
		}
		/**
		* Set a weight to the specified expression.
		*
		* @param name Name of the expression
		* @param weight Weight
		*/
		setValue(name, weight) {
			const expression = this.getExpression(name);
			if (expression) expression.weight = saturate(weight);
		}
		/**
		* Reset weights of all expressions to `0.0`.
		*/
		resetValues() {
			this._expressions.forEach((expression) => {
				expression.weight = 0;
			});
		}
		/**
		* Get a track name of specified expression.
		* This track name is needed to manipulate its expression via keyframe animations.
		*
		* @example Manipulate an expression using keyframe animation
		* ```js
		* const trackName = vrm.expressionManager.getExpressionTrackName( 'blink' );
		* const track = new THREE.NumberKeyframeTrack(
		*   name,
		*   [ 0.0, 0.5, 1.0 ], // times
		*   [ 0.0, 1.0, 0.0 ] // values
		* );
		*
		* const clip = new THREE.AnimationClip(
		*   'blink', // name
		*   1.0, // duration
		*   [ track ] // tracks
		* );
		*
		* const mixer = new THREE.AnimationMixer( vrm.scene );
		* const action = mixer.clipAction( clip );
		* action.play();
		* ```
		*
		* @param name Name of the expression
		*/
		getExpressionTrackName(name) {
			const expression = this.getExpression(name);
			return expression ? `${expression.name}.weight` : null;
		}
		/**
		* Update every expressions.
		*/
		update() {
			const weightMultipliers = this._calculateWeightMultipliers();
			this._expressions.forEach((expression) => {
				expression.clearAppliedWeight();
			});
			this._expressions.forEach((expression) => {
				let multiplier = 1;
				const name = expression.expressionName;
				if (this.blinkExpressionNames.indexOf(name) !== -1) multiplier *= weightMultipliers.blink;
				if (this.lookAtExpressionNames.indexOf(name) !== -1) multiplier *= weightMultipliers.lookAt;
				if (this.mouthExpressionNames.indexOf(name) !== -1) multiplier *= weightMultipliers.mouth;
				expression.applyWeight({ multiplier });
			});
		}
		/**
		* Calculate sum of override amounts to see how much we should multiply weights of certain expressions.
		*/
		_calculateWeightMultipliers() {
			let blink = 1;
			let lookAt = 1;
			let mouth = 1;
			this._expressions.forEach((expression) => {
				blink -= expression.overrideBlinkAmount;
				lookAt -= expression.overrideLookAtAmount;
				mouth -= expression.overrideMouthAmount;
			});
			blink = Math.max(0, blink);
			lookAt = Math.max(0, lookAt);
			mouth = Math.max(0, mouth);
			return {
				blink,
				lookAt,
				mouth
			};
		}
	};
	var VRMExpressionMaterialColorType = {
		Color: "color",
		EmissionColor: "emissionColor",
		ShadeColor: "shadeColor",
		MatcapColor: "matcapColor",
		RimColor: "rimColor",
		OutlineColor: "outlineColor"
	};
	var v0ExpressionMaterialColorMap = {
		_Color: VRMExpressionMaterialColorType.Color,
		_EmissionColor: VRMExpressionMaterialColorType.EmissionColor,
		_ShadeColor: VRMExpressionMaterialColorType.ShadeColor,
		_RimColor: VRMExpressionMaterialColorType.RimColor,
		_OutlineColor: VRMExpressionMaterialColorType.OutlineColor
	};
	var _color = new THREE2.Color();
	var _VRMExpressionMaterialColorBind = class _VRMExpressionMaterialColorBind2 {
		constructor({ material, type, targetValue, targetAlpha }) {
			this.material = material;
			this.type = type;
			this.targetValue = targetValue;
			this.targetAlpha = targetAlpha != null ? targetAlpha : 1;
			const color = this._initColorBindState();
			const alpha = this._initAlphaBindState();
			this._state = {
				color,
				alpha
			};
		}
		applyWeight(weight) {
			const { color, alpha } = this._state;
			if (color != null) {
				const { propertyName, deltaValue } = color;
				const target = this.material[propertyName];
				if (target != void 0) target.add(_color.copy(deltaValue).multiplyScalar(weight));
			}
			if (alpha != null) {
				const { propertyName, deltaValue } = alpha;
				if (this.material[propertyName] != void 0) this.material[propertyName] += deltaValue * weight;
			}
		}
		clearAppliedWeight() {
			const { color, alpha } = this._state;
			if (color != null) {
				const { propertyName, initialValue } = color;
				const target = this.material[propertyName];
				if (target != void 0) target.copy(initialValue);
			}
			if (alpha != null) {
				const { propertyName, initialValue } = alpha;
				if (this.material[propertyName] != void 0) this.material[propertyName] = initialValue;
			}
		}
		_initColorBindState() {
			var _a, _b, _c;
			const { material, type, targetValue } = this;
			const propertyNameMap = this._getPropertyNameMap();
			const propertyName = (_b = (_a = propertyNameMap == null ? void 0 : propertyNameMap[type]) == null ? void 0 : _a[0]) != null ? _b : null;
			if (propertyName == null) {
				console.warn(`Tried to add a material color bind to the material ${(_c = material.name) != null ? _c : "(no name)"}, the type ${type} but the material or the type is not supported.`);
				return null;
			}
			const initialValue = material[propertyName].clone();
			return {
				propertyName,
				initialValue,
				deltaValue: new THREE2.Color(targetValue.r - initialValue.r, targetValue.g - initialValue.g, targetValue.b - initialValue.b)
			};
		}
		_initAlphaBindState() {
			var _a, _b, _c;
			const { material, type, targetAlpha } = this;
			const propertyNameMap = this._getPropertyNameMap();
			const propertyName = (_b = (_a = propertyNameMap == null ? void 0 : propertyNameMap[type]) == null ? void 0 : _a[1]) != null ? _b : null;
			if (propertyName == null && targetAlpha !== 1) {
				console.warn(`Tried to add a material alpha bind to the material ${(_c = material.name) != null ? _c : "(no name)"}, the type ${type} but the material or the type does not support alpha.`);
				return null;
			}
			if (propertyName == null) return null;
			const initialValue = material[propertyName];
			return {
				propertyName,
				initialValue,
				deltaValue: targetAlpha - initialValue
			};
		}
		_getPropertyNameMap() {
			var _a, _b;
			return (_b = (_a = Object.entries(_VRMExpressionMaterialColorBind2._propertyNameMapMap).find(([distinguisher]) => {
				return this.material[distinguisher] === true;
			})) == null ? void 0 : _a[1]) != null ? _b : null;
		}
	};
	_VRMExpressionMaterialColorBind._propertyNameMapMap = {
		isMeshStandardMaterial: {
			color: ["color", "opacity"],
			emissionColor: ["emissive", null]
		},
		isMeshBasicMaterial: { color: ["color", "opacity"] },
		isMToonMaterial: {
			color: ["color", "opacity"],
			emissionColor: ["emissive", null],
			outlineColor: ["outlineColorFactor", null],
			matcapColor: ["matcapFactor", null],
			rimColor: ["parametricRimColorFactor", null],
			shadeColor: ["shadeColorFactor", null]
		}
	};
	var VRMExpressionMaterialColorBind = _VRMExpressionMaterialColorBind;
	var VRMExpressionMorphTargetBind = class {
		constructor({ primitives, index, weight }) {
			this.primitives = primitives;
			this.index = index;
			this.weight = weight;
		}
		applyWeight(weight) {
			this.primitives.forEach((mesh) => {
				var _a;
				if (((_a = mesh.morphTargetInfluences) == null ? void 0 : _a[this.index]) != null) mesh.morphTargetInfluences[this.index] += this.weight * weight;
			});
		}
		clearAppliedWeight() {
			this.primitives.forEach((mesh) => {
				var _a;
				if (((_a = mesh.morphTargetInfluences) == null ? void 0 : _a[this.index]) != null) mesh.morphTargetInfluences[this.index] = 0;
			});
		}
	};
	var _v2 = new THREE3.Vector2();
	var _VRMExpressionTextureTransformBind = class _VRMExpressionTextureTransformBind2 {
		constructor({ material, scale, offset }) {
			var _a, _b;
			this.material = material;
			this.scale = scale;
			this.offset = offset;
			const propertyNames = (_a = Object.entries(_VRMExpressionTextureTransformBind2._propertyNamesMap).find(([distinguisher]) => {
				return material[distinguisher] === true;
			})) == null ? void 0 : _a[1];
			if (propertyNames == null) {
				console.warn(`Tried to add a texture transform bind to the material ${(_b = material.name) != null ? _b : "(no name)"} but the material is not supported.`);
				this._properties = [];
			} else {
				this._properties = [];
				propertyNames.forEach((propertyName) => {
					var _a2;
					const texture = (_a2 = material[propertyName]) == null ? void 0 : _a2.clone();
					if (!texture) return null;
					material[propertyName] = texture;
					const initialOffset = texture.offset.clone();
					const initialScale = texture.repeat.clone();
					const deltaOffset = offset.clone().sub(initialOffset);
					const deltaScale = scale.clone().sub(initialScale);
					this._properties.push({
						name: propertyName,
						initialOffset,
						deltaOffset,
						initialScale,
						deltaScale
					});
				});
			}
		}
		applyWeight(weight) {
			this._properties.forEach((property) => {
				const target = this.material[property.name];
				if (target === void 0) return;
				target.offset.add(_v2.copy(property.deltaOffset).multiplyScalar(weight));
				target.repeat.add(_v2.copy(property.deltaScale).multiplyScalar(weight));
			});
		}
		clearAppliedWeight() {
			this._properties.forEach((property) => {
				const target = this.material[property.name];
				if (target === void 0) return;
				target.offset.copy(property.initialOffset);
				target.repeat.copy(property.initialScale);
			});
		}
	};
	_VRMExpressionTextureTransformBind._propertyNamesMap = {
		isMeshStandardMaterial: [
			"map",
			"emissiveMap",
			"bumpMap",
			"normalMap",
			"displacementMap",
			"roughnessMap",
			"metalnessMap",
			"alphaMap"
		],
		isMeshBasicMaterial: [
			"map",
			"specularMap",
			"alphaMap"
		],
		isMToonMaterial: [
			"map",
			"normalMap",
			"emissiveMap",
			"shadeMultiplyTexture",
			"rimMultiplyTexture",
			"outlineWidthMultiplyTexture",
			"uvAnimationMaskTexture"
		]
	};
	var VRMExpressionTextureTransformBind = _VRMExpressionTextureTransformBind;
	var POSSIBLE_SPEC_VERSIONS = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var _VRMExpressionLoaderPlugin = class _VRMExpressionLoaderPlugin2 {
		get name() {
			return "VRMExpressionLoaderPlugin";
		}
		constructor(parser) {
			this.parser = parser;
		}
		afterRoot(gltf) {
			return __async2(this, null, function* () {
				gltf.userData.vrmExpressionManager = yield this._import(gltf);
			});
		}
		/**
		* Import a {@link VRMExpressionManager} from a VRM.
		*
		* @param gltf A parsed result of GLTF taken from GLTFLoader
		*/
		_import(gltf) {
			return __async2(this, null, function* () {
				const v1Result = yield this._v1Import(gltf);
				if (v1Result) return v1Result;
				const v0Result = yield this._v0Import(gltf);
				if (v0Result) return v0Result;
				return null;
			});
		}
		_v1Import(gltf) {
			return __async2(this, null, function* () {
				var _a, _b;
				const json = this.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf("VRMC_vrm")) !== -1)) return null;
				const extension = (_b = json.extensions) == null ? void 0 : _b["VRMC_vrm"];
				if (!extension) return null;
				const specVersion = extension.specVersion;
				if (!POSSIBLE_SPEC_VERSIONS.has(specVersion)) {
					console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${specVersion}"`);
					return null;
				}
				const schemaExpressions = extension.expressions;
				if (!schemaExpressions) return null;
				const presetNameSet = new Set(Object.values(VRMExpressionPresetName));
				const nameSchemaExpressionMap = /* @__PURE__ */ new Map();
				if (schemaExpressions.preset != null) Object.entries(schemaExpressions.preset).forEach(([name, schemaExpression]) => {
					if (schemaExpression == null) return;
					if (!presetNameSet.has(name)) {
						console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${name}" detected. Ignoring the expression`);
						return;
					}
					nameSchemaExpressionMap.set(name, schemaExpression);
				});
				if (schemaExpressions.custom != null) Object.entries(schemaExpressions.custom).forEach(([name, schemaExpression]) => {
					if (presetNameSet.has(name)) {
						console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${name}". Ignoring the expression`);
						return;
					}
					nameSchemaExpressionMap.set(name, schemaExpression);
				});
				const manager = new VRMExpressionManager();
				yield Promise.all(Array.from(nameSchemaExpressionMap.entries()).map((_0) => __async2(this, [_0], function* ([name, schemaExpression]) {
					var _a2, _b2, _c, _d, _e, _f, _g;
					const expression = new VRMExpression(name);
					gltf.scene.add(expression);
					expression.isBinary = (_a2 = schemaExpression.isBinary) != null ? _a2 : false;
					expression.overrideBlink = (_b2 = schemaExpression.overrideBlink) != null ? _b2 : "none";
					expression.overrideLookAt = (_c = schemaExpression.overrideLookAt) != null ? _c : "none";
					expression.overrideMouth = (_d = schemaExpression.overrideMouth) != null ? _d : "none";
					(_e = schemaExpression.morphTargetBinds) == null || _e.forEach((bind) => __async2(this, null, function* () {
						var _a3;
						if (bind.node === void 0 || bind.index === void 0) return;
						const primitives = yield gltfExtractPrimitivesFromNode(gltf, bind.node);
						const morphTargetIndex = bind.index;
						if (!primitives.every((primitive) => Array.isArray(primitive.morphTargetInfluences) && morphTargetIndex < primitive.morphTargetInfluences.length)) {
							console.warn(`VRMExpressionLoaderPlugin: ${schemaExpression.name} attempts to index morph #${morphTargetIndex} but not found.`);
							return;
						}
						expression.addBind(new VRMExpressionMorphTargetBind({
							primitives,
							index: morphTargetIndex,
							weight: (_a3 = bind.weight) != null ? _a3 : 1
						}));
					}));
					if (schemaExpression.materialColorBinds || schemaExpression.textureTransformBinds) {
						const gltfMaterials = [];
						gltf.scene.traverse((object) => {
							const material = object.material;
							if (material) {
								if (Array.isArray(material)) gltfMaterials.push(...material);
								else gltfMaterials.push(material);
							}
						});
						(_f = schemaExpression.materialColorBinds) == null || _f.forEach((bind) => __async2(this, null, function* () {
							gltfMaterials.filter((material) => {
								var _a3;
								const materialIndex = (_a3 = this.parser.associations.get(material)) == null ? void 0 : _a3.materials;
								return bind.material === materialIndex;
							}).forEach((material) => {
								expression.addBind(new VRMExpressionMaterialColorBind({
									material,
									type: bind.type,
									targetValue: new THREE4.Color().fromArray(bind.targetValue),
									targetAlpha: bind.targetValue[3]
								}));
							});
						}));
						(_g = schemaExpression.textureTransformBinds) == null || _g.forEach((bind) => __async2(this, null, function* () {
							gltfMaterials.filter((material) => {
								var _a3;
								const materialIndex = (_a3 = this.parser.associations.get(material)) == null ? void 0 : _a3.materials;
								return bind.material === materialIndex;
							}).forEach((material) => {
								var _a3, _b3;
								expression.addBind(new VRMExpressionTextureTransformBind({
									material,
									offset: new THREE4.Vector2().fromArray((_a3 = bind.offset) != null ? _a3 : [0, 0]),
									scale: new THREE4.Vector2().fromArray((_b3 = bind.scale) != null ? _b3 : [1, 1])
								}));
							});
						}));
					}
					manager.registerExpression(expression);
				})));
				return manager;
			});
		}
		_v0Import(gltf) {
			return __async2(this, null, function* () {
				var _a;
				const json = this.parser.json;
				const vrmExt = (_a = json.extensions) == null ? void 0 : _a.VRM;
				if (!vrmExt) return null;
				const schemaBlendShape = vrmExt.blendShapeMaster;
				if (!schemaBlendShape) return null;
				const manager = new VRMExpressionManager();
				const schemaBlendShapeGroups = schemaBlendShape.blendShapeGroups;
				if (!schemaBlendShapeGroups) return manager;
				const blendShapeNameSet = /* @__PURE__ */ new Set();
				yield Promise.all(schemaBlendShapeGroups.map((schemaGroup) => __async2(this, null, function* () {
					var _a2;
					const v0PresetName = schemaGroup.presetName;
					const v1PresetName = v0PresetName != null && _VRMExpressionLoaderPlugin2.v0v1PresetNameMap[v0PresetName] || null;
					const name = v1PresetName != null ? v1PresetName : schemaGroup.name;
					if (name == null) {
						console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");
						return;
					}
					if (blendShapeNameSet.has(name)) {
						console.warn(`VRMExpressionLoaderPlugin: An expression preset ${v0PresetName} has duplicated entries. Ignoring the expression`);
						return;
					}
					blendShapeNameSet.add(name);
					const expression = new VRMExpression(name);
					gltf.scene.add(expression);
					expression.isBinary = (_a2 = schemaGroup.isBinary) != null ? _a2 : false;
					if (schemaGroup.binds) schemaGroup.binds.forEach((bind) => __async2(this, null, function* () {
						var _a3;
						if (bind.mesh === void 0 || bind.index === void 0) return;
						const nodesUsingMesh = [];
						(_a3 = json.nodes) == null || _a3.forEach((node, i) => {
							if (node.mesh === bind.mesh) nodesUsingMesh.push(i);
						});
						if (nodesUsingMesh.length === 0) {
							console.warn(`VRMExpressionLoaderPlugin: ${schemaGroup.name} attempts to bind a morph target to the mesh #${bind.mesh} but the mesh is not found or not used in the scene. Ignoring the bind.`);
							return;
						}
						const morphTargetIndex = bind.index;
						yield Promise.all(nodesUsingMesh.map((nodeIndex) => __async2(this, null, function* () {
							var _a4;
							const primitives = yield gltfExtractPrimitivesFromNode(gltf, nodeIndex);
							if (!primitives.every((primitive) => Array.isArray(primitive.morphTargetInfluences) && morphTargetIndex < primitive.morphTargetInfluences.length)) {
								console.warn(`VRMExpressionLoaderPlugin: ${schemaGroup.name} attempts to index ${morphTargetIndex}th morph but not found.`);
								return;
							}
							expression.addBind(new VRMExpressionMorphTargetBind({
								primitives,
								index: morphTargetIndex,
								weight: .01 * ((_a4 = bind.weight) != null ? _a4 : 100)
							}));
						})));
					}));
					const materialValues = schemaGroup.materialValues;
					if (materialValues && materialValues.length !== 0) materialValues.forEach((materialValue) => {
						if (materialValue.materialName === void 0 || materialValue.propertyName === void 0 || materialValue.targetValue === void 0) return;
						const materials = [];
						gltf.scene.traverse((object) => {
							if (object.material) {
								const material = object.material;
								if (Array.isArray(material)) materials.push(...material.filter((mtl) => (mtl.name === materialValue.materialName || mtl.name === materialValue.materialName + " (Outline)") && materials.indexOf(mtl) === -1));
								else if (material.name === materialValue.materialName && materials.indexOf(material) === -1) materials.push(material);
							}
						});
						const materialPropertyName = materialValue.propertyName;
						materials.forEach((material) => {
							if (materialPropertyName === "_MainTex_ST") {
								const scale = new THREE4.Vector2(materialValue.targetValue[0], materialValue.targetValue[1]);
								const offset = new THREE4.Vector2(materialValue.targetValue[2], materialValue.targetValue[3]);
								offset.y = 1 - offset.y - scale.y;
								expression.addBind(new VRMExpressionTextureTransformBind({
									material,
									scale,
									offset
								}));
								return;
							}
							const materialColorType = v0ExpressionMaterialColorMap[materialPropertyName];
							if (materialColorType) {
								expression.addBind(new VRMExpressionMaterialColorBind({
									material,
									type: materialColorType,
									targetValue: new THREE4.Color().fromArray(materialValue.targetValue),
									targetAlpha: materialValue.targetValue[3]
								}));
								return;
							}
							console.warn(materialPropertyName + " is not supported");
						});
					});
					manager.registerExpression(expression);
				})));
				return manager;
			});
		}
	};
	_VRMExpressionLoaderPlugin.v0v1PresetNameMap = {
		a: "aa",
		e: "ee",
		i: "ih",
		o: "oh",
		u: "ou",
		blink: "blink",
		joy: "happy",
		angry: "angry",
		sorrow: "sad",
		fun: "relaxed",
		lookup: "lookUp",
		lookdown: "lookDown",
		lookleft: "lookLeft",
		lookright: "lookRight",
		blink_l: "blinkLeft",
		blink_r: "blinkRight",
		neutral: "neutral"
	};
	var VRMExpressionLoaderPlugin = _VRMExpressionLoaderPlugin;
	var VRMExpressionOverrideType = {
		None: "none",
		Block: "block",
		Blend: "blend"
	};
	var _VRMFirstPerson = class _VRMFirstPerson2 {
		/**
		* Create a new VRMFirstPerson object.
		*
		* @param humanoid A {@link VRMHumanoid}
		* @param meshAnnotations A {@link VRMFirstPersonMeshAnnotation}
		*/
		constructor(humanoid, meshAnnotations) {
			this._firstPersonOnlyLayer = _VRMFirstPerson2.DEFAULT_FIRSTPERSON_ONLY_LAYER;
			this._thirdPersonOnlyLayer = _VRMFirstPerson2.DEFAULT_THIRDPERSON_ONLY_LAYER;
			this._initializedLayers = false;
			this.humanoid = humanoid;
			this.meshAnnotations = meshAnnotations;
		}
		/**
		* Copy the given {@link VRMFirstPerson} into this one.
		* {@link humanoid} must be same as the source one.
		* @param source The {@link VRMFirstPerson} you want to copy
		* @returns this
		*/
		copy(source) {
			if (this.humanoid !== source.humanoid) throw new Error("VRMFirstPerson: humanoid must be same in order to copy");
			this.meshAnnotations = source.meshAnnotations.map((annotation) => ({
				meshes: annotation.meshes.concat(),
				type: annotation.type
			}));
			return this;
		}
		/**
		* Returns a clone of this {@link VRMFirstPerson}.
		* @returns Copied {@link VRMFirstPerson}
		*/
		clone() {
			return new _VRMFirstPerson2(this.humanoid, this.meshAnnotations).copy(this);
		}
		/**
		* A camera layer represents `FirstPersonOnly` layer.
		* Note that **you must call {@link setup} first before you use the layer feature** or it does not work properly.
		*
		* The value is {@link DEFAULT_FIRSTPERSON_ONLY_LAYER} by default but you can change the layer by specifying via {@link setup} if you prefer.
		*
		* @see https://vrm.dev/en/univrm/api/univrm_use_firstperson/
		* @see https://threejs.org/docs/#api/en/core/Layers
		*/
		get firstPersonOnlyLayer() {
			return this._firstPersonOnlyLayer;
		}
		/**
		* A camera layer represents `ThirdPersonOnly` layer.
		* Note that **you must call {@link setup} first before you use the layer feature** or it does not work properly.
		*
		* The value is {@link DEFAULT_THIRDPERSON_ONLY_LAYER} by default but you can change the layer by specifying via {@link setup} if you prefer.
		*
		* @see https://vrm.dev/en/univrm/api/univrm_use_firstperson/
		* @see https://threejs.org/docs/#api/en/core/Layers
		*/
		get thirdPersonOnlyLayer() {
			return this._thirdPersonOnlyLayer;
		}
		/**
		* In this method, it assigns layers for every meshes based on mesh annotations.
		* You must call this method first before you use the layer feature.
		*
		* This is an equivalent of [VRMFirstPerson.Setup](https://github.com/vrm-c/UniVRM/blob/73a5bd8fcddaa2a7a8735099a97e63c9db3e5ea0/Assets/VRM/Runtime/FirstPerson/VRMFirstPerson.cs#L295-L299) of the UniVRM.
		*
		* The `cameraLayer` parameter specifies which layer will be assigned for `FirstPersonOnly` / `ThirdPersonOnly`.
		* In UniVRM, we specified those by naming each desired layer as `FIRSTPERSON_ONLY_LAYER` / `THIRDPERSON_ONLY_LAYER`
		* but we are going to specify these layers at here since we are unable to name layers in Three.js.
		*
		* @param cameraLayer Specify which layer will be for `FirstPersonOnly` / `ThirdPersonOnly`.
		*/
		setup({ firstPersonOnlyLayer = _VRMFirstPerson2.DEFAULT_FIRSTPERSON_ONLY_LAYER, thirdPersonOnlyLayer = _VRMFirstPerson2.DEFAULT_THIRDPERSON_ONLY_LAYER } = {}) {
			if (this._initializedLayers) return;
			this._firstPersonOnlyLayer = firstPersonOnlyLayer;
			this._thirdPersonOnlyLayer = thirdPersonOnlyLayer;
			this.meshAnnotations.forEach((item) => {
				item.meshes.forEach((mesh) => {
					if (item.type === "firstPersonOnly") {
						mesh.layers.set(this._firstPersonOnlyLayer);
						mesh.traverse((child) => child.layers.set(this._firstPersonOnlyLayer));
					} else if (item.type === "thirdPersonOnly") {
						mesh.layers.set(this._thirdPersonOnlyLayer);
						mesh.traverse((child) => child.layers.set(this._thirdPersonOnlyLayer));
					} else if (item.type === "auto") this._createHeadlessModel(mesh);
				});
			});
			this._initializedLayers = true;
		}
		_excludeTriangles(triangles, bws, skinIndex, exclude) {
			let count = 0;
			if (bws != null && bws.length > 0) for (let i = 0; i < triangles.length; i += 3) {
				const a = triangles[i];
				const b = triangles[i + 1];
				const c = triangles[i + 2];
				const bw0 = bws[a];
				const skin0 = skinIndex[a];
				if (bw0[0] > 0 && exclude.includes(skin0[0])) continue;
				if (bw0[1] > 0 && exclude.includes(skin0[1])) continue;
				if (bw0[2] > 0 && exclude.includes(skin0[2])) continue;
				if (bw0[3] > 0 && exclude.includes(skin0[3])) continue;
				const bw1 = bws[b];
				const skin1 = skinIndex[b];
				if (bw1[0] > 0 && exclude.includes(skin1[0])) continue;
				if (bw1[1] > 0 && exclude.includes(skin1[1])) continue;
				if (bw1[2] > 0 && exclude.includes(skin1[2])) continue;
				if (bw1[3] > 0 && exclude.includes(skin1[3])) continue;
				const bw2 = bws[c];
				const skin2 = skinIndex[c];
				if (bw2[0] > 0 && exclude.includes(skin2[0])) continue;
				if (bw2[1] > 0 && exclude.includes(skin2[1])) continue;
				if (bw2[2] > 0 && exclude.includes(skin2[2])) continue;
				if (bw2[3] > 0 && exclude.includes(skin2[3])) continue;
				triangles[count++] = a;
				triangles[count++] = b;
				triangles[count++] = c;
			}
			return count;
		}
		_createErasedMesh(src, erasingBonesIndex) {
			const dst = new THREE5.SkinnedMesh(src.geometry.clone(), src.material);
			dst.name = `${src.name}(erase)`;
			dst.frustumCulled = src.frustumCulled;
			dst.layers.set(this._firstPersonOnlyLayer);
			const geometry = dst.geometry;
			const skinIndexAttr = geometry.getAttribute("skinIndex");
			const skinIndexAttrArray = skinIndexAttr instanceof THREE5.GLBufferAttribute ? [] : skinIndexAttr.array;
			const skinIndex = [];
			for (let i = 0; i < skinIndexAttrArray.length; i += 4) skinIndex.push([
				skinIndexAttrArray[i],
				skinIndexAttrArray[i + 1],
				skinIndexAttrArray[i + 2],
				skinIndexAttrArray[i + 3]
			]);
			const skinWeightAttr = geometry.getAttribute("skinWeight");
			const skinWeightAttrArray = skinWeightAttr instanceof THREE5.GLBufferAttribute ? [] : skinWeightAttr.array;
			const skinWeight = [];
			for (let i = 0; i < skinWeightAttrArray.length; i += 4) skinWeight.push([
				skinWeightAttrArray[i],
				skinWeightAttrArray[i + 1],
				skinWeightAttrArray[i + 2],
				skinWeightAttrArray[i + 3]
			]);
			const index = geometry.getIndex();
			if (!index) throw new Error("The geometry doesn't have an index buffer");
			const oldTriangles = Array.from(index.array);
			const count = this._excludeTriangles(oldTriangles, skinWeight, skinIndex, erasingBonesIndex);
			const newTriangle = [];
			for (let i = 0; i < count; i++) newTriangle[i] = oldTriangles[i];
			geometry.setIndex(newTriangle);
			if (src.onBeforeRender) dst.onBeforeRender = src.onBeforeRender;
			dst.bind(new THREE5.Skeleton(src.skeleton.bones, src.skeleton.boneInverses), new THREE5.Matrix4());
			return dst;
		}
		_createHeadlessModelForSkinnedMesh(parent, mesh) {
			const eraseBoneIndexes = [];
			mesh.skeleton.bones.forEach((bone, index) => {
				if (this._isEraseTarget(bone)) eraseBoneIndexes.push(index);
			});
			if (!eraseBoneIndexes.length) {
				mesh.layers.enable(this._thirdPersonOnlyLayer);
				mesh.layers.enable(this._firstPersonOnlyLayer);
				return;
			}
			mesh.layers.set(this._thirdPersonOnlyLayer);
			const newMesh = this._createErasedMesh(mesh, eraseBoneIndexes);
			parent.add(newMesh);
		}
		_createHeadlessModel(node) {
			if (node.type === "Group") {
				node.layers.set(this._thirdPersonOnlyLayer);
				if (this._isEraseTarget(node)) node.traverse((child) => child.layers.set(this._thirdPersonOnlyLayer));
				else {
					const parent = new THREE5.Group();
					parent.name = `_headless_${node.name}`;
					parent.layers.set(this._firstPersonOnlyLayer);
					node.parent.add(parent);
					node.children.filter((child) => child.type === "SkinnedMesh").forEach((child) => {
						const skinnedMesh = child;
						this._createHeadlessModelForSkinnedMesh(parent, skinnedMesh);
					});
				}
			} else if (node.type === "SkinnedMesh") {
				const skinnedMesh = node;
				this._createHeadlessModelForSkinnedMesh(node.parent, skinnedMesh);
			} else if (this._isEraseTarget(node)) {
				node.layers.set(this._thirdPersonOnlyLayer);
				node.traverse((child) => child.layers.set(this._thirdPersonOnlyLayer));
			}
		}
		_isEraseTarget(bone) {
			if (bone === this.humanoid.getRawBoneNode("head")) return true;
			else if (!bone.parent) return false;
			else return this._isEraseTarget(bone.parent);
		}
	};
	_VRMFirstPerson.DEFAULT_FIRSTPERSON_ONLY_LAYER = 9;
	_VRMFirstPerson.DEFAULT_THIRDPERSON_ONLY_LAYER = 10;
	var VRMFirstPerson = _VRMFirstPerson;
	var POSSIBLE_SPEC_VERSIONS2 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var VRMFirstPersonLoaderPlugin = class {
		get name() {
			return "VRMFirstPersonLoaderPlugin";
		}
		constructor(parser) {
			this.parser = parser;
		}
		afterRoot(gltf) {
			return __async2(this, null, function* () {
				const vrmHumanoid = gltf.userData.vrmHumanoid;
				if (vrmHumanoid === null) return;
				else if (vrmHumanoid === void 0) throw new Error("VRMFirstPersonLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");
				gltf.userData.vrmFirstPerson = yield this._import(gltf, vrmHumanoid);
			});
		}
		/**
		* Import a {@link VRMFirstPerson} from a VRM.
		*
		* @param gltf A parsed result of GLTF taken from GLTFLoader
		* @param humanoid A {@link VRMHumanoid} instance that represents the VRM
		*/
		_import(gltf, humanoid) {
			return __async2(this, null, function* () {
				if (humanoid == null) return null;
				const v1Result = yield this._v1Import(gltf, humanoid);
				if (v1Result) return v1Result;
				const v0Result = yield this._v0Import(gltf, humanoid);
				if (v0Result) return v0Result;
				return null;
			});
		}
		_v1Import(gltf, humanoid) {
			return __async2(this, null, function* () {
				var _a, _b;
				const json = this.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf("VRMC_vrm")) !== -1)) return null;
				const extension = (_b = json.extensions) == null ? void 0 : _b["VRMC_vrm"];
				if (!extension) return null;
				const specVersion = extension.specVersion;
				if (!POSSIBLE_SPEC_VERSIONS2.has(specVersion)) {
					console.warn(`VRMFirstPersonLoaderPlugin: Unknown VRMC_vrm specVersion "${specVersion}"`);
					return null;
				}
				const schemaFirstPerson = extension.firstPerson;
				const meshAnnotations = [];
				const nodePrimitivesMap = yield gltfExtractPrimitivesFromNodes(gltf);
				Array.from(nodePrimitivesMap.entries()).forEach(([nodeIndex, primitives]) => {
					var _a2, _b2;
					const annotation = (_a2 = schemaFirstPerson == null ? void 0 : schemaFirstPerson.meshAnnotations) == null ? void 0 : _a2.find((a) => a.node === nodeIndex);
					meshAnnotations.push({
						meshes: primitives,
						type: (_b2 = annotation == null ? void 0 : annotation.type) != null ? _b2 : "auto"
					});
				});
				return new VRMFirstPerson(humanoid, meshAnnotations);
			});
		}
		_v0Import(gltf, humanoid) {
			return __async2(this, null, function* () {
				var _a;
				const json = this.parser.json;
				const vrmExt = (_a = json.extensions) == null ? void 0 : _a.VRM;
				if (!vrmExt) return null;
				const schemaFirstPerson = vrmExt.firstPerson;
				if (!schemaFirstPerson) return null;
				const meshAnnotations = [];
				const nodePrimitivesMap = yield gltfExtractPrimitivesFromNodes(gltf);
				Array.from(nodePrimitivesMap.entries()).forEach(([nodeIndex, primitives]) => {
					const schemaNode = json.nodes[nodeIndex];
					const flag = schemaFirstPerson.meshAnnotations ? schemaFirstPerson.meshAnnotations.find((a) => a.mesh === schemaNode.mesh) : void 0;
					meshAnnotations.push({
						meshes: primitives,
						type: this._convertV0FlagToV1Type(flag == null ? void 0 : flag.firstPersonFlag)
					});
				});
				return new VRMFirstPerson(humanoid, meshAnnotations);
			});
		}
		_convertV0FlagToV1Type(flag) {
			if (flag === "FirstPersonOnly") return "firstPersonOnly";
			else if (flag === "ThirdPersonOnly") return "thirdPersonOnly";
			else if (flag === "Both") return "both";
			else return "auto";
		}
	};
	var VRMFirstPersonMeshAnnotationType = {
		Auto: "auto",
		Both: "both",
		ThirdPersonOnly: "thirdPersonOnly",
		FirstPersonOnly: "firstPersonOnly"
	};
	var _v3A = new THREE6.Vector3();
	var _v3B = new THREE6.Vector3();
	var _quatA = new THREE6.Quaternion();
	var VRMHumanoidHelper = class extends THREE6.Group {
		constructor(humanoid) {
			super();
			this.vrmHumanoid = humanoid;
			this._boneAxesMap = /* @__PURE__ */ new Map();
			Object.values(humanoid.humanBones).forEach((bone) => {
				const helper = new THREE6.AxesHelper(1);
				helper.matrixAutoUpdate = false;
				helper.material.depthTest = false;
				helper.material.depthWrite = false;
				this.add(helper);
				this._boneAxesMap.set(bone, helper);
			});
		}
		dispose() {
			Array.from(this._boneAxesMap.values()).forEach((axes) => {
				axes.geometry.dispose();
				axes.material.dispose();
			});
		}
		updateMatrixWorld(force) {
			Array.from(this._boneAxesMap.entries()).forEach(([bone, axes]) => {
				bone.node.updateWorldMatrix(true, false);
				bone.node.matrixWorld.decompose(_v3A, _quatA, _v3B);
				const scale = _v3A.set(.1, .1, .1).divide(_v3B);
				axes.matrix.copy(bone.node.matrixWorld).scale(scale);
			});
			super.updateMatrixWorld(force);
		}
	};
	var VRMHumanBoneList = [
		"hips",
		"spine",
		"chest",
		"upperChest",
		"neck",
		"head",
		"leftEye",
		"rightEye",
		"jaw",
		"leftUpperLeg",
		"leftLowerLeg",
		"leftFoot",
		"leftToes",
		"rightUpperLeg",
		"rightLowerLeg",
		"rightFoot",
		"rightToes",
		"leftShoulder",
		"leftUpperArm",
		"leftLowerArm",
		"leftHand",
		"rightShoulder",
		"rightUpperArm",
		"rightLowerArm",
		"rightHand",
		"leftThumbMetacarpal",
		"leftThumbProximal",
		"leftThumbDistal",
		"leftIndexProximal",
		"leftIndexIntermediate",
		"leftIndexDistal",
		"leftMiddleProximal",
		"leftMiddleIntermediate",
		"leftMiddleDistal",
		"leftRingProximal",
		"leftRingIntermediate",
		"leftRingDistal",
		"leftLittleProximal",
		"leftLittleIntermediate",
		"leftLittleDistal",
		"rightThumbMetacarpal",
		"rightThumbProximal",
		"rightThumbDistal",
		"rightIndexProximal",
		"rightIndexIntermediate",
		"rightIndexDistal",
		"rightMiddleProximal",
		"rightMiddleIntermediate",
		"rightMiddleDistal",
		"rightRingProximal",
		"rightRingIntermediate",
		"rightRingDistal",
		"rightLittleProximal",
		"rightLittleIntermediate",
		"rightLittleDistal"
	];
	var VRMHumanBoneName = {
		Hips: "hips",
		Spine: "spine",
		Chest: "chest",
		UpperChest: "upperChest",
		Neck: "neck",
		Head: "head",
		LeftEye: "leftEye",
		RightEye: "rightEye",
		Jaw: "jaw",
		LeftUpperLeg: "leftUpperLeg",
		LeftLowerLeg: "leftLowerLeg",
		LeftFoot: "leftFoot",
		LeftToes: "leftToes",
		RightUpperLeg: "rightUpperLeg",
		RightLowerLeg: "rightLowerLeg",
		RightFoot: "rightFoot",
		RightToes: "rightToes",
		LeftShoulder: "leftShoulder",
		LeftUpperArm: "leftUpperArm",
		LeftLowerArm: "leftLowerArm",
		LeftHand: "leftHand",
		RightShoulder: "rightShoulder",
		RightUpperArm: "rightUpperArm",
		RightLowerArm: "rightLowerArm",
		RightHand: "rightHand",
		LeftThumbMetacarpal: "leftThumbMetacarpal",
		LeftThumbProximal: "leftThumbProximal",
		LeftThumbDistal: "leftThumbDistal",
		LeftIndexProximal: "leftIndexProximal",
		LeftIndexIntermediate: "leftIndexIntermediate",
		LeftIndexDistal: "leftIndexDistal",
		LeftMiddleProximal: "leftMiddleProximal",
		LeftMiddleIntermediate: "leftMiddleIntermediate",
		LeftMiddleDistal: "leftMiddleDistal",
		LeftRingProximal: "leftRingProximal",
		LeftRingIntermediate: "leftRingIntermediate",
		LeftRingDistal: "leftRingDistal",
		LeftLittleProximal: "leftLittleProximal",
		LeftLittleIntermediate: "leftLittleIntermediate",
		LeftLittleDistal: "leftLittleDistal",
		RightThumbMetacarpal: "rightThumbMetacarpal",
		RightThumbProximal: "rightThumbProximal",
		RightThumbDistal: "rightThumbDistal",
		RightIndexProximal: "rightIndexProximal",
		RightIndexIntermediate: "rightIndexIntermediate",
		RightIndexDistal: "rightIndexDistal",
		RightMiddleProximal: "rightMiddleProximal",
		RightMiddleIntermediate: "rightMiddleIntermediate",
		RightMiddleDistal: "rightMiddleDistal",
		RightRingProximal: "rightRingProximal",
		RightRingIntermediate: "rightRingIntermediate",
		RightRingDistal: "rightRingDistal",
		RightLittleProximal: "rightLittleProximal",
		RightLittleIntermediate: "rightLittleIntermediate",
		RightLittleDistal: "rightLittleDistal"
	};
	var VRMHumanBoneParentMap = {
		hips: null,
		spine: "hips",
		chest: "spine",
		upperChest: "chest",
		neck: "upperChest",
		head: "neck",
		leftEye: "head",
		rightEye: "head",
		jaw: "head",
		leftUpperLeg: "hips",
		leftLowerLeg: "leftUpperLeg",
		leftFoot: "leftLowerLeg",
		leftToes: "leftFoot",
		rightUpperLeg: "hips",
		rightLowerLeg: "rightUpperLeg",
		rightFoot: "rightLowerLeg",
		rightToes: "rightFoot",
		leftShoulder: "upperChest",
		leftUpperArm: "leftShoulder",
		leftLowerArm: "leftUpperArm",
		leftHand: "leftLowerArm",
		rightShoulder: "upperChest",
		rightUpperArm: "rightShoulder",
		rightLowerArm: "rightUpperArm",
		rightHand: "rightLowerArm",
		leftThumbMetacarpal: "leftHand",
		leftThumbProximal: "leftThumbMetacarpal",
		leftThumbDistal: "leftThumbProximal",
		leftIndexProximal: "leftHand",
		leftIndexIntermediate: "leftIndexProximal",
		leftIndexDistal: "leftIndexIntermediate",
		leftMiddleProximal: "leftHand",
		leftMiddleIntermediate: "leftMiddleProximal",
		leftMiddleDistal: "leftMiddleIntermediate",
		leftRingProximal: "leftHand",
		leftRingIntermediate: "leftRingProximal",
		leftRingDistal: "leftRingIntermediate",
		leftLittleProximal: "leftHand",
		leftLittleIntermediate: "leftLittleProximal",
		leftLittleDistal: "leftLittleIntermediate",
		rightThumbMetacarpal: "rightHand",
		rightThumbProximal: "rightThumbMetacarpal",
		rightThumbDistal: "rightThumbProximal",
		rightIndexProximal: "rightHand",
		rightIndexIntermediate: "rightIndexProximal",
		rightIndexDistal: "rightIndexIntermediate",
		rightMiddleProximal: "rightHand",
		rightMiddleIntermediate: "rightMiddleProximal",
		rightMiddleDistal: "rightMiddleIntermediate",
		rightRingProximal: "rightHand",
		rightRingIntermediate: "rightRingProximal",
		rightRingDistal: "rightRingIntermediate",
		rightLittleProximal: "rightHand",
		rightLittleIntermediate: "rightLittleProximal",
		rightLittleDistal: "rightLittleIntermediate"
	};
	function quatInvertCompat(target) {
		if (target.invert) target.invert();
		else target.inverse();
		return target;
	}
	var _v3A2 = new THREE7.Vector3();
	var _quatA2 = new THREE7.Quaternion();
	var VRMRig = class {
		/**
		* Create a new {@link VRMHumanoid}.
		* @param humanBones A {@link VRMHumanBones} contains all the bones of the new humanoid
		*/
		constructor(humanBones) {
			this.humanBones = humanBones;
			this.restPose = this.getAbsolutePose();
		}
		/**
		* Return the current absolute pose of this humanoid as a {@link VRMPose}.
		* Note that the output result will contain initial state of the VRM and not compatible between different models.
		* You might want to use {@link getPose} instead.
		*/
		getAbsolutePose() {
			const pose = {};
			Object.keys(this.humanBones).forEach((vrmBoneNameString) => {
				const vrmBoneName = vrmBoneNameString;
				const node = this.getBoneNode(vrmBoneName);
				if (!node) return;
				_v3A2.copy(node.position);
				_quatA2.copy(node.quaternion);
				pose[vrmBoneName] = {
					position: _v3A2.toArray(),
					rotation: _quatA2.toArray()
				};
			});
			return pose;
		}
		/**
		* Return the current pose of this humanoid as a {@link VRMPose}.
		*
		* Each transform is a local transform relative from rest pose (T-pose).
		*/
		getPose() {
			const pose = {};
			Object.keys(this.humanBones).forEach((boneNameString) => {
				const boneName = boneNameString;
				const node = this.getBoneNode(boneName);
				if (!node) return;
				_v3A2.set(0, 0, 0);
				_quatA2.identity();
				const restState = this.restPose[boneName];
				if (restState == null ? void 0 : restState.position) _v3A2.fromArray(restState.position).negate();
				if (restState == null ? void 0 : restState.rotation) quatInvertCompat(_quatA2.fromArray(restState.rotation));
				_v3A2.add(node.position);
				_quatA2.premultiply(node.quaternion);
				pose[boneName] = {
					position: _v3A2.toArray(),
					rotation: _quatA2.toArray()
				};
			});
			return pose;
		}
		/**
		* Let the humanoid do a specified pose.
		*
		* Each transform have to be a local transform relative from rest pose (T-pose).
		* You can pass what you got from {@link getPose}.
		*
		* @param poseObject A {@link VRMPose} that represents a single pose
		*/
		setPose(poseObject) {
			Object.entries(poseObject).forEach(([boneNameString, state]) => {
				const boneName = boneNameString;
				const node = this.getBoneNode(boneName);
				if (!node) return;
				const restState = this.restPose[boneName];
				if (!restState) return;
				if (state == null ? void 0 : state.position) {
					node.position.fromArray(state.position);
					if (restState.position) node.position.add(_v3A2.fromArray(restState.position));
				}
				if (state == null ? void 0 : state.rotation) {
					node.quaternion.fromArray(state.rotation);
					if (restState.rotation) node.quaternion.multiply(_quatA2.fromArray(restState.rotation));
				}
			});
		}
		/**
		* Reset the humanoid to its rest pose.
		*/
		resetPose() {
			Object.entries(this.restPose).forEach(([boneName, rest]) => {
				const node = this.getBoneNode(boneName);
				if (!node) return;
				if (rest == null ? void 0 : rest.position) node.position.fromArray(rest.position);
				if (rest == null ? void 0 : rest.rotation) node.quaternion.fromArray(rest.rotation);
			});
		}
		/**
		* Return a bone bound to a specified {@link VRMHumanBoneName}, as a {@link VRMHumanBone}.
		*
		* @param name Name of the bone you want
		*/
		getBone(name) {
			var _a;
			return (_a = this.humanBones[name]) != null ? _a : void 0;
		}
		/**
		* Return a bone bound to a specified {@link VRMHumanBoneName}, as a `THREE.Object3D`.
		*
		* @param name Name of the bone you want
		*/
		getBoneNode(name) {
			var _a, _b;
			return (_b = (_a = this.humanBones[name]) == null ? void 0 : _a.node) != null ? _b : null;
		}
	};
	var _v3A3 = new THREE8.Vector3();
	var _quatA3 = new THREE8.Quaternion();
	var _boneWorldPos = new THREE8.Vector3();
	var VRMHumanoidRig = class _VRMHumanoidRig extends VRMRig {
		static _setupTransforms(modelRig) {
			const root = new THREE8.Object3D();
			root.name = "VRMHumanoidRig";
			const boneWorldPositions = {};
			const boneWorldRotations = {};
			const boneRotations = {};
			const parentWorldRotations = {};
			VRMHumanBoneList.forEach((boneName) => {
				var _a;
				const boneNode = modelRig.getBoneNode(boneName);
				if (boneNode) {
					const boneWorldPosition = new THREE8.Vector3();
					const boneWorldRotation = new THREE8.Quaternion();
					boneNode.updateWorldMatrix(true, false);
					boneNode.matrixWorld.decompose(boneWorldPosition, boneWorldRotation, _v3A3);
					boneWorldPositions[boneName] = boneWorldPosition;
					boneWorldRotations[boneName] = boneWorldRotation;
					boneRotations[boneName] = boneNode.quaternion.clone();
					const parentWorldRotation = new THREE8.Quaternion();
					(_a = boneNode.parent) == null || _a.matrixWorld.decompose(_v3A3, parentWorldRotation, _v3A3);
					parentWorldRotations[boneName] = parentWorldRotation;
				}
			});
			const rigBones = {};
			VRMHumanBoneList.forEach((boneName) => {
				var _a;
				const boneNode = modelRig.getBoneNode(boneName);
				if (boneNode) {
					const boneWorldPosition = boneWorldPositions[boneName];
					let currentBoneName = boneName;
					let parentBoneWorldPosition;
					while (parentBoneWorldPosition == null) {
						currentBoneName = VRMHumanBoneParentMap[currentBoneName];
						if (currentBoneName == null) break;
						parentBoneWorldPosition = boneWorldPositions[currentBoneName];
					}
					const rigBoneNode = new THREE8.Object3D();
					rigBoneNode.name = "Normalized_" + boneNode.name;
					(currentBoneName ? (_a = rigBones[currentBoneName]) == null ? void 0 : _a.node : root).add(rigBoneNode);
					rigBoneNode.position.copy(boneWorldPosition);
					if (parentBoneWorldPosition) rigBoneNode.position.sub(parentBoneWorldPosition);
					rigBones[boneName] = { node: rigBoneNode };
				}
			});
			return {
				rigBones,
				root,
				parentWorldRotations,
				boneRotations
			};
		}
		constructor(humanoid) {
			const { rigBones, root, parentWorldRotations, boneRotations } = _VRMHumanoidRig._setupTransforms(humanoid);
			super(rigBones);
			this.original = humanoid;
			this.root = root;
			this._parentWorldRotations = parentWorldRotations;
			this._boneRotations = boneRotations;
		}
		/**
		* Update this humanoid rig.
		*/
		update() {
			VRMHumanBoneList.forEach((boneName) => {
				const boneNode = this.original.getBoneNode(boneName);
				if (boneNode != null) {
					const rigBoneNode = this.getBoneNode(boneName);
					const parentWorldRotation = this._parentWorldRotations[boneName];
					const invParentWorldRotation = _quatA3.copy(parentWorldRotation).invert();
					const boneRotation = this._boneRotations[boneName];
					boneNode.quaternion.copy(rigBoneNode.quaternion).multiply(parentWorldRotation).premultiply(invParentWorldRotation).multiply(boneRotation);
					if (boneName === "hips") {
						const boneWorldPosition = rigBoneNode.getWorldPosition(_boneWorldPos);
						boneNode.parent.updateWorldMatrix(true, false);
						const parentWorldMatrix = boneNode.parent.matrixWorld;
						const localPosition = boneWorldPosition.applyMatrix4(parentWorldMatrix.invert());
						boneNode.position.copy(localPosition);
					}
				}
			});
		}
	};
	var VRMHumanoid = class _VRMHumanoid {
		/**
		* @deprecated Deprecated. Use either {@link rawRestPose} or {@link normalizedRestPose} instead.
		*/
		get restPose() {
			console.warn("VRMHumanoid: restPose is deprecated. Use either rawRestPose or normalizedRestPose instead.");
			return this.rawRestPose;
		}
		/**
		* A {@link VRMPose} of its raw human bones that is its default state.
		* Note that it's not compatible with {@link setRawPose} and {@link getRawPose}, since it contains non-relative values of each local transforms.
		*/
		get rawRestPose() {
			return this._rawHumanBones.restPose;
		}
		/**
		* A {@link VRMPose} of its normalized human bones that is its default state.
		* Note that it's not compatible with {@link setNormalizedPose} and {@link getNormalizedPose}, since it contains non-relative values of each local transforms.
		*/
		get normalizedRestPose() {
			return this._normalizedHumanBones.restPose;
		}
		/**
		* A map from {@link VRMHumanBoneName} to raw {@link VRMHumanBone}s.
		*/
		get humanBones() {
			return this._rawHumanBones.humanBones;
		}
		/**
		* A map from {@link VRMHumanBoneName} to raw {@link VRMHumanBone}s.
		*/
		get rawHumanBones() {
			return this._rawHumanBones.humanBones;
		}
		/**
		* A map from {@link VRMHumanBoneName} to normalized {@link VRMHumanBone}s.
		*/
		get normalizedHumanBones() {
			return this._normalizedHumanBones.humanBones;
		}
		/**
		* The root of normalized {@link VRMHumanBone}s.
		*/
		get normalizedHumanBonesRoot() {
			return this._normalizedHumanBones.root;
		}
		/**
		* Create a new {@link VRMHumanoid}.
		* @param humanBones A {@link VRMHumanBones} contains all the bones of the new humanoid
		* @param autoUpdateHumanBones Whether it copies pose from normalizedHumanBones to rawHumanBones on {@link update}. `true` by default.
		*/
		constructor(humanBones, options) {
			var _a;
			this.autoUpdateHumanBones = (_a = options == null ? void 0 : options.autoUpdateHumanBones) != null ? _a : true;
			this._rawHumanBones = new VRMRig(humanBones);
			this._normalizedHumanBones = new VRMHumanoidRig(this._rawHumanBones);
		}
		/**
		* Copy the given {@link VRMHumanoid} into this one.
		* @param source The {@link VRMHumanoid} you want to copy
		* @returns this
		*/
		copy(source) {
			this.autoUpdateHumanBones = source.autoUpdateHumanBones;
			this._rawHumanBones = new VRMRig(source.humanBones);
			this._normalizedHumanBones = new VRMHumanoidRig(this._rawHumanBones);
			return this;
		}
		/**
		* Returns a clone of this {@link VRMHumanoid}.
		* @returns Copied {@link VRMHumanoid}
		*/
		clone() {
			return new _VRMHumanoid(this.humanBones, { autoUpdateHumanBones: this.autoUpdateHumanBones }).copy(this);
		}
		/**
		* @deprecated Deprecated. Use either {@link getRawAbsolutePose} or {@link getNormalizedAbsolutePose} instead.
		*/
		getAbsolutePose() {
			console.warn("VRMHumanoid: getAbsolutePose() is deprecated. Use either getRawAbsolutePose() or getNormalizedAbsolutePose() instead.");
			return this.getRawAbsolutePose();
		}
		/**
		* Return the current absolute pose of this raw human bones as a {@link VRMPose}.
		* Note that the output result will contain initial state of the VRM and not compatible between different models.
		* You might want to use {@link getRawPose} instead.
		*/
		getRawAbsolutePose() {
			return this._rawHumanBones.getAbsolutePose();
		}
		/**
		* Return the current absolute pose of this normalized human bones as a {@link VRMPose}.
		* Note that the output result will contain initial state of the VRM and not compatible between different models.
		* You might want to use {@link getNormalizedPose} instead.
		*/
		getNormalizedAbsolutePose() {
			return this._normalizedHumanBones.getAbsolutePose();
		}
		/**
		* @deprecated Deprecated. Use either {@link getRawPose} or {@link getNormalizedPose} instead.
		*/
		getPose() {
			console.warn("VRMHumanoid: getPose() is deprecated. Use either getRawPose() or getNormalizedPose() instead.");
			return this.getRawPose();
		}
		/**
		* Return the current pose of raw human bones as a {@link VRMPose}.
		*
		* Each transform is a local transform relative from rest pose (T-pose).
		*/
		getRawPose() {
			return this._rawHumanBones.getPose();
		}
		/**
		* Return the current pose of normalized human bones as a {@link VRMPose}.
		*
		* Each transform is a local transform relative from rest pose (T-pose).
		*/
		getNormalizedPose() {
			return this._normalizedHumanBones.getPose();
		}
		/**
		* @deprecated Deprecated. Use either {@link setRawPose} or {@link setNormalizedPose} instead.
		*/
		setPose(poseObject) {
			console.warn("VRMHumanoid: setPose() is deprecated. Use either setRawPose() or setNormalizedPose() instead.");
			return this.setRawPose(poseObject);
		}
		/**
		* Let the raw human bones do a specified pose.
		*
		* Each transform have to be a local transform relative from rest pose (T-pose).
		* You can pass what you got from {@link getRawPose}.
		*
		* If you are using {@link autoUpdateHumanBones}, you might want to use {@link setNormalizedPose} instead.
		*
		* @param poseObject A {@link VRMPose} that represents a single pose
		*/
		setRawPose(poseObject) {
			return this._rawHumanBones.setPose(poseObject);
		}
		/**
		* Let the normalized human bones do a specified pose.
		*
		* Each transform have to be a local transform relative from rest pose (T-pose).
		* You can pass what you got from {@link getNormalizedPose}.
		*
		* @param poseObject A {@link VRMPose} that represents a single pose
		*/
		setNormalizedPose(poseObject) {
			return this._normalizedHumanBones.setPose(poseObject);
		}
		/**
		* @deprecated Deprecated. Use either {@link resetRawPose} or {@link resetNormalizedPose} instead.
		*/
		resetPose() {
			console.warn("VRMHumanoid: resetPose() is deprecated. Use either resetRawPose() or resetNormalizedPose() instead.");
			return this.resetRawPose();
		}
		/**
		* Reset the raw humanoid to its rest pose.
		*
		* If you are using {@link autoUpdateHumanBones}, you might want to use {@link resetNormalizedPose} instead.
		*/
		resetRawPose() {
			return this._rawHumanBones.resetPose();
		}
		/**
		* Reset the normalized humanoid to its rest pose.
		*/
		resetNormalizedPose() {
			return this._normalizedHumanBones.resetPose();
		}
		/**
		* @deprecated Deprecated. Use either {@link getRawBone} or {@link getNormalizedBone} instead.
		*/
		getBone(name) {
			console.warn("VRMHumanoid: getBone() is deprecated. Use either getRawBone() or getNormalizedBone() instead.");
			return this.getRawBone(name);
		}
		/**
		* Return a raw {@link VRMHumanBone} bound to a specified {@link VRMHumanBoneName}.
		*
		* @param name Name of the bone you want
		*/
		getRawBone(name) {
			return this._rawHumanBones.getBone(name);
		}
		/**
		* Return a normalized {@link VRMHumanBone} bound to a specified {@link VRMHumanBoneName}.
		*
		* @param name Name of the bone you want
		*/
		getNormalizedBone(name) {
			return this._normalizedHumanBones.getBone(name);
		}
		/**
		* @deprecated Deprecated. Use either {@link getRawBoneNode} or {@link getNormalizedBoneNode} instead.
		*/
		getBoneNode(name) {
			console.warn("VRMHumanoid: getBoneNode() is deprecated. Use either getRawBoneNode() or getNormalizedBoneNode() instead.");
			return this.getRawBoneNode(name);
		}
		/**
		* Return a raw bone as a `THREE.Object3D` bound to a specified {@link VRMHumanBoneName}.
		*
		* @param name Name of the bone you want
		*/
		getRawBoneNode(name) {
			return this._rawHumanBones.getBoneNode(name);
		}
		/**
		* Return a normalized bone as a `THREE.Object3D` bound to a specified {@link VRMHumanBoneName}.
		*
		* @param name Name of the bone you want
		*/
		getNormalizedBoneNode(name) {
			return this._normalizedHumanBones.getBoneNode(name);
		}
		/**
		* Update the humanoid component.
		*
		* If {@link autoUpdateHumanBones} is `true`, it transfers the pose of normalized human bones to raw human bones.
		*/
		update() {
			if (this.autoUpdateHumanBones) this._normalizedHumanBones.update();
		}
	};
	var VRMRequiredHumanBoneName = {
		Hips: "hips",
		Spine: "spine",
		Head: "head",
		LeftUpperLeg: "leftUpperLeg",
		LeftLowerLeg: "leftLowerLeg",
		LeftFoot: "leftFoot",
		RightUpperLeg: "rightUpperLeg",
		RightLowerLeg: "rightLowerLeg",
		RightFoot: "rightFoot",
		LeftUpperArm: "leftUpperArm",
		LeftLowerArm: "leftLowerArm",
		LeftHand: "leftHand",
		RightUpperArm: "rightUpperArm",
		RightLowerArm: "rightLowerArm",
		RightHand: "rightHand"
	};
	var POSSIBLE_SPEC_VERSIONS3 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var thumbBoneNameMap = {
		leftThumbProximal: "leftThumbMetacarpal",
		leftThumbIntermediate: "leftThumbProximal",
		rightThumbProximal: "rightThumbMetacarpal",
		rightThumbIntermediate: "rightThumbProximal"
	};
	var VRMHumanoidLoaderPlugin = class {
		get name() {
			return "VRMHumanoidLoaderPlugin";
		}
		constructor(parser, options) {
			this.parser = parser;
			this.helperRoot = options == null ? void 0 : options.helperRoot;
			this.autoUpdateHumanBones = options == null ? void 0 : options.autoUpdateHumanBones;
		}
		afterRoot(gltf) {
			return __async2(this, null, function* () {
				gltf.userData.vrmHumanoid = yield this._import(gltf);
			});
		}
		/**
		* Import a {@link VRMHumanoid} from a VRM.
		*
		* @param gltf A parsed result of GLTF taken from GLTFLoader
		*/
		_import(gltf) {
			return __async2(this, null, function* () {
				const v1Result = yield this._v1Import(gltf);
				if (v1Result) return v1Result;
				const v0Result = yield this._v0Import(gltf);
				if (v0Result) return v0Result;
				return null;
			});
		}
		_v1Import(gltf) {
			return __async2(this, null, function* () {
				var _a, _b;
				const json = this.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf("VRMC_vrm")) !== -1)) return null;
				const extension = (_b = json.extensions) == null ? void 0 : _b["VRMC_vrm"];
				if (!extension) return null;
				const specVersion = extension.specVersion;
				if (!POSSIBLE_SPEC_VERSIONS3.has(specVersion)) {
					console.warn(`VRMHumanoidLoaderPlugin: Unknown VRMC_vrm specVersion "${specVersion}"`);
					return null;
				}
				const schemaHumanoid = extension.humanoid;
				if (!schemaHumanoid) return null;
				const existsPreviousThumbName = schemaHumanoid.humanBones.leftThumbIntermediate != null || schemaHumanoid.humanBones.rightThumbIntermediate != null;
				const humanBones = {};
				if (schemaHumanoid.humanBones != null) yield Promise.all(Object.entries(schemaHumanoid.humanBones).map((_0) => __async2(this, [_0], function* ([boneNameString, schemaHumanBone]) {
					let boneName = boneNameString;
					const index = schemaHumanBone.node;
					if (existsPreviousThumbName) {
						const thumbBoneName = thumbBoneNameMap[boneName];
						if (thumbBoneName != null) boneName = thumbBoneName;
					}
					const node = yield this.parser.getDependency("node", index);
					if (node == null) {
						console.warn(`A glTF node bound to the humanoid bone ${boneName} (index = ${index}) does not exist`);
						return;
					}
					humanBones[boneName] = { node };
				})));
				const humanoid = new VRMHumanoid(this._ensureRequiredBonesExist(humanBones), { autoUpdateHumanBones: this.autoUpdateHumanBones });
				gltf.scene.add(humanoid.normalizedHumanBonesRoot);
				if (this.helperRoot) {
					const helper = new VRMHumanoidHelper(humanoid);
					this.helperRoot.add(helper);
					helper.renderOrder = this.helperRoot.renderOrder;
				}
				return humanoid;
			});
		}
		_v0Import(gltf) {
			return __async2(this, null, function* () {
				var _a;
				const vrmExt = (_a = this.parser.json.extensions) == null ? void 0 : _a.VRM;
				if (!vrmExt) return null;
				const schemaHumanoid = vrmExt.humanoid;
				if (!schemaHumanoid) return null;
				const humanBones = {};
				if (schemaHumanoid.humanBones != null) yield Promise.all(schemaHumanoid.humanBones.map((bone) => __async2(this, null, function* () {
					const boneName = bone.bone;
					const index = bone.node;
					if (boneName == null || index == null) return;
					if (index < 0) {
						console.warn(`A glTF node index for the humanoid bone ${boneName} is negative (${index}), ignoring this bone.`);
						return;
					}
					const node = yield this.parser.getDependency("node", index);
					if (node == null) {
						console.warn(`A glTF node bound to the humanoid bone ${boneName} (index = ${index}) does not exist`);
						return;
					}
					const thumbBoneName = thumbBoneNameMap[boneName];
					const newBoneName = thumbBoneName != null ? thumbBoneName : boneName;
					if (humanBones[newBoneName] != null) {
						console.warn(`Multiple bone entries for ${newBoneName} detected (index = ${index}), ignoring duplicated entries.`);
						return;
					}
					humanBones[newBoneName] = { node };
				})));
				const humanoid = new VRMHumanoid(this._ensureRequiredBonesExist(humanBones), { autoUpdateHumanBones: this.autoUpdateHumanBones });
				gltf.scene.add(humanoid.normalizedHumanBonesRoot);
				if (this.helperRoot) {
					const helper = new VRMHumanoidHelper(humanoid);
					this.helperRoot.add(helper);
					helper.renderOrder = this.helperRoot.renderOrder;
				}
				return humanoid;
			});
		}
		/**
		* Ensure required bones exist in given human bones.
		* @param humanBones Human bones
		* @returns Human bones, no longer partial!
		*/
		_ensureRequiredBonesExist(humanBones) {
			const missingRequiredBones = Object.values(VRMRequiredHumanBoneName).filter((requiredBoneName) => humanBones[requiredBoneName] == null);
			if (missingRequiredBones.length > 0) throw new Error(`VRMHumanoidLoaderPlugin: These humanoid bones are required but not exist: ${missingRequiredBones.join(", ")}`);
			return humanBones;
		}
	};
	var FanBufferGeometry = class extends THREE9.BufferGeometry {
		constructor() {
			super();
			this._currentTheta = 0;
			this._currentRadius = 0;
			this.theta = 0;
			this.radius = 0;
			this._currentTheta = 0;
			this._currentRadius = 0;
			this._attrPos = new THREE9.BufferAttribute(/* @__PURE__ */ new Float32Array(195), 3);
			this.setAttribute("position", this._attrPos);
			this._attrIndex = new THREE9.BufferAttribute(/* @__PURE__ */ new Uint16Array(189), 1);
			this.setIndex(this._attrIndex);
			this._buildIndex();
			this.update();
		}
		update() {
			let shouldUpdateGeometry = false;
			if (this._currentTheta !== this.theta) {
				this._currentTheta = this.theta;
				shouldUpdateGeometry = true;
			}
			if (this._currentRadius !== this.radius) {
				this._currentRadius = this.radius;
				shouldUpdateGeometry = true;
			}
			if (shouldUpdateGeometry) this._buildPosition();
		}
		_buildPosition() {
			this._attrPos.setXYZ(0, 0, 0, 0);
			for (let i = 0; i < 64; i++) {
				const t = i / 63 * this._currentTheta;
				this._attrPos.setXYZ(i + 1, this._currentRadius * Math.sin(t), 0, this._currentRadius * Math.cos(t));
			}
			this._attrPos.needsUpdate = true;
		}
		_buildIndex() {
			for (let i = 0; i < 63; i++) this._attrIndex.setXYZ(i * 3, 0, i + 1, i + 2);
			this._attrIndex.needsUpdate = true;
		}
	};
	var LineAndSphereBufferGeometry = class extends THREE10.BufferGeometry {
		constructor() {
			super();
			this.radius = 0;
			this._currentRadius = 0;
			this.tail = new THREE10.Vector3();
			this._currentTail = new THREE10.Vector3();
			this._attrPos = new THREE10.BufferAttribute(/* @__PURE__ */ new Float32Array(294), 3);
			this.setAttribute("position", this._attrPos);
			this._attrIndex = new THREE10.BufferAttribute(/* @__PURE__ */ new Uint16Array(194), 1);
			this.setIndex(this._attrIndex);
			this._buildIndex();
			this.update();
		}
		update() {
			let shouldUpdateGeometry = false;
			if (this._currentRadius !== this.radius) {
				this._currentRadius = this.radius;
				shouldUpdateGeometry = true;
			}
			if (!this._currentTail.equals(this.tail)) {
				this._currentTail.copy(this.tail);
				shouldUpdateGeometry = true;
			}
			if (shouldUpdateGeometry) this._buildPosition();
		}
		_buildPosition() {
			for (let i = 0; i < 32; i++) {
				const t = i / 16 * Math.PI;
				this._attrPos.setXYZ(i, Math.cos(t), Math.sin(t), 0);
				this._attrPos.setXYZ(32 + i, 0, Math.cos(t), Math.sin(t));
				this._attrPos.setXYZ(64 + i, Math.sin(t), 0, Math.cos(t));
			}
			this.scale(this._currentRadius, this._currentRadius, this._currentRadius);
			this.translate(this._currentTail.x, this._currentTail.y, this._currentTail.z);
			this._attrPos.setXYZ(96, 0, 0, 0);
			this._attrPos.setXYZ(97, this._currentTail.x, this._currentTail.y, this._currentTail.z);
			this._attrPos.needsUpdate = true;
		}
		_buildIndex() {
			for (let i = 0; i < 32; i++) {
				const i1 = (i + 1) % 32;
				this._attrIndex.setXY(i * 2, i, i1);
				this._attrIndex.setXY(64 + i * 2, 32 + i, 32 + i1);
				this._attrIndex.setXY(128 + i * 2, 64 + i, 64 + i1);
			}
			this._attrIndex.setXY(192, 96, 97);
			this._attrIndex.needsUpdate = true;
		}
	};
	var _quatA4 = new THREE11.Quaternion();
	var _quatB = new THREE11.Quaternion();
	var _v3A4 = new THREE11.Vector3();
	var _v3B2 = new THREE11.Vector3();
	var SQRT_2_OVER_2 = Math.sqrt(2) / 2;
	var QUAT_XY_CW90 = new THREE11.Quaternion(0, 0, -SQRT_2_OVER_2, SQRT_2_OVER_2);
	var VEC3_POSITIVE_Y = new THREE11.Vector3(0, 1, 0);
	var VRMLookAtHelper = class extends THREE11.Group {
		constructor(lookAt) {
			super();
			this.matrixAutoUpdate = false;
			this.vrmLookAt = lookAt;
			{
				const geometry = new FanBufferGeometry();
				geometry.radius = .5;
				const material = new THREE11.MeshBasicMaterial({
					color: 65280,
					transparent: true,
					opacity: .5,
					side: THREE11.DoubleSide,
					depthTest: false,
					depthWrite: false
				});
				this._meshPitch = new THREE11.Mesh(geometry, material);
				this.add(this._meshPitch);
			}
			{
				const geometry = new FanBufferGeometry();
				geometry.radius = .5;
				const material = new THREE11.MeshBasicMaterial({
					color: 16711680,
					transparent: true,
					opacity: .5,
					side: THREE11.DoubleSide,
					depthTest: false,
					depthWrite: false
				});
				this._meshYaw = new THREE11.Mesh(geometry, material);
				this.add(this._meshYaw);
			}
			{
				const geometry = new LineAndSphereBufferGeometry();
				geometry.radius = .1;
				const material = new THREE11.LineBasicMaterial({
					color: 16777215,
					depthTest: false,
					depthWrite: false
				});
				this._lineTarget = new THREE11.LineSegments(geometry, material);
				this._lineTarget.frustumCulled = false;
				this.add(this._lineTarget);
			}
		}
		dispose() {
			this._meshYaw.geometry.dispose();
			this._meshYaw.material.dispose();
			this._meshPitch.geometry.dispose();
			this._meshPitch.material.dispose();
			this._lineTarget.geometry.dispose();
			this._lineTarget.material.dispose();
		}
		updateMatrixWorld(force) {
			const yaw = THREE11.MathUtils.DEG2RAD * this.vrmLookAt.yaw;
			this._meshYaw.geometry.theta = yaw;
			this._meshYaw.geometry.update();
			const pitch = THREE11.MathUtils.DEG2RAD * this.vrmLookAt.pitch;
			this._meshPitch.geometry.theta = pitch;
			this._meshPitch.geometry.update();
			this.vrmLookAt.getLookAtWorldPosition(_v3A4);
			this.vrmLookAt.getLookAtWorldQuaternion(_quatA4);
			_quatA4.multiply(this.vrmLookAt.getFaceFrontQuaternion(_quatB));
			this._meshYaw.position.copy(_v3A4);
			this._meshYaw.quaternion.copy(_quatA4);
			this._meshPitch.position.copy(_v3A4);
			this._meshPitch.quaternion.copy(_quatA4);
			this._meshPitch.quaternion.multiply(_quatB.setFromAxisAngle(VEC3_POSITIVE_Y, yaw));
			this._meshPitch.quaternion.multiply(QUAT_XY_CW90);
			const { target, autoUpdate } = this.vrmLookAt;
			if (target != null && autoUpdate) {
				target.getWorldPosition(_v3B2).sub(_v3A4);
				this._lineTarget.geometry.tail.copy(_v3B2);
				this._lineTarget.geometry.update();
				this._lineTarget.position.copy(_v3A4);
			}
			super.updateMatrixWorld(force);
		}
	};
	var _position = new THREE12.Vector3();
	var _scale = new THREE12.Vector3();
	function getWorldQuaternionLite(object, out) {
		object.matrixWorld.decompose(_position, out, _scale);
		return out;
	}
	function calcAzimuthAltitude(vector) {
		return [Math.atan2(-vector.z, vector.x), Math.atan2(vector.y, Math.sqrt(vector.x * vector.x + vector.z * vector.z))];
	}
	function sanitizeAngle(angle) {
		const roundTurn = Math.round(angle / 2 / Math.PI);
		return angle - 2 * Math.PI * roundTurn;
	}
	var VEC3_POSITIVE_Z = new THREE13.Vector3(0, 0, 1);
	var _v3A5 = new THREE13.Vector3();
	var _v3B3 = new THREE13.Vector3();
	var _v3C = new THREE13.Vector3();
	var _quatA5 = new THREE13.Quaternion();
	var _quatB2 = new THREE13.Quaternion();
	var _quatC = new THREE13.Quaternion();
	var _quatD = new THREE13.Quaternion();
	var _eulerA = new THREE13.Euler();
	var _VRMLookAt = class _VRMLookAt2 {
		/**
		* Create a new {@link VRMLookAt}.
		*
		* @param humanoid A {@link VRMHumanoid}
		* @param applier A {@link VRMLookAtApplier}
		*/
		constructor(humanoid, applier) {
			this.offsetFromHeadBone = new THREE13.Vector3();
			this.autoUpdate = true;
			this.faceFront = new THREE13.Vector3(0, 0, 1);
			this.humanoid = humanoid;
			this.applier = applier;
			this._yaw = 0;
			this._pitch = 0;
			this._needsUpdate = true;
			this._restHeadWorldQuaternion = this.getLookAtWorldQuaternion(new THREE13.Quaternion());
		}
		/**
		* Its current angle around Y axis, in degree.
		*/
		get yaw() {
			return this._yaw;
		}
		/**
		* Its current angle around Y axis, in degree.
		*/
		set yaw(value) {
			this._yaw = value;
			this._needsUpdate = true;
		}
		/**
		* Its current angle around X axis, in degree.
		*/
		get pitch() {
			return this._pitch;
		}
		/**
		* Its current angle around X axis, in degree.
		*/
		set pitch(value) {
			this._pitch = value;
			this._needsUpdate = true;
		}
		/**
		* @deprecated Use {@link getEuler} instead.
		*/
		get euler() {
			console.warn("VRMLookAt: euler is deprecated. use getEuler() instead.");
			return this.getEuler(new THREE13.Euler());
		}
		/**
		* Get its yaw-pitch angles as an `Euler`.
		* Does NOT consider {@link faceFront}; it returns `Euler(0, 0, 0; "YXZ")` by default regardless of the faceFront value.
		*
		* @param target The target euler
		*/
		getEuler(target) {
			return target.set(THREE13.MathUtils.DEG2RAD * this._pitch, THREE13.MathUtils.DEG2RAD * this._yaw, 0, "YXZ");
		}
		/**
		* Copy the given {@link VRMLookAt} into this one.
		* {@link humanoid} must be same as the source one.
		* {@link applier} will reference the same instance as the source one.
		* @param source The {@link VRMLookAt} you want to copy
		* @returns this
		*/
		copy(source) {
			if (this.humanoid !== source.humanoid) throw new Error("VRMLookAt: humanoid must be same in order to copy");
			this.offsetFromHeadBone.copy(source.offsetFromHeadBone);
			this.applier = source.applier;
			this.autoUpdate = source.autoUpdate;
			this.target = source.target;
			this.faceFront.copy(source.faceFront);
			return this;
		}
		/**
		* Returns a clone of this {@link VRMLookAt}.
		* Note that {@link humanoid} and {@link applier} will reference the same instance as this one.
		* @returns Copied {@link VRMLookAt}
		*/
		clone() {
			return new _VRMLookAt2(this.humanoid, this.applier).copy(this);
		}
		/**
		* Reset the lookAt direction (yaw and pitch) to the initial direction.
		*/
		reset() {
			this._yaw = 0;
			this._pitch = 0;
			this._needsUpdate = true;
		}
		/**
		* Get its lookAt position in world coordinate.
		*
		* @param target A target `THREE.Vector3`
		*/
		getLookAtWorldPosition(target) {
			const head = this.humanoid.getRawBoneNode("head");
			return target.copy(this.offsetFromHeadBone).applyMatrix4(head.matrixWorld);
		}
		/**
		* Get its lookAt rotation in world coordinate.
		* Does NOT consider {@link faceFront}.
		*
		* @param target A target `THREE.Quaternion`
		*/
		getLookAtWorldQuaternion(target) {
			return getWorldQuaternionLite(this.humanoid.getRawBoneNode("head"), target);
		}
		/**
		* Get a quaternion that rotates the +Z unit vector of the humanoid Head to the {@link faceFront} direction.
		*
		* @param target A target `THREE.Quaternion`
		*/
		getFaceFrontQuaternion(target) {
			if (this.faceFront.distanceToSquared(VEC3_POSITIVE_Z) < .01) return target.copy(this._restHeadWorldQuaternion).invert();
			const [faceFrontAzimuth, faceFrontAltitude] = calcAzimuthAltitude(this.faceFront);
			_eulerA.set(0, .5 * Math.PI + faceFrontAzimuth, faceFrontAltitude, "YZX");
			return target.setFromEuler(_eulerA).premultiply(_quatD.copy(this._restHeadWorldQuaternion).invert());
		}
		/**
		* Get its LookAt direction in world coordinate.
		*
		* @param target A target `THREE.Vector3`
		*/
		getLookAtWorldDirection(target) {
			this.getLookAtWorldQuaternion(_quatB2);
			this.getFaceFrontQuaternion(_quatC);
			return target.copy(VEC3_POSITIVE_Z).applyQuaternion(_quatB2).applyQuaternion(_quatC).applyEuler(this.getEuler(_eulerA));
		}
		/**
		* Set its lookAt target position.
		*
		* Note that its result will be instantly overwritten if {@link VRMLookAtHead.autoUpdate} is enabled.
		*
		* If you want to track an object continuously, you might want to use {@link target} instead.
		*
		* @param position A target position, in world space
		*/
		lookAt(position) {
			const headRotDiffInv = _quatA5.copy(this._restHeadWorldQuaternion).multiply(quatInvertCompat(this.getLookAtWorldQuaternion(_quatB2)));
			const headPos = this.getLookAtWorldPosition(_v3B3);
			const lookAtDir = _v3C.copy(position).sub(headPos).applyQuaternion(headRotDiffInv).normalize();
			const [azimuthFrom, altitudeFrom] = calcAzimuthAltitude(this.faceFront);
			const [azimuthTo, altitudeTo] = calcAzimuthAltitude(lookAtDir);
			const yaw = sanitizeAngle(azimuthTo - azimuthFrom);
			const pitch = sanitizeAngle(altitudeFrom - altitudeTo);
			this._yaw = THREE13.MathUtils.RAD2DEG * yaw;
			this._pitch = THREE13.MathUtils.RAD2DEG * pitch;
			this._needsUpdate = true;
		}
		/**
		* Update the VRMLookAtHead.
		* If {@link autoUpdate} is enabled, this will make it look at the {@link target}.
		*
		* @param delta deltaTime, it isn't used though. You can use the parameter if you want to use this in your own extended {@link VRMLookAt}.
		*/
		update(delta) {
			if (this.target != null && this.autoUpdate) this.lookAt(this.target.getWorldPosition(_v3A5));
			if (this._needsUpdate) {
				this._needsUpdate = false;
				this.applier.applyYawPitch(this._yaw, this._pitch);
			}
		}
	};
	_VRMLookAt.EULER_ORDER = "YXZ";
	var VRMLookAt = _VRMLookAt;
	var VEC3_POSITIVE_Z2 = new THREE14.Vector3(0, 0, 1);
	var _quatA6 = new THREE14.Quaternion();
	var _quatB3 = new THREE14.Quaternion();
	var _eulerA2 = new THREE14.Euler(0, 0, 0, "YXZ");
	var VRMLookAtBoneApplier = class {
		/**
		* Create a new {@link VRMLookAtBoneApplier}.
		*
		* @param humanoid A {@link VRMHumanoid}
		* @param rangeMapHorizontalInner A {@link VRMLookAtRangeMap} used for inner transverse direction
		* @param rangeMapHorizontalOuter A {@link VRMLookAtRangeMap} used for outer transverse direction
		* @param rangeMapVerticalDown A {@link VRMLookAtRangeMap} used for down direction
		* @param rangeMapVerticalUp A {@link VRMLookAtRangeMap} used for up direction
		*/
		constructor(humanoid, rangeMapHorizontalInner, rangeMapHorizontalOuter, rangeMapVerticalDown, rangeMapVerticalUp) {
			this.humanoid = humanoid;
			this.rangeMapHorizontalInner = rangeMapHorizontalInner;
			this.rangeMapHorizontalOuter = rangeMapHorizontalOuter;
			this.rangeMapVerticalDown = rangeMapVerticalDown;
			this.rangeMapVerticalUp = rangeMapVerticalUp;
			this.faceFront = new THREE14.Vector3(0, 0, 1);
			this._restQuatLeftEye = new THREE14.Quaternion();
			this._restQuatRightEye = new THREE14.Quaternion();
			this._restLeftEyeParentWorldQuat = new THREE14.Quaternion();
			this._restRightEyeParentWorldQuat = new THREE14.Quaternion();
			const leftEye = this.humanoid.getRawBoneNode("leftEye");
			const rightEye = this.humanoid.getRawBoneNode("rightEye");
			if (leftEye) {
				this._restQuatLeftEye.copy(leftEye.quaternion);
				getWorldQuaternionLite(leftEye.parent, this._restLeftEyeParentWorldQuat);
			}
			if (rightEye) {
				this._restQuatRightEye.copy(rightEye.quaternion);
				getWorldQuaternionLite(rightEye.parent, this._restRightEyeParentWorldQuat);
			}
		}
		/**
		* Apply the input angle to its associated VRM model.
		*
		* @param yaw Rotation around Y axis, in degree
		* @param pitch Rotation around X axis, in degree
		*/
		applyYawPitch(yaw, pitch) {
			const leftEye = this.humanoid.getRawBoneNode("leftEye");
			const rightEye = this.humanoid.getRawBoneNode("rightEye");
			const leftEyeNormalized = this.humanoid.getNormalizedBoneNode("leftEye");
			const rightEyeNormalized = this.humanoid.getNormalizedBoneNode("rightEye");
			if (leftEye) {
				if (pitch < 0) _eulerA2.x = -THREE14.MathUtils.DEG2RAD * this.rangeMapVerticalDown.map(-pitch);
				else _eulerA2.x = THREE14.MathUtils.DEG2RAD * this.rangeMapVerticalUp.map(pitch);
				if (yaw < 0) _eulerA2.y = -THREE14.MathUtils.DEG2RAD * this.rangeMapHorizontalInner.map(-yaw);
				else _eulerA2.y = THREE14.MathUtils.DEG2RAD * this.rangeMapHorizontalOuter.map(yaw);
				_quatA6.setFromEuler(_eulerA2);
				this._getWorldFaceFrontQuat(_quatB3);
				leftEyeNormalized.quaternion.copy(_quatB3).multiply(_quatA6).multiply(_quatB3.invert());
				_quatA6.copy(this._restLeftEyeParentWorldQuat);
				leftEye.quaternion.copy(leftEyeNormalized.quaternion).multiply(_quatA6).premultiply(_quatA6.invert()).multiply(this._restQuatLeftEye);
			}
			if (rightEye) {
				if (pitch < 0) _eulerA2.x = -THREE14.MathUtils.DEG2RAD * this.rangeMapVerticalDown.map(-pitch);
				else _eulerA2.x = THREE14.MathUtils.DEG2RAD * this.rangeMapVerticalUp.map(pitch);
				if (yaw < 0) _eulerA2.y = -THREE14.MathUtils.DEG2RAD * this.rangeMapHorizontalOuter.map(-yaw);
				else _eulerA2.y = THREE14.MathUtils.DEG2RAD * this.rangeMapHorizontalInner.map(yaw);
				_quatA6.setFromEuler(_eulerA2);
				this._getWorldFaceFrontQuat(_quatB3);
				rightEyeNormalized.quaternion.copy(_quatB3).multiply(_quatA6).multiply(_quatB3.invert());
				_quatA6.copy(this._restRightEyeParentWorldQuat);
				rightEye.quaternion.copy(rightEyeNormalized.quaternion).multiply(_quatA6).premultiply(_quatA6.invert()).multiply(this._restQuatRightEye);
			}
		}
		/**
		* @deprecated Use {@link applyYawPitch} instead.
		*/
		lookAt(euler) {
			console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");
			const yaw = THREE14.MathUtils.RAD2DEG * euler.y;
			const pitch = THREE14.MathUtils.RAD2DEG * euler.x;
			this.applyYawPitch(yaw, pitch);
		}
		/**
		* Get a quaternion that rotates the world-space +Z unit vector to the {@link faceFront} direction.
		*
		* @param target A target `THREE.Quaternion`
		*/
		_getWorldFaceFrontQuat(target) {
			if (this.faceFront.distanceToSquared(VEC3_POSITIVE_Z2) < .01) return target.identity();
			const [faceFrontAzimuth, faceFrontAltitude] = calcAzimuthAltitude(this.faceFront);
			_eulerA2.set(0, .5 * Math.PI + faceFrontAzimuth, faceFrontAltitude, "YZX");
			return target.setFromEuler(_eulerA2);
		}
	};
	VRMLookAtBoneApplier.type = "bone";
	var VRMLookAtExpressionApplier = class {
		/**
		* Create a new {@link VRMLookAtExpressionApplier}.
		*
		* @param expressions A {@link VRMExpressionManager}
		* @param rangeMapHorizontalInner A {@link VRMLookAtRangeMap} used for inner transverse direction
		* @param rangeMapHorizontalOuter A {@link VRMLookAtRangeMap} used for outer transverse direction
		* @param rangeMapVerticalDown A {@link VRMLookAtRangeMap} used for down direction
		* @param rangeMapVerticalUp A {@link VRMLookAtRangeMap} used for up direction
		*/
		constructor(expressions, rangeMapHorizontalInner, rangeMapHorizontalOuter, rangeMapVerticalDown, rangeMapVerticalUp) {
			this.expressions = expressions;
			this.rangeMapHorizontalInner = rangeMapHorizontalInner;
			this.rangeMapHorizontalOuter = rangeMapHorizontalOuter;
			this.rangeMapVerticalDown = rangeMapVerticalDown;
			this.rangeMapVerticalUp = rangeMapVerticalUp;
		}
		/**
		* Apply the input angle to its associated VRM model.
		*
		* @param yaw Rotation around Y axis, in degree
		* @param pitch Rotation around X axis, in degree
		*/
		applyYawPitch(yaw, pitch) {
			if (pitch < 0) {
				this.expressions.setValue("lookDown", 0);
				this.expressions.setValue("lookUp", this.rangeMapVerticalUp.map(-pitch));
			} else {
				this.expressions.setValue("lookUp", 0);
				this.expressions.setValue("lookDown", this.rangeMapVerticalDown.map(pitch));
			}
			if (yaw < 0) {
				this.expressions.setValue("lookLeft", 0);
				this.expressions.setValue("lookRight", this.rangeMapHorizontalOuter.map(-yaw));
			} else {
				this.expressions.setValue("lookRight", 0);
				this.expressions.setValue("lookLeft", this.rangeMapHorizontalOuter.map(yaw));
			}
		}
		/**
		* @deprecated Use {@link applyYawPitch} instead.
		*/
		lookAt(euler) {
			console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");
			const yaw = THREE15.MathUtils.RAD2DEG * euler.y;
			const pitch = THREE15.MathUtils.RAD2DEG * euler.x;
			this.applyYawPitch(yaw, pitch);
		}
	};
	VRMLookAtExpressionApplier.type = "expression";
	var VRMLookAtRangeMap = class {
		/**
		* Create a new {@link VRMLookAtRangeMap}.
		*
		* @param inputMaxValue The {@link inputMaxValue} of the map
		* @param outputScale The {@link outputScale} of the map
		*/
		constructor(inputMaxValue, outputScale) {
			this.inputMaxValue = inputMaxValue;
			this.outputScale = outputScale;
		}
		/**
		* Evaluate an input value and output a mapped value.
		* @param src The input value
		*/
		map(src) {
			return this.outputScale * saturate(src / this.inputMaxValue);
		}
	};
	var POSSIBLE_SPEC_VERSIONS4 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var INPUT_MAX_VALUE_MINIMUM = .01;
	var VRMLookAtLoaderPlugin = class {
		get name() {
			return "VRMLookAtLoaderPlugin";
		}
		constructor(parser, options) {
			this.parser = parser;
			this.helperRoot = options == null ? void 0 : options.helperRoot;
		}
		afterRoot(gltf) {
			return __async2(this, null, function* () {
				const vrmHumanoid = gltf.userData.vrmHumanoid;
				if (vrmHumanoid === null) return;
				else if (vrmHumanoid === void 0) throw new Error("VRMLookAtLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");
				const vrmExpressionManager = gltf.userData.vrmExpressionManager;
				if (vrmExpressionManager === null) return;
				else if (vrmExpressionManager === void 0) throw new Error("VRMLookAtLoaderPlugin: vrmExpressionManager is undefined. VRMExpressionLoaderPlugin have to be used first");
				gltf.userData.vrmLookAt = yield this._import(gltf, vrmHumanoid, vrmExpressionManager);
			});
		}
		/**
		* Import a {@link VRMLookAt} from a VRM.
		*
		* @param gltf A parsed result of GLTF taken from GLTFLoader
		* @param humanoid A {@link VRMHumanoid} instance that represents the VRM
		* @param expressions A {@link VRMExpressionManager} instance that represents the VRM
		*/
		_import(gltf, humanoid, expressions) {
			return __async2(this, null, function* () {
				if (humanoid == null || expressions == null) return null;
				const v1Result = yield this._v1Import(gltf, humanoid, expressions);
				if (v1Result) return v1Result;
				const v0Result = yield this._v0Import(gltf, humanoid, expressions);
				if (v0Result) return v0Result;
				return null;
			});
		}
		_v1Import(gltf, humanoid, expressions) {
			return __async2(this, null, function* () {
				var _a, _b, _c;
				const json = this.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf("VRMC_vrm")) !== -1)) return null;
				const extension = (_b = json.extensions) == null ? void 0 : _b["VRMC_vrm"];
				if (!extension) return null;
				const specVersion = extension.specVersion;
				if (!POSSIBLE_SPEC_VERSIONS4.has(specVersion)) {
					console.warn(`VRMLookAtLoaderPlugin: Unknown VRMC_vrm specVersion "${specVersion}"`);
					return null;
				}
				const schemaLookAt = extension.lookAt;
				if (!schemaLookAt) return null;
				const defaultOutputScale = schemaLookAt.type === "expression" ? 1 : 10;
				const mapHI = this._v1ImportRangeMap(schemaLookAt.rangeMapHorizontalInner, defaultOutputScale);
				const mapHO = this._v1ImportRangeMap(schemaLookAt.rangeMapHorizontalOuter, defaultOutputScale);
				const mapVD = this._v1ImportRangeMap(schemaLookAt.rangeMapVerticalDown, defaultOutputScale);
				const mapVU = this._v1ImportRangeMap(schemaLookAt.rangeMapVerticalUp, defaultOutputScale);
				let applier;
				if (schemaLookAt.type === "expression") applier = new VRMLookAtExpressionApplier(expressions, mapHI, mapHO, mapVD, mapVU);
				else applier = new VRMLookAtBoneApplier(humanoid, mapHI, mapHO, mapVD, mapVU);
				const lookAt = this._importLookAt(humanoid, applier);
				lookAt.offsetFromHeadBone.fromArray((_c = schemaLookAt.offsetFromHeadBone) != null ? _c : [
					0,
					.06,
					0
				]);
				return lookAt;
			});
		}
		_v1ImportRangeMap(schemaRangeMap, defaultOutputScale) {
			var _a, _b;
			let inputMaxValue = (_a = schemaRangeMap == null ? void 0 : schemaRangeMap.inputMaxValue) != null ? _a : 90;
			const outputScale = (_b = schemaRangeMap == null ? void 0 : schemaRangeMap.outputScale) != null ? _b : defaultOutputScale;
			if (inputMaxValue < INPUT_MAX_VALUE_MINIMUM) {
				console.warn("VRMLookAtLoaderPlugin: inputMaxValue of a range map is too small. Consider reviewing the range map!");
				inputMaxValue = INPUT_MAX_VALUE_MINIMUM;
			}
			return new VRMLookAtRangeMap(inputMaxValue, outputScale);
		}
		_v0Import(gltf, humanoid, expressions) {
			return __async2(this, null, function* () {
				var _a, _b, _c, _d;
				const vrmExt = (_a = this.parser.json.extensions) == null ? void 0 : _a.VRM;
				if (!vrmExt) return null;
				const schemaFirstPerson = vrmExt.firstPerson;
				if (!schemaFirstPerson) return null;
				const defaultOutputScale = schemaFirstPerson.lookAtTypeName === "BlendShape" ? 1 : 10;
				const mapHI = this._v0ImportDegreeMap(schemaFirstPerson.lookAtHorizontalInner, defaultOutputScale);
				const mapHO = this._v0ImportDegreeMap(schemaFirstPerson.lookAtHorizontalOuter, defaultOutputScale);
				const mapVD = this._v0ImportDegreeMap(schemaFirstPerson.lookAtVerticalDown, defaultOutputScale);
				const mapVU = this._v0ImportDegreeMap(schemaFirstPerson.lookAtVerticalUp, defaultOutputScale);
				let applier;
				if (schemaFirstPerson.lookAtTypeName === "BlendShape") applier = new VRMLookAtExpressionApplier(expressions, mapHI, mapHO, mapVD, mapVU);
				else applier = new VRMLookAtBoneApplier(humanoid, mapHI, mapHO, mapVD, mapVU);
				const lookAt = this._importLookAt(humanoid, applier);
				if (schemaFirstPerson.firstPersonBoneOffset) lookAt.offsetFromHeadBone.set((_b = schemaFirstPerson.firstPersonBoneOffset.x) != null ? _b : 0, (_c = schemaFirstPerson.firstPersonBoneOffset.y) != null ? _c : .06, -((_d = schemaFirstPerson.firstPersonBoneOffset.z) != null ? _d : 0));
				else lookAt.offsetFromHeadBone.set(0, .06, 0);
				lookAt.faceFront.set(0, 0, -1);
				if (applier instanceof VRMLookAtBoneApplier) applier.faceFront.set(0, 0, -1);
				return lookAt;
			});
		}
		_v0ImportDegreeMap(schemaDegreeMap, defaultOutputScale) {
			var _a, _b;
			const curve = schemaDegreeMap == null ? void 0 : schemaDegreeMap.curve;
			if (JSON.stringify(curve) !== "[0,0,0,1,1,1,1,0]") console.warn("Curves of LookAtDegreeMap defined in VRM 0.0 are not supported");
			let xRange = (_a = schemaDegreeMap == null ? void 0 : schemaDegreeMap.xRange) != null ? _a : 90;
			const yRange = (_b = schemaDegreeMap == null ? void 0 : schemaDegreeMap.yRange) != null ? _b : defaultOutputScale;
			if (xRange < INPUT_MAX_VALUE_MINIMUM) {
				console.warn("VRMLookAtLoaderPlugin: xRange of a degree map is too small. Consider reviewing the degree map!");
				xRange = INPUT_MAX_VALUE_MINIMUM;
			}
			return new VRMLookAtRangeMap(xRange, yRange);
		}
		_importLookAt(humanoid, applier) {
			const lookAt = new VRMLookAt(humanoid, applier);
			if (this.helperRoot) {
				const helper = new VRMLookAtHelper(lookAt);
				this.helperRoot.add(helper);
				helper.renderOrder = this.helperRoot.renderOrder;
			}
			return lookAt;
		}
	};
	var VRMLookAtTypeName = {
		Bone: "bone",
		Expression: "expression"
	};
	function resolveURL(url, path) {
		if (typeof url !== "string" || url === "") return "";
		if (/^https?:\/\//i.test(path) && /^\//.test(url)) path = path.replace(/(^https?:\/\/[^/]+).*/i, "$1");
		if (/^(https?:)?\/\//i.test(url)) return url;
		if (/^data:.*,.*$/i.test(url)) return url;
		if (/^blob:.*$/i.test(url)) return url;
		return path + url;
	}
	var POSSIBLE_SPEC_VERSIONS5 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var VRMMetaLoaderPlugin = class {
		get name() {
			return "VRMMetaLoaderPlugin";
		}
		constructor(parser, options) {
			var _a, _b, _c;
			this.parser = parser;
			this.needThumbnailImage = (_a = options == null ? void 0 : options.needThumbnailImage) != null ? _a : false;
			this.acceptLicenseUrls = (_b = options == null ? void 0 : options.acceptLicenseUrls) != null ? _b : ["https://vrm.dev/licenses/1.0/"];
			this.acceptV0Meta = (_c = options == null ? void 0 : options.acceptV0Meta) != null ? _c : true;
		}
		afterRoot(gltf) {
			return __async2(this, null, function* () {
				gltf.userData.vrmMeta = yield this._import(gltf);
			});
		}
		_import(gltf) {
			return __async2(this, null, function* () {
				const v1Result = yield this._v1Import(gltf);
				if (v1Result != null) return v1Result;
				const v0Result = yield this._v0Import(gltf);
				if (v0Result != null) return v0Result;
				return null;
			});
		}
		_v1Import(gltf) {
			return __async2(this, null, function* () {
				var _a, _b, _c;
				const json = this.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf("VRMC_vrm")) !== -1)) return null;
				const extension = (_b = json.extensions) == null ? void 0 : _b["VRMC_vrm"];
				if (extension == null) return null;
				const specVersion = extension.specVersion;
				if (!POSSIBLE_SPEC_VERSIONS5.has(specVersion)) {
					console.warn(`VRMMetaLoaderPlugin: Unknown VRMC_vrm specVersion "${specVersion}"`);
					return null;
				}
				const schemaMeta = extension.meta;
				if (!schemaMeta) return null;
				const licenseUrl = schemaMeta.licenseUrl;
				if (!new Set(this.acceptLicenseUrls).has(licenseUrl)) throw new Error(`VRMMetaLoaderPlugin: The license url "${licenseUrl}" is not accepted`);
				let thumbnailImage = void 0;
				if (this.needThumbnailImage && schemaMeta.thumbnailImage != null) thumbnailImage = (_c = yield this._extractGLTFImage(schemaMeta.thumbnailImage)) != null ? _c : void 0;
				return {
					metaVersion: "1",
					name: schemaMeta.name,
					version: schemaMeta.version,
					authors: schemaMeta.authors,
					copyrightInformation: schemaMeta.copyrightInformation,
					contactInformation: schemaMeta.contactInformation,
					references: schemaMeta.references,
					thirdPartyLicenses: schemaMeta.thirdPartyLicenses,
					thumbnailImage,
					licenseUrl: schemaMeta.licenseUrl,
					avatarPermission: schemaMeta.avatarPermission,
					allowExcessivelyViolentUsage: schemaMeta.allowExcessivelyViolentUsage,
					allowExcessivelySexualUsage: schemaMeta.allowExcessivelySexualUsage,
					commercialUsage: schemaMeta.commercialUsage,
					allowPoliticalOrReligiousUsage: schemaMeta.allowPoliticalOrReligiousUsage,
					allowAntisocialOrHateUsage: schemaMeta.allowAntisocialOrHateUsage,
					creditNotation: schemaMeta.creditNotation,
					allowRedistribution: schemaMeta.allowRedistribution,
					modification: schemaMeta.modification,
					otherLicenseUrl: schemaMeta.otherLicenseUrl
				};
			});
		}
		_v0Import(gltf) {
			return __async2(this, null, function* () {
				var _a;
				const vrmExt = (_a = this.parser.json.extensions) == null ? void 0 : _a.VRM;
				if (!vrmExt) return null;
				const schemaMeta = vrmExt.meta;
				if (!schemaMeta) return null;
				if (!this.acceptV0Meta) throw new Error("VRMMetaLoaderPlugin: Attempted to load VRM0.0 meta but acceptV0Meta is false");
				let texture;
				if (this.needThumbnailImage && schemaMeta.texture != null && schemaMeta.texture !== -1) texture = yield this.parser.getDependency("texture", schemaMeta.texture);
				return {
					metaVersion: "0",
					allowedUserName: schemaMeta.allowedUserName,
					author: schemaMeta.author,
					commercialUssageName: schemaMeta.commercialUssageName,
					contactInformation: schemaMeta.contactInformation,
					licenseName: schemaMeta.licenseName,
					otherLicenseUrl: schemaMeta.otherLicenseUrl,
					otherPermissionUrl: schemaMeta.otherPermissionUrl,
					reference: schemaMeta.reference,
					sexualUssageName: schemaMeta.sexualUssageName,
					texture: texture != null ? texture : void 0,
					title: schemaMeta.title,
					version: schemaMeta.version,
					violentUssageName: schemaMeta.violentUssageName
				};
			});
		}
		_extractGLTFImage(index) {
			return __async2(this, null, function* () {
				var _a;
				const source = (_a = this.parser.json.images) == null ? void 0 : _a[index];
				if (source == null) {
					console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${index}] of glTF as a thumbnail but the image doesn't exist`);
					return null;
				}
				let sourceURI = source.uri;
				if (source.bufferView != null) {
					const bufferView = yield this.parser.getDependency("bufferView", source.bufferView);
					const blob = new Blob([bufferView], { type: source.mimeType });
					sourceURI = URL.createObjectURL(blob);
				}
				if (sourceURI == null) {
					console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${index}] of glTF as a thumbnail but the image couldn't load properly`);
					return null;
				}
				return yield new THREE16.ImageLoader().loadAsync(resolveURL(sourceURI, this.parser.options.path)).catch((error) => {
					console.error(error);
					console.warn("VRMMetaLoaderPlugin: Failed to load a thumbnail image");
					return null;
				});
			});
		}
	};
	var VRMCore = class {
		/**
		* Create a new VRM instance.
		*
		* @param params {@link VRMParameters} that represents components of the VRM
		*/
		constructor(params) {
			this.scene = params.scene;
			this.meta = params.meta;
			this.humanoid = params.humanoid;
			this.expressionManager = params.expressionManager;
			this.firstPerson = params.firstPerson;
			this.lookAt = params.lookAt;
		}
		/**
		* **You need to call this on your update loop.**
		*
		* This function updates every VRM components.
		*
		* @param delta deltaTime
		*/
		update(delta) {
			this.humanoid.update();
			if (this.lookAt) this.lookAt.update(delta);
			if (this.expressionManager) this.expressionManager.update();
		}
	};
	var VRMCoreLoaderPlugin = class {
		get name() {
			return "VRMC_vrm";
		}
		constructor(parser, options) {
			var _a, _b, _c, _d, _e;
			this.parser = parser;
			const helperRoot = options == null ? void 0 : options.helperRoot;
			const autoUpdateHumanBones = options == null ? void 0 : options.autoUpdateHumanBones;
			this.expressionPlugin = (_a = options == null ? void 0 : options.expressionPlugin) != null ? _a : new VRMExpressionLoaderPlugin(parser);
			this.firstPersonPlugin = (_b = options == null ? void 0 : options.firstPersonPlugin) != null ? _b : new VRMFirstPersonLoaderPlugin(parser);
			this.humanoidPlugin = (_c = options == null ? void 0 : options.humanoidPlugin) != null ? _c : new VRMHumanoidLoaderPlugin(parser, {
				helperRoot,
				autoUpdateHumanBones
			});
			this.lookAtPlugin = (_d = options == null ? void 0 : options.lookAtPlugin) != null ? _d : new VRMLookAtLoaderPlugin(parser, { helperRoot });
			this.metaPlugin = (_e = options == null ? void 0 : options.metaPlugin) != null ? _e : new VRMMetaLoaderPlugin(parser);
		}
		afterRoot(gltf) {
			return __async2(this, null, function* () {
				yield this.metaPlugin.afterRoot(gltf);
				yield this.humanoidPlugin.afterRoot(gltf);
				yield this.expressionPlugin.afterRoot(gltf);
				yield this.lookAtPlugin.afterRoot(gltf);
				yield this.firstPersonPlugin.afterRoot(gltf);
				const meta = gltf.userData.vrmMeta;
				const humanoid = gltf.userData.vrmHumanoid;
				if (meta && humanoid) {
					const vrmCore = new VRMCore({
						scene: gltf.scene,
						expressionManager: gltf.userData.vrmExpressionManager,
						firstPerson: gltf.userData.vrmFirstPerson,
						humanoid,
						lookAt: gltf.userData.vrmLookAt,
						meta
					});
					gltf.userData.vrmCore = vrmCore;
				}
			});
		}
	};
	var VRM = class extends VRMCore {
		/**
		* Create a new VRM instance.
		*
		* @param params {@link VRMParameters} that represents components of the VRM
		*/
		constructor(params) {
			super(params);
			this.materials = params.materials;
			this.springBoneManager = params.springBoneManager;
			this.nodeConstraintManager = params.nodeConstraintManager;
		}
		/**
		* **You need to call this on your update loop.**
		*
		* This function updates every VRM components.
		*
		* @param delta deltaTime
		*/
		update(delta) {
			super.update(delta);
			if (this.nodeConstraintManager) this.nodeConstraintManager.update();
			if (this.springBoneManager) this.springBoneManager.update(delta);
			if (this.materials) this.materials.forEach((material) => {
				if (material.update) material.update(delta);
			});
		}
	};
	var __defProp = Object.defineProperty;
	var __getOwnPropSymbols = Object.getOwnPropertySymbols;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __propIsEnum = Object.prototype.propertyIsEnumerable;
	var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
		enumerable: true,
		configurable: true,
		writable: true,
		value
	}) : obj[key] = value;
	var __spreadValues = (a, b) => {
		for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
		if (__getOwnPropSymbols) {
			for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
		}
		return a;
	};
	var __async3 = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	var colorSpaceEncodingMap = {
		"": 3e3,
		srgb: 3001
	};
	function setTextureColorSpace(texture, colorSpace) {
		if (parseInt(THREE17.REVISION, 10) >= 152) texture.colorSpace = colorSpace;
		else texture.encoding = colorSpaceEncodingMap[colorSpace];
	}
	var GLTFMToonMaterialParamsAssignHelper = class {
		get pending() {
			return Promise.all(this._pendings);
		}
		constructor(parser, materialParams) {
			this._parser = parser;
			this._materialParams = materialParams;
			this._pendings = [];
		}
		assignPrimitive(key, value) {
			if (value != null) this._materialParams[key] = value;
		}
		assignColor(key, value, convertSRGBToLinear) {
			if (value != null) {
				const color = new THREE22.Color().fromArray(value);
				if (convertSRGBToLinear) color.convertSRGBToLinear();
				this._materialParams[key] = color;
			}
		}
		assignTexture(key, schemaTexture, isColorTexture) {
			return __async3(this, null, function* () {
				const promise = (() => __async3(this, null, function* () {
					if (schemaTexture != null) {
						const texture = yield this._parser.assignTexture(this._materialParams, key, schemaTexture);
						if (texture == null) {
							console.warn("GLTFMToonMaterialParamsAssignHelper: Failed to load texture. The rendering result may be wrong");
							return;
						}
						if (isColorTexture) setTextureColorSpace(texture, "srgb");
					}
				}))();
				this._pendings.push(promise);
				return promise;
			});
		}
		assignTextureByIndex(key, textureIndex, isColorTexture) {
			return __async3(this, null, function* () {
				return this.assignTexture(key, textureIndex != null ? { index: textureIndex } : void 0, isColorTexture);
			});
		}
	};
	var mtoon_default = "// #define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n  varying vec3 vNormal;\n#endif\n\n#include <common>\n\n// #include <uv_pars_vertex>\n#ifdef MTOON_USE_UV\n  varying vec2 vUv;\n\n  // COMPAT: pre-r151 uses a common uvTransform\n  #if THREE_VRM_THREE_REVISION < 151\n    uniform mat3 uvTransform;\n  #endif\n#endif\n\n// #include <uv2_pars_vertex>\n// COMAPT: pre-r151 uses uv2 for lightMap and aoMap\n#if THREE_VRM_THREE_REVISION < 151\n  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n    attribute vec2 uv2;\n    varying vec2 vUv2;\n    uniform mat3 uv2Transform;\n  #endif\n#endif\n\n// #include <displacementmap_pars_vertex>\n// #include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\n#ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE\n  uniform sampler2D outlineWidthMultiplyTexture;\n  uniform mat3 outlineWidthMultiplyTextureUvTransform;\n#endif\n\nuniform float outlineWidthFactor;\n\nvoid main() {\n\n  // #include <uv_vertex>\n  #ifdef MTOON_USE_UV\n    // COMPAT: pre-r151 uses a common uvTransform\n    #if THREE_VRM_THREE_REVISION >= 151\n      vUv = uv;\n    #else\n      vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n    #endif\n  #endif\n\n  // #include <uv2_vertex>\n  // COMAPT: pre-r151 uses uv2 for lightMap and aoMap\n  #if THREE_VRM_THREE_REVISION < 151\n    #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n      vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;\n    #endif\n  #endif\n\n  #include <color_vertex>\n\n  #include <beginnormal_vertex>\n  #include <morphnormal_vertex>\n  #include <skinbase_vertex>\n  #include <skinnormal_vertex>\n\n  // we need this to compute the outline properly\n  objectNormal = normalize( objectNormal );\n\n  #include <defaultnormal_vertex>\n\n  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n    vNormal = normalize( transformedNormal );\n  #endif\n\n  #include <begin_vertex>\n\n  #include <morphtarget_vertex>\n  #include <skinning_vertex>\n  // #include <displacementmap_vertex>\n  #include <project_vertex>\n  #include <logdepthbuf_vertex>\n  #include <clipping_planes_vertex>\n\n  vViewPosition = - mvPosition.xyz;\n\n  #ifdef OUTLINE\n    float worldNormalLength = length( transformedNormal );\n    vec3 outlineOffset = outlineWidthFactor * worldNormalLength * objectNormal;\n\n    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE\n      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;\n      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;\n      outlineOffset *= outlineTex;\n    #endif\n\n    #ifdef OUTLINE_WIDTH_SCREEN\n      outlineOffset *= vViewPosition.z / projectionMatrix[ 1 ].y;\n    #endif\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );\n\n    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic\n  #endif\n\n  #include <worldpos_vertex>\n  // #include <envmap_vertex>\n  #include <shadowmap_vertex>\n  #include <fog_vertex>\n\n}";
	var mtoon_default2 = "// #define PHONG\n\nuniform vec3 litFactor;\n\nuniform float opacity;\n\nuniform vec3 shadeColorFactor;\n#ifdef USE_SHADEMULTIPLYTEXTURE\n  uniform sampler2D shadeMultiplyTexture;\n  uniform mat3 shadeMultiplyTextureUvTransform;\n#endif\n\nuniform float shadingShiftFactor;\nuniform float shadingToonyFactor;\n\n#ifdef USE_SHADINGSHIFTTEXTURE\n  uniform sampler2D shadingShiftTexture;\n  uniform mat3 shadingShiftTextureUvTransform;\n  uniform float shadingShiftTextureScale;\n#endif\n\nuniform float giEqualizationFactor;\n\nuniform vec3 parametricRimColorFactor;\n#ifdef USE_RIMMULTIPLYTEXTURE\n  uniform sampler2D rimMultiplyTexture;\n  uniform mat3 rimMultiplyTextureUvTransform;\n#endif\nuniform float rimLightingMixFactor;\nuniform float parametricRimFresnelPowerFactor;\nuniform float parametricRimLiftFactor;\n\n#ifdef USE_MATCAPTEXTURE\n  uniform vec3 matcapFactor;\n  uniform sampler2D matcapTexture;\n  uniform mat3 matcapTextureUvTransform;\n#endif\n\nuniform vec3 emissive;\nuniform float emissiveIntensity;\n\nuniform vec3 outlineColorFactor;\nuniform float outlineLightingMixFactor;\n\n#ifdef USE_UVANIMATIONMASKTEXTURE\n  uniform sampler2D uvAnimationMaskTexture;\n  uniform mat3 uvAnimationMaskTextureUvTransform;\n#endif\n\nuniform float uvAnimationScrollXOffset;\nuniform float uvAnimationScrollYOffset;\nuniform float uvAnimationRotationPhase;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n\n// #include <uv_pars_fragment>\n#if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )\n  varying vec2 vUv;\n#endif\n\n// #include <uv2_pars_fragment>\n// COMAPT: pre-r151 uses uv2 for lightMap and aoMap\n#if THREE_VRM_THREE_REVISION < 151\n  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n    varying vec2 vUv2;\n  #endif\n#endif\n\n#include <map_pars_fragment>\n\n#ifdef USE_MAP\n  uniform mat3 mapUvTransform;\n#endif\n\n// #include <alphamap_pars_fragment>\n\n#include <alphatest_pars_fragment>\n\n#include <aomap_pars_fragment>\n// #include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n\n#ifdef USE_EMISSIVEMAP\n  uniform mat3 emissiveMapUvTransform;\n#endif\n\n// #include <envmap_common_pars_fragment>\n// #include <envmap_pars_fragment>\n// #include <cube_uv_reflection_fragment>\n#include <fog_pars_fragment>\n\n// #include <bsdfs>\n// COMPAT: pre-r151 doesn't have BRDF_Lambert in <common>\n#if THREE_VRM_THREE_REVISION < 151\n  vec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n    return RECIPROCAL_PI * diffuseColor;\n  }\n#endif\n\n#include <lights_pars_begin>\n\n#include <normal_pars_fragment>\n\n// #include <lights_phong_pars_fragment>\nvarying vec3 vViewPosition;\n\nstruct MToonMaterial {\n  vec3 diffuseColor;\n  vec3 shadeColor;\n  float shadingShift;\n};\n\nfloat linearstep( float a, float b, float t ) {\n  return clamp( ( t - a ) / ( b - a ), 0.0, 1.0 );\n}\n\n/**\n * Convert NdotL into toon shading factor using shadingShift and shadingToony\n */\nfloat getShading(\n  const in float dotNL,\n  const in float shadow,\n  const in float shadingShift\n) {\n  float shading = dotNL;\n  shading = shading + shadingShift;\n  shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading );\n  shading *= shadow;\n  return shading;\n}\n\n/**\n * Mix diffuseColor and shadeColor using shading factor and light color\n */\nvec3 getDiffuse(\n  const in MToonMaterial material,\n  const in float shading,\n  in vec3 lightColor\n) {\n  #ifdef DEBUG_LITSHADERATE\n    return vec3( BRDF_Lambert( shading * lightColor ) );\n  #endif\n\n  vec3 col = lightColor * BRDF_Lambert( mix( material.shadeColor, material.diffuseColor, shading ) );\n\n  // The \"comment out if you want to PBR absolutely\" line\n  #ifdef V0_COMPAT_SHADE\n    col = min( col, material.diffuseColor );\n  #endif\n\n  return col;\n}\n\n// COMPAT: pre-r156 uses a struct GeometricContext\n#if THREE_VRM_THREE_REVISION >= 157\n  void RE_Direct_MToon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {\n    float dotNL = clamp( dot( geometryNormal, directLight.direction ), -1.0, 1.0 );\n    vec3 irradiance = directLight.color;\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n\n    irradiance *= dotNL;\n\n    float shading = getShading( dotNL, shadow, material.shadingShift );\n\n    // toon shaded diffuse\n    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );\n  }\n\n  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {\n    // indirect diffuse will use diffuseColor, no shadeColor involved\n    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n  }\n#else\n  void RE_Direct_MToon( const in IncidentLight directLight, const in GeometricContext geometry, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {\n    float dotNL = clamp( dot( geometry.normal, directLight.direction ), -1.0, 1.0 );\n    vec3 irradiance = directLight.color;\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n\n    irradiance *= dotNL;\n\n    float shading = getShading( dotNL, shadow, material.shadingShift );\n\n    // toon shaded diffuse\n    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );\n  }\n\n  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in GeometricContext geometry, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {\n    // indirect diffuse will use diffuseColor, no shadeColor involved\n    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n    // directSpecular will be used for rim lighting, not an actual specular\n    reflectedLight.directSpecular += irradiance;\n  }\n#endif\n\n#define RE_Direct RE_Direct_MToon\n#define RE_IndirectDiffuse RE_IndirectDiffuse_MToon\n#define Material_LightProbeLOD( material ) (0)\n\n#include <shadowmap_pars_fragment>\n// #include <bumpmap_pars_fragment>\n\n// #include <normalmap_pars_fragment>\n#ifdef USE_NORMALMAP\n\n  uniform sampler2D normalMap;\n  uniform mat3 normalMapUvTransform;\n  uniform vec2 normalScale;\n\n#endif\n\n// COMPAT: pre-r151\n// USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151\n#if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )\n\n  uniform mat3 normalMatrix;\n\n#endif\n\n// COMPAT: pre-r151\n// USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( TANGENTSPACE_NORMALMAP ) )\n\n  // Per-Pixel Tangent Space Normal Mapping\n  // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n  // three-vrm specific change: it requires `uv` as an input in order to support uv scrolls\n\n  // Temporary compat against shader change @ Three.js r126, r151\n  #if THREE_VRM_THREE_REVISION >= 151\n\n    mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n\n      vec3 q0 = dFdx( eye_pos.xyz );\n      vec3 q1 = dFdy( eye_pos.xyz );\n      vec2 st0 = dFdx( uv.st );\n      vec2 st1 = dFdy( uv.st );\n\n      vec3 N = surf_norm;\n\n      vec3 q1perp = cross( q1, N );\n      vec3 q0perp = cross( N, q0 );\n\n      vec3 T = q1perp * st0.x + q0perp * st1.x;\n      vec3 B = q1perp * st0.y + q0perp * st1.y;\n\n      float det = max( dot( T, T ), dot( B, B ) );\n      float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n\n      return mat3( T * scale, B * scale, N );\n\n    }\n\n  #else\n\n    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {\n\n      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );\n      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );\n      vec2 st0 = dFdx( uv.st );\n      vec2 st1 = dFdy( uv.st );\n\n      vec3 N = normalize( surf_norm );\n\n      vec3 q1perp = cross( q1, N );\n      vec3 q0perp = cross( N, q0 );\n\n      vec3 T = q1perp * st0.x + q0perp * st1.x;\n      vec3 B = q1perp * st0.y + q0perp * st1.y;\n\n      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0\n      // TODO: Is this still required? Or shall I make a PR about it?\n      if ( length( T ) == 0.0 || length( B ) == 0.0 ) {\n        return surf_norm;\n      }\n\n      float det = max( dot( T, T ), dot( B, B ) );\n      float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );\n\n      return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );\n\n    }\n\n  #endif\n\n#endif\n\n// #include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\n// == post correction ==========================================================\nvoid postCorrection() {\n  #include <tonemapping_fragment>\n  #include <colorspace_fragment>\n  #include <fog_fragment>\n  #include <premultiplied_alpha_fragment>\n  #include <dithering_fragment>\n}\n\n// == main procedure ===========================================================\nvoid main() {\n  #include <clipping_planes_fragment>\n\n  vec2 uv = vec2(0.5, 0.5);\n\n  #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )\n    uv = vUv;\n\n    float uvAnimMask = 1.0;\n    #ifdef USE_UVANIMATIONMASKTEXTURE\n      vec2 uvAnimationMaskTextureUv = ( uvAnimationMaskTextureUvTransform * vec3( uv, 1 ) ).xy;\n      uvAnimMask = texture2D( uvAnimationMaskTexture, uvAnimationMaskTextureUv ).b;\n    #endif\n\n    float uvRotCos = cos( uvAnimationRotationPhase * uvAnimMask );\n    float uvRotSin = sin( uvAnimationRotationPhase * uvAnimMask );\n    uv = mat2( uvRotCos, -uvRotSin, uvRotSin, uvRotCos ) * ( uv - 0.5 ) + 0.5;\n    uv = uv + vec2( uvAnimationScrollXOffset, uvAnimationScrollYOffset ) * uvAnimMask;\n  #endif\n\n  #ifdef DEBUG_UV\n    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n    #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )\n      gl_FragColor = vec4( uv, 0.0, 1.0 );\n    #endif\n    return;\n  #endif\n\n  vec4 diffuseColor = vec4( litFactor, opacity );\n  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n  vec3 totalEmissiveRadiance = emissive * emissiveIntensity;\n\n  #include <logdepthbuf_fragment>\n\n  // #include <map_fragment>\n  #ifdef USE_MAP\n    vec2 mapUv = ( mapUvTransform * vec3( uv, 1 ) ).xy;\n    vec4 sampledDiffuseColor = texture2D( map, mapUv );\n    #ifdef DECODE_VIDEO_TEXTURE\n      sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );\n    #endif\n    diffuseColor *= sampledDiffuseColor;\n  #endif\n\n  // #include <color_fragment>\n  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )\n    diffuseColor.rgb *= vColor;\n  #endif\n\n  // #include <alphamap_fragment>\n\n  #include <alphatest_fragment>\n\n  // #include <specularmap_fragment>\n\n  // #include <normal_fragment_begin>\n  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;\n\n  #ifdef FLAT_SHADED\n\n    vec3 fdx = dFdx( vViewPosition );\n    vec3 fdy = dFdy( vViewPosition );\n    vec3 normal = normalize( cross( fdx, fdy ) );\n\n  #else\n\n    vec3 normal = normalize( vNormal );\n\n    #ifdef DOUBLE_SIDED\n\n      normal *= faceDirection;\n\n    #endif\n\n  #endif\n\n  #ifdef USE_NORMALMAP\n\n    vec2 normalMapUv = ( normalMapUvTransform * vec3( uv, 1 ) ).xy;\n\n  #endif\n\n  #ifdef USE_NORMALMAP_TANGENTSPACE\n\n    #ifdef USE_TANGENT\n\n      mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\n    #else\n\n      mat3 tbn = getTangentFrame( - vViewPosition, normal, normalMapUv );\n\n    #endif\n\n    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\n      tbn[0] *= faceDirection;\n      tbn[1] *= faceDirection;\n\n    #endif\n\n  #endif\n\n  #ifdef USE_CLEARCOAT_NORMALMAP\n\n    #ifdef USE_TANGENT\n\n      mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\n    #else\n\n      mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n\n    #endif\n\n    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\n      tbn2[0] *= faceDirection;\n      tbn2[1] *= faceDirection;\n\n    #endif\n\n  #endif\n\n  // non perturbed normal for clearcoat among others\n\n  vec3 nonPerturbedNormal = normal;\n\n  #ifdef OUTLINE\n    normal *= -1.0;\n  #endif\n\n  // #include <normal_fragment_maps>\n\n  // COMPAT: pre-r151\n  // USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151\n  #if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )\n\n    normal = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals\n\n    #ifdef FLIP_SIDED\n\n      normal = - normal;\n\n    #endif\n\n    #ifdef DOUBLE_SIDED\n\n      normal = normal * faceDirection;\n\n    #endif\n\n    normal = normalize( normalMatrix * normal );\n\n  // COMPAT: pre-r151\n  // USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151\n  #elif defined( USE_NORMALMAP_TANGENTSPACE ) || defined( TANGENTSPACE_NORMALMAP )\n\n    vec3 mapN = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0;\n    mapN.xy *= normalScale;\n\n    // COMPAT: pre-r151\n    #if THREE_VRM_THREE_REVISION >= 151 || defined( USE_TANGENT )\n\n      normal = normalize( tbn * mapN );\n\n    #else\n\n      normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN, faceDirection );\n\n    #endif\n\n  #endif\n\n  // #include <emissivemap_fragment>\n  #ifdef USE_EMISSIVEMAP\n    vec2 emissiveMapUv = ( emissiveMapUvTransform * vec3( uv, 1 ) ).xy;\n    totalEmissiveRadiance *= texture2D( emissiveMap, emissiveMapUv ).rgb;\n  #endif\n\n  #ifdef DEBUG_NORMAL\n    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );\n    return;\n  #endif\n\n  // -- MToon: lighting --------------------------------------------------------\n  // accumulation\n  // #include <lights_phong_fragment>\n  MToonMaterial material;\n\n  material.diffuseColor = diffuseColor.rgb;\n\n  material.shadeColor = shadeColorFactor;\n  #ifdef USE_SHADEMULTIPLYTEXTURE\n    vec2 shadeMultiplyTextureUv = ( shadeMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;\n    material.shadeColor *= texture2D( shadeMultiplyTexture, shadeMultiplyTextureUv ).rgb;\n  #endif\n\n  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )\n    material.shadeColor.rgb *= vColor;\n  #endif\n\n  material.shadingShift = shadingShiftFactor;\n  #ifdef USE_SHADINGSHIFTTEXTURE\n    vec2 shadingShiftTextureUv = ( shadingShiftTextureUvTransform * vec3( uv, 1 ) ).xy;\n    material.shadingShift += texture2D( shadingShiftTexture, shadingShiftTextureUv ).r * shadingShiftTextureScale;\n  #endif\n\n  // #include <lights_fragment_begin>\n\n  // MToon Specific changes:\n  // Since we want to take shadows into account of shading instead of irradiance,\n  // we had to modify the codes that multiplies the results of shadowmap into color of direct lights.\n\n  // COMPAT: pre-r156 uses a struct GeometricContext\n  #if THREE_VRM_THREE_REVISION >= 157\n    vec3 geometryPosition = - vViewPosition;\n    vec3 geometryNormal = normal;\n    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\n\n    vec3 geometryClearcoatNormal;\n\n    #ifdef USE_CLEARCOAT\n\n      geometryClearcoatNormal = clearcoatNormal;\n\n    #endif\n  #else\n    GeometricContext geometry;\n\n    geometry.position = - vViewPosition;\n    geometry.normal = normal;\n    geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\n\n    #ifdef USE_CLEARCOAT\n\n      geometry.clearcoatNormal = clearcoatNormal;\n\n    #endif\n  #endif\n\n  IncidentLight directLight;\n\n  // since these variables will be used in unrolled loop, we have to define in prior\n  float shadow;\n\n  #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\n    PointLight pointLight;\n    #if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n    PointLightShadow pointLightShadow;\n    #endif\n\n    #pragma unroll_loop_start\n    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\n      pointLight = pointLights[ i ];\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        getPointLightInfo( pointLight, geometryPosition, directLight );\n      #else\n        getPointLightInfo( pointLight, geometry, directLight );\n      #endif\n\n      shadow = 1.0;\n      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )\n      pointLightShadow = pointLightShadows[ i ];\n      // COMPAT: pre-r166\n      // r166 introduced shadowIntensity\n      #if THREE_VRM_THREE_REVISION >= 166\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n      #else\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n      #endif\n      #endif\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );\n      #else\n        RE_Direct( directLight, geometry, material, shadow, reflectedLight );\n      #endif\n\n    }\n    #pragma unroll_loop_end\n\n  #endif\n\n  #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\n    SpotLight spotLight;\n    // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS, r144+ uses NUM_SPOT_LIGHT_COORDS\n    #if THREE_VRM_THREE_REVISION >= 144\n      #if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_COORDS > 0\n      SpotLightShadow spotLightShadow;\n      #endif\n    #elif defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n    SpotLightShadow spotLightShadow;\n    #endif\n\n    #pragma unroll_loop_start\n    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\n      spotLight = spotLights[ i ];\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        getSpotLightInfo( spotLight, geometryPosition, directLight );\n      #else\n        getSpotLightInfo( spotLight, geometry, directLight );\n      #endif\n\n      shadow = 1.0;\n      // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS and vSpotShadowCoord, r144+ uses NUM_SPOT_LIGHT_COORDS and vSpotLightCoord\n      // COMPAT: pre-r166 does not have shadowIntensity, r166+ has shadowIntensity\n      #if THREE_VRM_THREE_REVISION >= 166\n        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )\n        spotLightShadow = spotLightShadows[ i ];\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n        #endif\n      #elif THREE_VRM_THREE_REVISION >= 144\n        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )\n        spotLightShadow = spotLightShadows[ i ];\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n        #endif\n      #elif defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n      spotLightShadow = spotLightShadows[ i ];\n      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n      #endif\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );\n      #else\n        RE_Direct( directLight, geometry, material, shadow, reflectedLight );\n      #endif\n\n    }\n    #pragma unroll_loop_end\n\n  #endif\n\n  #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\n    DirectionalLight directionalLight;\n    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n    DirectionalLightShadow directionalLightShadow;\n    #endif\n\n    #pragma unroll_loop_start\n    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\n      directionalLight = directionalLights[ i ];\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        getDirectionalLightInfo( directionalLight, directLight );\n      #else\n        getDirectionalLightInfo( directionalLight, geometry, directLight );\n      #endif\n\n      shadow = 1.0;\n      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n      directionalLightShadow = directionalLightShadows[ i ];\n      // COMPAT: pre-r166\n      // r166 introduced shadowIntensity\n      #if THREE_VRM_THREE_REVISION >= 166\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n      #else\n        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n      #endif\n      #endif\n\n      // COMPAT: pre-r156 uses a struct GeometricContext\n      #if THREE_VRM_THREE_REVISION >= 157\n        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );\n      #else\n        RE_Direct( directLight, geometry, material, shadow, reflectedLight );\n      #endif\n\n    }\n    #pragma unroll_loop_end\n\n  #endif\n\n  // #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n\n  //   RectAreaLight rectAreaLight;\n\n  //   #pragma unroll_loop_start\n  //   for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\n  //     rectAreaLight = rectAreaLights[ i ];\n  //     RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\n\n  //   }\n  //   #pragma unroll_loop_end\n\n  // #endif\n\n  #if defined( RE_IndirectDiffuse )\n\n    vec3 iblIrradiance = vec3( 0.0 );\n\n    vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\n    // COMPAT: pre-r156 uses a struct GeometricContext\n    // COMPAT: pre-r156 doesn't have a define USE_LIGHT_PROBES\n    #if THREE_VRM_THREE_REVISION >= 157\n      #if defined( USE_LIGHT_PROBES )\n        irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n      #endif\n    #else\n      irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );\n    #endif\n\n    #if ( NUM_HEMI_LIGHTS > 0 )\n\n      #pragma unroll_loop_start\n      for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\n        // COMPAT: pre-r156 uses a struct GeometricContext\n        #if THREE_VRM_THREE_REVISION >= 157\n          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n        #else\n          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );\n        #endif\n\n      }\n      #pragma unroll_loop_end\n\n    #endif\n\n  #endif\n\n  // #if defined( RE_IndirectSpecular )\n\n  //   vec3 radiance = vec3( 0.0 );\n  //   vec3 clearcoatRadiance = vec3( 0.0 );\n\n  // #endif\n\n  #include <lights_fragment_maps>\n  #include <lights_fragment_end>\n\n  // modulation\n  #include <aomap_fragment>\n\n  vec3 col = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n\n  #ifdef DEBUG_LITSHADERATE\n    gl_FragColor = vec4( col, diffuseColor.a );\n    postCorrection();\n    return;\n  #endif\n\n  // -- MToon: rim lighting -----------------------------------------\n  vec3 viewDir = normalize( vViewPosition );\n\n  #ifndef PHYSICALLY_CORRECT_LIGHTS\n    reflectedLight.directSpecular /= PI;\n  #endif\n  vec3 rimMix = mix( vec3( 1.0 ), reflectedLight.directSpecular, rimLightingMixFactor );\n\n  vec3 rim = parametricRimColorFactor * pow( saturate( 1.0 - dot( viewDir, normal ) + parametricRimLiftFactor ), parametricRimFresnelPowerFactor );\n\n  #ifdef USE_MATCAPTEXTURE\n    {\n      vec3 x = normalize( vec3( viewDir.z, 0.0, -viewDir.x ) );\n      vec3 y = cross( viewDir, x ); // guaranteed to be normalized\n      vec2 sphereUv = 0.5 + 0.5 * vec2( dot( x, normal ), -dot( y, normal ) );\n      sphereUv = ( matcapTextureUvTransform * vec3( sphereUv, 1 ) ).xy;\n      vec3 matcap = texture2D( matcapTexture, sphereUv ).rgb;\n      rim += matcapFactor * matcap;\n    }\n  #endif\n\n  #ifdef USE_RIMMULTIPLYTEXTURE\n    vec2 rimMultiplyTextureUv = ( rimMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;\n    rim *= texture2D( rimMultiplyTexture, rimMultiplyTextureUv ).rgb;\n  #endif\n\n  col += rimMix * rim;\n\n  // -- MToon: Emission --------------------------------------------------------\n  col += totalEmissiveRadiance;\n\n  // #include <envmap_fragment>\n\n  // -- Almost done! -----------------------------------------------------------\n  #if defined( OUTLINE )\n    col = outlineColorFactor.rgb * mix( vec3( 1.0 ), col, outlineLightingMixFactor );\n  #endif\n\n  #ifdef OPAQUE\n    diffuseColor.a = 1.0;\n  #endif\n\n  gl_FragColor = vec4( col, diffuseColor.a );\n  postCorrection();\n}\n";
	var MToonMaterialDebugMode = {
		/**
		* Render normally.
		*/
		None: "none",
		/**
		* Visualize normals of the surface.
		*/
		Normal: "normal",
		/**
		* Visualize lit/shade of the surface.
		*/
		LitShadeRate: "litShadeRate",
		/**
		* Visualize UV of the surface.
		*/
		UV: "uv"
	};
	var MToonMaterialOutlineWidthMode = {
		None: "none",
		WorldCoordinates: "worldCoordinates",
		ScreenCoordinates: "screenCoordinates"
	};
	var encodingColorSpaceMap = {
		3e3: "",
		3001: "srgb"
	};
	function getTextureColorSpace(texture) {
		if (parseInt(THREE32.REVISION, 10) >= 152) return texture.colorSpace;
		else return encodingColorSpaceMap[texture.encoding];
	}
	var MToonMaterial = class extends THREE42.ShaderMaterial {
		constructor(parameters = {}) {
			var _a;
			super({
				vertexShader: mtoon_default,
				fragmentShader: mtoon_default2
			});
			this.uvAnimationScrollXSpeedFactor = 0;
			this.uvAnimationScrollYSpeedFactor = 0;
			this.uvAnimationRotationSpeedFactor = 0;
			this.fog = true;
			this.normalMapType = THREE42.TangentSpaceNormalMap;
			this._ignoreVertexColor = true;
			this._v0CompatShade = false;
			this._debugMode = MToonMaterialDebugMode.None;
			this._outlineWidthMode = MToonMaterialOutlineWidthMode.None;
			this._isOutline = false;
			if (parameters.transparentWithZWrite) parameters.depthWrite = true;
			delete parameters.transparentWithZWrite;
			parameters.fog = true;
			parameters.lights = true;
			parameters.clipping = true;
			this.uniforms = THREE42.UniformsUtils.merge([
				THREE42.UniformsLib.common,
				THREE42.UniformsLib.normalmap,
				THREE42.UniformsLib.emissivemap,
				THREE42.UniformsLib.fog,
				THREE42.UniformsLib.lights,
				{
					litFactor: { value: new THREE42.Color(1, 1, 1) },
					mapUvTransform: { value: new THREE42.Matrix3() },
					colorAlpha: { value: 1 },
					normalMapUvTransform: { value: new THREE42.Matrix3() },
					shadeColorFactor: { value: new THREE42.Color(0, 0, 0) },
					shadeMultiplyTexture: { value: null },
					shadeMultiplyTextureUvTransform: { value: new THREE42.Matrix3() },
					shadingShiftFactor: { value: 0 },
					shadingShiftTexture: { value: null },
					shadingShiftTextureUvTransform: { value: new THREE42.Matrix3() },
					shadingShiftTextureScale: { value: 1 },
					shadingToonyFactor: { value: .9 },
					giEqualizationFactor: { value: .9 },
					matcapFactor: { value: new THREE42.Color(1, 1, 1) },
					matcapTexture: { value: null },
					matcapTextureUvTransform: { value: new THREE42.Matrix3() },
					parametricRimColorFactor: { value: new THREE42.Color(0, 0, 0) },
					rimMultiplyTexture: { value: null },
					rimMultiplyTextureUvTransform: { value: new THREE42.Matrix3() },
					rimLightingMixFactor: { value: 1 },
					parametricRimFresnelPowerFactor: { value: 5 },
					parametricRimLiftFactor: { value: 0 },
					emissive: { value: new THREE42.Color(0, 0, 0) },
					emissiveIntensity: { value: 1 },
					emissiveMapUvTransform: { value: new THREE42.Matrix3() },
					outlineWidthMultiplyTexture: { value: null },
					outlineWidthMultiplyTextureUvTransform: { value: new THREE42.Matrix3() },
					outlineWidthFactor: { value: 0 },
					outlineColorFactor: { value: new THREE42.Color(0, 0, 0) },
					outlineLightingMixFactor: { value: 1 },
					uvAnimationMaskTexture: { value: null },
					uvAnimationMaskTextureUvTransform: { value: new THREE42.Matrix3() },
					uvAnimationScrollXOffset: { value: 0 },
					uvAnimationScrollYOffset: { value: 0 },
					uvAnimationRotationPhase: { value: 0 }
				},
				(_a = parameters.uniforms) != null ? _a : {}
			]);
			this.setValues(parameters);
			this._uploadUniformsWorkaround();
			this.customProgramCacheKey = () => [
				...Object.entries(this._generateDefines()).map(([token, macro]) => `${token}:${macro}`),
				this.matcapTexture ? `matcapTextureColorSpace:${getTextureColorSpace(this.matcapTexture)}` : "",
				this.shadeMultiplyTexture ? `shadeMultiplyTextureColorSpace:${getTextureColorSpace(this.shadeMultiplyTexture)}` : "",
				this.rimMultiplyTexture ? `rimMultiplyTextureColorSpace:${getTextureColorSpace(this.rimMultiplyTexture)}` : ""
			].join(",");
			this.onBeforeCompile = (shader) => {
				const threeRevision = parseInt(THREE42.REVISION, 10);
				const defines = Object.entries(__spreadValues(__spreadValues({}, this._generateDefines()), this.defines)).filter(([token, macro]) => !!macro).map(([token, macro]) => `#define ${token} ${macro}`).join("\n") + "\n";
				shader.vertexShader = defines + shader.vertexShader;
				shader.fragmentShader = defines + shader.fragmentShader;
				if (threeRevision < 154) shader.fragmentShader = shader.fragmentShader.replace("#include <colorspace_fragment>", "#include <encodings_fragment>");
			};
		}
		get color() {
			return this.uniforms.litFactor.value;
		}
		set color(value) {
			this.uniforms.litFactor.value = value;
		}
		get map() {
			return this.uniforms.map.value;
		}
		set map(value) {
			this.uniforms.map.value = value;
		}
		get normalMap() {
			return this.uniforms.normalMap.value;
		}
		set normalMap(value) {
			this.uniforms.normalMap.value = value;
		}
		get normalScale() {
			return this.uniforms.normalScale.value;
		}
		set normalScale(value) {
			this.uniforms.normalScale.value = value;
		}
		get emissive() {
			return this.uniforms.emissive.value;
		}
		set emissive(value) {
			this.uniforms.emissive.value = value;
		}
		get emissiveIntensity() {
			return this.uniforms.emissiveIntensity.value;
		}
		set emissiveIntensity(value) {
			this.uniforms.emissiveIntensity.value = value;
		}
		get emissiveMap() {
			return this.uniforms.emissiveMap.value;
		}
		set emissiveMap(value) {
			this.uniforms.emissiveMap.value = value;
		}
		get shadeColorFactor() {
			return this.uniforms.shadeColorFactor.value;
		}
		set shadeColorFactor(value) {
			this.uniforms.shadeColorFactor.value = value;
		}
		get shadeMultiplyTexture() {
			return this.uniforms.shadeMultiplyTexture.value;
		}
		set shadeMultiplyTexture(value) {
			this.uniforms.shadeMultiplyTexture.value = value;
		}
		get shadingShiftFactor() {
			return this.uniforms.shadingShiftFactor.value;
		}
		set shadingShiftFactor(value) {
			this.uniforms.shadingShiftFactor.value = value;
		}
		get shadingShiftTexture() {
			return this.uniforms.shadingShiftTexture.value;
		}
		set shadingShiftTexture(value) {
			this.uniforms.shadingShiftTexture.value = value;
		}
		get shadingShiftTextureScale() {
			return this.uniforms.shadingShiftTextureScale.value;
		}
		set shadingShiftTextureScale(value) {
			this.uniforms.shadingShiftTextureScale.value = value;
		}
		get shadingToonyFactor() {
			return this.uniforms.shadingToonyFactor.value;
		}
		set shadingToonyFactor(value) {
			this.uniforms.shadingToonyFactor.value = value;
		}
		get giEqualizationFactor() {
			return this.uniforms.giEqualizationFactor.value;
		}
		set giEqualizationFactor(value) {
			this.uniforms.giEqualizationFactor.value = value;
		}
		get matcapFactor() {
			return this.uniforms.matcapFactor.value;
		}
		set matcapFactor(value) {
			this.uniforms.matcapFactor.value = value;
		}
		get matcapTexture() {
			return this.uniforms.matcapTexture.value;
		}
		set matcapTexture(value) {
			this.uniforms.matcapTexture.value = value;
		}
		get parametricRimColorFactor() {
			return this.uniforms.parametricRimColorFactor.value;
		}
		set parametricRimColorFactor(value) {
			this.uniforms.parametricRimColorFactor.value = value;
		}
		get rimMultiplyTexture() {
			return this.uniforms.rimMultiplyTexture.value;
		}
		set rimMultiplyTexture(value) {
			this.uniforms.rimMultiplyTexture.value = value;
		}
		get rimLightingMixFactor() {
			return this.uniforms.rimLightingMixFactor.value;
		}
		set rimLightingMixFactor(value) {
			this.uniforms.rimLightingMixFactor.value = value;
		}
		get parametricRimFresnelPowerFactor() {
			return this.uniforms.parametricRimFresnelPowerFactor.value;
		}
		set parametricRimFresnelPowerFactor(value) {
			this.uniforms.parametricRimFresnelPowerFactor.value = value;
		}
		get parametricRimLiftFactor() {
			return this.uniforms.parametricRimLiftFactor.value;
		}
		set parametricRimLiftFactor(value) {
			this.uniforms.parametricRimLiftFactor.value = value;
		}
		get outlineWidthMultiplyTexture() {
			return this.uniforms.outlineWidthMultiplyTexture.value;
		}
		set outlineWidthMultiplyTexture(value) {
			this.uniforms.outlineWidthMultiplyTexture.value = value;
		}
		get outlineWidthFactor() {
			return this.uniforms.outlineWidthFactor.value;
		}
		set outlineWidthFactor(value) {
			this.uniforms.outlineWidthFactor.value = value;
		}
		get outlineColorFactor() {
			return this.uniforms.outlineColorFactor.value;
		}
		set outlineColorFactor(value) {
			this.uniforms.outlineColorFactor.value = value;
		}
		get outlineLightingMixFactor() {
			return this.uniforms.outlineLightingMixFactor.value;
		}
		set outlineLightingMixFactor(value) {
			this.uniforms.outlineLightingMixFactor.value = value;
		}
		get uvAnimationMaskTexture() {
			return this.uniforms.uvAnimationMaskTexture.value;
		}
		set uvAnimationMaskTexture(value) {
			this.uniforms.uvAnimationMaskTexture.value = value;
		}
		get uvAnimationScrollXOffset() {
			return this.uniforms.uvAnimationScrollXOffset.value;
		}
		set uvAnimationScrollXOffset(value) {
			this.uniforms.uvAnimationScrollXOffset.value = value;
		}
		get uvAnimationScrollYOffset() {
			return this.uniforms.uvAnimationScrollYOffset.value;
		}
		set uvAnimationScrollYOffset(value) {
			this.uniforms.uvAnimationScrollYOffset.value = value;
		}
		get uvAnimationRotationPhase() {
			return this.uniforms.uvAnimationRotationPhase.value;
		}
		set uvAnimationRotationPhase(value) {
			this.uniforms.uvAnimationRotationPhase.value = value;
		}
		/**
		* When this is `true`, vertex colors will be ignored.
		* `true` by default.
		*/
		get ignoreVertexColor() {
			return this._ignoreVertexColor;
		}
		set ignoreVertexColor(value) {
			this._ignoreVertexColor = value;
			this.needsUpdate = true;
		}
		/**
		* There is a line of the shader called "comment out if you want to PBR absolutely" in VRM0.0 MToon.
		* When this is true, the material enables the line to make it compatible with the legacy rendering of VRM.
		* Usually not recommended to turn this on.
		* `false` by default.
		*/
		get v0CompatShade() {
			return this._v0CompatShade;
		}
		/**
		* There is a line of the shader called "comment out if you want to PBR absolutely" in VRM0.0 MToon.
		* When this is true, the material enables the line to make it compatible with the legacy rendering of VRM.
		* Usually not recommended to turn this on.
		* `false` by default.
		*/
		set v0CompatShade(v) {
			this._v0CompatShade = v;
			this.needsUpdate = true;
		}
		/**
		* Debug mode for the material.
		* You can visualize several components for diagnosis using debug mode.
		*
		* See: {@link MToonMaterialDebugMode}
		*/
		get debugMode() {
			return this._debugMode;
		}
		/**
		* Debug mode for the material.
		* You can visualize several components for diagnosis using debug mode.
		*
		* See: {@link MToonMaterialDebugMode}
		*/
		set debugMode(m) {
			this._debugMode = m;
			this.needsUpdate = true;
		}
		get outlineWidthMode() {
			return this._outlineWidthMode;
		}
		set outlineWidthMode(m) {
			this._outlineWidthMode = m;
			this.needsUpdate = true;
		}
		get isOutline() {
			return this._isOutline;
		}
		set isOutline(b) {
			this._isOutline = b;
			this.needsUpdate = true;
		}
		/**
		* Readonly boolean that indicates this is a {@link MToonMaterial}.
		*/
		get isMToonMaterial() {
			return true;
		}
		/**
		* Update this material.
		*
		* @param delta deltaTime since last update
		*/
		update(delta) {
			this._uploadUniformsWorkaround();
			this._updateUVAnimation(delta);
		}
		copy(source) {
			super.copy(source);
			this.map = source.map;
			this.normalMap = source.normalMap;
			this.emissiveMap = source.emissiveMap;
			this.shadeMultiplyTexture = source.shadeMultiplyTexture;
			this.shadingShiftTexture = source.shadingShiftTexture;
			this.matcapTexture = source.matcapTexture;
			this.rimMultiplyTexture = source.rimMultiplyTexture;
			this.outlineWidthMultiplyTexture = source.outlineWidthMultiplyTexture;
			this.uvAnimationMaskTexture = source.uvAnimationMaskTexture;
			this.normalMapType = source.normalMapType;
			this.uvAnimationScrollXSpeedFactor = source.uvAnimationScrollXSpeedFactor;
			this.uvAnimationScrollYSpeedFactor = source.uvAnimationScrollYSpeedFactor;
			this.uvAnimationRotationSpeedFactor = source.uvAnimationRotationSpeedFactor;
			this.ignoreVertexColor = source.ignoreVertexColor;
			this.v0CompatShade = source.v0CompatShade;
			this.debugMode = source.debugMode;
			this.outlineWidthMode = source.outlineWidthMode;
			this.isOutline = source.isOutline;
			this.needsUpdate = true;
			return this;
		}
		/**
		* Update UV animation state.
		* Intended to be called via {@link update}.
		* @param delta deltaTime
		*/
		_updateUVAnimation(delta) {
			this.uniforms.uvAnimationScrollXOffset.value += delta * this.uvAnimationScrollXSpeedFactor;
			this.uniforms.uvAnimationScrollYOffset.value += delta * this.uvAnimationScrollYSpeedFactor;
			this.uniforms.uvAnimationRotationPhase.value += delta * this.uvAnimationRotationSpeedFactor;
			this.uniforms.alphaTest.value = this.alphaTest;
			this.uniformsNeedUpdate = true;
		}
		/**
		* Upload uniforms that need to upload but doesn't automatically because of reasons.
		* Intended to be called via {@link constructor} and {@link update}.
		*/
		_uploadUniformsWorkaround() {
			this.uniforms.opacity.value = this.opacity;
			this._updateTextureMatrix(this.uniforms.map, this.uniforms.mapUvTransform);
			this._updateTextureMatrix(this.uniforms.normalMap, this.uniforms.normalMapUvTransform);
			this._updateTextureMatrix(this.uniforms.emissiveMap, this.uniforms.emissiveMapUvTransform);
			this._updateTextureMatrix(this.uniforms.shadeMultiplyTexture, this.uniforms.shadeMultiplyTextureUvTransform);
			this._updateTextureMatrix(this.uniforms.shadingShiftTexture, this.uniforms.shadingShiftTextureUvTransform);
			this._updateTextureMatrix(this.uniforms.matcapTexture, this.uniforms.matcapTextureUvTransform);
			this._updateTextureMatrix(this.uniforms.rimMultiplyTexture, this.uniforms.rimMultiplyTextureUvTransform);
			this._updateTextureMatrix(this.uniforms.outlineWidthMultiplyTexture, this.uniforms.outlineWidthMultiplyTextureUvTransform);
			this._updateTextureMatrix(this.uniforms.uvAnimationMaskTexture, this.uniforms.uvAnimationMaskTextureUvTransform);
			this.uniformsNeedUpdate = true;
		}
		/**
		* Returns a map object of preprocessor token and macro of the shader program.
		*/
		_generateDefines() {
			const threeRevision = parseInt(THREE42.REVISION, 10);
			const useUvInVert = this.outlineWidthMultiplyTexture !== null;
			const useUvInFrag = this.map !== null || this.normalMap !== null || this.emissiveMap !== null || this.shadeMultiplyTexture !== null || this.shadingShiftTexture !== null || this.rimMultiplyTexture !== null || this.uvAnimationMaskTexture !== null;
			return {
				THREE_VRM_THREE_REVISION: threeRevision,
				OUTLINE: this._isOutline,
				MTOON_USE_UV: useUvInVert || useUvInFrag,
				MTOON_UVS_VERTEX_ONLY: useUvInVert && !useUvInFrag,
				V0_COMPAT_SHADE: this._v0CompatShade,
				USE_SHADEMULTIPLYTEXTURE: this.shadeMultiplyTexture !== null,
				USE_SHADINGSHIFTTEXTURE: this.shadingShiftTexture !== null,
				USE_MATCAPTEXTURE: this.matcapTexture !== null,
				USE_RIMMULTIPLYTEXTURE: this.rimMultiplyTexture !== null,
				USE_OUTLINEWIDTHMULTIPLYTEXTURE: this._isOutline && this.outlineWidthMultiplyTexture !== null,
				USE_UVANIMATIONMASKTEXTURE: this.uvAnimationMaskTexture !== null,
				IGNORE_VERTEX_COLOR: this._ignoreVertexColor === true,
				DEBUG_NORMAL: this._debugMode === "normal",
				DEBUG_LITSHADERATE: this._debugMode === "litShadeRate",
				DEBUG_UV: this._debugMode === "uv",
				OUTLINE_WIDTH_SCREEN: this._isOutline && this._outlineWidthMode === MToonMaterialOutlineWidthMode.ScreenCoordinates
			};
		}
		_updateTextureMatrix(src, dst) {
			if (src.value) {
				if (src.value.matrixAutoUpdate) src.value.updateMatrix();
				dst.value.copy(src.value.matrix);
			}
		}
	};
	var POSSIBLE_SPEC_VERSIONS6 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var _MToonMaterialLoaderPlugin = class _MToonMaterialLoaderPlugin2 {
		get name() {
			return _MToonMaterialLoaderPlugin2.EXTENSION_NAME;
		}
		constructor(parser, options = {}) {
			var _a, _b, _c, _d;
			this.parser = parser;
			this.materialType = (_a = options.materialType) != null ? _a : MToonMaterial;
			this.renderOrderOffset = (_b = options.renderOrderOffset) != null ? _b : 0;
			this.v0CompatShade = (_c = options.v0CompatShade) != null ? _c : false;
			this.debugMode = (_d = options.debugMode) != null ? _d : "none";
			this._mToonMaterialSet = /* @__PURE__ */ new Set();
		}
		beforeRoot() {
			return __async3(this, null, function* () {
				this._removeUnlitExtensionIfMToonExists();
			});
		}
		afterRoot(gltf) {
			return __async3(this, null, function* () {
				gltf.userData.vrmMToonMaterials = Array.from(this._mToonMaterialSet);
			});
		}
		getMaterialType(materialIndex) {
			if (this._getMToonExtension(materialIndex)) return this.materialType;
			return null;
		}
		extendMaterialParams(materialIndex, materialParams) {
			const extension = this._getMToonExtension(materialIndex);
			if (extension) return this._extendMaterialParams(extension, materialParams);
			return null;
		}
		loadMesh(meshIndex) {
			return __async3(this, null, function* () {
				var _a;
				const parser = this.parser;
				const meshDef = (_a = parser.json.meshes) == null ? void 0 : _a[meshIndex];
				if (meshDef == null) throw new Error(`MToonMaterialLoaderPlugin: Attempt to use meshes[${meshIndex}] of glTF but the mesh doesn't exist`);
				const primitivesDef = meshDef.primitives;
				const meshOrGroup = yield parser.loadMesh(meshIndex);
				if (primitivesDef.length === 1) {
					const mesh = meshOrGroup;
					const materialIndex = primitivesDef[0].material;
					if (materialIndex != null) this._setupPrimitive(mesh, materialIndex);
				} else {
					const group = meshOrGroup;
					for (let i = 0; i < primitivesDef.length; i++) {
						const mesh = group.children[i];
						const materialIndex = primitivesDef[i].material;
						if (materialIndex != null) this._setupPrimitive(mesh, materialIndex);
					}
				}
				return meshOrGroup;
			});
		}
		/**
		* Delete use of `KHR_materials_unlit` from its `materials` if the material is using MToon.
		*
		* Since GLTFLoader have so many hardcoded procedure related to `KHR_materials_unlit`
		* we have to delete the extension before we start to parse the glTF.
		*/
		_removeUnlitExtensionIfMToonExists() {
			this.parser.json.materials?.map((materialDef, iMaterial) => {
				var _a;
				if (this._getMToonExtension(iMaterial) && ((_a = materialDef.extensions) == null ? void 0 : _a["KHR_materials_unlit"])) delete materialDef.extensions["KHR_materials_unlit"];
			});
		}
		_getMToonExtension(materialIndex) {
			var _a, _b;
			const materialDef = (_a = this.parser.json.materials) == null ? void 0 : _a[materialIndex];
			if (materialDef == null) {
				console.warn(`MToonMaterialLoaderPlugin: Attempt to use materials[${materialIndex}] of glTF but the material doesn't exist`);
				return;
			}
			const extension = (_b = materialDef.extensions) == null ? void 0 : _b[_MToonMaterialLoaderPlugin2.EXTENSION_NAME];
			if (extension == null) return;
			const specVersion = extension.specVersion;
			if (!POSSIBLE_SPEC_VERSIONS6.has(specVersion)) {
				console.warn(`MToonMaterialLoaderPlugin: Unknown ${_MToonMaterialLoaderPlugin2.EXTENSION_NAME} specVersion "${specVersion}"`);
				return;
			}
			return extension;
		}
		_extendMaterialParams(extension, materialParams) {
			return __async3(this, null, function* () {
				var _a;
				delete materialParams.metalness;
				delete materialParams.roughness;
				const assignHelper = new GLTFMToonMaterialParamsAssignHelper(this.parser, materialParams);
				assignHelper.assignPrimitive("transparentWithZWrite", extension.transparentWithZWrite);
				assignHelper.assignColor("shadeColorFactor", extension.shadeColorFactor);
				assignHelper.assignTexture("shadeMultiplyTexture", extension.shadeMultiplyTexture, true);
				assignHelper.assignPrimitive("shadingShiftFactor", extension.shadingShiftFactor);
				assignHelper.assignTexture("shadingShiftTexture", extension.shadingShiftTexture, true);
				assignHelper.assignPrimitive("shadingShiftTextureScale", (_a = extension.shadingShiftTexture) == null ? void 0 : _a.scale);
				assignHelper.assignPrimitive("shadingToonyFactor", extension.shadingToonyFactor);
				assignHelper.assignPrimitive("giEqualizationFactor", extension.giEqualizationFactor);
				assignHelper.assignColor("matcapFactor", extension.matcapFactor);
				assignHelper.assignTexture("matcapTexture", extension.matcapTexture, true);
				assignHelper.assignColor("parametricRimColorFactor", extension.parametricRimColorFactor);
				assignHelper.assignTexture("rimMultiplyTexture", extension.rimMultiplyTexture, true);
				assignHelper.assignPrimitive("rimLightingMixFactor", extension.rimLightingMixFactor);
				assignHelper.assignPrimitive("parametricRimFresnelPowerFactor", extension.parametricRimFresnelPowerFactor);
				assignHelper.assignPrimitive("parametricRimLiftFactor", extension.parametricRimLiftFactor);
				assignHelper.assignPrimitive("outlineWidthMode", extension.outlineWidthMode);
				assignHelper.assignPrimitive("outlineWidthFactor", extension.outlineWidthFactor);
				assignHelper.assignTexture("outlineWidthMultiplyTexture", extension.outlineWidthMultiplyTexture, false);
				assignHelper.assignColor("outlineColorFactor", extension.outlineColorFactor);
				assignHelper.assignPrimitive("outlineLightingMixFactor", extension.outlineLightingMixFactor);
				assignHelper.assignTexture("uvAnimationMaskTexture", extension.uvAnimationMaskTexture, false);
				assignHelper.assignPrimitive("uvAnimationScrollXSpeedFactor", extension.uvAnimationScrollXSpeedFactor);
				assignHelper.assignPrimitive("uvAnimationScrollYSpeedFactor", extension.uvAnimationScrollYSpeedFactor);
				assignHelper.assignPrimitive("uvAnimationRotationSpeedFactor", extension.uvAnimationRotationSpeedFactor);
				assignHelper.assignPrimitive("v0CompatShade", this.v0CompatShade);
				assignHelper.assignPrimitive("debugMode", this.debugMode);
				yield assignHelper.pending;
			});
		}
		/**
		* This will do two processes that is required to render MToon properly.
		*
		* - Set render order
		* - Generate outline
		*
		* @param mesh A target GLTF primitive
		* @param materialIndex The material index of the primitive
		*/
		_setupPrimitive(mesh, materialIndex) {
			const extension = this._getMToonExtension(materialIndex);
			if (extension) {
				mesh.renderOrder = this._parseRenderOrder(extension) + this.renderOrderOffset;
				this._generateOutline(mesh);
				this._addToMaterialSet(mesh);
				return;
			}
		}
		/**
		* Check whether the material should generate outline or not.
		* @param surfaceMaterial The material to check
		* @returns True if the material should generate outline
		*/
		_shouldGenerateOutline(surfaceMaterial) {
			return typeof surfaceMaterial.outlineWidthMode === "string" && surfaceMaterial.outlineWidthMode !== "none" && typeof surfaceMaterial.outlineWidthFactor === "number" && surfaceMaterial.outlineWidthFactor > 0;
		}
		/**
		* Generate outline for the given mesh, if it needs.
		*
		* @param mesh The target mesh
		*/
		_generateOutline(mesh) {
			const surfaceMaterial = mesh.material;
			if (!(surfaceMaterial instanceof THREE52.Material)) return;
			if (!this._shouldGenerateOutline(surfaceMaterial)) return;
			mesh.material = [surfaceMaterial];
			const outlineMaterial = surfaceMaterial.clone();
			outlineMaterial.name += " (Outline)";
			outlineMaterial.isOutline = true;
			outlineMaterial.side = THREE52.BackSide;
			mesh.material.push(outlineMaterial);
			const geometry = mesh.geometry;
			const primitiveVertices = geometry.index ? geometry.index.count : geometry.attributes.position.count / 3;
			geometry.addGroup(0, primitiveVertices, 0);
			geometry.addGroup(0, primitiveVertices, 1);
		}
		_addToMaterialSet(mesh) {
			const materialOrMaterials = mesh.material;
			const materialSet = /* @__PURE__ */ new Set();
			if (Array.isArray(materialOrMaterials)) materialOrMaterials.forEach((material) => materialSet.add(material));
			else materialSet.add(materialOrMaterials);
			for (const material of materialSet) this._mToonMaterialSet.add(material);
		}
		_parseRenderOrder(extension) {
			var _a;
			return (extension.transparentWithZWrite ? 0 : 19) + ((_a = extension.renderQueueOffsetNumber) != null ? _a : 0);
		}
	};
	_MToonMaterialLoaderPlugin.EXTENSION_NAME = "VRMC_materials_mtoon";
	var MToonMaterialLoaderPlugin = _MToonMaterialLoaderPlugin;
	var __async4 = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	var _VRMMaterialsHDREmissiveMultiplierLoaderPlugin = class _VRMMaterialsHDREmissiveMultiplierLoaderPlugin2 {
		get name() {
			return _VRMMaterialsHDREmissiveMultiplierLoaderPlugin2.EXTENSION_NAME;
		}
		constructor(parser) {
			this.parser = parser;
		}
		extendMaterialParams(materialIndex, materialParams) {
			return __async4(this, null, function* () {
				const extension = this._getHDREmissiveMultiplierExtension(materialIndex);
				if (extension == null) return;
				console.warn("VRMMaterialsHDREmissiveMultiplierLoaderPlugin: `VRMC_materials_hdr_emissiveMultiplier` is archived. Use `KHR_materials_emissive_strength` instead.");
				materialParams.emissiveIntensity = extension.emissiveMultiplier;
			});
		}
		_getHDREmissiveMultiplierExtension(materialIndex) {
			var _a, _b;
			const materialDef = (_a = this.parser.json.materials) == null ? void 0 : _a[materialIndex];
			if (materialDef == null) {
				console.warn(`VRMMaterialsHDREmissiveMultiplierLoaderPlugin: Attempt to use materials[${materialIndex}] of glTF but the material doesn't exist`);
				return;
			}
			const extension = (_b = materialDef.extensions) == null ? void 0 : _b[_VRMMaterialsHDREmissiveMultiplierLoaderPlugin2.EXTENSION_NAME];
			if (extension == null) return;
			return extension;
		}
	};
	_VRMMaterialsHDREmissiveMultiplierLoaderPlugin.EXTENSION_NAME = "VRMC_materials_hdr_emissiveMultiplier";
	var VRMMaterialsHDREmissiveMultiplierLoaderPlugin = _VRMMaterialsHDREmissiveMultiplierLoaderPlugin;
	var __defProp2 = Object.defineProperty;
	var __defProps = Object.defineProperties;
	var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
	var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
	var __hasOwnProp2 = Object.prototype.hasOwnProperty;
	var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
	var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, {
		enumerable: true,
		configurable: true,
		writable: true,
		value
	}) : obj[key] = value;
	var __spreadValues2 = (a, b) => {
		for (var prop in b || (b = {})) if (__hasOwnProp2.call(b, prop)) __defNormalProp2(a, prop, b[prop]);
		if (__getOwnPropSymbols2) {
			for (var prop of __getOwnPropSymbols2(b)) if (__propIsEnum2.call(b, prop)) __defNormalProp2(a, prop, b[prop]);
		}
		return a;
	};
	var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
	var __async5 = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	function gammaEOTF(e) {
		return Math.pow(e, 2.2);
	}
	var VRMMaterialsV0CompatPlugin = class {
		get name() {
			return "VRMMaterialsV0CompatPlugin";
		}
		constructor(parser) {
			var _a;
			this.parser = parser;
			this._renderQueueMapTransparent = /* @__PURE__ */ new Map();
			this._renderQueueMapTransparentZWrite = /* @__PURE__ */ new Map();
			const json = this.parser.json;
			json.extensionsUsed = (_a = json.extensionsUsed) != null ? _a : [];
			if (json.extensionsUsed.indexOf("KHR_texture_transform") === -1) json.extensionsUsed.push("KHR_texture_transform");
		}
		beforeRoot() {
			return __async5(this, null, function* () {
				var _a;
				const json = this.parser.json;
				const v0VRMExtension = (_a = json.extensions) == null ? void 0 : _a["VRM"];
				const v0MaterialProperties = v0VRMExtension == null ? void 0 : v0VRMExtension.materialProperties;
				if (!v0MaterialProperties) return;
				this._populateRenderQueueMap(v0MaterialProperties);
				v0MaterialProperties.forEach((materialProperties, materialIndex) => {
					var _a2, _b;
					const materialDef = (_a2 = json.materials) == null ? void 0 : _a2[materialIndex];
					if (materialDef == null) {
						console.warn(`VRMMaterialsV0CompatPlugin: Attempt to use materials[${materialIndex}] of glTF but the material doesn't exist`);
						return;
					}
					if (materialProperties.shader === "VRM/MToon") {
						const material = this._parseV0MToonProperties(materialProperties, materialDef);
						json.materials[materialIndex] = material;
					} else if ((_b = materialProperties.shader) == null ? void 0 : _b.startsWith("VRM/Unlit")) {
						const material = this._parseV0UnlitProperties(materialProperties, materialDef);
						json.materials[materialIndex] = material;
					} else if (materialProperties.shader === "VRM_USE_GLTFSHADER") {} else console.warn(`VRMMaterialsV0CompatPlugin: Unknown shader: ${materialProperties.shader}`);
				});
			});
		}
		_parseV0MToonProperties(materialProperties, schemaMaterial) {
			var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa;
			const isTransparent = (_b = (_a = materialProperties.keywordMap) == null ? void 0 : _a["_ALPHABLEND_ON"]) != null ? _b : false;
			const transparentWithZWrite = ((_c = materialProperties.floatProperties) == null ? void 0 : _c["_ZWrite"]) === 1 && isTransparent;
			const renderQueueOffsetNumber = this._v0ParseRenderQueue(materialProperties);
			const isCutoff = (_e = (_d = materialProperties.keywordMap) == null ? void 0 : _d["_ALPHATEST_ON"]) != null ? _e : false;
			const alphaMode = isTransparent ? "BLEND" : isCutoff ? "MASK" : "OPAQUE";
			const alphaCutoff = isCutoff ? (_g = (_f = materialProperties.floatProperties) == null ? void 0 : _f["_Cutoff"]) != null ? _g : .5 : void 0;
			const doubleSided = ((_i = (_h = materialProperties.floatProperties) == null ? void 0 : _h["_CullMode"]) != null ? _i : 2) === 0;
			const textureTransformExt = this._portTextureTransform(materialProperties);
			const baseColorFactor = ((_k = (_j = materialProperties.vectorProperties) == null ? void 0 : _j["_Color"]) != null ? _k : [
				1,
				1,
				1,
				1
			]).map((v, i) => i === 3 ? v : gammaEOTF(v));
			const baseColorTextureIndex = (_l = materialProperties.textureProperties) == null ? void 0 : _l["_MainTex"];
			const baseColorTexture = baseColorTextureIndex != null ? {
				index: baseColorTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const normalTextureScale = (_n = (_m = materialProperties.floatProperties) == null ? void 0 : _m["_BumpScale"]) != null ? _n : 1;
			const normalTextureIndex = (_o = materialProperties.textureProperties) == null ? void 0 : _o["_BumpMap"];
			const normalTexture = normalTextureIndex != null ? {
				index: normalTextureIndex,
				scale: normalTextureScale,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const emissiveFactor = ((_q = (_p = materialProperties.vectorProperties) == null ? void 0 : _p["_EmissionColor"]) != null ? _q : [
				0,
				0,
				0,
				1
			]).map(gammaEOTF);
			const emissiveTextureIndex = (_r = materialProperties.textureProperties) == null ? void 0 : _r["_EmissionMap"];
			const emissiveTexture = emissiveTextureIndex != null ? {
				index: emissiveTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const shadeColorFactor = ((_t = (_s = materialProperties.vectorProperties) == null ? void 0 : _s["_ShadeColor"]) != null ? _t : [
				.97,
				.81,
				.86,
				1
			]).map(gammaEOTF);
			const shadeMultiplyTextureIndex = (_u = materialProperties.textureProperties) == null ? void 0 : _u["_ShadeTexture"];
			const shadeMultiplyTexture = shadeMultiplyTextureIndex != null ? {
				index: shadeMultiplyTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			let shadingShiftFactor = (_w = (_v = materialProperties.floatProperties) == null ? void 0 : _v["_ShadeShift"]) != null ? _w : 0;
			let shadingToonyFactor = (_y = (_x = materialProperties.floatProperties) == null ? void 0 : _x["_ShadeToony"]) != null ? _y : .9;
			shadingToonyFactor = THREE18.MathUtils.lerp(shadingToonyFactor, 1, .5 + .5 * shadingShiftFactor);
			shadingShiftFactor = -shadingShiftFactor - (1 - shadingToonyFactor);
			const giIntensityFactor = (_A = (_z = materialProperties.floatProperties) == null ? void 0 : _z["_IndirectLightIntensity"]) != null ? _A : .1;
			const giEqualizationFactor = giIntensityFactor ? 1 - giIntensityFactor : void 0;
			const matcapTextureIndex = (_B = materialProperties.textureProperties) == null ? void 0 : _B["_SphereAdd"];
			const matcapFactor = matcapTextureIndex != null ? [
				1,
				1,
				1
			] : void 0;
			const matcapTexture = matcapTextureIndex != null ? { index: matcapTextureIndex } : void 0;
			const rimLightingMixFactor = (_D = (_C = materialProperties.floatProperties) == null ? void 0 : _C["_RimLightingMix"]) != null ? _D : 0;
			const rimMultiplyTextureIndex = (_E = materialProperties.textureProperties) == null ? void 0 : _E["_RimTexture"];
			const rimMultiplyTexture = rimMultiplyTextureIndex != null ? {
				index: rimMultiplyTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const parametricRimColorFactor = ((_G = (_F = materialProperties.vectorProperties) == null ? void 0 : _F["_RimColor"]) != null ? _G : [
				0,
				0,
				0,
				1
			]).map(gammaEOTF);
			const parametricRimFresnelPowerFactor = (_I = (_H = materialProperties.floatProperties) == null ? void 0 : _H["_RimFresnelPower"]) != null ? _I : 1;
			const parametricRimLiftFactor = (_K = (_J = materialProperties.floatProperties) == null ? void 0 : _J["_RimLift"]) != null ? _K : 0;
			const outlineWidthMode = [
				"none",
				"worldCoordinates",
				"screenCoordinates"
			][(_M = (_L = materialProperties.floatProperties) == null ? void 0 : _L["_OutlineWidthMode"]) != null ? _M : 0];
			let outlineWidthFactor = (_O = (_N = materialProperties.floatProperties) == null ? void 0 : _N["_OutlineWidth"]) != null ? _O : 0;
			outlineWidthFactor = .01 * outlineWidthFactor;
			const outlineWidthMultiplyTextureIndex = (_P = materialProperties.textureProperties) == null ? void 0 : _P["_OutlineWidthTexture"];
			const outlineWidthMultiplyTexture = outlineWidthMultiplyTextureIndex != null ? {
				index: outlineWidthMultiplyTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const outlineColorFactor = ((_R = (_Q = materialProperties.vectorProperties) == null ? void 0 : _Q["_OutlineColor"]) != null ? _R : [
				0,
				0,
				0
			]).map(gammaEOTF);
			const outlineLightingMixFactor = ((_T = (_S = materialProperties.floatProperties) == null ? void 0 : _S["_OutlineColorMode"]) != null ? _T : 0) === 1 ? (_V = (_U = materialProperties.floatProperties) == null ? void 0 : _U["_OutlineLightingMix"]) != null ? _V : 1 : 0;
			const uvAnimationMaskTextureIndex = (_W = materialProperties.textureProperties) == null ? void 0 : _W["_UvAnimMaskTexture"];
			const uvAnimationMaskTexture = uvAnimationMaskTextureIndex != null ? {
				index: uvAnimationMaskTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const uvAnimationScrollXSpeedFactor = (_Y = (_X = materialProperties.floatProperties) == null ? void 0 : _X["_UvAnimScrollX"]) != null ? _Y : 0;
			let uvAnimationScrollYSpeedFactor = (__ = (_Z = materialProperties.floatProperties) == null ? void 0 : _Z["_UvAnimScrollY"]) != null ? __ : 0;
			if (uvAnimationScrollYSpeedFactor != null) uvAnimationScrollYSpeedFactor = -uvAnimationScrollYSpeedFactor;
			const uvAnimationRotationSpeedFactor = (_aa = (_$ = materialProperties.floatProperties) == null ? void 0 : _$["_UvAnimRotation"]) != null ? _aa : 0;
			const mtoonExtension = {
				specVersion: "1.0",
				transparentWithZWrite,
				renderQueueOffsetNumber,
				shadeColorFactor,
				shadeMultiplyTexture,
				shadingShiftFactor,
				shadingToonyFactor,
				giEqualizationFactor,
				matcapFactor,
				matcapTexture,
				rimLightingMixFactor,
				rimMultiplyTexture,
				parametricRimColorFactor,
				parametricRimFresnelPowerFactor,
				parametricRimLiftFactor,
				outlineWidthMode,
				outlineWidthFactor,
				outlineWidthMultiplyTexture,
				outlineColorFactor,
				outlineLightingMixFactor,
				uvAnimationMaskTexture,
				uvAnimationScrollXSpeedFactor,
				uvAnimationScrollYSpeedFactor,
				uvAnimationRotationSpeedFactor
			};
			return __spreadProps(__spreadValues2({}, schemaMaterial), {
				pbrMetallicRoughness: {
					baseColorFactor,
					baseColorTexture
				},
				normalTexture,
				emissiveTexture,
				emissiveFactor,
				alphaMode,
				alphaCutoff,
				doubleSided,
				extensions: { VRMC_materials_mtoon: mtoonExtension }
			});
		}
		_parseV0UnlitProperties(materialProperties, schemaMaterial) {
			var _a, _b, _c, _d, _e;
			const isTransparentZWrite = materialProperties.shader === "VRM/UnlitTransparentZWrite";
			const isTransparent = materialProperties.shader === "VRM/UnlitTransparent" || isTransparentZWrite;
			const renderQueueOffsetNumber = this._v0ParseRenderQueue(materialProperties);
			const isCutoff = materialProperties.shader === "VRM/UnlitCutout";
			const alphaMode = isTransparent ? "BLEND" : isCutoff ? "MASK" : "OPAQUE";
			const alphaCutoff = isCutoff ? (_b = (_a = materialProperties.floatProperties) == null ? void 0 : _a["_Cutoff"]) != null ? _b : .5 : void 0;
			const textureTransformExt = this._portTextureTransform(materialProperties);
			const baseColorFactor = ((_d = (_c = materialProperties.vectorProperties) == null ? void 0 : _c["_Color"]) != null ? _d : [
				1,
				1,
				1,
				1
			]).map(gammaEOTF);
			const baseColorTextureIndex = (_e = materialProperties.textureProperties) == null ? void 0 : _e["_MainTex"];
			const baseColorTexture = baseColorTextureIndex != null ? {
				index: baseColorTextureIndex,
				extensions: __spreadValues2({}, textureTransformExt)
			} : void 0;
			const mtoonExtension = {
				specVersion: "1.0",
				transparentWithZWrite: isTransparentZWrite,
				renderQueueOffsetNumber,
				shadeColorFactor: baseColorFactor,
				shadeMultiplyTexture: baseColorTexture
			};
			return __spreadProps(__spreadValues2({}, schemaMaterial), {
				pbrMetallicRoughness: {
					baseColorFactor,
					baseColorTexture
				},
				alphaMode,
				alphaCutoff,
				extensions: { VRMC_materials_mtoon: mtoonExtension }
			});
		}
		/**
		* Create a glTF `KHR_texture_transform` extension from v0 texture transform info.
		*/
		_portTextureTransform(materialProperties) {
			var _a, _b, _c, _d, _e;
			const textureTransform = (_a = materialProperties.vectorProperties) == null ? void 0 : _a["_MainTex"];
			if (textureTransform == null) return {};
			const offset = [(_b = textureTransform == null ? void 0 : textureTransform[0]) != null ? _b : 0, (_c = textureTransform == null ? void 0 : textureTransform[1]) != null ? _c : 0];
			const scale = [(_d = textureTransform == null ? void 0 : textureTransform[2]) != null ? _d : 1, (_e = textureTransform == null ? void 0 : textureTransform[3]) != null ? _e : 1];
			offset[1] = 1 - scale[1] - offset[1];
			return { KHR_texture_transform: {
				offset,
				scale
			} };
		}
		/**
		* Convert v0 render order into v1 render order.
		* This uses a map from v0 render queue to v1 compliant render queue offset which is generated in {@link _populateRenderQueueMap}.
		*/
		_v0ParseRenderQueue(materialProperties) {
			var _a, _b;
			const isTransparentZWrite = materialProperties.shader === "VRM/UnlitTransparentZWrite";
			const isTransparent = ((_a = materialProperties.keywordMap) == null ? void 0 : _a["_ALPHABLEND_ON"]) != void 0 || materialProperties.shader === "VRM/UnlitTransparent" || isTransparentZWrite;
			const enabledZWrite = ((_b = materialProperties.floatProperties) == null ? void 0 : _b["_ZWrite"]) === 1 || isTransparentZWrite;
			let offset = 0;
			if (isTransparent) {
				const v0Queue = materialProperties.renderQueue;
				if (v0Queue != null) {
					if (enabledZWrite) offset = this._renderQueueMapTransparentZWrite.get(v0Queue);
					else offset = this._renderQueueMapTransparent.get(v0Queue);
				}
			}
			return offset;
		}
		/**
		* Create a map which maps v0 render queue to v1 compliant render queue offset.
		* This lists up all render queues the model use and creates a map to new render queue offsets in the same order.
		*/
		_populateRenderQueueMap(materialPropertiesList) {
			const renderQueuesTransparent = /* @__PURE__ */ new Set();
			const renderQueuesTransparentZWrite = /* @__PURE__ */ new Set();
			materialPropertiesList.forEach((materialProperties) => {
				var _a, _b;
				const isTransparentZWrite = materialProperties.shader === "VRM/UnlitTransparentZWrite";
				const isTransparent = ((_a = materialProperties.keywordMap) == null ? void 0 : _a["_ALPHABLEND_ON"]) != void 0 || materialProperties.shader === "VRM/UnlitTransparent" || isTransparentZWrite;
				const enabledZWrite = ((_b = materialProperties.floatProperties) == null ? void 0 : _b["_ZWrite"]) === 1 || isTransparentZWrite;
				if (isTransparent) {
					const v0Queue = materialProperties.renderQueue;
					if (v0Queue != null) {
						if (enabledZWrite) renderQueuesTransparentZWrite.add(v0Queue);
						else renderQueuesTransparent.add(v0Queue);
					}
				}
			});
			if (renderQueuesTransparent.size > 10) console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${renderQueuesTransparent.size} render queues for Transparent materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`);
			if (renderQueuesTransparentZWrite.size > 10) console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${renderQueuesTransparentZWrite.size} render queues for TransparentZWrite materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`);
			Array.from(renderQueuesTransparent).sort().forEach((queue, i) => {
				const newQueueOffset = Math.min(Math.max(i - renderQueuesTransparent.size + 1, -9), 0);
				this._renderQueueMapTransparent.set(queue, newQueueOffset);
			});
			Array.from(renderQueuesTransparentZWrite).sort().forEach((queue, i) => {
				const newQueueOffset = Math.min(Math.max(i, 0), 9);
				this._renderQueueMapTransparentZWrite.set(queue, newQueueOffset);
			});
		}
	};
	var __async6 = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	var _v3A6 = new THREE19.Vector3();
	var VRMNodeConstraintHelper = class extends THREE19.Group {
		constructor(constraint) {
			super();
			this._attrPosition = new THREE19.BufferAttribute(new Float32Array([
				0,
				0,
				0,
				0,
				0,
				0
			]), 3);
			this._attrPosition.setUsage(THREE19.DynamicDrawUsage);
			const geometry = new THREE19.BufferGeometry();
			geometry.setAttribute("position", this._attrPosition);
			const material = new THREE19.LineBasicMaterial({
				color: 16711935,
				depthTest: false,
				depthWrite: false
			});
			this._line = new THREE19.Line(geometry, material);
			this.add(this._line);
			this.constraint = constraint;
		}
		updateMatrixWorld(force) {
			_v3A6.setFromMatrixPosition(this.constraint.destination.matrixWorld);
			this._attrPosition.setXYZ(0, _v3A6.x, _v3A6.y, _v3A6.z);
			if (this.constraint.source) _v3A6.setFromMatrixPosition(this.constraint.source.matrixWorld);
			this._attrPosition.setXYZ(1, _v3A6.x, _v3A6.y, _v3A6.z);
			this._attrPosition.needsUpdate = true;
			super.updateMatrixWorld(force);
		}
	};
	function decomposePosition(matrix, target) {
		return target.set(matrix.elements[12], matrix.elements[13], matrix.elements[14]);
	}
	var _v3A22 = new THREE23.Vector3();
	var _v3B4 = new THREE23.Vector3();
	function decomposeRotation(matrix, target) {
		matrix.decompose(_v3A22, target, _v3B4);
		return target;
	}
	function quatInvertCompat2(target) {
		if (target.invert) target.invert();
		else target.inverse();
		return target;
	}
	var VRMNodeConstraint = class {
		/**
		* @param destination The destination object
		* @param source The source object
		*/
		constructor(destination, source) {
			this.destination = destination;
			this.source = source;
			this.weight = 1;
		}
	};
	var _v3A32 = new THREE33.Vector3();
	var _v3B22 = new THREE33.Vector3();
	var _v3C2 = new THREE33.Vector3();
	var _quatA7 = new THREE33.Quaternion();
	var _quatB4 = new THREE33.Quaternion();
	var _quatC2 = new THREE33.Quaternion();
	var VRMAimConstraint = class extends VRMNodeConstraint {
		/**
		* The aim axis of the constraint.
		*/
		get aimAxis() {
			return this._aimAxis;
		}
		/**
		* The aim axis of the constraint.
		*/
		set aimAxis(aimAxis) {
			this._aimAxis = aimAxis;
			this._v3AimAxis.set(aimAxis === "PositiveX" ? 1 : aimAxis === "NegativeX" ? -1 : 0, aimAxis === "PositiveY" ? 1 : aimAxis === "NegativeY" ? -1 : 0, aimAxis === "PositiveZ" ? 1 : aimAxis === "NegativeZ" ? -1 : 0);
		}
		get dependencies() {
			const set = /* @__PURE__ */ new Set([this.source]);
			if (this.destination.parent) set.add(this.destination.parent);
			return set;
		}
		constructor(destination, source) {
			super(destination, source);
			this._aimAxis = "PositiveX";
			this._v3AimAxis = new THREE33.Vector3(1, 0, 0);
			this._dstRestQuat = new THREE33.Quaternion();
		}
		setInitState() {
			this._dstRestQuat.copy(this.destination.quaternion);
		}
		update() {
			this.destination.updateWorldMatrix(true, false);
			this.source.updateWorldMatrix(true, false);
			const dstParentWorldQuat = _quatA7.identity();
			const invDstParentWorldQuat = _quatB4.identity();
			if (this.destination.parent) {
				decomposeRotation(this.destination.parent.matrixWorld, dstParentWorldQuat);
				quatInvertCompat2(invDstParentWorldQuat.copy(dstParentWorldQuat));
			}
			const a0 = _v3A32.copy(this._v3AimAxis).applyQuaternion(this._dstRestQuat).applyQuaternion(dstParentWorldQuat);
			const a1 = decomposePosition(this.source.matrixWorld, _v3B22).sub(decomposePosition(this.destination.matrixWorld, _v3C2)).normalize();
			const targetQuat = _quatC2.setFromUnitVectors(a0, a1).premultiply(invDstParentWorldQuat).multiply(dstParentWorldQuat).multiply(this._dstRestQuat);
			this.destination.quaternion.copy(this._dstRestQuat).slerp(targetQuat, this.weight);
		}
	};
	function traverseAncestorsFromRoot(object, callback) {
		const ancestors = [object];
		let head = object.parent;
		while (head !== null) {
			ancestors.unshift(head);
			head = head.parent;
		}
		ancestors.forEach((ancestor) => {
			callback(ancestor);
		});
	}
	var VRMNodeConstraintManager = class {
		constructor() {
			this._constraints = /* @__PURE__ */ new Set();
			this._objectConstraintsMap = /* @__PURE__ */ new Map();
		}
		get constraints() {
			return this._constraints;
		}
		addConstraint(constraint) {
			this._constraints.add(constraint);
			let objectSet = this._objectConstraintsMap.get(constraint.destination);
			if (objectSet == null) {
				objectSet = /* @__PURE__ */ new Set();
				this._objectConstraintsMap.set(constraint.destination, objectSet);
			}
			objectSet.add(constraint);
		}
		deleteConstraint(constraint) {
			this._constraints.delete(constraint);
			this._objectConstraintsMap.get(constraint.destination).delete(constraint);
		}
		setInitState() {
			const constraintsTried = /* @__PURE__ */ new Set();
			const constraintsDone = /* @__PURE__ */ new Set();
			for (const constraint of this._constraints) this._processConstraint(constraint, constraintsTried, constraintsDone, (constraint2) => constraint2.setInitState());
		}
		update() {
			const constraintsTried = /* @__PURE__ */ new Set();
			const constraintsDone = /* @__PURE__ */ new Set();
			for (const constraint of this._constraints) this._processConstraint(constraint, constraintsTried, constraintsDone, (constraint2) => constraint2.update());
		}
		/**
		* Update a constraint.
		* If there are other constraints that are dependant, it will try to update them recursively.
		* It might throw an error if there are circular dependencies.
		*
		* Intended to be used in {@link update} and {@link _processConstraint} itself recursively.
		*
		* @param constraint A constraint you want to update
		* @param constraintsTried Set of constraints that are already tried to be updated
		* @param constraintsDone Set of constraints that are already up to date
		*/
		_processConstraint(constraint, constraintsTried, constraintsDone, callback) {
			if (constraintsDone.has(constraint)) return;
			if (constraintsTried.has(constraint)) throw new Error("VRMNodeConstraintManager: Circular dependency detected while updating constraints");
			constraintsTried.add(constraint);
			const depObjects = constraint.dependencies;
			for (const depObject of depObjects) traverseAncestorsFromRoot(depObject, (depObjectAncestor) => {
				const objectSet = this._objectConstraintsMap.get(depObjectAncestor);
				if (objectSet) for (const depConstraint of objectSet) this._processConstraint(depConstraint, constraintsTried, constraintsDone, callback);
			});
			callback(constraint);
			constraintsDone.add(constraint);
		}
	};
	var _quatA22 = new THREE43.Quaternion();
	var _quatB22 = new THREE43.Quaternion();
	var VRMRotationConstraint = class extends VRMNodeConstraint {
		get dependencies() {
			return /* @__PURE__ */ new Set([this.source]);
		}
		constructor(destination, source) {
			super(destination, source);
			this._dstRestQuat = new THREE43.Quaternion();
			this._invSrcRestQuat = new THREE43.Quaternion();
		}
		setInitState() {
			this._dstRestQuat.copy(this.destination.quaternion);
			quatInvertCompat2(this._invSrcRestQuat.copy(this.source.quaternion));
		}
		update() {
			const srcDeltaQuat = _quatA22.copy(this._invSrcRestQuat).multiply(this.source.quaternion);
			const targetQuat = _quatB22.copy(this._dstRestQuat).multiply(srcDeltaQuat);
			this.destination.quaternion.copy(this._dstRestQuat).slerp(targetQuat, this.weight);
		}
	};
	var _v3A42 = new THREE53.Vector3();
	var _quatA32 = new THREE53.Quaternion();
	var _quatB32 = new THREE53.Quaternion();
	var VRMRollConstraint = class extends VRMNodeConstraint {
		/**
		* The roll axis of the constraint.
		*/
		get rollAxis() {
			return this._rollAxis;
		}
		/**
		* The roll axis of the constraint.
		*/
		set rollAxis(rollAxis) {
			this._rollAxis = rollAxis;
			this._v3RollAxis.set(rollAxis === "X" ? 1 : 0, rollAxis === "Y" ? 1 : 0, rollAxis === "Z" ? 1 : 0);
		}
		get dependencies() {
			return /* @__PURE__ */ new Set([this.source]);
		}
		constructor(destination, source) {
			super(destination, source);
			this._rollAxis = "X";
			this._v3RollAxis = new THREE53.Vector3(1, 0, 0);
			this._dstRestQuat = new THREE53.Quaternion();
			this._invDstRestQuat = new THREE53.Quaternion();
			this._invSrcRestQuatMulDstRestQuat = new THREE53.Quaternion();
		}
		setInitState() {
			this._dstRestQuat.copy(this.destination.quaternion);
			quatInvertCompat2(this._invDstRestQuat.copy(this._dstRestQuat));
			quatInvertCompat2(this._invSrcRestQuatMulDstRestQuat.copy(this.source.quaternion)).multiply(this._dstRestQuat);
		}
		update() {
			const quatDelta = _quatA32.copy(this._invDstRestQuat).multiply(this.source.quaternion).multiply(this._invSrcRestQuatMulDstRestQuat);
			const n1 = _v3A42.copy(this._v3RollAxis).applyQuaternion(quatDelta);
			const targetQuat = _quatB32.setFromUnitVectors(n1, this._v3RollAxis).premultiply(this._dstRestQuat).multiply(quatDelta);
			this.destination.quaternion.copy(this._dstRestQuat).slerp(targetQuat, this.weight);
		}
	};
	var POSSIBLE_SPEC_VERSIONS7 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var _VRMNodeConstraintLoaderPlugin = class _VRMNodeConstraintLoaderPlugin2 {
		get name() {
			return _VRMNodeConstraintLoaderPlugin2.EXTENSION_NAME;
		}
		constructor(parser, options) {
			this.parser = parser;
			this.helperRoot = options == null ? void 0 : options.helperRoot;
		}
		afterRoot(gltf) {
			return __async6(this, null, function* () {
				gltf.userData.vrmNodeConstraintManager = yield this._import(gltf);
			});
		}
		/**
		* Import constraints from a GLTF and returns a {@link VRMNodeConstraintManager}.
		* It might return `null` instead when it does not need to be created or something go wrong.
		*
		* @param gltf A parsed result of GLTF taken from GLTFLoader
		*/
		_import(gltf) {
			return __async6(this, null, function* () {
				var _a;
				const json = this.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf(_VRMNodeConstraintLoaderPlugin2.EXTENSION_NAME)) !== -1)) return null;
				const manager = new VRMNodeConstraintManager();
				const threeNodes = yield this.parser.getDependencies("node");
				threeNodes.forEach((node, nodeIndex) => {
					var _a2;
					const schemaNode = json.nodes[nodeIndex];
					const extension = (_a2 = schemaNode == null ? void 0 : schemaNode.extensions) == null ? void 0 : _a2[_VRMNodeConstraintLoaderPlugin2.EXTENSION_NAME];
					if (extension == null) return;
					const specVersion = extension.specVersion;
					if (!POSSIBLE_SPEC_VERSIONS7.has(specVersion)) {
						console.warn(`VRMNodeConstraintLoaderPlugin: Unknown ${_VRMNodeConstraintLoaderPlugin2.EXTENSION_NAME} specVersion "${specVersion}"`);
						return;
					}
					const constraintDef = extension.constraint;
					if (constraintDef.roll != null) {
						const constraint = this._importRollConstraint(node, threeNodes, constraintDef.roll);
						manager.addConstraint(constraint);
					} else if (constraintDef.aim != null) {
						const constraint = this._importAimConstraint(node, threeNodes, constraintDef.aim);
						manager.addConstraint(constraint);
					} else if (constraintDef.rotation != null) {
						const constraint = this._importRotationConstraint(node, threeNodes, constraintDef.rotation);
						manager.addConstraint(constraint);
					}
				});
				gltf.scene.updateMatrixWorld();
				manager.setInitState();
				return manager;
			});
		}
		_importRollConstraint(destination, nodes, rollConstraintDef) {
			const { source: sourceIndex, rollAxis, weight } = rollConstraintDef;
			const source = nodes[sourceIndex];
			const constraint = new VRMRollConstraint(destination, source);
			if (rollAxis != null) constraint.rollAxis = rollAxis;
			if (weight != null) constraint.weight = weight;
			if (this.helperRoot) {
				const helper = new VRMNodeConstraintHelper(constraint);
				this.helperRoot.add(helper);
			}
			return constraint;
		}
		_importAimConstraint(destination, nodes, aimConstraintDef) {
			const { source: sourceIndex, aimAxis, weight } = aimConstraintDef;
			const source = nodes[sourceIndex];
			const constraint = new VRMAimConstraint(destination, source);
			if (aimAxis != null) constraint.aimAxis = aimAxis;
			if (weight != null) constraint.weight = weight;
			if (this.helperRoot) {
				const helper = new VRMNodeConstraintHelper(constraint);
				this.helperRoot.add(helper);
			}
			return constraint;
		}
		_importRotationConstraint(destination, nodes, rotationConstraintDef) {
			const { source: sourceIndex, weight } = rotationConstraintDef;
			const source = nodes[sourceIndex];
			const constraint = new VRMRotationConstraint(destination, source);
			if (weight != null) constraint.weight = weight;
			if (this.helperRoot) {
				const helper = new VRMNodeConstraintHelper(constraint);
				this.helperRoot.add(helper);
			}
			return constraint;
		}
	};
	_VRMNodeConstraintLoaderPlugin.EXTENSION_NAME = "VRMC_node_constraint";
	var VRMNodeConstraintLoaderPlugin = _VRMNodeConstraintLoaderPlugin;
	var __async7 = (__this, __arguments, generator) => {
		return new Promise((resolve, reject) => {
			var fulfilled = (value) => {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			};
			var rejected = (value) => {
				try {
					step(generator.throw(value));
				} catch (e) {
					reject(e);
				}
			};
			var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
			step((generator = generator.apply(__this, __arguments)).next());
		});
	};
	var VRMSpringBoneColliderShape = class {};
	var _v3A7 = new THREE20.Vector3();
	var _v3B5 = new THREE20.Vector3();
	var VRMSpringBoneColliderShapeCapsule = class extends VRMSpringBoneColliderShape {
		get type() {
			return "capsule";
		}
		constructor(params) {
			var _a, _b, _c, _d;
			super();
			this.offset = (_a = params == null ? void 0 : params.offset) != null ? _a : new THREE20.Vector3(0, 0, 0);
			this.tail = (_b = params == null ? void 0 : params.tail) != null ? _b : new THREE20.Vector3(0, 0, 0);
			this.radius = (_c = params == null ? void 0 : params.radius) != null ? _c : 0;
			this.inside = (_d = params == null ? void 0 : params.inside) != null ? _d : false;
		}
		calculateCollision(colliderMatrix, objectPosition, objectRadius, target) {
			_v3A7.setFromMatrixPosition(colliderMatrix);
			_v3B5.subVectors(this.tail, this.offset).applyMatrix4(colliderMatrix);
			_v3B5.sub(_v3A7);
			const lengthSqCapsule = _v3B5.lengthSq();
			target.copy(objectPosition).sub(_v3A7);
			const dot = _v3B5.dot(target);
			if (dot <= 0) {} else if (lengthSqCapsule <= dot) target.sub(_v3B5);
			else {
				_v3B5.multiplyScalar(dot / lengthSqCapsule);
				target.sub(_v3B5);
			}
			const length = target.length();
			const distance = this.inside ? this.radius - objectRadius - length : length - objectRadius - this.radius;
			if (distance < 0) {
				target.multiplyScalar(1 / length);
				if (this.inside) target.negate();
			}
			return distance;
		}
	};
	var _v3A23 = new THREE24.Vector3();
	var _mat3A = new THREE24.Matrix3();
	var VRMSpringBoneColliderShapePlane = class extends VRMSpringBoneColliderShape {
		get type() {
			return "plane";
		}
		constructor(params) {
			var _a, _b;
			super();
			this.offset = (_a = params == null ? void 0 : params.offset) != null ? _a : new THREE24.Vector3(0, 0, 0);
			this.normal = (_b = params == null ? void 0 : params.normal) != null ? _b : new THREE24.Vector3(0, 0, 1);
		}
		calculateCollision(colliderMatrix, objectPosition, objectRadius, target) {
			target.setFromMatrixPosition(colliderMatrix);
			target.negate().add(objectPosition);
			_mat3A.getNormalMatrix(colliderMatrix);
			_v3A23.copy(this.normal).applyNormalMatrix(_mat3A).normalize();
			const distance = target.dot(_v3A23) - objectRadius;
			target.copy(_v3A23);
			return distance;
		}
	};
	var _v3A33 = new THREE34.Vector3();
	var VRMSpringBoneColliderShapeSphere = class extends VRMSpringBoneColliderShape {
		get type() {
			return "sphere";
		}
		constructor(params) {
			var _a, _b, _c;
			super();
			this.offset = (_a = params == null ? void 0 : params.offset) != null ? _a : new THREE34.Vector3(0, 0, 0);
			this.radius = (_b = params == null ? void 0 : params.radius) != null ? _b : 0;
			this.inside = (_c = params == null ? void 0 : params.inside) != null ? _c : false;
		}
		calculateCollision(colliderMatrix, objectPosition, objectRadius, target) {
			target.subVectors(objectPosition, _v3A33.setFromMatrixPosition(colliderMatrix));
			const length = target.length();
			const distance = this.inside ? this.radius - objectRadius - length : length - objectRadius - this.radius;
			if (distance < 0) {
				target.multiplyScalar(1 / length);
				if (this.inside) target.negate();
			}
			return distance;
		}
	};
	var _v3A43 = new THREE44.Vector3();
	var ColliderShapeCapsuleBufferGeometry = class extends THREE44.BufferGeometry {
		constructor(shape) {
			super();
			this.worldScale = 1;
			this._currentRadius = 0;
			this._currentOffset = new THREE44.Vector3();
			this._currentTail = new THREE44.Vector3();
			this._shape = shape;
			this._attrPos = new THREE44.BufferAttribute(/* @__PURE__ */ new Float32Array(396), 3);
			this.setAttribute("position", this._attrPos);
			this._attrIndex = new THREE44.BufferAttribute(/* @__PURE__ */ new Uint16Array(264), 1);
			this.setIndex(this._attrIndex);
			this._buildIndex();
			this.update();
		}
		update() {
			let shouldUpdateGeometry = false;
			const radius = this._shape.radius / this.worldScale;
			if (this._currentRadius !== radius) {
				this._currentRadius = radius;
				shouldUpdateGeometry = true;
			}
			if (!this._currentOffset.equals(this._shape.offset)) {
				this._currentOffset.copy(this._shape.offset);
				shouldUpdateGeometry = true;
			}
			const tail = _v3A43.copy(this._shape.tail).divideScalar(this.worldScale);
			if (this._currentTail.distanceToSquared(tail) > 1e-10) {
				this._currentTail.copy(tail);
				shouldUpdateGeometry = true;
			}
			if (shouldUpdateGeometry) this._buildPosition();
		}
		_buildPosition() {
			_v3A43.copy(this._currentTail).sub(this._currentOffset);
			const l = _v3A43.length() / this._currentRadius;
			for (let i = 0; i <= 16; i++) {
				const t = i / 16 * Math.PI;
				this._attrPos.setXYZ(i, -Math.sin(t), -Math.cos(t), 0);
				this._attrPos.setXYZ(17 + i, l + Math.sin(t), Math.cos(t), 0);
				this._attrPos.setXYZ(34 + i, -Math.sin(t), 0, -Math.cos(t));
				this._attrPos.setXYZ(51 + i, l + Math.sin(t), 0, Math.cos(t));
			}
			for (let i = 0; i < 32; i++) {
				const t = i / 16 * Math.PI;
				this._attrPos.setXYZ(68 + i, 0, Math.sin(t), Math.cos(t));
				this._attrPos.setXYZ(100 + i, l, Math.sin(t), Math.cos(t));
			}
			const theta = Math.atan2(_v3A43.y, Math.sqrt(_v3A43.x * _v3A43.x + _v3A43.z * _v3A43.z));
			const phi = -Math.atan2(_v3A43.z, _v3A43.x);
			this.rotateZ(theta);
			this.rotateY(phi);
			this.scale(this._currentRadius, this._currentRadius, this._currentRadius);
			this.translate(this._currentOffset.x, this._currentOffset.y, this._currentOffset.z);
			this._attrPos.needsUpdate = true;
		}
		_buildIndex() {
			for (let i = 0; i < 34; i++) {
				const i1 = (i + 1) % 34;
				this._attrIndex.setXY(i * 2, i, i1);
				this._attrIndex.setXY(68 + i * 2, 34 + i, 34 + i1);
			}
			for (let i = 0; i < 32; i++) {
				const i1 = (i + 1) % 32;
				this._attrIndex.setXY(136 + i * 2, 68 + i, 68 + i1);
				this._attrIndex.setXY(200 + i * 2, 100 + i, 100 + i1);
			}
			this._attrIndex.needsUpdate = true;
		}
	};
	var ColliderShapePlaneBufferGeometry = class extends THREE54.BufferGeometry {
		constructor(shape) {
			super();
			this.worldScale = 1;
			this._currentOffset = new THREE54.Vector3();
			this._currentNormal = new THREE54.Vector3();
			this._shape = shape;
			this._attrPos = new THREE54.BufferAttribute(/* @__PURE__ */ new Float32Array(18), 3);
			this.setAttribute("position", this._attrPos);
			this._attrIndex = new THREE54.BufferAttribute(/* @__PURE__ */ new Uint16Array(10), 1);
			this.setIndex(this._attrIndex);
			this._buildIndex();
			this.update();
		}
		update() {
			let shouldUpdateGeometry = false;
			if (!this._currentOffset.equals(this._shape.offset)) {
				this._currentOffset.copy(this._shape.offset);
				shouldUpdateGeometry = true;
			}
			if (!this._currentNormal.equals(this._shape.normal)) {
				this._currentNormal.copy(this._shape.normal);
				shouldUpdateGeometry = true;
			}
			if (shouldUpdateGeometry) this._buildPosition();
		}
		_buildPosition() {
			this._attrPos.setXYZ(0, -.5, -.5, 0);
			this._attrPos.setXYZ(1, .5, -.5, 0);
			this._attrPos.setXYZ(2, .5, .5, 0);
			this._attrPos.setXYZ(3, -.5, .5, 0);
			this._attrPos.setXYZ(4, 0, 0, 0);
			this._attrPos.setXYZ(5, 0, 0, .25);
			this.translate(this._currentOffset.x, this._currentOffset.y, this._currentOffset.z);
			this.lookAt(this._currentNormal);
			this._attrPos.needsUpdate = true;
		}
		_buildIndex() {
			this._attrIndex.setXY(0, 0, 1);
			this._attrIndex.setXY(2, 1, 2);
			this._attrIndex.setXY(4, 2, 3);
			this._attrIndex.setXY(6, 3, 0);
			this._attrIndex.setXY(8, 4, 5);
			this._attrIndex.needsUpdate = true;
		}
	};
	var ColliderShapeSphereBufferGeometry = class extends THREE62.BufferGeometry {
		constructor(shape) {
			super();
			this.worldScale = 1;
			this._currentRadius = 0;
			this._currentOffset = new THREE62.Vector3();
			this._shape = shape;
			this._attrPos = new THREE62.BufferAttribute(/* @__PURE__ */ new Float32Array(288), 3);
			this.setAttribute("position", this._attrPos);
			this._attrIndex = new THREE62.BufferAttribute(/* @__PURE__ */ new Uint16Array(192), 1);
			this.setIndex(this._attrIndex);
			this._buildIndex();
			this.update();
		}
		update() {
			let shouldUpdateGeometry = false;
			const radius = this._shape.radius / this.worldScale;
			if (this._currentRadius !== radius) {
				this._currentRadius = radius;
				shouldUpdateGeometry = true;
			}
			if (!this._currentOffset.equals(this._shape.offset)) {
				this._currentOffset.copy(this._shape.offset);
				shouldUpdateGeometry = true;
			}
			if (shouldUpdateGeometry) this._buildPosition();
		}
		_buildPosition() {
			for (let i = 0; i < 32; i++) {
				const t = i / 16 * Math.PI;
				this._attrPos.setXYZ(i, Math.cos(t), Math.sin(t), 0);
				this._attrPos.setXYZ(32 + i, 0, Math.cos(t), Math.sin(t));
				this._attrPos.setXYZ(64 + i, Math.sin(t), 0, Math.cos(t));
			}
			this.scale(this._currentRadius, this._currentRadius, this._currentRadius);
			this.translate(this._currentOffset.x, this._currentOffset.y, this._currentOffset.z);
			this._attrPos.needsUpdate = true;
		}
		_buildIndex() {
			for (let i = 0; i < 32; i++) {
				const i1 = (i + 1) % 32;
				this._attrIndex.setXY(i * 2, i, i1);
				this._attrIndex.setXY(64 + i * 2, 32 + i, 32 + i1);
				this._attrIndex.setXY(128 + i * 2, 64 + i, 64 + i1);
			}
			this._attrIndex.needsUpdate = true;
		}
	};
	var _v3A52 = new THREE72.Vector3();
	var VRMSpringBoneColliderHelper = class extends THREE72.Group {
		constructor(collider) {
			super();
			this.matrixAutoUpdate = false;
			this.collider = collider;
			if (this.collider.shape instanceof VRMSpringBoneColliderShapeSphere) this._geometry = new ColliderShapeSphereBufferGeometry(this.collider.shape);
			else if (this.collider.shape instanceof VRMSpringBoneColliderShapeCapsule) this._geometry = new ColliderShapeCapsuleBufferGeometry(this.collider.shape);
			else if (this.collider.shape instanceof VRMSpringBoneColliderShapePlane) this._geometry = new ColliderShapePlaneBufferGeometry(this.collider.shape);
			else throw new Error("VRMSpringBoneColliderHelper: Unknown collider shape type detected");
			const material = new THREE72.LineBasicMaterial({
				color: 16711935,
				depthTest: false,
				depthWrite: false
			});
			this._line = new THREE72.LineSegments(this._geometry, material);
			this.add(this._line);
		}
		dispose() {
			this._geometry.dispose();
		}
		updateMatrixWorld(force) {
			this.collider.updateWorldMatrix(true, false);
			this.matrix.copy(this.collider.matrixWorld);
			const matrixWorldElements = this.matrix.elements;
			this._geometry.worldScale = _v3A52.set(matrixWorldElements[0], matrixWorldElements[1], matrixWorldElements[2]).length();
			this._geometry.update();
			super.updateMatrixWorld(force);
		}
	};
	var SpringBoneBufferGeometry = class extends THREE82.BufferGeometry {
		constructor(springBone) {
			super();
			this.worldScale = 1;
			this._currentRadius = 0;
			this._currentTail = new THREE82.Vector3();
			this._springBone = springBone;
			this._attrPos = new THREE82.BufferAttribute(/* @__PURE__ */ new Float32Array(294), 3);
			this.setAttribute("position", this._attrPos);
			this._attrIndex = new THREE82.BufferAttribute(/* @__PURE__ */ new Uint16Array(194), 1);
			this.setIndex(this._attrIndex);
			this._buildIndex();
			this.update();
		}
		update() {
			let shouldUpdateGeometry = false;
			const radius = this._springBone.settings.hitRadius / this.worldScale;
			if (this._currentRadius !== radius) {
				this._currentRadius = radius;
				shouldUpdateGeometry = true;
			}
			if (!this._currentTail.equals(this._springBone.initialLocalChildPosition)) {
				this._currentTail.copy(this._springBone.initialLocalChildPosition);
				shouldUpdateGeometry = true;
			}
			if (shouldUpdateGeometry) this._buildPosition();
		}
		_buildPosition() {
			for (let i = 0; i < 32; i++) {
				const t = i / 16 * Math.PI;
				this._attrPos.setXYZ(i, Math.cos(t), Math.sin(t), 0);
				this._attrPos.setXYZ(32 + i, 0, Math.cos(t), Math.sin(t));
				this._attrPos.setXYZ(64 + i, Math.sin(t), 0, Math.cos(t));
			}
			this.scale(this._currentRadius, this._currentRadius, this._currentRadius);
			this.translate(this._currentTail.x, this._currentTail.y, this._currentTail.z);
			this._attrPos.setXYZ(96, 0, 0, 0);
			this._attrPos.setXYZ(97, this._currentTail.x, this._currentTail.y, this._currentTail.z);
			this._attrPos.needsUpdate = true;
		}
		_buildIndex() {
			for (let i = 0; i < 32; i++) {
				const i1 = (i + 1) % 32;
				this._attrIndex.setXY(i * 2, i, i1);
				this._attrIndex.setXY(64 + i * 2, 32 + i, 32 + i1);
				this._attrIndex.setXY(128 + i * 2, 64 + i, 64 + i1);
			}
			this._attrIndex.setXY(192, 96, 97);
			this._attrIndex.needsUpdate = true;
		}
	};
	var _v3A62 = new THREE92.Vector3();
	var VRMSpringBoneJointHelper = class extends THREE92.Group {
		constructor(springBone) {
			super();
			this.matrixAutoUpdate = false;
			this.springBone = springBone;
			this._geometry = new SpringBoneBufferGeometry(this.springBone);
			const material = new THREE92.LineBasicMaterial({
				color: 16776960,
				depthTest: false,
				depthWrite: false
			});
			this._line = new THREE92.LineSegments(this._geometry, material);
			this.add(this._line);
		}
		dispose() {
			this._geometry.dispose();
		}
		updateMatrixWorld(force) {
			this.springBone.bone.updateWorldMatrix(true, false);
			this.matrix.copy(this.springBone.bone.matrixWorld);
			const matrixWorldElements = this.matrix.elements;
			this._geometry.worldScale = _v3A62.set(matrixWorldElements[0], matrixWorldElements[1], matrixWorldElements[2]).length();
			this._geometry.update();
			super.updateMatrixWorld(force);
		}
	};
	var VRMSpringBoneCollider = class extends THREE102.Object3D {
		constructor(shape) {
			super();
			this.colliderMatrix = new THREE102.Matrix4();
			this.shape = shape;
		}
		updateWorldMatrix(updateParents, updateChildren) {
			super.updateWorldMatrix(updateParents, updateChildren);
			updateColliderMatrix(this.colliderMatrix, this.matrixWorld, this.shape.offset);
		}
	};
	function updateColliderMatrix(colliderMatrix, matrixWorld, offset) {
		const me = matrixWorld.elements;
		colliderMatrix.copy(matrixWorld);
		if (offset) {
			colliderMatrix.elements[12] = me[0] * offset.x + me[4] * offset.y + me[8] * offset.z + me[12];
			colliderMatrix.elements[13] = me[1] * offset.x + me[5] * offset.y + me[9] * offset.z + me[13];
			colliderMatrix.elements[14] = me[2] * offset.x + me[6] * offset.y + me[10] * offset.z + me[14];
		}
	}
	var _matA = new THREE112.Matrix4();
	function mat4InvertCompat(target) {
		if (target.invert) target.invert();
		else target.getInverse(_matA.copy(target));
		return target;
	}
	var Matrix4InverseCache = class {
		constructor(matrix) {
			this._inverseCache = new THREE122.Matrix4();
			this._shouldUpdateInverse = true;
			this.matrix = matrix;
			const handler = { set: (obj, prop, newVal) => {
				this._shouldUpdateInverse = true;
				obj[prop] = newVal;
				return true;
			} };
			this._originalElements = matrix.elements;
			matrix.elements = new Proxy(matrix.elements, handler);
		}
		/**
		* Inverse of given matrix.
		* Note that it will return its internal private instance.
		* Make sure copying this before mutate this.
		*/
		get inverse() {
			if (this._shouldUpdateInverse) {
				mat4InvertCompat(this._inverseCache.copy(this.matrix));
				this._shouldUpdateInverse = false;
			}
			return this._inverseCache;
		}
		revert() {
			this.matrix.elements = this._originalElements;
		}
	};
	var IDENTITY_MATRIX4 = new THREE132.Matrix4();
	var _v3A72 = new THREE132.Vector3();
	var _v3B23 = new THREE132.Vector3();
	var _worldSpacePosition = new THREE132.Vector3();
	var _nextTail = new THREE132.Vector3();
	var _matA2 = new THREE132.Matrix4();
	var VRMSpringBoneJoint = class {
		/**
		* Create a new VRMSpringBone.
		*
		* @param bone An Object3D that will be attached to this bone
		* @param child An Object3D that will be used as a tail of this spring bone. It can be null when the spring bone is imported from VRM 0.0
		* @param settings Several parameters related to behavior of the spring bone
		* @param colliderGroups Collider groups that will be collided with this spring bone
		*/
		constructor(bone, child, settings = {}, colliderGroups = []) {
			this._currentTail = new THREE132.Vector3();
			this._prevTail = new THREE132.Vector3();
			this._boneAxis = new THREE132.Vector3();
			this._worldSpaceBoneLength = 0;
			this._center = null;
			this._initialLocalMatrix = new THREE132.Matrix4();
			this._initialLocalRotation = new THREE132.Quaternion();
			this._initialLocalChildPosition = new THREE132.Vector3();
			var _a, _b, _c, _d, _e, _f;
			this.bone = bone;
			this.bone.matrixAutoUpdate = false;
			this.child = child;
			this.settings = {
				hitRadius: (_a = settings.hitRadius) != null ? _a : 0,
				stiffness: (_b = settings.stiffness) != null ? _b : 1,
				gravityPower: (_c = settings.gravityPower) != null ? _c : 0,
				gravityDir: (_e = (_d = settings.gravityDir) == null ? void 0 : _d.clone()) != null ? _e : new THREE132.Vector3(0, -1, 0),
				dragForce: (_f = settings.dragForce) != null ? _f : .4
			};
			this.colliderGroups = colliderGroups;
		}
		/**
		* Set of dependencies that need to be updated before this joint.
		*/
		get dependencies() {
			const set = /* @__PURE__ */ new Set();
			const parent = this.bone.parent;
			if (parent) set.add(parent);
			for (let cg = 0; cg < this.colliderGroups.length; cg++) for (let c = 0; c < this.colliderGroups[cg].colliders.length; c++) set.add(this.colliderGroups[cg].colliders[c]);
			return set;
		}
		get center() {
			return this._center;
		}
		set center(center) {
			var _a;
			if ((_a = this._center) == null ? void 0 : _a.userData.inverseCacheProxy) {
				this._center.userData.inverseCacheProxy.revert();
				delete this._center.userData.inverseCacheProxy;
			}
			this._center = center;
			if (this._center) {
				if (!this._center.userData.inverseCacheProxy) this._center.userData.inverseCacheProxy = new Matrix4InverseCache(this._center.matrixWorld);
			}
		}
		get initialLocalChildPosition() {
			return this._initialLocalChildPosition;
		}
		/**
		* Returns the world matrix of its parent object.
		* Note that it returns a reference to the matrix. Don't mutate this directly!
		*/
		get _parentMatrixWorld() {
			return this.bone.parent ? this.bone.parent.matrixWorld : IDENTITY_MATRIX4;
		}
		/**
		* Set the initial state of this spring bone.
		* You might want to call {@link VRMSpringBoneManager.setInitState} instead.
		*/
		setInitState() {
			this._initialLocalMatrix.copy(this.bone.matrix);
			this._initialLocalRotation.copy(this.bone.quaternion);
			if (this.child) this._initialLocalChildPosition.copy(this.child.position);
			else this._initialLocalChildPosition.copy(this.bone.position).normalize().multiplyScalar(.07);
			const matrixWorldToCenter = this._getMatrixWorldToCenter();
			this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(matrixWorldToCenter);
			this._prevTail.copy(this._currentTail);
			this._boneAxis.copy(this._initialLocalChildPosition).normalize();
		}
		/**
		* Reset the state of this bone.
		* You might want to call {@link VRMSpringBoneManager.reset} instead.
		*/
		reset() {
			this.bone.quaternion.copy(this._initialLocalRotation);
			this.bone.updateMatrix();
			this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld, this.bone.matrix);
			const matrixWorldToCenter = this._getMatrixWorldToCenter();
			this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(matrixWorldToCenter);
			this._prevTail.copy(this._currentTail);
		}
		/**
		* Update the state of this bone.
		* You might want to call {@link VRMSpringBoneManager.update} instead.
		*
		* @param delta deltaTime
		*/
		update(delta) {
			if (delta <= 0) return;
			this._calcWorldSpaceBoneLength();
			const worldSpaceBoneAxis = _v3B23.copy(this._boneAxis).transformDirection(this._initialLocalMatrix).transformDirection(this._parentMatrixWorld);
			_nextTail.copy(this._currentTail).add(_v3A72.subVectors(this._currentTail, this._prevTail).multiplyScalar(1 - this.settings.dragForce)).applyMatrix4(this._getMatrixCenterToWorld()).addScaledVector(worldSpaceBoneAxis, this.settings.stiffness * delta).addScaledVector(this.settings.gravityDir, this.settings.gravityPower * delta);
			_worldSpacePosition.setFromMatrixPosition(this.bone.matrixWorld);
			_nextTail.sub(_worldSpacePosition).normalize().multiplyScalar(this._worldSpaceBoneLength).add(_worldSpacePosition);
			this._collision(_nextTail);
			this._prevTail.copy(this._currentTail);
			this._currentTail.copy(_nextTail).applyMatrix4(this._getMatrixWorldToCenter());
			const worldSpaceInitialMatrixInv = _matA2.multiplyMatrices(this._parentMatrixWorld, this._initialLocalMatrix).invert();
			this.bone.quaternion.setFromUnitVectors(this._boneAxis, _v3A72.copy(_nextTail).applyMatrix4(worldSpaceInitialMatrixInv).normalize()).premultiply(this._initialLocalRotation);
			this.bone.updateMatrix();
			this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld, this.bone.matrix);
		}
		/**
		* Do collision math against every colliders attached to this bone.
		*
		* @param tail The tail you want to process
		*/
		_collision(tail) {
			for (let cg = 0; cg < this.colliderGroups.length; cg++) for (let c = 0; c < this.colliderGroups[cg].colliders.length; c++) {
				const collider = this.colliderGroups[cg].colliders[c];
				const dist = collider.shape.calculateCollision(collider.colliderMatrix, tail, this.settings.hitRadius, _v3A72);
				if (dist < 0) {
					tail.addScaledVector(_v3A72, -dist);
					tail.sub(_worldSpacePosition);
					const length = tail.length();
					tail.multiplyScalar(this._worldSpaceBoneLength / length).add(_worldSpacePosition);
				}
			}
		}
		/**
		* Calculate the {@link _worldSpaceBoneLength}.
		* Intended to be used in {@link update}.
		*/
		_calcWorldSpaceBoneLength() {
			_v3A72.setFromMatrixPosition(this.bone.matrixWorld);
			if (this.child) _v3B23.setFromMatrixPosition(this.child.matrixWorld);
			else {
				_v3B23.copy(this._initialLocalChildPosition);
				_v3B23.applyMatrix4(this.bone.matrixWorld);
			}
			this._worldSpaceBoneLength = _v3A72.sub(_v3B23).length();
		}
		/**
		* Create a matrix that converts center space into world space.
		*/
		_getMatrixCenterToWorld() {
			return this._center ? this._center.matrixWorld : IDENTITY_MATRIX4;
		}
		/**
		* Create a matrix that converts world space into center space.
		*/
		_getMatrixWorldToCenter() {
			return this._center ? this._center.userData.inverseCacheProxy.inverse : IDENTITY_MATRIX4;
		}
	};
	function traverseAncestorsFromRoot2(object, callback) {
		const ancestors = [];
		let head = object;
		while (head !== null) {
			ancestors.unshift(head);
			head = head.parent;
		}
		ancestors.forEach((ancestor) => {
			callback(ancestor);
		});
	}
	function traverseChildrenUntilConditionMet(object, callback) {
		object.children.forEach((child) => {
			if (!callback(child)) traverseChildrenUntilConditionMet(child, callback);
		});
	}
	function lowestCommonAncestor(objects) {
		var _a;
		const sharedAncestors = /* @__PURE__ */ new Map();
		for (const object of objects) {
			let current = object;
			do {
				const newValue = ((_a = sharedAncestors.get(current)) != null ? _a : 0) + 1;
				if (newValue === objects.size) return current;
				sharedAncestors.set(current, newValue);
				current = current.parent;
			} while (current !== null);
		}
		return null;
	}
	var VRMSpringBoneManager = class {
		constructor() {
			this._joints = /* @__PURE__ */ new Set();
			this._sortedJoints = [];
			this._hasWarnedCircularDependency = false;
			this._ancestors = [];
			this._objectSpringBonesMap = /* @__PURE__ */ new Map();
			this._isSortedJointsDirty = false;
			this._relevantChildrenUpdated = this._relevantChildrenUpdated.bind(this);
		}
		get joints() {
			return this._joints;
		}
		/**
		* @deprecated Use {@link joints} instead.
		*/
		get springBones() {
			console.warn("VRMSpringBoneManager: springBones is deprecated. use joints instead.");
			return this._joints;
		}
		get colliderGroups() {
			const set = /* @__PURE__ */ new Set();
			this._joints.forEach((springBone) => {
				springBone.colliderGroups.forEach((colliderGroup) => {
					set.add(colliderGroup);
				});
			});
			return Array.from(set);
		}
		get colliders() {
			const set = /* @__PURE__ */ new Set();
			this.colliderGroups.forEach((colliderGroup) => {
				colliderGroup.colliders.forEach((collider) => {
					set.add(collider);
				});
			});
			return Array.from(set);
		}
		addJoint(joint) {
			this._joints.add(joint);
			let objectSet = this._objectSpringBonesMap.get(joint.bone);
			if (objectSet == null) {
				objectSet = /* @__PURE__ */ new Set();
				this._objectSpringBonesMap.set(joint.bone, objectSet);
			}
			objectSet.add(joint);
			this._isSortedJointsDirty = true;
		}
		/**
		* @deprecated Use {@link addJoint} instead.
		*/
		addSpringBone(joint) {
			console.warn("VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead.");
			this.addJoint(joint);
		}
		deleteJoint(joint) {
			this._joints.delete(joint);
			this._objectSpringBonesMap.get(joint.bone).delete(joint);
			this._isSortedJointsDirty = true;
		}
		/**
		* @deprecated Use {@link deleteJoint} instead.
		*/
		deleteSpringBone(joint) {
			console.warn("VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead.");
			this.deleteJoint(joint);
		}
		setInitState() {
			this._sortJoints();
			for (let i = 0; i < this._sortedJoints.length; i++) {
				const springBone = this._sortedJoints[i];
				springBone.bone.updateMatrix();
				springBone.bone.updateWorldMatrix(false, false);
				springBone.setInitState();
			}
		}
		reset() {
			this._sortJoints();
			for (let i = 0; i < this._sortedJoints.length; i++) {
				const springBone = this._sortedJoints[i];
				springBone.bone.updateMatrix();
				springBone.bone.updateWorldMatrix(false, false);
				springBone.reset();
			}
		}
		update(delta) {
			this._sortJoints();
			for (let i = 0; i < this._ancestors.length; i++) this._ancestors[i].updateWorldMatrix(i === 0, false);
			for (let i = 0; i < this._sortedJoints.length; i++) {
				const springBone = this._sortedJoints[i];
				springBone.bone.updateMatrix();
				springBone.bone.updateWorldMatrix(false, false);
				springBone.update(delta);
				traverseChildrenUntilConditionMet(springBone.bone, this._relevantChildrenUpdated);
			}
		}
		/**
		* Sorts the joints ensuring they are updated in the correct order taking dependencies into account.
		*
		* This method updates {@link _sortedJoints} and {@link _ancestors}.
		* Make sure to call this before using them.
		*/
		_sortJoints() {
			if (!this._isSortedJointsDirty) return;
			const springBoneOrder = [];
			const springBonesTried = /* @__PURE__ */ new Set();
			const springBonesDone = /* @__PURE__ */ new Set();
			const ancestors = /* @__PURE__ */ new Set();
			for (const springBone of this._joints) this._insertJointSort(springBone, springBonesTried, springBonesDone, springBoneOrder, ancestors);
			this._sortedJoints = springBoneOrder;
			const lca = lowestCommonAncestor(ancestors);
			this._ancestors = [];
			if (lca) {
				this._ancestors.push(lca);
				traverseChildrenUntilConditionMet(lca, (object) => {
					var _a, _b;
					if (((_b = (_a = this._objectSpringBonesMap.get(object)) == null ? void 0 : _a.size) != null ? _b : 0) > 0) return true;
					this._ancestors.push(object);
					return false;
				});
			}
			this._isSortedJointsDirty = false;
		}
		_insertJointSort(springBone, springBonesTried, springBonesDone, springBoneOrder, ancestors) {
			if (springBonesDone.has(springBone)) return;
			if (springBonesTried.has(springBone)) {
				if (!this._hasWarnedCircularDependency) {
					console.warn("VRMSpringBoneManager: Circular dependency detected");
					this._hasWarnedCircularDependency = true;
				}
				return;
			}
			springBonesTried.add(springBone);
			const depObjects = springBone.dependencies;
			for (const depObject of depObjects) {
				let encounteredSpringBone = false;
				let ancestor = null;
				traverseAncestorsFromRoot2(depObject, (depObjectAncestor) => {
					const objectSet = this._objectSpringBonesMap.get(depObjectAncestor);
					if (objectSet) for (const depSpringBone of objectSet) {
						encounteredSpringBone = true;
						this._insertJointSort(depSpringBone, springBonesTried, springBonesDone, springBoneOrder, ancestors);
					}
					else if (!encounteredSpringBone) ancestor = depObjectAncestor;
				});
				if (ancestor) ancestors.add(ancestor);
			}
			springBoneOrder.push(springBone);
			springBonesDone.add(springBone);
		}
		_relevantChildrenUpdated(object) {
			var _a, _b;
			if (((_b = (_a = this._objectSpringBonesMap.get(object)) == null ? void 0 : _a.size) != null ? _b : 0) > 0) return true;
			object.updateWorldMatrix(false, false);
			return false;
		}
	};
	var EXTENSION_NAME_EXTENDED_COLLIDER = "VRMC_springBone_extended_collider";
	var POSSIBLE_SPEC_VERSIONS8 = /* @__PURE__ */ new Set(["1.0", "1.0-beta"]);
	var POSSIBLE_SPEC_VERSIONS_EXTENDED_COLLIDERS = /* @__PURE__ */ new Set(["1.0"]);
	var _VRMSpringBoneLoaderPlugin = class _VRMSpringBoneLoaderPlugin2 {
		get name() {
			return _VRMSpringBoneLoaderPlugin2.EXTENSION_NAME;
		}
		constructor(parser, options) {
			var _a;
			this.parser = parser;
			this.jointHelperRoot = options == null ? void 0 : options.jointHelperRoot;
			this.colliderHelperRoot = options == null ? void 0 : options.colliderHelperRoot;
			this.useExtendedColliders = (_a = options == null ? void 0 : options.useExtendedColliders) != null ? _a : true;
		}
		afterRoot(gltf) {
			return __async7(this, null, function* () {
				gltf.userData.vrmSpringBoneManager = yield this._import(gltf);
			});
		}
		/**
		* Import spring bones from a GLTF and return a {@link VRMSpringBoneManager}.
		* It might return `null` instead when it does not need to be created or something go wrong.
		*
		* @param gltf A parsed result of GLTF taken from GLTFLoader
		*/
		_import(gltf) {
			return __async7(this, null, function* () {
				const v1Result = yield this._v1Import(gltf);
				if (v1Result != null) return v1Result;
				const v0Result = yield this._v0Import(gltf);
				if (v0Result != null) return v0Result;
				return null;
			});
		}
		_v1Import(gltf) {
			return __async7(this, null, function* () {
				var _a, _b, _c, _d, _e;
				const json = gltf.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf(_VRMSpringBoneLoaderPlugin2.EXTENSION_NAME)) !== -1)) return null;
				const manager = new VRMSpringBoneManager();
				const threeNodes = yield gltf.parser.getDependencies("node");
				const extension = (_b = json.extensions) == null ? void 0 : _b[_VRMSpringBoneLoaderPlugin2.EXTENSION_NAME];
				if (!extension) return null;
				const specVersion = extension.specVersion;
				if (!POSSIBLE_SPEC_VERSIONS8.has(specVersion)) {
					console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${_VRMSpringBoneLoaderPlugin2.EXTENSION_NAME} specVersion "${specVersion}"`);
					return null;
				}
				const colliders = (_c = extension.colliders) == null ? void 0 : _c.map((schemaCollider, iCollider) => {
					var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
					const node = threeNodes[schemaCollider.node];
					if (node == null) {
						console.warn(`VRMSpringBoneLoaderPlugin: The collider #${iCollider} attempted to reference a node #${schemaCollider.node} but not found. Skipping the collider`);
						return null;
					}
					const schemaShape = schemaCollider.shape;
					const schemaExCollider = (_a2 = schemaCollider.extensions) == null ? void 0 : _a2[EXTENSION_NAME_EXTENDED_COLLIDER];
					if (this.useExtendedColliders && schemaExCollider != null) {
						const specVersionExCollider = schemaExCollider.specVersion;
						if (!POSSIBLE_SPEC_VERSIONS_EXTENDED_COLLIDERS.has(specVersionExCollider)) console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${EXTENSION_NAME_EXTENDED_COLLIDER} specVersion "${specVersionExCollider}". Fallbacking to the ${_VRMSpringBoneLoaderPlugin2.EXTENSION_NAME} definition`);
						else {
							const schemaExShape = schemaExCollider.shape;
							if (schemaExShape.sphere) return this._importSphereCollider(node, {
								offset: new THREE142.Vector3().fromArray((_b2 = schemaExShape.sphere.offset) != null ? _b2 : [
									0,
									0,
									0
								]),
								radius: (_c2 = schemaExShape.sphere.radius) != null ? _c2 : 0,
								inside: (_d2 = schemaExShape.sphere.inside) != null ? _d2 : false
							});
							else if (schemaExShape.capsule) return this._importCapsuleCollider(node, {
								offset: new THREE142.Vector3().fromArray((_e2 = schemaExShape.capsule.offset) != null ? _e2 : [
									0,
									0,
									0
								]),
								radius: (_f = schemaExShape.capsule.radius) != null ? _f : 0,
								tail: new THREE142.Vector3().fromArray((_g = schemaExShape.capsule.tail) != null ? _g : [
									0,
									0,
									0
								]),
								inside: (_h = schemaExShape.capsule.inside) != null ? _h : false
							});
							else if (schemaExShape.plane) return this._importPlaneCollider(node, {
								offset: new THREE142.Vector3().fromArray((_i = schemaExShape.plane.offset) != null ? _i : [
									0,
									0,
									0
								]),
								normal: new THREE142.Vector3().fromArray((_j = schemaExShape.plane.normal) != null ? _j : [
									0,
									0,
									1
								])
							});
						}
					}
					if (schemaShape.sphere) return this._importSphereCollider(node, {
						offset: new THREE142.Vector3().fromArray((_k = schemaShape.sphere.offset) != null ? _k : [
							0,
							0,
							0
						]),
						radius: (_l = schemaShape.sphere.radius) != null ? _l : 0,
						inside: false
					});
					else if (schemaShape.capsule) return this._importCapsuleCollider(node, {
						offset: new THREE142.Vector3().fromArray((_m = schemaShape.capsule.offset) != null ? _m : [
							0,
							0,
							0
						]),
						radius: (_n = schemaShape.capsule.radius) != null ? _n : 0,
						tail: new THREE142.Vector3().fromArray((_o = schemaShape.capsule.tail) != null ? _o : [
							0,
							0,
							0
						]),
						inside: false
					});
					console.warn(`VRMSpringBoneLoaderPlugin: The collider #${iCollider} has no valid shape. Skipping the collider`);
				});
				const colliderGroups = (_d = extension.colliderGroups) == null ? void 0 : _d.map((schemaColliderGroup, iColliderGroup) => {
					var _a2;
					return {
						colliders: ((_a2 = schemaColliderGroup.colliders) != null ? _a2 : []).map((iCollider) => {
							const col = colliders == null ? void 0 : colliders[iCollider];
							if (col == null) {
								console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${iColliderGroup} attempted to reference a collider #${iCollider} but not found. Skipping the collider`);
								return null;
							}
							return col;
						}).filter((col) => col != null),
						name: schemaColliderGroup.name
					};
				});
				(_e = extension.springs) == null || _e.forEach((schemaSpring, iSpring) => {
					var _a2;
					const schemaJoints = schemaSpring.joints;
					const colliderGroupsForSpring = (_a2 = schemaSpring.colliderGroups) == null ? void 0 : _a2.map((iColliderGroup) => {
						const group = colliderGroups == null ? void 0 : colliderGroups[iColliderGroup];
						if (group == null) {
							console.warn(`VRMSpringBoneLoaderPlugin: The spring #${iSpring} attempted to reference a collider group #${iColliderGroup} but not found. Skipping the collider group`);
							return null;
						}
						return group;
					}).filter((group) => group != null);
					const center = schemaSpring.center != null ? threeNodes[schemaSpring.center] : void 0;
					let prevSchemaJoint;
					schemaJoints.forEach((schemaJoint) => {
						if (prevSchemaJoint) {
							const nodeIndex = prevSchemaJoint.node;
							const node = threeNodes[nodeIndex];
							const childIndex = schemaJoint.node;
							const child = threeNodes[childIndex];
							const setting = {
								hitRadius: prevSchemaJoint.hitRadius,
								dragForce: prevSchemaJoint.dragForce,
								gravityPower: prevSchemaJoint.gravityPower,
								stiffness: prevSchemaJoint.stiffness,
								gravityDir: prevSchemaJoint.gravityDir != null ? new THREE142.Vector3().fromArray(prevSchemaJoint.gravityDir) : void 0
							};
							const joint = this._importJoint(node, child, setting, colliderGroupsForSpring);
							if (center) joint.center = center;
							manager.addJoint(joint);
						}
						prevSchemaJoint = schemaJoint;
					});
				});
				manager.setInitState();
				return manager;
			});
		}
		_v0Import(gltf) {
			return __async7(this, null, function* () {
				var _a, _b, _c;
				const json = gltf.parser.json;
				if (!(((_a = json.extensionsUsed) == null ? void 0 : _a.indexOf("VRM")) !== -1)) return null;
				const extension = (_b = json.extensions) == null ? void 0 : _b["VRM"];
				const schemaSecondaryAnimation = extension == null ? void 0 : extension.secondaryAnimation;
				if (!schemaSecondaryAnimation) return null;
				const schemaBoneGroups = schemaSecondaryAnimation == null ? void 0 : schemaSecondaryAnimation.boneGroups;
				if (!schemaBoneGroups) return null;
				const manager = new VRMSpringBoneManager();
				const threeNodes = yield gltf.parser.getDependencies("node");
				const colliderGroups = (_c = schemaSecondaryAnimation.colliderGroups) == null ? void 0 : _c.map((schemaColliderGroup, iColliderGroup) => {
					var _a2;
					const node = threeNodes[schemaColliderGroup.node];
					if (node == null) {
						console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${iColliderGroup} attempted to reference a node #${schemaColliderGroup.node} but not found. Skipping the collider group`);
						return null;
					}
					return { colliders: ((_a2 = schemaColliderGroup.colliders) != null ? _a2 : []).map((schemaCollider, iCollider) => {
						var _a3, _b2, _c2;
						const offset = new THREE142.Vector3(0, 0, 0);
						if (schemaCollider.offset) offset.set((_a3 = schemaCollider.offset.x) != null ? _a3 : 0, (_b2 = schemaCollider.offset.y) != null ? _b2 : 0, schemaCollider.offset.z ? -schemaCollider.offset.z : 0);
						return this._importSphereCollider(node, {
							offset,
							radius: (_c2 = schemaCollider.radius) != null ? _c2 : 0,
							inside: false
						});
					}) };
				});
				schemaBoneGroups?.forEach((schemaBoneGroup, iBoneGroup) => {
					const rootIndices = schemaBoneGroup.bones;
					if (!rootIndices) return;
					rootIndices.forEach((rootIndex) => {
						var _a2, _b2, _c2, _d;
						const root = threeNodes[rootIndex];
						if (root == null) {
							console.warn(`VRMSpringBoneLoaderPlugin: The spring bone group #${iBoneGroup} attempted to reference a node #${rootIndex} but not found. Skipping the node`);
							return;
						}
						const gravityDir = new THREE142.Vector3();
						if (schemaBoneGroup.gravityDir) gravityDir.set((_a2 = schemaBoneGroup.gravityDir.x) != null ? _a2 : 0, (_b2 = schemaBoneGroup.gravityDir.y) != null ? _b2 : 0, (_c2 = schemaBoneGroup.gravityDir.z) != null ? _c2 : 0);
						else gravityDir.set(0, -1, 0);
						const center = schemaBoneGroup.center != null ? threeNodes[schemaBoneGroup.center] : void 0;
						const setting = {
							hitRadius: schemaBoneGroup.hitRadius,
							dragForce: schemaBoneGroup.dragForce,
							gravityPower: schemaBoneGroup.gravityPower,
							stiffness: schemaBoneGroup.stiffiness,
							gravityDir
						};
						const colliderGroupsForSpring = (_d = schemaBoneGroup.colliderGroups) == null ? void 0 : _d.map((iColliderGroup) => {
							const group = colliderGroups == null ? void 0 : colliderGroups[iColliderGroup];
							if (group == null) {
								console.warn(`VRMSpringBoneLoaderPlugin: The spring #${iBoneGroup} attempted to reference a collider group #${iColliderGroup} but not found. Skipping the collider group`);
								return null;
							}
							return group;
						}).filter((group) => group != null);
						root.traverse((node) => {
							var _a3;
							const child = (_a3 = node.children[0]) != null ? _a3 : null;
							const joint = this._importJoint(node, child, setting, colliderGroupsForSpring);
							if (center) joint.center = center;
							manager.addJoint(joint);
						});
					});
				});
				gltf.scene.updateMatrixWorld();
				manager.setInitState();
				return manager;
			});
		}
		_importJoint(node, child, setting, colliderGroupsForSpring) {
			const springBone = new VRMSpringBoneJoint(node, child, setting, colliderGroupsForSpring);
			if (this.jointHelperRoot) {
				const helper = new VRMSpringBoneJointHelper(springBone);
				this.jointHelperRoot.add(helper);
				helper.renderOrder = this.jointHelperRoot.renderOrder;
			}
			return springBone;
		}
		_importSphereCollider(destination, params) {
			const collider = new VRMSpringBoneCollider(new VRMSpringBoneColliderShapeSphere(params));
			destination.add(collider);
			if (this.colliderHelperRoot) {
				const helper = new VRMSpringBoneColliderHelper(collider);
				this.colliderHelperRoot.add(helper);
				helper.renderOrder = this.colliderHelperRoot.renderOrder;
			}
			return collider;
		}
		_importCapsuleCollider(destination, params) {
			const collider = new VRMSpringBoneCollider(new VRMSpringBoneColliderShapeCapsule(params));
			destination.add(collider);
			if (this.colliderHelperRoot) {
				const helper = new VRMSpringBoneColliderHelper(collider);
				this.colliderHelperRoot.add(helper);
				helper.renderOrder = this.colliderHelperRoot.renderOrder;
			}
			return collider;
		}
		_importPlaneCollider(destination, params) {
			const collider = new VRMSpringBoneCollider(new VRMSpringBoneColliderShapePlane(params));
			destination.add(collider);
			if (this.colliderHelperRoot) {
				const helper = new VRMSpringBoneColliderHelper(collider);
				this.colliderHelperRoot.add(helper);
				helper.renderOrder = this.colliderHelperRoot.renderOrder;
			}
			return collider;
		}
	};
	_VRMSpringBoneLoaderPlugin.EXTENSION_NAME = "VRMC_springBone";
	var VRMSpringBoneLoaderPlugin = _VRMSpringBoneLoaderPlugin;
	var VRMLoaderPlugin = class {
		get name() {
			return "VRMLoaderPlugin";
		}
		constructor(parser, options) {
			var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
			this.parser = parser;
			const helperRoot = options == null ? void 0 : options.helperRoot;
			const autoUpdateHumanBones = options == null ? void 0 : options.autoUpdateHumanBones;
			this.expressionPlugin = (_a = options == null ? void 0 : options.expressionPlugin) != null ? _a : new VRMExpressionLoaderPlugin(parser);
			this.firstPersonPlugin = (_b = options == null ? void 0 : options.firstPersonPlugin) != null ? _b : new VRMFirstPersonLoaderPlugin(parser);
			this.humanoidPlugin = (_c = options == null ? void 0 : options.humanoidPlugin) != null ? _c : new VRMHumanoidLoaderPlugin(parser, {
				helperRoot,
				autoUpdateHumanBones
			});
			this.lookAtPlugin = (_d = options == null ? void 0 : options.lookAtPlugin) != null ? _d : new VRMLookAtLoaderPlugin(parser, { helperRoot });
			this.metaPlugin = (_e = options == null ? void 0 : options.metaPlugin) != null ? _e : new VRMMetaLoaderPlugin(parser);
			this.mtoonMaterialPlugin = (_f = options == null ? void 0 : options.mtoonMaterialPlugin) != null ? _f : new MToonMaterialLoaderPlugin(parser);
			this.materialsHDREmissiveMultiplierPlugin = (_g = options == null ? void 0 : options.materialsHDREmissiveMultiplierPlugin) != null ? _g : new VRMMaterialsHDREmissiveMultiplierLoaderPlugin(parser);
			this.materialsV0CompatPlugin = (_h = options == null ? void 0 : options.materialsV0CompatPlugin) != null ? _h : new VRMMaterialsV0CompatPlugin(parser);
			this.springBonePlugin = (_i = options == null ? void 0 : options.springBonePlugin) != null ? _i : new VRMSpringBoneLoaderPlugin(parser, {
				colliderHelperRoot: helperRoot,
				jointHelperRoot: helperRoot
			});
			this.nodeConstraintPlugin = (_j = options == null ? void 0 : options.nodeConstraintPlugin) != null ? _j : new VRMNodeConstraintLoaderPlugin(parser, { helperRoot });
		}
		beforeRoot() {
			return __async(this, null, function* () {
				yield this.materialsV0CompatPlugin.beforeRoot();
				yield this.mtoonMaterialPlugin.beforeRoot();
			});
		}
		loadMesh(meshIndex) {
			return __async(this, null, function* () {
				return yield this.mtoonMaterialPlugin.loadMesh(meshIndex);
			});
		}
		getMaterialType(materialIndex) {
			const mtoonType = this.mtoonMaterialPlugin.getMaterialType(materialIndex);
			if (mtoonType != null) return mtoonType;
			return null;
		}
		extendMaterialParams(materialIndex, materialParams) {
			return __async(this, null, function* () {
				yield this.materialsHDREmissiveMultiplierPlugin.extendMaterialParams(materialIndex, materialParams);
				yield this.mtoonMaterialPlugin.extendMaterialParams(materialIndex, materialParams);
			});
		}
		afterRoot(gltf) {
			return __async(this, null, function* () {
				yield this.metaPlugin.afterRoot(gltf);
				yield this.humanoidPlugin.afterRoot(gltf);
				yield this.expressionPlugin.afterRoot(gltf);
				yield this.lookAtPlugin.afterRoot(gltf);
				yield this.firstPersonPlugin.afterRoot(gltf);
				yield this.springBonePlugin.afterRoot(gltf);
				yield this.nodeConstraintPlugin.afterRoot(gltf);
				yield this.mtoonMaterialPlugin.afterRoot(gltf);
				const meta = gltf.userData.vrmMeta;
				const humanoid = gltf.userData.vrmHumanoid;
				if (meta && humanoid) {
					const vrm = new VRM({
						scene: gltf.scene,
						expressionManager: gltf.userData.vrmExpressionManager,
						firstPerson: gltf.userData.vrmFirstPerson,
						humanoid,
						lookAt: gltf.userData.vrmLookAt,
						meta,
						materials: gltf.userData.vrmMToonMaterials,
						springBoneManager: gltf.userData.vrmSpringBoneManager,
						nodeConstraintManager: gltf.userData.vrmNodeConstraintManager
					});
					gltf.userData.vrm = vrm;
				}
			});
		}
	};
	function collectMeshes(scene) {
		const meshes = /* @__PURE__ */ new Set();
		scene.traverse((obj) => {
			if (!obj.isMesh) return;
			const mesh = obj;
			meshes.add(mesh);
		});
		return meshes;
	}
	function combineMorph(positionAttributes, binds, morphTargetsRelative) {
		if (binds.size === 1) {
			const bind = binds.values().next().value;
			if (bind.weight === 1) return positionAttributes[bind.index];
		}
		const newArray = new Float32Array(positionAttributes[0].count * 3);
		let weightSum = 0;
		if (morphTargetsRelative) weightSum = 1;
		else for (const bind of binds) weightSum += bind.weight;
		for (const bind of binds) {
			const src = positionAttributes[bind.index];
			const weight = bind.weight / weightSum;
			for (let i = 0; i < src.count; i++) {
				newArray[i * 3 + 0] += src.getX(i) * weight;
				newArray[i * 3 + 1] += src.getY(i) * weight;
				newArray[i * 3 + 2] += src.getZ(i) * weight;
			}
		}
		return new THREE21.BufferAttribute(newArray, 3);
	}
	function combineMorphs(vrm) {
		var _a;
		const meshes = collectMeshes(vrm.scene);
		const meshNameBindSetMapMap = /* @__PURE__ */ new Map();
		const expressionMap = (_a = vrm.expressionManager) == null ? void 0 : _a.expressionMap;
		if (expressionMap != null) for (const [expressionName, expression] of Object.entries(expressionMap)) {
			const bindsToDeleteSet = /* @__PURE__ */ new Set();
			for (const bind of expression.binds) if (bind instanceof VRMExpressionMorphTargetBind) {
				if (bind.weight !== 0) for (const mesh of bind.primitives) {
					let nameBindSetMap = meshNameBindSetMapMap.get(mesh);
					if (nameBindSetMap == null) {
						nameBindSetMap = /* @__PURE__ */ new Map();
						meshNameBindSetMapMap.set(mesh, nameBindSetMap);
					}
					let bindSet = nameBindSetMap.get(expressionName);
					if (bindSet == null) {
						bindSet = /* @__PURE__ */ new Set();
						nameBindSetMap.set(expressionName, bindSet);
					}
					bindSet.add(bind);
				}
				bindsToDeleteSet.add(bind);
			}
			for (const bind of bindsToDeleteSet) expression.deleteBind(bind);
		}
		for (const mesh of meshes) {
			const nameBindSetMap = meshNameBindSetMapMap.get(mesh);
			if (nameBindSetMap == null) continue;
			const originalMorphAttributes = mesh.geometry.morphAttributes;
			mesh.geometry.morphAttributes = {};
			const geometry = mesh.geometry.clone();
			mesh.geometry = geometry;
			const morphTargetsRelative = geometry.morphTargetsRelative;
			const hasPMorph = originalMorphAttributes.position != null;
			const hasNMorph = originalMorphAttributes.normal != null;
			const morphAttributes = {};
			const morphTargetDictionary = {};
			const morphTargetInfluences = [];
			if (hasPMorph || hasNMorph) {
				if (hasPMorph) morphAttributes.position = [];
				if (hasNMorph) morphAttributes.normal = [];
				let i = 0;
				for (const [name, bindSet] of nameBindSetMap) {
					if (hasPMorph) morphAttributes.position[i] = combineMorph(originalMorphAttributes.position, bindSet, morphTargetsRelative);
					if (hasNMorph) morphAttributes.normal[i] = combineMorph(originalMorphAttributes.normal, bindSet, morphTargetsRelative);
					expressionMap?.[name].addBind(new VRMExpressionMorphTargetBind({
						index: i,
						weight: 1,
						primitives: [mesh]
					}));
					morphTargetDictionary[name] = i;
					morphTargetInfluences.push(0);
					i++;
				}
			}
			geometry.morphAttributes = morphAttributes;
			mesh.morphTargetDictionary = morphTargetDictionary;
			mesh.morphTargetInfluences = morphTargetInfluences;
		}
	}
	function attributeGetComponentCompat(attribute, index, component) {
		if (attribute.getComponent) return attribute.getComponent(index, component);
		else {
			let value = attribute.array[index * attribute.itemSize + component];
			if (attribute.normalized) value = THREE25.MathUtils.denormalize(value, attribute.array);
			return value;
		}
	}
	function attributeSetComponentCompat(attribute, index, component, value) {
		if (attribute.setComponent) attribute.setComponent(index, component, value);
		else {
			if (attribute.normalized) value = THREE26.MathUtils.normalize(value, attribute.array);
			attribute.array[index * attribute.itemSize + component] = value;
		}
	}
	function combineSkeletons(root) {
		var _a;
		const skinnedMeshes = collectSkinnedMeshes(root);
		const geometries = /* @__PURE__ */ new Set();
		for (const mesh of skinnedMeshes) {
			if (geometries.has(mesh.geometry)) mesh.geometry = shallowCloneBufferGeometry(mesh.geometry);
			geometries.add(mesh.geometry);
		}
		const attributeUsedIndexSetMap = /* @__PURE__ */ new Map();
		for (const geometry of geometries) {
			const skinIndexAttr = geometry.getAttribute("skinIndex");
			const skinIndexMap = (_a = attributeUsedIndexSetMap.get(skinIndexAttr)) != null ? _a : /* @__PURE__ */ new Map();
			attributeUsedIndexSetMap.set(skinIndexAttr, skinIndexMap);
			const skinWeightAttr = geometry.getAttribute("skinWeight");
			const usedIndicesSet = listUsedIndices(skinIndexAttr, skinWeightAttr);
			skinIndexMap.set(skinWeightAttr, usedIndicesSet);
		}
		const meshBoneInverseMapMap = /* @__PURE__ */ new Map();
		for (const mesh of skinnedMeshes) {
			const boneInverseMap = listUsedBones(mesh, attributeUsedIndexSetMap);
			meshBoneInverseMapMap.set(mesh, boneInverseMap);
		}
		const groups = [];
		for (const [mesh, boneInverseMap] of meshBoneInverseMapMap) {
			let foundMergeableGroup = false;
			for (const candidate of groups) if (boneInverseMapIsMergeable(boneInverseMap, candidate.boneInverseMap)) {
				foundMergeableGroup = true;
				candidate.meshes.add(mesh);
				for (const [bone, boneInverse] of boneInverseMap) candidate.boneInverseMap.set(bone, boneInverse);
				break;
			}
			if (!foundMergeableGroup) groups.push({
				boneInverseMap,
				meshes: /* @__PURE__ */ new Set([mesh])
			});
		}
		const cache = /* @__PURE__ */ new Map();
		const skinIndexDispatcher = new ObjectIndexDispatcher();
		const skeletonDispatcher = new ObjectIndexDispatcher();
		const boneDispatcher = new ObjectIndexDispatcher();
		for (const group of groups) {
			const { boneInverseMap, meshes } = group;
			const newBones = Array.from(boneInverseMap.keys());
			const newBoneInverses = Array.from(boneInverseMap.values());
			const newSkeleton = new THREE27.Skeleton(newBones, newBoneInverses);
			const skeletonKey = skeletonDispatcher.getOrCreate(newSkeleton);
			for (const mesh of meshes) {
				const skinIndexAttr = mesh.geometry.getAttribute("skinIndex");
				const skinIndexKey = skinIndexDispatcher.getOrCreate(skinIndexAttr);
				const bones = mesh.skeleton.bones;
				const key = `${skinIndexKey};${skeletonKey};${bones.map((bone) => boneDispatcher.getOrCreate(bone)).join(",")}`;
				let newSkinIndexAttr = cache.get(key);
				if (newSkinIndexAttr == null) {
					newSkinIndexAttr = skinIndexAttr.clone();
					remapSkinIndexAttribute(newSkinIndexAttr, bones, newBones);
					cache.set(key, newSkinIndexAttr);
				}
				mesh.geometry.setAttribute("skinIndex", newSkinIndexAttr);
			}
			for (const mesh of meshes) mesh.bind(newSkeleton, new THREE27.Matrix4());
		}
	}
	function collectSkinnedMeshes(scene) {
		const skinnedMeshes = /* @__PURE__ */ new Set();
		scene.traverse((obj) => {
			if (!obj.isSkinnedMesh) return;
			const skinnedMesh = obj;
			skinnedMeshes.add(skinnedMesh);
		});
		return skinnedMeshes;
	}
	function listUsedIndices(skinIndexAttr, skinWeightAttr) {
		const usedIndices = /* @__PURE__ */ new Set();
		for (let i = 0; i < skinIndexAttr.count; i++) for (let j = 0; j < skinIndexAttr.itemSize; j++) {
			const index = attributeGetComponentCompat(skinIndexAttr, i, j);
			if (attributeGetComponentCompat(skinWeightAttr, i, j) !== 0) usedIndices.add(index);
		}
		return usedIndices;
	}
	function listUsedBones(mesh, attributeUsedIndexSetMap) {
		const boneInverseMap = /* @__PURE__ */ new Map();
		const skeleton = mesh.skeleton;
		const geometry = mesh.geometry;
		const skinIndexAttr = geometry.getAttribute("skinIndex");
		const skinWeightAttr = geometry.getAttribute("skinWeight");
		const skinIndexMap = attributeUsedIndexSetMap.get(skinIndexAttr);
		const usedIndicesSet = skinIndexMap == null ? void 0 : skinIndexMap.get(skinWeightAttr);
		if (!usedIndicesSet) throw new Error("Unreachable. attributeUsedIndexSetMap does not know the skin index attribute or the skin weight attribute.");
		for (const index of usedIndicesSet) boneInverseMap.set(skeleton.bones[index], skeleton.boneInverses[index]);
		return boneInverseMap;
	}
	function boneInverseMapIsMergeable(toCheck, candidate) {
		for (const [bone, boneInverse] of toCheck.entries()) {
			const candidateBoneInverse = candidate.get(bone);
			if (candidateBoneInverse != null) {
				if (!matrixEquals(boneInverse, candidateBoneInverse)) return false;
			}
		}
		return true;
	}
	function remapSkinIndexAttribute(attribute, oldBones, newBones) {
		const boneOldIndexMap = /* @__PURE__ */ new Map();
		for (const bone of oldBones) boneOldIndexMap.set(bone, boneOldIndexMap.size);
		const oldToNew = /* @__PURE__ */ new Map();
		for (const [i, bone] of newBones.entries()) {
			const oldIndex = boneOldIndexMap.get(bone);
			oldToNew.set(oldIndex, i);
		}
		for (let i = 0; i < attribute.count; i++) for (let j = 0; j < attribute.itemSize; j++) {
			const oldIndex = attributeGetComponentCompat(attribute, i, j);
			const newIndex = oldToNew.get(oldIndex);
			attributeSetComponentCompat(attribute, i, j, newIndex);
		}
		attribute.needsUpdate = true;
	}
	function matrixEquals(a, b, tolerance) {
		tolerance = tolerance || 1e-4;
		if (a.elements.length != b.elements.length) return false;
		for (let i = 0, il = a.elements.length; i < il; i++) if (Math.abs(a.elements[i] - b.elements[i]) > tolerance) return false;
		return true;
	}
	var ObjectIndexDispatcher = class {
		constructor() {
			this._objectIndexMap = /* @__PURE__ */ new Map();
			this._index = 0;
		}
		get(obj) {
			return this._objectIndexMap.get(obj);
		}
		getOrCreate(obj) {
			let index = this._objectIndexMap.get(obj);
			if (index == null) {
				index = this._index;
				this._objectIndexMap.set(obj, index);
				this._index++;
			}
			return index;
		}
	};
	function shallowCloneBufferGeometry(geometry) {
		var _a, _b, _c, _d;
		const clone = new THREE27.BufferGeometry();
		clone.name = geometry.name;
		clone.setIndex(geometry.index);
		for (const [name, attribute] of Object.entries(geometry.attributes)) clone.setAttribute(name, attribute);
		for (const [key, morphAttributes] of Object.entries(geometry.morphAttributes)) {
			const attributeName = key;
			clone.morphAttributes[attributeName] = morphAttributes.concat();
		}
		clone.morphTargetsRelative = geometry.morphTargetsRelative;
		clone.groups = [];
		for (const group of geometry.groups) clone.addGroup(group.start, group.count, group.materialIndex);
		clone.boundingSphere = (_b = (_a = geometry.boundingSphere) == null ? void 0 : _a.clone()) != null ? _b : null;
		clone.boundingBox = (_d = (_c = geometry.boundingBox) == null ? void 0 : _c.clone()) != null ? _d : null;
		clone.drawRange.start = geometry.drawRange.start;
		clone.drawRange.count = geometry.drawRange.count;
		clone.userData = geometry.userData;
		return clone;
	}
	function disposeMaterial(material) {
		Object.values(material).forEach((value) => {
			if (value == null ? void 0 : value.isTexture) value.dispose();
		});
		if (material.isShaderMaterial) {
			const uniforms = material.uniforms;
			if (uniforms) Object.values(uniforms).forEach((uniform) => {
				const value = uniform.value;
				if (value == null ? void 0 : value.isTexture) value.dispose();
			});
		}
		material.dispose();
	}
	function dispose(object3D) {
		const geometry = object3D.geometry;
		if (geometry) geometry.dispose();
		const skeleton = object3D.skeleton;
		if (skeleton) skeleton.dispose();
		const material = object3D.material;
		if (material) {
			if (Array.isArray(material)) material.forEach((material2) => disposeMaterial(material2));
			else if (material) disposeMaterial(material);
		}
	}
	function deepDispose(object3D) {
		object3D.traverse(dispose);
	}
	function removeUnnecessaryJoints(root, options) {
		var _a, _b;
		console.warn("VRMUtils.removeUnnecessaryJoints: removeUnnecessaryJoints is deprecated. Use combineSkeletons instead. combineSkeletons contributes more to the performance improvement. This function will be removed in the next major version.");
		const experimentalSameBoneCounts = (_a = options == null ? void 0 : options.experimentalSameBoneCounts) != null ? _a : false;
		const skinnedMeshes = [];
		root.traverse((obj) => {
			if (obj.type !== "SkinnedMesh") return;
			skinnedMeshes.push(obj);
		});
		const attributeToBoneIndexMapMap = /* @__PURE__ */ new Map();
		let maxBones = 0;
		for (const mesh of skinnedMeshes) {
			const attribute = mesh.geometry.getAttribute("skinIndex");
			if (attributeToBoneIndexMapMap.has(attribute)) continue;
			const oldToNew = /* @__PURE__ */ new Map();
			const newToOld = /* @__PURE__ */ new Map();
			for (let i = 0; i < attribute.count; i++) for (let j = 0; j < attribute.itemSize; j++) {
				const oldIndex = attributeGetComponentCompat(attribute, i, j);
				let newIndex = oldToNew.get(oldIndex);
				if (newIndex == null) {
					newIndex = oldToNew.size;
					oldToNew.set(oldIndex, newIndex);
					newToOld.set(newIndex, oldIndex);
				}
				attributeSetComponentCompat(attribute, i, j, newIndex);
			}
			attribute.needsUpdate = true;
			attributeToBoneIndexMapMap.set(attribute, newToOld);
			maxBones = Math.max(maxBones, oldToNew.size);
		}
		for (const mesh of skinnedMeshes) {
			const attribute = mesh.geometry.getAttribute("skinIndex");
			const newToOld = attributeToBoneIndexMapMap.get(attribute);
			const bones = [];
			const boneInverses = [];
			const nBones = experimentalSameBoneCounts ? maxBones : newToOld.size;
			for (let newIndex = 0; newIndex < nBones; newIndex++) {
				const oldIndex = (_b = newToOld.get(newIndex)) != null ? _b : 0;
				bones.push(mesh.skeleton.bones[oldIndex]);
				boneInverses.push(mesh.skeleton.boneInverses[oldIndex]);
			}
			const skeleton = new THREE28.Skeleton(bones, boneInverses);
			mesh.bind(skeleton, new THREE28.Matrix4());
		}
	}
	function checkIsVertexUsed(attributes, originalIndex) {
		const vertexCount = attributes.position.count;
		const isVertexUsed = new Array(vertexCount);
		let verticesUsed = 0;
		const originalIndexArray = originalIndex.array;
		for (let i = 0; i < originalIndexArray.length; i++) {
			const index = originalIndexArray[i];
			if (!isVertexUsed[index]) {
				isVertexUsed[index] = true;
				verticesUsed++;
			}
		}
		return {
			isVertexUsed,
			vertexCount,
			verticesUsed
		};
	}
	function buildIndexMapsFromIsVertexUsed(isVertexUsed) {
		const originalIndexNewIndexMap = [];
		const newIndexOriginalIndexMap = [];
		let indexHead = 0;
		for (let i = 0; i < isVertexUsed.length; i++) if (isVertexUsed[i]) {
			const newIndex = indexHead++;
			originalIndexNewIndexMap[i] = newIndex;
			newIndexOriginalIndexMap[newIndex] = i;
		}
		return {
			originalIndexNewIndexMap,
			newIndexOriginalIndexMap
		};
	}
	function copyGeometryProperties(source, target) {
		var _a, _b, _c, _d;
		target.name = source.name;
		target.morphTargetsRelative = source.morphTargetsRelative;
		source.groups.forEach((group) => {
			target.addGroup(group.start, group.count, group.materialIndex);
		});
		target.boundingBox = (_b = (_a = source.boundingBox) == null ? void 0 : _a.clone()) != null ? _b : null;
		target.boundingSphere = (_d = (_c = source.boundingSphere) == null ? void 0 : _c.clone()) != null ? _d : null;
		target.setDrawRange(source.drawRange.start, source.drawRange.count);
		target.userData = source.userData;
	}
	function reorganizeIndexAttribute(newGeometry, originalIndex, originalIndexNewIndexMap) {
		const originalIndexArray = originalIndex.array;
		const newIndexArray = new originalIndexArray.constructor(originalIndexArray.length);
		for (let i = 0; i < originalIndexArray.length; i++) {
			const index = originalIndexArray[i];
			newIndexArray[i] = originalIndexNewIndexMap[index];
		}
		newGeometry.setIndex(new BufferAttribute9(newIndexArray, originalIndex.itemSize, originalIndex.normalized));
	}
	function remapAttributeArray(originalArray, newIndexOriginalIndexMap, stride) {
		const ArrayCtor = originalArray.constructor;
		const newArray = new ArrayCtor(newIndexOriginalIndexMap.length * stride);
		let isAllZero = true;
		for (let i = 0; i < newIndexOriginalIndexMap.length; i++) {
			const srcBase = newIndexOriginalIndexMap[i] * stride;
			const dstBase = i * stride;
			for (let j = 0; j < stride; j++) {
				const v = originalArray[srcBase + j];
				newArray[dstBase + j] = v;
				isAllZero = isAllZero && v === 0;
			}
		}
		return [newArray, isAllZero];
	}
	function collectGeometryAttributeGroups(attributes) {
		var _a;
		const interleavedBufferAttributeMap = /* @__PURE__ */ new Map();
		const nonInterleavedAttributes = [];
		for (const [attributeName, originalAttribute] of Object.entries(attributes)) if (originalAttribute.isInterleavedBufferAttribute) {
			const interleavedAttribute = originalAttribute;
			const interleavedBuffer = interleavedAttribute.data;
			const group = (_a = interleavedBufferAttributeMap.get(interleavedBuffer)) != null ? _a : [];
			interleavedBufferAttributeMap.set(interleavedBuffer, group);
			group.push([attributeName, interleavedAttribute]);
		} else {
			const attribute = originalAttribute;
			nonInterleavedAttributes.push([attributeName, attribute]);
		}
		return [interleavedBufferAttributeMap, nonInterleavedAttributes];
	}
	function reorganizeGeometryAttributes(newGeometry, attributes, newIndexOriginalIndexMap) {
		const [interleavedBufferAttributeMap, nonInterleavedAttributes] = collectGeometryAttributeGroups(attributes);
		for (const [interleavedBuffer, attributesInGroup] of interleavedBufferAttributeMap) {
			const originalInterleavedBufferArray = interleavedBuffer.array;
			const { stride } = interleavedBuffer;
			const [newInterleavedArray, _] = remapAttributeArray(originalInterleavedBufferArray, newIndexOriginalIndexMap, stride);
			const newInterleavedBuffer = new THREE29.InterleavedBuffer(newInterleavedArray, stride);
			newInterleavedBuffer.setUsage(interleavedBuffer.usage);
			for (const [attributeName, originalAttribute] of attributesInGroup) {
				const { itemSize, offset, normalized } = originalAttribute;
				const newAttribute = new THREE29.InterleavedBufferAttribute(newInterleavedBuffer, itemSize, offset, normalized);
				newGeometry.setAttribute(attributeName, newAttribute);
			}
		}
		for (const [attributeName, originalAttribute] of nonInterleavedAttributes) {
			const originalAttributeArray = originalAttribute.array;
			const { itemSize, normalized } = originalAttribute;
			const [newAttributeArray, _] = remapAttributeArray(originalAttributeArray, newIndexOriginalIndexMap, itemSize);
			newGeometry.setAttribute(attributeName, new BufferAttribute9(newAttributeArray, itemSize, normalized));
		}
	}
	function collectMorphAttributeGroups(morphAttributes) {
		var _a;
		const interleavedBufferAttributeMap = /* @__PURE__ */ new Map();
		const nonInterleavedAttributes = [];
		for (const [key, attributes] of Object.entries(morphAttributes)) {
			const attributeName = key;
			for (let iMorph = 0; iMorph < attributes.length; iMorph++) {
				const originalAttribute = attributes[iMorph];
				if (originalAttribute.isInterleavedBufferAttribute) {
					const interleavedAttribute = originalAttribute;
					const interleavedBuffer = interleavedAttribute.data;
					const group = (_a = interleavedBufferAttributeMap.get(interleavedBuffer)) != null ? _a : [];
					interleavedBufferAttributeMap.set(interleavedBuffer, group);
					group.push([
						attributeName,
						iMorph,
						interleavedAttribute
					]);
				} else {
					const attribute = originalAttribute;
					nonInterleavedAttributes.push([
						attributeName,
						iMorph,
						attribute
					]);
				}
			}
		}
		return [interleavedBufferAttributeMap, nonInterleavedAttributes];
	}
	function reorganizeMorphAttributes(newGeometry, morphAttributes, newIndexOriginalIndexMap) {
		let allMorphsAreZero = true;
		const [interleavedBufferAttributeMap, nonInterleavedAttributes] = collectMorphAttributeGroups(morphAttributes);
		const newMorphAttributes = {};
		for (const [interleavedBuffer, attributesInGroup] of interleavedBufferAttributeMap) {
			const originalInterleavedBufferArray = interleavedBuffer.array;
			const { stride } = interleavedBuffer;
			const [newInterleavedArray, isAllZero] = remapAttributeArray(originalInterleavedBufferArray, newIndexOriginalIndexMap, stride);
			allMorphsAreZero = allMorphsAreZero && isAllZero;
			const newInterleavedBuffer = new THREE29.InterleavedBuffer(newInterleavedArray, stride);
			newInterleavedBuffer.setUsage(interleavedBuffer.usage);
			for (const [attributeName, morphIndex, attribute] of attributesInGroup) {
				const { itemSize, offset, normalized } = attribute;
				const newAttribute = new THREE29.InterleavedBufferAttribute(newInterleavedBuffer, itemSize, offset, normalized);
				newMorphAttributes[attributeName] ?? (newMorphAttributes[attributeName] = []);
				newMorphAttributes[attributeName][morphIndex] = newAttribute;
			}
		}
		for (const [attributeName, morphIndex, attribute] of nonInterleavedAttributes) {
			const originalAttribute = attribute;
			const originalAttributeArray = originalAttribute.array;
			const { itemSize, normalized } = originalAttribute;
			const [newAttributeArray, isAllZero] = remapAttributeArray(originalAttributeArray, newIndexOriginalIndexMap, itemSize);
			allMorphsAreZero = allMorphsAreZero && isAllZero;
			newMorphAttributes[attributeName] ?? (newMorphAttributes[attributeName] = []);
			newMorphAttributes[attributeName][morphIndex] = new BufferAttribute9(newAttributeArray, itemSize, normalized);
		}
		newGeometry.morphAttributes = allMorphsAreZero ? {} : newMorphAttributes;
	}
	function removeUnnecessaryVertices(root) {
		const geometryMap = /* @__PURE__ */ new Map();
		root.traverse((obj) => {
			if (!obj.isMesh) return;
			const mesh = obj;
			const geometry = mesh.geometry;
			const originalIndex = geometry.index;
			if (originalIndex == null) return;
			const newGeometryAlreadyExisted = geometryMap.get(geometry);
			if (newGeometryAlreadyExisted != null) {
				mesh.geometry = newGeometryAlreadyExisted;
				return;
			}
			const { isVertexUsed, vertexCount, verticesUsed } = checkIsVertexUsed(geometry.attributes, originalIndex);
			if (verticesUsed === vertexCount) return;
			const { originalIndexNewIndexMap, newIndexOriginalIndexMap } = buildIndexMapsFromIsVertexUsed(isVertexUsed);
			const newGeometry = new THREE29.BufferGeometry();
			copyGeometryProperties(geometry, newGeometry);
			geometryMap.set(geometry, newGeometry);
			reorganizeIndexAttribute(newGeometry, originalIndex, originalIndexNewIndexMap);
			reorganizeGeometryAttributes(newGeometry, geometry.attributes, newIndexOriginalIndexMap);
			reorganizeMorphAttributes(newGeometry, geometry.morphAttributes, newIndexOriginalIndexMap);
			mesh.geometry = newGeometry;
		});
		Array.from(geometryMap.keys()).forEach((originalGeometry) => {
			originalGeometry.dispose();
		});
	}
	function rotateVRM0(vrm) {
		var _a;
		if (((_a = vrm.meta) == null ? void 0 : _a.metaVersion) === "0") vrm.scene.rotation.y = Math.PI;
	}
	var VRMUtils = class {
		constructor() {}
	};
	VRMUtils.combineMorphs = combineMorphs;
	VRMUtils.combineSkeletons = combineSkeletons;
	VRMUtils.deepDispose = deepDispose;
	VRMUtils.removeUnnecessaryJoints = removeUnnecessaryJoints;
	VRMUtils.removeUnnecessaryVertices = removeUnnecessaryVertices;
	VRMUtils.rotateVRM0 = rotateVRM0;
	/*!
	* @pixiv/three-vrm-core v3.5.5
	* The implementation of core features of VRM, for @pixiv/three-vrm
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm-core is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	/*!
	* @pixiv/three-vrm-materials-mtoon v3.5.5
	* MToon (toon material) module for @pixiv/three-vrm
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm-materials-mtoon is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	/*!
	* @pixiv/three-vrm-materials-hdr-emissive-multiplier v3.5.5
	* Support VRMC_hdr_emissiveMultiplier for @pixiv/three-vrm
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm-materials-hdr-emissive-multiplier is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	/*!
	* @pixiv/three-vrm-materials-v0compat v3.5.5
	* VRM0.0 materials compatibility layer plugin for @pixiv/three-vrm
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm-materials-v0compat is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	/*!
	* @pixiv/three-vrm-node-constraint v3.5.5
	* Node constraint module for @pixiv/three-vrm
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm-node-constraint is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	/*!
	* @pixiv/three-vrm-springbone v3.5.5
	* Spring bone module for @pixiv/three-vrm
	*
	* Copyright (c) 2019-2026 pixiv Inc.
	* @pixiv/three-vrm-springbone is distributed under MIT License
	* https://github.com/pixiv/three-vrm/blob/release/LICENSE
	*/
	return {
		MToonMaterial,
		MToonMaterialDebugMode,
		MToonMaterialLoaderPlugin,
		MToonMaterialOutlineWidthMode,
		VRM,
		VRMAimConstraint,
		VRMCore,
		VRMCoreLoaderPlugin,
		VRMExpression,
		VRMExpressionLoaderPlugin,
		VRMExpressionManager,
		VRMExpressionMaterialColorBind,
		VRMExpressionMaterialColorType,
		VRMExpressionMorphTargetBind,
		VRMExpressionOverrideType,
		VRMExpressionPresetName,
		VRMExpressionTextureTransformBind,
		VRMFirstPerson,
		VRMFirstPersonLoaderPlugin,
		VRMFirstPersonMeshAnnotationType,
		VRMHumanBoneList,
		VRMHumanBoneName,
		VRMHumanBoneParentMap,
		VRMHumanoid,
		VRMHumanoidHelper,
		VRMHumanoidLoaderPlugin,
		VRMLoaderPlugin,
		VRMLookAt,
		VRMLookAtBoneApplier,
		VRMLookAtExpressionApplier,
		VRMLookAtHelper,
		VRMLookAtLoaderPlugin,
		VRMLookAtRangeMap,
		VRMLookAtTypeName,
		VRMMetaLoaderPlugin,
		VRMNodeConstraint,
		VRMNodeConstraintHelper,
		VRMNodeConstraintLoaderPlugin,
		VRMNodeConstraintManager,
		VRMRequiredHumanBoneName,
		VRMRollConstraint,
		VRMRotationConstraint,
		VRMSpringBoneCollider,
		VRMSpringBoneColliderHelper,
		VRMSpringBoneColliderShape,
		VRMSpringBoneColliderShapeCapsule,
		VRMSpringBoneColliderShapePlane,
		VRMSpringBoneColliderShapeSphere,
		VRMSpringBoneJoint,
		VRMSpringBoneJointHelper,
		VRMSpringBoneLoaderPlugin,
		VRMSpringBoneManager,
		VRMUtils
	};
}
/**
* Loads VRM avatars onto A-Frame nodes and turns their humanoid bones.
*
* Rotations are written to the normalized humanoid bones, whose rest pose is the same
* T-pose for every model, and `update` copies them to the model's own bones. That is
* what makes one rotation mean the same thing on any VRM.
*/
var VrmAvatars = class {
	constructor(getThree) {
		this.getThree = getThree;
		this.entries = /* @__PURE__ */ new Map();
		this.vrmApi = null;
		this.vrmApiThree = null;
		this.generation = 0;
	}
	async load(nodeId, url, attach) {
		const generation = ++this.generation;
		this.remove(nodeId);
		const entry = {
			state: "loading",
			error: "",
			vrm: null,
			generation
		};
		this.entries.set(nodeId, entry);
		try {
			const THREE = this.requireThree();
			const { VRMLoaderPlugin, VRMUtils } = this.api(THREE);
			const loader = new THREE.GLTFLoader();
			loader.register((parser) => new VRMLoaderPlugin(parser));
			const vrm = (await loader.loadAsync(url)).userData.vrm;
			if (vrm === void 0) throw new Error(`Not a VRM file: ${url}`);
			if (this.entries.get(nodeId)?.generation !== generation) {
				VRMUtils.deepDispose(vrm.scene);
				return;
			}
			VRMUtils.rotateVRM0(vrm);
			attach(vrm.scene);
			entry.vrm = vrm;
			entry.state = "ready";
		} catch (error) {
			if (this.entries.get(nodeId)?.generation !== generation) return;
			entry.state = "error";
			entry.error = error instanceof Error ? error.message : String(error);
			throw error;
		}
	}
	setBoneRotation(nodeId, bone, degrees) {
		const node = this.requireVrm(nodeId).humanoid.getNormalizedBoneNode(bone);
		if (node === null) throw new Error(`VRM ${nodeId} has no humanoid bone: ${bone}`);
		const { degToRad } = this.requireThree().MathUtils;
		node.rotation.set(degToRad(degrees.x), degToRad(degrees.y), degToRad(degrees.z));
	}
	/**
	* Sets an expression's weight. The weight is clamped to 0 through 1, as three-vrm does, and
	* the scene tick applies it with the other expressions.
	*/
	setExpression(nodeId, name, weight) {
		if (!Number.isFinite(weight)) throw new Error(`VRM expression weight must be a number: ${weight}`);
		const expressions = this.requireVrm(nodeId).expressionManager;
		if (expressions === void 0) throw new Error(`VRM ${nodeId} has no expressions.`);
		if (expressions.getExpression(name) == null) throw new Error(`VRM ${nodeId} has no expression: ${name}`);
		expressions.setValue(name, Math.min(Math.max(weight, 0), 1));
	}
	expressionNames(nodeId) {
		return (this.entries.get(nodeId)?.vrm?.expressionManager?.expressions ?? []).map((expression) => expression.expressionName);
	}
	boneNames(nodeId) {
		const vrm = this.entries.get(nodeId)?.vrm;
		if (vrm === null || vrm === void 0) return [];
		return Object.keys(vrm.humanoid.humanBones).filter((name) => vrm.humanoid.getNormalizedBoneNode(name) !== null);
	}
	state(nodeId) {
		return this.entries.get(nodeId)?.state ?? "none";
	}
	error(nodeId) {
		return this.entries.get(nodeId)?.error ?? "";
	}
	update(deltaSeconds) {
		for (const entry of this.entries.values()) entry.vrm?.update(deltaSeconds);
	}
	remove(nodeId) {
		const entry = this.entries.get(nodeId);
		if (entry === void 0) return;
		this.entries.delete(nodeId);
		if (entry.vrm !== null && this.vrmApi !== null) this.vrmApi.VRMUtils.deepDispose(entry.vrm.scene);
	}
	clear() {
		for (const nodeId of [...this.entries.keys()]) this.remove(nodeId);
	}
	requireVrm(nodeId) {
		const entry = this.entries.get(nodeId);
		if (entry?.vrm === null || entry?.vrm === void 0) throw new Error(`VRM ${nodeId} is ${entry?.state ?? "not loaded"}.`);
		return entry.vrm;
	}
	requireThree() {
		const THREE = this.getThree();
		if (THREE === null) throw new Error("VRM avatars need A-Frame to be loaded first.");
		return THREE;
	}
	api(THREE) {
		if (this.vrmApi === null || this.vrmApiThree !== THREE) {
			this.vrmApi = createThreeVrm(THREE);
			this.vrmApiThree = THREE;
		}
		return this.vrmApi;
	}
};
var SCENE_LAYERS = Object.freeze(["above-stage", "below-stage"]);
var DEFAULT_SCENE_LAYER = "above-stage";
/**
* Stacking positions for the two hosts that can share the stage.
*
* `turbowarp-ar` puts its camera background one step below the `above-stage` value here, so a 3D
* scene renders over the camera image. Keep the two in step when either extension changes.
*/
var SCENE_HOST_Z_INDEX = {
	"above-stage": "10",
	"below-stage": "0"
};
var blockDefinitions = block_definitions_default.blocks;
var ROOT_ID = "scene";
var DOM_EVENT_TYPES = [
	"click",
	"tap",
	"pointerenter",
	"pointerleave"
];
var TurboWarpAFrameExtension = class {
	constructor() {
		this.nodes = /* @__PURE__ */ new Map();
		this.templates = /* @__PURE__ */ new Map();
		this.animationClips = /* @__PURE__ */ new Map();
		this.animationPlaybacks = /* @__PURE__ */ new Map();
		this.eventQueue = [];
		this.domEventTypes = new Set(DOM_EVENT_TYPES);
		this.runtimeId = `twaframe-${Math.random().toString(36).slice(2)}`;
		this.sceneOptions = {
			layer: DEFAULT_SCENE_LAYER,
			mode: "3d"
		};
		this.rootElement = null;
		this.sceneReadyPending = false;
		this.lastEvent = null;
		this.disposed = false;
		this.vrms = new VrmAvatars(() => this.getThree());
		this.handleSourceEditorDispose = () => {
			this.removeSourceEditors();
			(Scratch.vm?.runtime)?.off?.("RUNTIME_DISPOSED", this.handleSourceEditorDispose);
		};
		this.fixedEditors = fixedInputRegistration(Scratch);
		this.removeSourceEditors = registerSourceEditors(Scratch);
		(Scratch.vm?.runtime)?.on?.("RUNTIME_DISPOSED", this.handleSourceEditorDispose);
		this.resetGraph();
		this.runtimeCapability = createRuntimeCapability({
			createScene: (layer, mode) => this.createScene({
				LAYER: layer,
				MODE: mode
			}),
			createNode: (type, id, parent) => this.createNode({
				TYPE: type,
				ID: id,
				PARENT: parent
			}),
			addClass: (className, selector) => this.addClass({
				CLASS: className,
				SELECTOR: selector
			}),
			loadTemplate: (id, source) => this.loadTemplate({
				ID: id,
				SOURCE: source
			}),
			createFromTemplate: (template, instance, parent) => this.createFromTemplate({
				TEMPLATE: template,
				INSTANCE: instance,
				PARENT: parent
			}),
			setPosition: (selector, x, y, z) => this.setPosition({
				SELECTOR: selector,
				X: x,
				Y: y,
				Z: z
			}),
			setRotation: (selector, x, y, z) => this.setRotation({
				SELECTOR: selector,
				X: x,
				Y: y,
				Z: z
			}),
			setAttribute: (selector, name, value) => this.setAttribute({
				SELECTOR: selector,
				NAME: name,
				VALUE: value
			}),
			setData: (selector, key, value) => this.setData({
				SELECTOR: selector,
				KEY: key,
				VALUE: value
			}),
			emitEvent: (type, selector, data) => this.emitEvent({
				TYPE: type,
				SELECTOR: selector,
				DATA: data
			}),
			deleteSelector: (selector) => this.deleteSelector({ SELECTOR: selector }),
			countSelector: (selector) => this.countSelector({ SELECTOR: selector }),
			loadVrm: (url, selector) => this.loadVrm({
				URL: url,
				SELECTOR: selector
			}),
			setVrmBoneRotation: (selector, bone, x, y, z) => this.setVrmBoneRotation({
				SELECTOR: selector,
				BONE: bone,
				X: x,
				Y: y,
				Z: z
			}),
			vrmBoneNames: (selector) => this.vrmBoneNamesFor(Scratch.Cast.toString(selector)),
			vrmStatus: (selector) => this.vrmStatusFor(Scratch.Cast.toString(selector)),
			setVrmExpression: (selector, name, weight) => this.setVrmExpression({
				SELECTOR: selector,
				NAME: name,
				WEIGHT: weight
			}),
			vrmExpressionNames: (selector) => this.vrmExpressionNamesFor(Scratch.Cast.toString(selector))
		}, () => this.assertActive());
		const runtime = Scratch.vm?.runtime;
		if (runtime) runtime[runtimeCapabilityKey] = this.runtimeCapability;
	}
	getInfo() {
		const blocks = blockDefinitions.map((block) => this.toScratchBlock(block));
		this.fixedEditors.ensure(blocks.map((block) => `${extensionConfig.id}_${block.opcode}`));
		return {
			id: extensionConfig.id,
			name: Scratch.translate(block_definitions_default.extensionName),
			docsURI: extensionConfig.docsURI,
			blockIconURI: extensionConfig.blockIconURI,
			blocks
		};
	}
	async createScene(args) {
		await ensureAFrame();
		this.sceneOptions = {
			layer: this.normalizeLayer(Scratch.Cast.toString(args.LAYER)),
			mode: Scratch.Cast.toString(args.MODE) || "3d"
		};
		this.resetGraph();
		this.rootElement = this.createSceneElement();
		const root = this.requireNode(ROOT_ID);
		root.element = this.rootElement;
		this.applyNodeToElement(root);
		this.sceneReadyPending = true;
		this.enqueueEvent({
			type: "scene-ready",
			targetId: ROOT_ID,
			data: "{}"
		});
	}
	loadTemplate(args) {
		const id = this.normalizeId(Scratch.Cast.toString(args.ID));
		const template = this.parseTemplate(Scratch.Cast.toString(args.SOURCE));
		this.templates.set(id, template);
	}
	createNode(args) {
		const parent = this.firstMatch(Scratch.Cast.toString(args.PARENT)) ?? this.requireNode(ROOT_ID);
		this.addNode({
			type: Scratch.Cast.toString(args.TYPE),
			id: Scratch.Cast.toString(args.ID)
		}, parent.id);
	}
	createFromTemplate(args) {
		const templateId = this.normalizeId(Scratch.Cast.toString(args.TEMPLATE));
		const instanceId = this.normalizeId(Scratch.Cast.toString(args.INSTANCE));
		const template = this.templates.get(templateId);
		if (template === void 0) throw new Error(`Unknown A-Frame template: ${templateId}`);
		const parent = this.firstMatch(Scratch.Cast.toString(args.PARENT)) ?? this.requireNode(ROOT_ID);
		const rootTemplate = {
			...template,
			id: instanceId,
			data: {
				...template.data,
				template: templateId,
				instance: instanceId
			}
		};
		this.addNodeTree(rootTemplate, parent.id, instanceId);
	}
	setPosition(args) {
		this.setVec3Attribute(Scratch.Cast.toString(args.SELECTOR), "position", this.argsToVec3(args));
	}
	moveBy(args) {
		const delta = this.argsToVec3(args);
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			const current = this.parseVec3(node.attributes.get("position"));
			this.setVec3(node, "position", {
				x: current.x + delta.x,
				y: current.y + delta.y,
				z: current.z + delta.z
			});
		}
	}
	setRotation(args) {
		this.setVec3Attribute(Scratch.Cast.toString(args.SELECTOR), "rotation", this.argsToVec3(args));
	}
	addClass(args) {
		const className = this.normalizeToken(Scratch.Cast.toString(args.CLASS));
		if (className.length === 0) return;
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			node.classes.add(className);
			this.applyNodeToElement(node);
		}
	}
	setData(args) {
		const key = this.normalizeDataKey(Scratch.Cast.toString(args.KEY));
		const value = Scratch.Cast.toString(args.VALUE);
		if (key.length === 0) return;
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			node.data.set(key, value);
			this.applyNodeToElement(node);
		}
	}
	setAttribute(args) {
		const name = this.normalizeAttributeName(Scratch.Cast.toString(args.NAME));
		const value = Scratch.Cast.toString(args.VALUE);
		if (name.length === 0) return;
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			node.attributes.set(name, value);
			this.applyNodeToElement(node);
		}
	}
	deleteSelector(args) {
		const targets = this.matches(Scratch.Cast.toString(args.SELECTOR)).filter((node) => node.id !== ROOT_ID);
		for (const node of targets) if (this.nodes.has(node.id)) this.deleteNode(node.id);
	}
	countSelector(args) {
		return this.matches(Scratch.Cast.toString(args.SELECTOR)).length;
	}
	eventTargetId() {
		return this.lastEvent?.targetId ?? "";
	}
	emitEvent(args) {
		const target = this.firstMatch(Scratch.Cast.toString(args.SELECTOR));
		if (target === void 0) return;
		this.enqueueEvent({
			type: Scratch.Cast.toString(args.TYPE),
			targetId: target.id,
			data: Scratch.Cast.toString(args.DATA)
		});
	}
	whenSceneReady() {
		if (!this.sceneReadyPending) return false;
		this.sceneReadyPending = false;
		this.lastEvent = {
			type: "scene-ready",
			targetId: ROOT_ID,
			data: "{}"
		};
		return true;
	}
	whenEventOnSelector(args) {
		const type = Scratch.Cast.toString(args.TYPE);
		const selector = Scratch.Cast.toString(args.SELECTOR);
		this.domEventTypes.add(type);
		this.attachDomEventType(type);
		const index = this.eventQueue.findIndex((event) => {
			if (event.type !== type) return false;
			const target = this.nodes.get(event.targetId);
			return target !== void 0 && this.matchesSelector(target, selector);
		});
		if (index < 0) return false;
		const [event] = this.eventQueue.splice(index, 1);
		this.lastEvent = event ?? null;
		return event !== void 0;
	}
	createAnimationClip(args) {
		const name = this.normalizeId(Scratch.Cast.toString(args.NAME));
		const duration = Scratch.Cast.toNumber(args.DURATION);
		if (!Number.isFinite(duration) || duration < -1) throw new TypeError("Animation clip duration must be -1 or a non-negative number.");
		this.stopClipEverywhere(name);
		this.animationClips.set(name, {
			name,
			duration,
			tracks: []
		});
	}
	deleteAnimationClip(args) {
		const name = this.normalizeId(Scratch.Cast.toString(args.NAME));
		this.stopClipEverywhere(name);
		this.animationClips.delete(name);
	}
	addVectorKeyframeTrack(args) {
		this.addKeyframeTrack(args, "vector");
	}
	addQuaternionKeyframeTrack(args) {
		this.addKeyframeTrack(args, "quaternion");
	}
	addEulerRotationKeyframeTrack(args) {
		const times = this.parseNumberList(Scratch.Cast.toString(args.TIMES), "times");
		const eulerValues = this.parseNumberList(Scratch.Cast.toString(args.VALUES), "values");
		this.validateTrackNumbers(times, eulerValues, 3);
		const unit = this.normalizeEulerUnit(Scratch.Cast.toString(args.UNIT));
		const values = [];
		for (let index = 0; index < eulerValues.length; index += 3) values.push(...this.eulerToQuaternion(eulerValues[index] ?? 0, eulerValues[index + 1] ?? 0, eulerValues[index + 2] ?? 0, unit));
		this.pushKeyframeTrack({
			clipName: this.normalizeId(Scratch.Cast.toString(args.CLIP)),
			path: Scratch.Cast.toString(args.PATH),
			trackType: "quaternion",
			times,
			values
		});
	}
	addPositionKeyframe(args) {
		this.insertVectorKeyframe(args, ".position");
	}
	addScaleKeyframe(args) {
		this.insertVectorKeyframe(args, ".scale");
	}
	addEulerRotationKeyframe(args) {
		const unit = this.normalizeEulerUnit(Scratch.Cast.toString(args.UNIT));
		this.insertKeyframe({
			clipName: this.normalizeId(Scratch.Cast.toString(args.CLIP)),
			path: ".quaternion",
			trackType: "quaternion",
			time: Scratch.Cast.toNumber(args.TIME),
			values: this.eulerToQuaternion(Scratch.Cast.toNumber(args.X), Scratch.Cast.toNumber(args.Y), Scratch.Cast.toNumber(args.Z), unit)
		});
	}
	playAnimationClip(args) {
		const clipName = this.normalizeId(Scratch.Cast.toString(args.CLIP));
		const clip = this.requireAnimationClip(clipName);
		if (clip.tracks.length === 0) throw new Error(`3D animation clip has no keyframe tracks: ${clipName}`);
		const loop = Scratch.Cast.toBoolean(args.LOOP);
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			const playback = this.createPlayback(node, clip, loop);
			this.animationPlaybacks.set(this.playbackKey(node.id, clipName), playback);
		}
		this.ensureAnimationTickBridge();
	}
	stopAnimationClip(args) {
		const clipName = this.normalizeId(Scratch.Cast.toString(args.CLIP));
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) this.stopPlayback(this.playbackKey(node.id, clipName), true);
	}
	pauseAnimationClip(args) {
		const clipName = this.normalizeId(Scratch.Cast.toString(args.CLIP));
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			const playback = this.animationPlaybacks.get(this.playbackKey(node.id, clipName));
			if (playback === void 0) continue;
			playback.paused = true;
			if (playback.action !== null) playback.action.paused = true;
		}
	}
	resumeAnimationClip(args) {
		const clipName = this.normalizeId(Scratch.Cast.toString(args.CLIP));
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			const playback = this.animationPlaybacks.get(this.playbackKey(node.id, clipName));
			if (playback === void 0 || !playback.active) continue;
			playback.paused = false;
			if (playback.action !== null) {
				playback.action.paused = false;
				playback.action.play?.();
			}
		}
	}
	setAnimationTimeScale(args) {
		const clipName = this.normalizeId(Scratch.Cast.toString(args.CLIP));
		const scale = Scratch.Cast.toNumber(args.SCALE);
		if (!Number.isFinite(scale)) throw new TypeError("Animation time scale must be a finite number.");
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			const playback = this.animationPlaybacks.get(this.playbackKey(node.id, clipName));
			if (playback === void 0) continue;
			playback.timeScale = scale;
			if (playback.action !== null) playback.action.timeScale = scale;
		}
	}
	isAnimationClipPlaying(args) {
		const clipName = this.normalizeId(Scratch.Cast.toString(args.CLIP));
		return this.matches(Scratch.Cast.toString(args.SELECTOR)).some((node) => {
			const playback = this.animationPlaybacks.get(this.playbackKey(node.id, clipName));
			return playback?.active === true && playback.paused === false;
		});
	}
	async loadVrm(args) {
		const selector = Scratch.Cast.toString(args.SELECTOR);
		const node = this.firstMatch(selector);
		if (node === void 0) throw new Error(`No A-Frame node matches: ${selector}`);
		const element = node.element;
		if (element === null) throw new Error("VRM avatars need a scene in the browser.");
		this.ensureAnimationTickBridge();
		await this.vrms.load(node.id, Scratch.Cast.toString(args.URL), (scene) => {
			if (element.setObject3D !== void 0) element.setObject3D("vrm", scene);
			else element.object3D?.add(scene);
		});
	}
	setVrmBoneRotation(args) {
		const bone = Scratch.Cast.toString(args.BONE).trim();
		const rotation = this.argsToVec3(args);
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			if (this.vrms.state(node.id) !== "ready") continue;
			this.vrms.setBoneRotation(node.id, bone, rotation);
		}
	}
	setVrmExpression(args) {
		const name = Scratch.Cast.toString(args.NAME).trim();
		const weight = Scratch.Cast.toNumber(args.WEIGHT);
		for (const node of this.matches(Scratch.Cast.toString(args.SELECTOR))) {
			if (this.vrms.state(node.id) !== "ready") continue;
			this.vrms.setExpression(node.id, name, weight);
		}
	}
	vrmExpressionNames(args) {
		return JSON.stringify(this.vrmExpressionNamesFor(Scratch.Cast.toString(args.SELECTOR)));
	}
	vrmBoneNames(args) {
		return JSON.stringify(this.vrmBoneNamesFor(Scratch.Cast.toString(args.SELECTOR)));
	}
	vrmState(args) {
		const { state, error } = this.vrmStatusFor(Scratch.Cast.toString(args.SELECTOR));
		return state === "error" ? `error: ${error}` : state;
	}
	testStepAnimations(args) {
		this.updateFrame(Scratch.Cast.toNumber(args.DELTA) / 1e3);
	}
	snapshot() {
		return {
			options: this.sceneOptions,
			animationClips: [...this.animationClips.values()].map((clip) => ({
				name: clip.name,
				duration: clip.duration,
				tracks: clip.tracks.map((track) => ({
					type: track.type,
					path: track.path,
					times: [...track.times],
					values: [...track.values]
				}))
			})),
			animationPlaybacks: [...this.animationPlaybacks.values()].map((playback) => ({
				nodeId: playback.nodeId,
				clipName: playback.clipName,
				loop: playback.loop,
				active: playback.active,
				playing: playback.active && !playback.paused,
				paused: playback.paused,
				timeScale: playback.timeScale,
				hasMixer: playback.mixer !== null
			})),
			nodes: [...this.nodes.values()].map((node) => ({
				id: node.id,
				type: node.type,
				parentId: node.parentId,
				children: [...node.children],
				classes: [...node.classes].sort(),
				data: Object.fromEntries([...node.data.entries()].sort()),
				attributes: Object.fromEntries([...node.attributes.entries()].sort())
			}))
		};
	}
	dispose() {
		this.fixedEditors.dispose();
		if (this.disposed) return;
		this.disposed = true;
		this.handleSourceEditorDispose();
		for (const key of [...this.animationPlaybacks.keys()]) this.stopPlayback(key, true);
		this.vrms.clear();
		this.rootElement?.parentElement?.remove();
		this.rootElement = null;
		const runtime = Scratch.vm?.runtime;
		if (runtime?.["turbowarpAFrameCapability"] === this.runtimeCapability) delete runtime[runtimeCapabilityKey];
	}
	assertActive() {
		if (this.disposed) throw new Error("A-Frame runtime capability is disposed.");
	}
	resetGraph() {
		for (const key of [...this.animationPlaybacks.keys()]) this.stopPlayback(key, true);
		this.vrms.clear();
		this.nodes.clear();
		this.nodes.set(ROOT_ID, {
			id: ROOT_ID,
			type: "scene",
			parentId: null,
			children: [],
			classes: /* @__PURE__ */ new Set(),
			data: /* @__PURE__ */ new Map(),
			attributes: /* @__PURE__ */ new Map([["embedded", "true"], ["renderer", "alpha: true"]]),
			element: null
		});
		this.eventQueue.length = 0;
		this.lastEvent = null;
	}
	addNodeTree(template, parentId, fallbackId) {
		const node = this.addNode({
			...template,
			id: fallbackId
		}, parentId);
		for (const [index, child] of (template.children ?? []).entries()) {
			const childId = child.id ?? child.type ?? String(index + 1);
			this.addNodeTree(child, node.id, `${node.id}-${this.normalizeId(childId)}`);
		}
		return node;
	}
	addNode(template, parentId) {
		const id = this.normalizeId(template.id ?? template.type ?? "node");
		if (id === ROOT_ID || this.nodes.has(id)) throw new Error(`Duplicate A-Frame node id: ${id}`);
		const parent = this.requireNode(parentId);
		const node = {
			id,
			type: this.normalizeNodeType(template.type ?? "group"),
			parentId,
			children: [],
			classes: new Set(this.normalizeClasses(template)),
			data: new Map(this.normalizeRecord(template.data, this.normalizeDataKey.bind(this))),
			attributes: new Map(this.normalizeRecord(template.attributes, this.normalizeAttributeName.bind(this))),
			element: this.createElementForType(template.type ?? "group")
		};
		this.nodes.set(id, node);
		parent.children.push(id);
		this.attachElement(parent, node);
		this.attachNodeEventListeners(node);
		this.applyNodeToElement(node);
		return node;
	}
	deleteNode(id) {
		const node = this.requireNode(id);
		for (const childId of [...node.children]) this.deleteNode(childId);
		if (node.parentId !== null) {
			const parent = this.requireNode(node.parentId);
			parent.children = parent.children.filter((childId) => childId !== id);
		}
		node.element?.remove();
		this.nodes.delete(id);
		this.vrms.remove(id);
		for (const key of [...this.animationPlaybacks.keys()]) if (key.startsWith(`${id}:`)) this.stopPlayback(key, true);
	}
	matches(selector) {
		const normalized = selector.trim();
		if (normalized.length === 0 || normalized === "*") return [...this.nodes.values()];
		return [...this.nodes.values()].filter((node) => this.matchesSelector(node, normalized));
	}
	firstMatch(selector) {
		return this.matches(selector)[0];
	}
	matchesSelector(node, selector) {
		if (selector === "@event" || selector === "event target") return this.lastEvent?.targetId === node.id;
		if (selector.startsWith("#")) return node.id === this.normalizeId(selector.slice(1));
		if (selector.startsWith(".")) return node.classes.has(this.normalizeToken(selector.slice(1)));
		const dataMatch = selector.match(/^\[data-([a-zA-Z0-9_-]+)=["']?([^"'\]]+)["']?\]$/);
		if (dataMatch !== null) {
			const [, key, value] = dataMatch;
			return node.data.get(this.normalizeDataKey(key ?? "")) === value;
		}
		return node.id === this.normalizeId(selector);
	}
	enqueueEvent(event) {
		this.pushEvent(event);
		const element = this.nodes.get(event.targetId)?.element;
		if (element !== null && element !== void 0) element.dispatchEvent(new CustomEvent(event.type, { detail: {
			data: event.data,
			targetId: event.targetId,
			twAframeSynthetic: true
		} }));
	}
	pushEvent(event) {
		this.eventQueue.push(event);
	}
	createSceneElement() {
		if (typeof document === "undefined") return null;
		document.getElementById("tw-aframe-root")?.remove();
		const host = document.createElement("div");
		host.id = "tw-aframe-root";
		host.dataset["twAframeLayer"] = this.sceneOptions.layer;
		host.dataset["twAframeMode"] = this.sceneOptions.mode;
		host.style.position = "absolute";
		host.style.inset = "0";
		host.style.pointerEvents = "auto";
		host.style.zIndex = SCENE_HOST_Z_INDEX[this.sceneOptions.layer];
		const scene = document.createElement("a-scene");
		host.append(scene);
		this.findStageMount().append(host);
		return scene;
	}
	createElementForType(type) {
		if (typeof document === "undefined") return null;
		return document.createElement(this.tagForType(this.normalizeNodeType(type)));
	}
	attachElement(parent, child) {
		if (parent.element === null || child.element === null) return;
		parent.element.append(child.element);
	}
	attachDomEventType(type) {
		for (const node of this.nodes.values()) this.attachNodeEventListener(node, type);
	}
	attachNodeEventListeners(node) {
		for (const type of this.domEventTypes) this.attachNodeEventListener(node, type);
	}
	attachNodeEventListener(node, type) {
		const element = node.element;
		if (element === null) return;
		const listenerKey = `twAframeListener${type}`;
		const elementWithState = element;
		if (elementWithState[listenerKey]) return;
		element.addEventListener(type, (event) => {
			if (event.target !== element) return;
			const detail = this.eventDetail(event);
			if (detail["twAframeSynthetic"] === true) return;
			this.pushEvent({
				type,
				targetId: node.id,
				data: JSON.stringify(detail)
			});
		});
		elementWithState[listenerKey] = true;
	}
	eventDetail(event) {
		if ("detail" in event && typeof event.detail === "object" && event.detail !== null) return event.detail;
		return {};
	}
	findStageMount() {
		for (const selector of [
			"[class*=\"stage_stage-wrapper\"]",
			"[class*=\"stage-wrapper\"]",
			"[class*=\"stage\"]",
			"#scratch-stage",
			"canvas"
		]) {
			const match = document.querySelector(selector);
			const mount = match instanceof HTMLCanvasElement ? match.parentElement : match;
			if (mount instanceof HTMLElement) {
				if (getComputedStyle(mount).position === "static") mount.style.position = "relative";
				return mount;
			}
		}
		return document.body;
	}
	applyNodeToElement(node) {
		if (node.element === null) return;
		node.element.id = node.id;
		node.element.setAttribute("class", [...node.classes].sort().join(" "));
		for (const [key, value] of node.data) node.element.setAttribute(`data-${key}`, value);
		for (const [name, value] of node.attributes) node.element.setAttribute(name, value);
	}
	addKeyframeTrack(args, trackType) {
		const times = this.parseNumberList(Scratch.Cast.toString(args.TIMES), "times");
		const values = this.parseNumberList(Scratch.Cast.toString(args.VALUES), "values");
		this.validateTrackNumbers(times, values, trackType === "vector" ? 3 : 4);
		this.pushKeyframeTrack({
			clipName: this.normalizeId(Scratch.Cast.toString(args.CLIP)),
			path: Scratch.Cast.toString(args.PATH),
			trackType,
			times,
			values
		});
	}
	insertVectorKeyframe(args, path) {
		this.insertKeyframe({
			clipName: this.normalizeId(Scratch.Cast.toString(args.CLIP)),
			path,
			trackType: "vector",
			time: Scratch.Cast.toNumber(args.TIME),
			values: [
				Scratch.Cast.toNumber(args.X),
				Scratch.Cast.toNumber(args.Y),
				Scratch.Cast.toNumber(args.Z)
			]
		});
	}
	insertKeyframe({ clipName, path, trackType, time, values }) {
		if (!Number.isFinite(time) || time < 0) throw new TypeError("Animation keyframe time must be a non-negative number.");
		if (values.some((value) => !Number.isFinite(value))) throw new TypeError("Animation keyframe values must be finite numbers.");
		const stride = trackType === "vector" ? 3 : 4;
		if (values.length !== stride) throw new TypeError(`Animation keyframe must contain ${stride} values.`);
		const clip = this.requireAnimationClip(clipName);
		const normalizedPath = this.normalizeTrackPath(path, trackType);
		let track = clip.tracks.find((item) => item.type === trackType && item.path === normalizedPath);
		if (track === void 0) {
			track = {
				type: trackType,
				path: normalizedPath,
				times: [],
				values: []
			};
			clip.tracks.push(track);
		}
		const insertAt = track.times.findIndex((existingTime) => existingTime >= time);
		const valueInsertAt = (insertAt < 0 ? track.times.length : insertAt) * stride;
		if (insertAt >= 0 && track.times[insertAt] === time) {
			track.values.splice(valueInsertAt, stride, ...values);
			return;
		}
		const timeInsertAt = insertAt < 0 ? track.times.length : insertAt;
		track.times.splice(timeInsertAt, 0, time);
		track.values.splice(valueInsertAt, 0, ...values);
	}
	pushKeyframeTrack({ clipName, path, trackType, times, values }) {
		const clip = this.requireAnimationClip(clipName);
		const normalizedPath = this.normalizeTrackPath(path, trackType);
		clip.tracks.push({
			type: trackType,
			path: normalizedPath,
			times: [...times],
			values: [...values]
		});
	}
	parseNumberList(source, label) {
		const trimmed = source.trim();
		if (trimmed.length === 0) throw new TypeError(`Animation ${label} must contain at least one number.`);
		const values = trimmed.split(/[\s,]+/).filter((part) => part.length > 0).map((part) => Number(part));
		if (values.length === 0 || values.some((value) => !Number.isFinite(value))) throw new TypeError(`Animation ${label} must contain only finite numbers.`);
		return values;
	}
	validateTrackNumbers(times, values, stride) {
		if (times.length === 0) throw new TypeError("Animation track times must not be empty.");
		for (let index = 1; index < times.length; index += 1) if ((times[index] ?? 0) < (times[index - 1] ?? 0)) throw new TypeError("Animation track times must be sorted in ascending order.");
		const expectedValues = times.length * stride;
		if (values.length !== expectedValues) throw new TypeError(`Animation track values length must be ${expectedValues} for ${times.length} keyframes.`);
	}
	normalizeTrackPath(path, trackType) {
		const normalized = path.trim();
		const allowed = trackType === "vector" ? /* @__PURE__ */ new Set([".position", ".scale"]) : /* @__PURE__ */ new Set([".quaternion"]);
		if (!allowed.has(normalized)) throw new TypeError(`Animation ${trackType} track path must be one of: ${[...allowed].join(", ")}.`);
		return normalized;
	}
	eulerToQuaternion(x, y, z, unit) {
		const scale = unit === "degrees" ? Math.PI / 180 : 1;
		const halfX = x * scale / 2;
		const halfY = y * scale / 2;
		const halfZ = z * scale / 2;
		const c1 = Math.cos(halfX);
		const c2 = Math.cos(halfY);
		const c3 = Math.cos(halfZ);
		const s1 = Math.sin(halfX);
		const s2 = Math.sin(halfY);
		const s3 = Math.sin(halfZ);
		return [
			s1 * c2 * c3 + c1 * s2 * s3,
			c1 * s2 * c3 - s1 * c2 * s3,
			c1 * c2 * s3 + s1 * s2 * c3,
			c1 * c2 * c3 - s1 * s2 * s3
		];
	}
	normalizeEulerUnit(value) {
		const unit = value.trim().toLowerCase();
		if (unit !== "radians" && unit !== "degrees") throw new TypeError("Euler rotation keyframe unit must be radians or degrees.");
		return unit;
	}
	createPlayback(node, clip, loop) {
		const key = this.playbackKey(node.id, clip.name);
		this.stopPlayback(key, true);
		const playback = {
			nodeId: node.id,
			clipName: clip.name,
			loop,
			active: false,
			paused: false,
			timeScale: 1,
			mixer: null,
			action: null
		};
		const mixer = this.createMixer(node, clip, loop);
		if (mixer !== null) {
			playback.mixer = mixer.mixer;
			playback.action = mixer.action;
			playback.active = true;
		}
		return playback;
	}
	createMixer(node, clip, loop) {
		const object3D = this.object3DForNode(node);
		const THREE = this.getThree();
		if (object3D === null || THREE === null) return null;
		const threeClip = this.toThreeAnimationClip(THREE, clip);
		const mixer = new THREE.AnimationMixer(object3D);
		const action = mixer.clipAction(threeClip);
		if (action.setLoop !== void 0) action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
		action.paused = false;
		action.timeScale = 1;
		action.play?.();
		return {
			mixer,
			action
		};
	}
	toThreeAnimationClip(THREE, clip) {
		const tracks = clip.tracks.map((track) => {
			if (track.type === "vector") return new THREE.VectorKeyframeTrack(track.path, track.times, track.values);
			return new THREE.QuaternionKeyframeTrack(track.path, track.times, track.values);
		});
		return new THREE.AnimationClip(clip.name, clip.duration, tracks);
	}
	object3DForNode(node) {
		return node.element?.object3D ?? null;
	}
	stopPlayback(key, remove) {
		const playback = this.animationPlaybacks.get(key);
		if (playback === void 0) return;
		playback.action?.stop?.();
		playback.mixer?.stopAllAction?.();
		playback.active = false;
		playback.paused = false;
		if (remove) this.animationPlaybacks.delete(key);
	}
	stopClipEverywhere(clipName) {
		for (const [key, playback] of [...this.animationPlaybacks.entries()]) if (playback.clipName === clipName) this.stopPlayback(key, true);
	}
	vrmBoneNamesFor(selector) {
		const node = this.firstMatch(selector);
		return node === void 0 ? [] : this.vrms.boneNames(node.id);
	}
	vrmExpressionNamesFor(selector) {
		const node = this.firstMatch(selector);
		return node === void 0 ? [] : this.vrms.expressionNames(node.id);
	}
	vrmStatusFor(selector) {
		const node = this.firstMatch(selector);
		if (node === void 0) return {
			state: "none",
			error: ""
		};
		return {
			state: this.vrms.state(node.id),
			error: this.vrms.error(node.id)
		};
	}
	updateFrame(deltaTime) {
		this.updateAnimationMixers(deltaTime);
		if (Number.isFinite(deltaTime) && deltaTime >= 0) this.vrms.update(deltaTime);
	}
	updateAnimationMixers(deltaTime) {
		if (!Number.isFinite(deltaTime) || deltaTime < 0) return;
		for (const playback of this.animationPlaybacks.values()) {
			if (!playback.active || playback.paused) continue;
			playback.mixer?.update(deltaTime * playback.timeScale);
		}
	}
	ensureAnimationTickBridge() {
		const scene = this.rootElement;
		if (scene === null || this.getThree() === null) return;
		const AFRAME = this.getAFrame();
		if (AFRAME === null) return;
		this.animationRuntimeRegistry().set(this.runtimeId, this);
		if (AFRAME.components?.["tw-animation-runtime"] === void 0) AFRAME.registerComponent("tw-animation-runtime", {
			schema: { id: { type: "string" } },
			tick(_time, timeDelta) {
				animationRuntimeRegistry().get(this.data.id)?.updateFrame(timeDelta / 1e3);
			}
		});
		scene.setAttribute("tw-animation-runtime", `id: ${this.runtimeId}`);
	}
	animationRuntimeRegistry() {
		return animationRuntimeRegistry();
	}
	getAFrame() {
		return globalThis.AFRAME ?? null;
	}
	getThree() {
		return this.getAFrame()?.THREE ?? null;
	}
	playbackKey(nodeId, clipName) {
		return `${nodeId}:${clipName}`;
	}
	requireAnimationClip(name) {
		const clip = this.animationClips.get(name);
		if (clip === void 0) throw new Error(`Unknown 3D animation clip: ${name}`);
		return clip;
	}
	setVec3Attribute(selector, name, value) {
		for (const node of this.matches(selector)) this.setVec3(node, name, value);
	}
	setVec3(node, name, value) {
		node.attributes.set(name, `${value.x} ${value.y} ${value.z}`);
		this.applyNodeToElement(node);
	}
	argsToVec3(args) {
		return {
			x: Scratch.Cast.toNumber(args.X),
			y: Scratch.Cast.toNumber(args.Y),
			z: Scratch.Cast.toNumber(args.Z)
		};
	}
	parseVec3(value) {
		if (value === void 0) return {
			x: 0,
			y: 0,
			z: 0
		};
		const [x = 0, y = 0, z = 0] = value.split(/\s+/).map((part) => Number(part));
		return {
			x,
			y,
			z
		};
	}
	parseTemplate(source) {
		const value = JSON.parse(source);
		validateTemplateNode(value, "template");
		return value;
	}
	normalizeClasses(template) {
		return [...Array.isArray(template.class) ? template.class : String(template.class ?? "").split(/\s+/), ...template.classes ?? []].map((value) => this.normalizeToken(value)).filter((value) => value.length > 0);
	}
	normalizeRecord(value, normalizeKey) {
		return Object.entries(value ?? {}).map(([key, recordValue]) => [normalizeKey(key), String(recordValue)]);
	}
	normalizeNodeType(value) {
		const type = this.normalizeToken(value);
		return type.length === 0 ? "group" : type;
	}
	normalizeId(value) {
		return this.normalizeToken(value) || "node";
	}
	/**
	* Blocks take whatever string a project hands them, so an unknown layer falls back to the default
	* rather than stopping the script, and never reaches the host as a value it cannot honor.
	*/
	normalizeLayer(value) {
		const layer = value.trim();
		return SCENE_LAYERS.includes(layer) ? layer : DEFAULT_SCENE_LAYER;
	}
	normalizeToken(value) {
		return value.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
	}
	normalizeDataKey(value) {
		return this.normalizeToken(value).toLowerCase();
	}
	normalizeAttributeName(value) {
		return value.trim().replace(/[^a-zA-Z0-9_:-]/g, "-");
	}
	tagForType(type) {
		return {
			box: "a-box",
			camera: "a-camera",
			circle: "a-circle",
			cone: "a-cone",
			cylinder: "a-cylinder",
			empty: "a-entity",
			group: "a-entity",
			image: "a-image",
			"image-plane": "a-image",
			light: "a-light",
			model: "a-entity",
			plane: "a-plane",
			primitive: "a-entity",
			scene: "a-scene",
			sphere: "a-sphere",
			text: "a-text"
		}[type] ?? "a-entity";
	}
	requireNode(id) {
		const node = this.nodes.get(id);
		if (node === void 0) throw new Error(`Unknown A-Frame node: ${id}`);
		return node;
	}
	toScratchBlock(block) {
		return {
			opcode: block.opcode,
			blockType: Scratch.BlockType[block.blockType],
			text: Scratch.translate(block.text),
			arguments: Object.fromEntries(Object.entries(block.arguments).map(([name, argument]) => [name, {
				type: Scratch.ArgumentType[argument.type],
				defaultValue: argument.defaultValue
			}]))
		};
	}
};
function animationRuntimeRegistry() {
	const globalState = globalThis;
	globalState.__twAframeAnimationRuntimes ?? (globalState.__twAframeAnimationRuntimes = /* @__PURE__ */ new Map());
	return globalState.__twAframeAnimationRuntimes;
}
if (extensionConfig.unsandboxed && !Scratch.extensions.unsandboxed) throw new Error(`${extensionConfig.name} must run unsandboxed.`);
Scratch.extensions.register(new TurboWarpAFrameExtension());

})(Scratch);
