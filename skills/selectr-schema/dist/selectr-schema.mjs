import { createRequire } from "node:module";
import { accessSync, constants, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename, dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
// \0rolldown/runtime.js
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
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
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
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
// src/lib/has-own.ts
/** Whether `obj` has `key` as its own property (not inherited, so "constructor" or "__proto__" never match). */
var hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
// src/lib/model/column-types.ts
var TYPE_ALIASES = {
	integer: "int4",
	int: "int4",
	smallint: "int2",
	bigint: "int8",
	boolean: "bool",
	real: "float4",
	decimal: "numeric"
};
/** The pg_type name of a type: `integer` -> `int4`; anything else as it is. */
var canonicalType = (type) => hasOwn(TYPE_ALIASES, type) ? TYPE_ALIASES[type] : type;
var NUMERIC_TYPES = /* @__PURE__ */ new Set([
	"int2",
	"int4",
	"int8",
	"numeric",
	"float4",
	"float8"
]);
/** A numeric type, which Postgres compares with every other numeric type natively. */
var isNumericType = (type) => NUMERIC_TYPES.has(canonicalType(type));
/** The same type once canonical, or two numeric types (`int4` and `int8` hold the same ids). */
var compatibleTypes = (a, b) => canonicalType(a) === canonicalType(b) || isNumericType(a) && isNumericType(b);
// node_modules/ajv/dist/compile/codegen/code.js
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
// node_modules/ajv/dist/compile/codegen/scope.js
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
// node_modules/ajv/dist/compile/codegen/index.js
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
// node_modules/ajv/dist/compile/util.js
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
// node_modules/ajv/dist/compile/names.js
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
// node_modules/ajv/dist/compile/errors.js
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
// node_modules/ajv/dist/compile/validate/boolSchema.js
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
// node_modules/ajv/dist/compile/rules.js
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
// node_modules/ajv/dist/compile/validate/applicability.js
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
// node_modules/ajv/dist/compile/validate/dataType.js
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
// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
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
// node_modules/ajv/dist/vocabularies/code.js
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
// node_modules/ajv/dist/compile/validate/keyword.js
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
// node_modules/ajv/dist/compile/validate/subschema.js
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
// node_modules/fast-deep-equal/index.js
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
// node_modules/json-schema-traverse/index.js
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
// node_modules/ajv/dist/compile/resolve.js
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
// node_modules/ajv/dist/compile/validate/index.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults$1();
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
// node_modules/ajv/dist/runtime/validation_error.js
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
// node_modules/ajv/dist/compile/ref_error.js
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
// node_modules/ajv/dist/compile/index.js
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
// node_modules/ajv/dist/refs/data.json
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$10,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description$2,
	properties: () => properties$10,
	required: () => required$2,
	type: () => type$10
}), $id$10, description$2, type$10, required$2, properties$10, data_default;
var init_data = __esmMin((() => {
	$id$10 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description$2 = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$10 = "object";
	required$2 = ["$data"];
	properties$10 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$10,
		description: description$2,
		type: type$10,
		required: required$2,
		properties: properties$10,
		additionalProperties: false
	};
}));
// node_modules/fast-uri/lib/utils.js
var require_utils$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
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
// node_modules/fast-uri/lib/schemes.js
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils$2();
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
// node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils$2();
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
// node_modules/ajv/dist/runtime/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
// node_modules/ajv/dist/core.js
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
// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
// node_modules/ajv/dist/vocabularies/core/ref.js
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
// node_modules/ajv/dist/vocabularies/core/index.js
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
// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
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
// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
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
// node_modules/ajv/dist/runtime/ucs2length.js
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
// node_modules/ajv/dist/vocabularies/validation/limitLength.js
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
// node_modules/ajv/dist/vocabularies/validation/pattern.js
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
// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
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
// node_modules/ajv/dist/vocabularies/validation/required.js
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
// node_modules/ajv/dist/vocabularies/validation/limitItems.js
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
// node_modules/ajv/dist/runtime/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
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
// node_modules/ajv/dist/vocabularies/validation/const.js
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
// node_modules/ajv/dist/vocabularies/validation/enum.js
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
// node_modules/ajv/dist/vocabularies/validation/index.js
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
// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
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
// node_modules/ajv/dist/vocabularies/applicator/items.js
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
// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
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
// node_modules/ajv/dist/vocabularies/applicator/items2020.js
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
// node_modules/ajv/dist/vocabularies/applicator/contains.js
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
// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
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
// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
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
// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
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
// node_modules/ajv/dist/vocabularies/applicator/properties.js
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
// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
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
// node_modules/ajv/dist/vocabularies/applicator/not.js
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
// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
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
// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
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
// node_modules/ajv/dist/vocabularies/applicator/allOf.js
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
// node_modules/ajv/dist/vocabularies/applicator/if.js
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
// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
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
// node_modules/ajv/dist/vocabularies/applicator/index.js
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
// node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
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
// node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
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
// node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
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
// node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dynamicRef_1 = require_dynamicRef();
	exports.default = {
		keyword: "$recursiveRef",
		schemaType: "string",
		code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
	};
}));
// node_modules/ajv/dist/vocabularies/dynamic/index.js
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
// node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
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
// node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
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
// node_modules/ajv/dist/vocabularies/validation/limitContains.js
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
// node_modules/ajv/dist/vocabularies/next.js
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
// node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
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
// node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
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
// node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var unevaluatedProperties_1 = require_unevaluatedProperties();
	var unevaluatedItems_1 = require_unevaluatedItems();
	exports.default = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
}));
// node_modules/ajv/dist/vocabularies/format/format.js
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
// node_modules/ajv/dist/vocabularies/format/index.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
// node_modules/ajv/dist/vocabularies/metadata.js
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
// node_modules/ajv/dist/vocabularies/draft2020.js
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
// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
// node_modules/ajv/dist/vocabularies/discriminator/index.js
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
// node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var schema_exports = /* @__PURE__ */ __exportAll({
	$comment: () => $comment,
	$dynamicAnchor: () => $dynamicAnchor$7,
	$id: () => $id$9,
	$schema: () => $schema$9,
	$vocabulary: () => $vocabulary$7,
	allOf: () => allOf,
	default: () => schema_default,
	properties: () => properties$9,
	title: () => title$9,
	type: () => type$9
});
var $schema$9, $id$9, $vocabulary$7, $dynamicAnchor$7, title$9, allOf, type$9, $comment, properties$9, schema_default;
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
	type$9 = ["object", "boolean"];
	$comment = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.";
	properties$9 = {
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
		type: type$9,
		$comment,
		properties: properties$9
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var applicator_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$3,
	$dynamicAnchor: () => $dynamicAnchor$6,
	$id: () => $id$8,
	$schema: () => $schema$8,
	$vocabulary: () => $vocabulary$6,
	default: () => applicator_default,
	properties: () => properties$8,
	title: () => title$8,
	type: () => type$8
});
var $schema$8, $id$8, $vocabulary$6, $dynamicAnchor$6, title$8, type$8, properties$8, $defs$3, applicator_default;
var init_applicator = __esmMin((() => {
	$schema$8 = "https://json-schema.org/draft/2020-12/schema";
	$id$8 = "https://json-schema.org/draft/2020-12/meta/applicator";
	$vocabulary$6 = { "https://json-schema.org/draft/2020-12/vocab/applicator": true };
	$dynamicAnchor$6 = "meta";
	title$8 = "Applicator vocabulary meta-schema";
	type$8 = ["object", "boolean"];
	properties$8 = {
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
		type: type$8,
		properties: properties$8,
		$defs: $defs$3
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var unevaluated_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$5,
	$id: () => $id$7,
	$schema: () => $schema$7,
	$vocabulary: () => $vocabulary$5,
	default: () => unevaluated_default,
	properties: () => properties$7,
	title: () => title$7,
	type: () => type$7
});
var $schema$7, $id$7, $vocabulary$5, $dynamicAnchor$5, title$7, type$7, properties$7, unevaluated_default;
var init_unevaluated = __esmMin((() => {
	$schema$7 = "https://json-schema.org/draft/2020-12/schema";
	$id$7 = "https://json-schema.org/draft/2020-12/meta/unevaluated";
	$vocabulary$5 = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": true };
	$dynamicAnchor$5 = "meta";
	title$7 = "Unevaluated applicator vocabulary meta-schema";
	type$7 = ["object", "boolean"];
	properties$7 = {
		"unevaluatedItems": { "$dynamicRef": "#meta" },
		"unevaluatedProperties": { "$dynamicRef": "#meta" }
	};
	unevaluated_default = {
		$schema: $schema$7,
		$id: $id$7,
		$vocabulary: $vocabulary$5,
		$dynamicAnchor: $dynamicAnchor$5,
		title: title$7,
		type: type$7,
		properties: properties$7
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var content_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$4,
	$id: () => $id$6,
	$schema: () => $schema$6,
	$vocabulary: () => $vocabulary$4,
	default: () => content_default,
	properties: () => properties$6,
	title: () => title$6,
	type: () => type$6
});
var $schema$6, $id$6, $vocabulary$4, $dynamicAnchor$4, title$6, type$6, properties$6, content_default;
var init_content = __esmMin((() => {
	$schema$6 = "https://json-schema.org/draft/2020-12/schema";
	$id$6 = "https://json-schema.org/draft/2020-12/meta/content";
	$vocabulary$4 = { "https://json-schema.org/draft/2020-12/vocab/content": true };
	$dynamicAnchor$4 = "meta";
	title$6 = "Content vocabulary meta-schema";
	type$6 = ["object", "boolean"];
	properties$6 = {
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
		type: type$6,
		properties: properties$6
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var core_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$2,
	$dynamicAnchor: () => $dynamicAnchor$3,
	$id: () => $id$5,
	$schema: () => $schema$5,
	$vocabulary: () => $vocabulary$3,
	default: () => core_default,
	properties: () => properties$5,
	title: () => title$5,
	type: () => type$5
});
var $schema$5, $id$5, $vocabulary$3, $dynamicAnchor$3, title$5, type$5, properties$5, $defs$2, core_default;
var init_core = __esmMin((() => {
	$schema$5 = "https://json-schema.org/draft/2020-12/schema";
	$id$5 = "https://json-schema.org/draft/2020-12/meta/core";
	$vocabulary$3 = { "https://json-schema.org/draft/2020-12/vocab/core": true };
	$dynamicAnchor$3 = "meta";
	title$5 = "Core vocabulary meta-schema";
	type$5 = ["object", "boolean"];
	properties$5 = {
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
		type: type$5,
		properties: properties$5,
		$defs: $defs$2
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var format_annotation_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$2,
	$id: () => $id$4,
	$schema: () => $schema$4,
	$vocabulary: () => $vocabulary$2,
	default: () => format_annotation_default,
	properties: () => properties$4,
	title: () => title$4,
	type: () => type$4
});
var $schema$4, $id$4, $vocabulary$2, $dynamicAnchor$2, title$4, type$4, properties$4, format_annotation_default;
var init_format_annotation = __esmMin((() => {
	$schema$4 = "https://json-schema.org/draft/2020-12/schema";
	$id$4 = "https://json-schema.org/draft/2020-12/meta/format-annotation";
	$vocabulary$2 = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": true };
	$dynamicAnchor$2 = "meta";
	title$4 = "Format vocabulary meta-schema for annotation results";
	type$4 = ["object", "boolean"];
	properties$4 = { "format": { "type": "string" } };
	format_annotation_default = {
		$schema: $schema$4,
		$id: $id$4,
		$vocabulary: $vocabulary$2,
		$dynamicAnchor: $dynamicAnchor$2,
		title: title$4,
		type: type$4,
		properties: properties$4
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var meta_data_exports = /* @__PURE__ */ __exportAll({
	$dynamicAnchor: () => $dynamicAnchor$1,
	$id: () => $id$3,
	$schema: () => $schema$3,
	$vocabulary: () => $vocabulary$1,
	default: () => meta_data_default,
	properties: () => properties$3,
	title: () => title$3,
	type: () => type$3
});
var $schema$3, $id$3, $vocabulary$1, $dynamicAnchor$1, title$3, type$3, properties$3, meta_data_default;
var init_meta_data = __esmMin((() => {
	$schema$3 = "https://json-schema.org/draft/2020-12/schema";
	$id$3 = "https://json-schema.org/draft/2020-12/meta/meta-data";
	$vocabulary$1 = { "https://json-schema.org/draft/2020-12/vocab/meta-data": true };
	$dynamicAnchor$1 = "meta";
	title$3 = "Meta-data vocabulary meta-schema";
	type$3 = ["object", "boolean"];
	properties$3 = {
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
		type: type$3,
		properties: properties$3
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var validation_exports = /* @__PURE__ */ __exportAll({
	$defs: () => $defs$1,
	$dynamicAnchor: () => $dynamicAnchor,
	$id: () => $id$2,
	$schema: () => $schema$2,
	$vocabulary: () => $vocabulary,
	default: () => validation_default,
	properties: () => properties$2,
	title: () => title$2,
	type: () => type$2
});
var $schema$2, $id$2, $vocabulary, $dynamicAnchor, title$2, type$2, properties$2, $defs$1, validation_default;
var init_validation = __esmMin((() => {
	$schema$2 = "https://json-schema.org/draft/2020-12/schema";
	$id$2 = "https://json-schema.org/draft/2020-12/meta/validation";
	$vocabulary = { "https://json-schema.org/draft/2020-12/vocab/validation": true };
	$dynamicAnchor = "meta";
	title$2 = "Validation vocabulary meta-schema";
	type$2 = ["object", "boolean"];
	properties$2 = {
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
		type: type$2,
		properties: properties$2,
		$defs: $defs$1
	};
}));
// node_modules/ajv/dist/refs/json-schema-2020-12/index.js
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
// src/lib/model/schemas/base.schema.json
var import__2020 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
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
})))(), 1);
var base_schema_default = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "base.schema.json",
	title: "Selectr schema (base, format v2)",
	description: "Facts about a database: entities, columns, relations. Written by the generator; user changes live in the overlay file.",
	type: "object",
	additionalProperties: false,
	required: [
		"format",
		"version",
		"name",
		"entities",
		"relations"
	],
	properties: {
		"$schema": { "type": "string" },
		"format": { "const": "selectr-schema" },
		"version": { "const": 2 },
		"name": {
			"type": "string",
			"minLength": 1
		},
		"description": { "type": "string" },
		"generatedAt": { "type": "string" },
		"generator": {
			"type": "object",
			"additionalProperties": false,
			"required": ["name", "version"],
			"properties": {
				"name": { "type": "string" },
				"version": { "type": "string" }
			}
		},
		"sources": {
			"type": "array",
			"items": {
				"type": "object",
				"additionalProperties": false,
				"required": ["kind", "ref"],
				"properties": {
					"kind": { "type": "string" },
					"ref": { "type": "string" }
				}
			}
		},
		"scope": { "$ref": "#/$defs/scope" },
		"entities": {
			"type": "object",
			"additionalProperties": { "$ref": "#/$defs/entity" }
		},
		"relations": {
			"type": "array",
			"items": { "$ref": "#/$defs/relation" }
		},
		"groups": {
			"type": "array",
			"items": { "$ref": "#/$defs/group" }
		},
		"unresolved": {
			"type": "array",
			"items": {
				"type": "object",
				"additionalProperties": false,
				"required": ["entity", "column"],
				"properties": {
					"entity": { "type": "string" },
					"column": { "type": "string" },
					"note": { "type": "string" }
				}
			}
		}
	},
	$defs: {
		"scope": {
			"type": "object",
			"additionalProperties": false,
			"required": ["label", "column"],
			"properties": {
				"label": {
					"type": "string",
					"minLength": 1
				},
				"column": {
					"type": "string",
					"minLength": 1
				},
				"entity": { "type": "string" },
				"partitioned": { "type": "boolean" }
			}
		},
		"group": {
			"type": "object",
			"additionalProperties": false,
			"required": ["label", "entities"],
			"properties": {
				"label": {
					"type": "string",
					"minLength": 1
				},
				"entities": {
					"type": "array",
					"items": { "type": "string" }
				}
			}
		},
		"stringList": {
			"type": "array",
			"items": { "type": "string" }
		},
		"sortSpec": {
			"type": "object",
			"additionalProperties": false,
			"required": ["column", "direction"],
			"properties": {
				"column": { "type": "string" },
				"direction": { "enum": ["asc", "desc"] }
			}
		},
		"fieldLayout": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"pinned": { "$ref": "#/$defs/stringList" },
				"hidden": { "$ref": "#/$defs/stringList" }
			}
		},
		"computedField": {
			"type": "object",
			"additionalProperties": false,
			"required": [
				"name",
				"source",
				"path",
				"type"
			],
			"properties": {
				"name": {
					"type": "string",
					"minLength": 1
				},
				"source": { "type": "string" },
				"path": { "$ref": "#/$defs/stringList" },
				"type": { "enum": [
					"text",
					"number",
					"boolean"
				] }
			}
		},
		"column": {
			"type": "object",
			"additionalProperties": false,
			"required": ["type", "nullable"],
			"properties": {
				"type": {
					"type": "string",
					"minLength": 1
				},
				"nullable": { "type": "boolean" },
				"description": { "type": "string" },
				"allowedValues": { "$ref": "#/$defs/stringList" },
				"allowedValuesOpen": { "type": "boolean" },
				"sensitive": { "type": "boolean" }
			}
		},
		"entity": {
			"type": "object",
			"additionalProperties": false,
			"required": [
				"table",
				"label",
				"primaryKey",
				"columns"
			],
			"properties": {
				"table": {
					"type": "string",
					"minLength": 1
				},
				"dbSchema": { "type": "string" },
				"label": {
					"type": "string",
					"minLength": 1
				},
				"description": { "type": "string" },
				"kind": { "enum": [
					"entity",
					"reference",
					"event",
					"history",
					"junction",
					"other"
				] },
				"primaryKey": { "$ref": "#/$defs/stringList" },
				"scoped": { "type": "boolean" },
				"titleColumns": { "$ref": "#/$defs/stringList" },
				"defaultSort": { "$ref": "#/$defs/sortSpec" },
				"searchColumns": { "$ref": "#/$defs/stringList" },
				"lookupKeys": {
					"type": "array",
					"items": {
						"type": "object",
						"additionalProperties": false,
						"required": ["column", "kind"],
						"properties": {
							"column": { "type": "string" },
							"kind": { "type": "string" }
						}
					}
				},
				"timeline": { "anyOf": [{ "type": "null" }, {
					"type": "object",
					"additionalProperties": false,
					"required": ["timestampColumn", "summaryColumns"],
					"properties": {
						"timestampColumn": { "type": "string" },
						"summaryColumns": { "$ref": "#/$defs/stringList" }
					}
				}] },
				"columns": {
					"type": "object",
					"additionalProperties": { "$ref": "#/$defs/column" }
				},
				"computedFields": {
					"type": "array",
					"items": { "$ref": "#/$defs/computedField" }
				}
			}
		},
		"joinPair": {
			"type": "object",
			"additionalProperties": false,
			"required": ["from", "to"],
			"properties": {
				"from": {
					"type": "string",
					"minLength": 1
				},
				"to": {
					"type": "string",
					"minLength": 1
				},
				"match": { "const": "array" }
			}
		},
		"relation": {
			"type": "object",
			"additionalProperties": false,
			"required": [
				"id",
				"from",
				"to",
				"join",
				"cardinality",
				"name",
				"inverseName",
				"provenance",
				"confidence"
			],
			"properties": {
				"id": {
					"type": "string",
					"minLength": 1
				},
				"from": {
					"type": "string",
					"minLength": 1
				},
				"to": {
					"type": "string",
					"minLength": 1
				},
				"join": {
					"type": "array",
					"minItems": 1,
					"items": { "$ref": "#/$defs/joinPair" }
				},
				"condition": { "anyOf": [{ "type": "null" }, {
					"type": "object",
					"additionalProperties": false,
					"required": [
						"side",
						"column",
						"equals"
					],
					"properties": {
						"side": { "enum": ["from", "to"] },
						"column": {
							"type": "string",
							"minLength": 1
						},
						"equals": { "type": [
							"string",
							"number",
							"boolean"
						] }
					}
				}] },
				"cardinality": { "enum": [
					"many_to_one",
					"one_to_one",
					"one_to_many",
					"many_to_many"
				] },
				"name": {
					"type": "string",
					"minLength": 1
				},
				"inverseName": {
					"type": "string",
					"minLength": 1
				},
				"provenance": { "enum": [
					"foreign_key",
					"declared",
					"curated",
					"inferred",
					"verified"
				] },
				"confidence": { "enum": [
					"high",
					"medium",
					"low"
				] },
				"note": { "type": ["string", "null"] }
			}
		}
	}
};
var overlay_schema_default = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "overlay.schema.json",
	title: "Selectr overlay (format v1)",
	description: "User changes on top of a base schema: presentation, fact metadata, relation tweaks and virtual entities. Resolved against the base at load time.",
	type: "object",
	additionalProperties: false,
	required: [
		"format",
		"version",
		"base"
	],
	properties: {
		"$schema": { "type": "string" },
		"format": { "const": "selectr-overlay" },
		"version": { "const": 1 },
		"base": {
			"type": "string",
			"minLength": 1
		},
		"entities": {
			"type": "object",
			"additionalProperties": {
				"type": "object",
				"additionalProperties": false,
				"properties": {
					"label": {
						"type": "string",
						"minLength": 1
					},
					"color": { "type": "string" },
					"titleColumns": { "$ref": "base.schema.json#/$defs/stringList" },
					"defaultSort": { "$ref": "base.schema.json#/$defs/sortSpec" },
					"searchColumns": { "$ref": "base.schema.json#/$defs/stringList" },
					"fieldLayout": { "$ref": "base.schema.json#/$defs/fieldLayout" },
					"computedFields": {
						"type": "array",
						"items": { "$ref": "base.schema.json#/$defs/computedField" }
					},
					"columns": {
						"type": "object",
						"additionalProperties": {
							"type": "object",
							"additionalProperties": false,
							"properties": {
								"description": { "type": "string" },
								"allowedValues": { "$ref": "base.schema.json#/$defs/stringList" },
								"allowedValuesOpen": { "type": "boolean" },
								"sensitive": { "type": "boolean" }
							}
						}
					}
				}
			}
		},
		"relations": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"patch": {
					"type": "object",
					"additionalProperties": {
						"type": "object",
						"additionalProperties": false,
						"properties": {
							"name": {
								"type": "string",
								"minLength": 1
							},
							"inverseName": {
								"type": "string",
								"minLength": 1
							},
							"confidence": { "enum": [
								"high",
								"medium",
								"low"
							] },
							"provenance": { "enum": [
								"foreign_key",
								"declared",
								"curated",
								"inferred",
								"verified"
							] },
							"note": { "type": ["string", "null"] }
						}
					}
				},
				"hide": { "$ref": "base.schema.json#/$defs/stringList" },
				"add": {
					"type": "array",
					"items": { "$ref": "base.schema.json#/$defs/relation" }
				}
			}
		},
		"virtualEntities": {
			"type": "object",
			"additionalProperties": {
				"type": "object",
				"additionalProperties": false,
				"required": [
					"label",
					"base",
					"conditions"
				],
				"properties": {
					"label": {
						"type": "string",
						"minLength": 1
					},
					"color": { "type": "string" },
					"base": {
						"type": "string",
						"minLength": 1
					},
					"conditions": {
						"type": "array",
						"items": {
							"type": "object",
							"additionalProperties": false,
							"required": [
								"column",
								"operator",
								"value"
							],
							"properties": {
								"column": { "type": "string" },
								"operator": { "type": "string" },
								"value": { "oneOf": [{ "type": [
									"string",
									"number",
									"boolean",
									"null"
								] }, {
									"type": "array",
									"items": { "type": "string" }
								}] }
							}
						}
					},
					"borrow": {
						"type": "array",
						"items": {
							"type": "object",
							"additionalProperties": false,
							"required": [
								"via",
								"column",
								"as"
							],
							"properties": {
								"via": { "$ref": "base.schema.json#/$defs/stringList" },
								"column": { "type": "string" },
								"as": {
									"type": "string",
									"minLength": 1
								}
							}
						}
					},
					"fieldLayout": { "$ref": "base.schema.json#/$defs/fieldLayout" }
				}
			}
		},
		"groups": {
			"type": "array",
			"items": { "$ref": "base.schema.json#/$defs/group" }
		},
		"scope": {
			"type": "object",
			"additionalProperties": false,
			"properties": { "label": {
				"type": "string",
				"minLength": 1
			} }
		}
	}
};
// src/lib/model/validate.ts
var UNSUPPORTED_MESSAGE = "This schema uses an old format Selectr no longer reads. Generate a new one with the schema skill or Generate from database.";
/** The file is not a v2 base schema (v1, or a missing/other format or version). */
var UnsupportedSchemaError = class extends Error {
	constructor() {
		super(UNSUPPORTED_MESSAGE);
		this.name = "UnsupportedSchemaError";
	}
};
/** The file has the right format but breaks the JSON Schema or a semantic rule. */
var SchemaValidationError = class extends Error {
	problems;
	constructor(problems) {
		const errors = problems.filter((p) => p.level === "error");
		const shown = errors.slice(0, 3).map((p) => `${p.where}: ${p.message}`).join("; ");
		const more = errors.length > 3 ? ` (and ${errors.length - 3} more)` : "";
		super(`Schema is invalid: ${shown}${more}`);
		this.name = "SchemaValidationError";
		this.problems = problems;
	}
};
var compiled = null;
/** The overlay schema $refs the base schema's definitions, so both are registered on one instance. */
function validators() {
	if (!compiled) {
		const ajv = new import__2020.default({
			allErrors: true,
			allowUnionTypes: true
		});
		ajv.addSchema(base_schema_default);
		ajv.addSchema(overlay_schema_default);
		compiled = {
			base: ajv.getSchema("base.schema.json"),
			overlay: ajv.getSchema("overlay.schema.json")
		};
	}
	return compiled;
}
/** `/entities/orders/titleColumns/0` -> `entities.orders.titleColumns[0]`. */
function pointerToWhere(pointer) {
	if (!pointer) return "(root)";
	return pointer.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~")).reduce((acc, seg) => /^\d+$/.test(seg) ? `${acc}[${seg}]` : acc ? `${acc}.${seg}` : seg, "");
}
function describeAjvError(e) {
	const where = pointerToWhere(e.instancePath);
	switch (e.keyword) {
		case "additionalProperties": return {
			level: "error",
			where,
			message: `unknown property "${e.params.additionalProperty}"`
		};
		case "required": return {
			level: "error",
			where,
			message: `missing required property "${e.params.missingProperty}"`
		};
		case "enum": return {
			level: "error",
			where,
			message: `must be equal to one of the allowed values (${e.params.allowedValues.join(", ")})`
		};
		case "const": return {
			level: "error",
			where,
			message: `must be ${JSON.stringify(e.params.allowedValue)}`
		};
		default: return {
			level: "error",
			where,
			message: e.message ?? "is invalid"
		};
	}
}
function structuralProblems(validate, json) {
	if (validate(json)) return [];
	const seen = /* @__PURE__ */ new Set();
	const problems = [];
	for (const e of validate.errors ?? []) {
		if (e.keyword === "anyOf") continue;
		const p = describeAjvError(e);
		const key = `${p.where}\0${p.message}`;
		if (seen.has(key)) continue;
		seen.add(key);
		problems.push(p);
	}
	return problems;
}
/** The id scope of a base or a merged model, or undefined when it declares no scope. */
function idScope(schema) {
	if (!schema.scope) return void 0;
	const scopedEntities = new Set(Object.entries(schema.entities).filter(([, e]) => e.scoped === true).map(([key]) => key));
	return {
		column: schema.scope.column,
		scopedEntities
	};
}
/**
* Deterministic id for a relation's shape: `<from>.<cols>[<condition>]-><to>`.
* `cols` are the join pairs' `from` columns in order. The pair
* `scope.column -> scope.column` is left out when both entities are scoped:
* there it is tenancy plumbing, not part of what the relation means. Between
* entities that are not both scoped it is a real join column and stays.
*/
function relationId(rel, scope) {
	const plumbing = scope !== void 0 && scope.scopedEntities.has(rel.from) && scope.scopedEntities.has(rel.to);
	const cols = rel.join.filter((p) => !(plumbing && p.from === scope.column && p.to === scope.column)).map((p) => p.from);
	const colPart = cols.length === 1 ? cols[0] : `(${cols.join(",")})`;
	const cond = rel.condition ? `[${rel.condition.column}=${rel.condition.equals}]` : "";
	return `${rel.from}.${colPart}${cond}->${rel.to}`;
}
var isArrayType = (type) => type.endsWith("[]");
/** `obj[key]` only when `key` is an own property: user-supplied keys like `constructor` must not hit the prototype. */
function own(obj, key) {
	return hasOwn(obj, key) ? obj[key] : void 0;
}
/**
* Check a relation's endpoints, join columns and condition against a set of
* entities. Shared by base validation and the overlay's `relations.add`.
*/
function relationRefProblems(r, entities, at) {
	const problems = [];
	const err = (where, message) => problems.push({
		level: "error",
		where,
		message
	});
	const from = own(entities, r.from);
	const to = own(entities, r.to);
	if (!from) err(`${at}.from`, `unknown entity "${r.from}"`);
	if (!to) err(`${at}.to`, `unknown entity "${r.to}"`);
	r.join.forEach((p, j) => {
		const fromCol = from ? own(from.columns, p.from) : void 0;
		if (from && !fromCol) err(`${at}.join[${j}].from`, `unknown column "${p.from}" on ${r.from}`);
		if (to && !own(to.columns, p.to)) err(`${at}.join[${j}].to`, `unknown column "${p.to}" on ${r.to}`);
		if (p.match === "array" && fromCol && !isArrayType(fromCol.type)) err(`${at}.join[${j}].match`, `match "array" needs an array column, but ${r.from}.${p.from} has type ${fromCol.type}`);
	});
	if (r.condition) {
		const side = r.condition.side === "from" ? from : to;
		const sideKey = r.condition.side === "from" ? r.from : r.to;
		if (side && !own(side.columns, r.condition.column)) err(`${at}.condition.column`, `unknown column "${r.condition.column}" on ${sideKey}`);
	}
	return problems;
}
function semanticProblems(base) {
	const problems = [];
	const err = (where, message) => problems.push({
		level: "error",
		where,
		message
	});
	const warn = (where, message) => problems.push({
		level: "warning",
		where,
		message
	});
	const scope = base.scope;
	if (scope?.entity && !own(base.entities, scope.entity)) err("scope.entity", `unknown scope entity "${scope.entity}"`);
	for (const [key, ent] of Object.entries(base.entities)) {
		const at = `entities.${key}`;
		const colExists = (c) => own(ent.columns, c) !== void 0;
		const checkCols = (where, cols) => {
			(cols ?? []).forEach((c, i) => {
				if (!colExists(c)) err(`${where}[${i}]`, `unknown column "${c}" on ${key}`);
			});
		};
		if (ent.dbSchema !== void 0 && ent.dbSchema !== "public") err(`${at}.dbSchema`, "only the public database schema is supported for now");
		checkCols(`${at}.primaryKey`, ent.primaryKey);
		checkCols(`${at}.titleColumns`, ent.titleColumns);
		checkCols(`${at}.searchColumns`, ent.searchColumns);
		if (ent.defaultSort && !colExists(ent.defaultSort.column)) err(`${at}.defaultSort.column`, `unknown column "${ent.defaultSort.column}" on ${key}`);
		if (ent.timeline) {
			if (!colExists(ent.timeline.timestampColumn)) err(`${at}.timeline.timestampColumn`, `unknown column "${ent.timeline.timestampColumn}" on ${key}`);
			checkCols(`${at}.timeline.summaryColumns`, ent.timeline.summaryColumns);
		}
		(ent.lookupKeys ?? []).forEach((k, i) => {
			if (!colExists(k.column)) err(`${at}.lookupKeys[${i}].column`, `unknown column "${k.column}" on ${key}`);
		});
		(ent.computedFields ?? []).forEach((f, i) => {
			if (!colExists(f.source)) err(`${at}.computedFields[${i}].source`, `unknown column "${f.source}" on ${key}`);
		});
		if (ent.scoped) {
			if (!scope) err(`${at}.scoped`, `${key} is scoped but the schema declares no scope`);
			else if (!colExists(scope.column)) err(`${at}.scoped`, `unknown column "${scope.column}" on ${key}: a scoped entity must carry the scope column`);
		}
	}
	const seenIds = /* @__PURE__ */ new Set();
	const ids = idScope(base);
	base.relations.forEach((r, i) => {
		const at = `relations[${i}]`;
		const expected = relationId(r, ids);
		if (r.id !== expected) err(`${at}.id`, `id should be "${expected}"`);
		if (seenIds.has(r.id)) err(`${at}.id`, `duplicate relation id "${r.id}"`);
		seenIds.add(r.id);
		problems.push(...relationRefProblems(r, base.entities, at));
	});
	(base.groups ?? []).forEach((g, i) => {
		g.entities.forEach((e, j) => {
			if (!own(base.entities, e)) err(`groups[${i}].entities[${j}]`, `unknown entity "${e}"`);
		});
	});
	(base.unresolved ?? []).forEach((u, i) => {
		const ent = own(base.entities, u.entity);
		if (!ent) warn(`unresolved[${i}].entity`, `unknown entity "${u.entity}"`);
		else if (!own(ent.columns, u.column)) warn(`unresolved[${i}].column`, `unknown column "${u.column}" on ${u.entity}`);
	});
	return problems;
}
/**
* Validate a parsed base schema file. Throws UnsupportedSchemaError for anything
* that is not format v2, SchemaValidationError when there are errors; otherwise
* returns the schema plus any warnings.
*/
function validateBase(json) {
	const obj = json;
	if (typeof obj !== "object" || obj === null || obj.format !== "selectr-schema" || obj.version !== 2) throw new UnsupportedSchemaError();
	const structural = structuralProblems(validators().base, json);
	if (structural.length > 0) throw new SchemaValidationError(structural);
	const base = json;
	const problems = semanticProblems(base);
	if (problems.some((p) => p.level === "error")) throw new SchemaValidationError(problems);
	return {
		base,
		problems
	};
}
/**
* Validate a parsed overlay file structurally. References into the base are
* resolved at merge time, where unresolved ones become broken entries.
*/
function validateOverlay(json) {
	const problems = structuralProblems(validators().overlay, json);
	if (problems.length > 0) throw new SchemaValidationError(problems);
	return {
		overlay: json,
		problems: []
	};
}
// src/lib/model/generate.ts
var TITLE_CANDIDATES = [
	"name",
	"title",
	"email",
	"code",
	"status"
];
var SEARCH_CANDIDATES = [
	"name",
	"title",
	"email",
	"code"
];
var TEXT_TYPES = /* @__PURE__ */ new Set([
	"text",
	"varchar",
	"bpchar",
	"citext"
]);
var MAX_TITLE_COLUMNS = 3;
function humanize(snakeCase) {
	const spaced = snakeCase.replace(/_/g, " ").trim();
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
var UNCOUNTED_WORDS = /* @__PURE__ */ new Set([
	"series",
	"news",
	"data"
]);
/**
* A humanized table name with its last word made singular: `ies` -> `y`,
* `sses` -> `ss`, `xes`/`ches`/`shes` lose `es`, else a final `s` goes. Words
* ending in `ics`, `ss`, `us` or `is`, and `series`, `news` and `data`, stay.
* A mechanical guess; people rewrite labels anyway.
*/
function singularLabel(label) {
	const word = label.slice(label.lastIndexOf(" ") + 1);
	const lower = word.toLowerCase();
	const cut = (n, add = "") => label.slice(0, -n) + add;
	if (UNCOUNTED_WORDS.has(lower) || /(ics|ss|us|is)$/.test(lower)) return label;
	if (lower.endsWith("ies") && word.length > 3) return cut(3, "y");
	if (lower.endsWith("sses")) return cut(2);
	if (/(x|ch|sh)es$/.test(lower)) return cut(2);
	if (lower.endsWith("s") && word.length > 1) return cut(1);
	return label;
}
/** `_uuid` (Postgres array udt name) -> `uuid[]`. */
function columnType(udtName) {
	return udtName.startsWith("_") ? `${udtName.slice(1)}[]` : udtName;
}
function buildEntity(table, columns, primaryKey) {
	const defs = {};
	for (const c of columns) defs[c.column_name] = {
		type: columnType(c.udt_name),
		nullable: true
	};
	const entity = {
		table,
		label: singularLabel(humanize(table)),
		primaryKey,
		columns: defs
	};
	const titleColumns = TITLE_CANDIDATES.filter((c) => c in defs).slice(0, MAX_TITLE_COLUMNS);
	if (titleColumns.length > 0) entity.titleColumns = titleColumns;
	if ("created_at" in defs) entity.defaultSort = {
		column: "created_at",
		direction: "desc"
	};
	const searchColumns = SEARCH_CANDIDATES.filter((c) => c in defs && TEXT_TYPES.has(defs[c].type));
	if (searchColumns.length > 0) entity.searchColumns = searchColumns;
	return entity;
}
/** Candidate target tables for a `<x>_id` column, most likely first. */
function targetCandidates(x) {
	const candidates = [`${x}s`, `${x}es`];
	if (x.endsWith("y")) candidates.push(`${x.slice(0, -1)}ies`);
	candidates.push(x);
	return candidates;
}
/**
* The target primary-key column a `<x>_id` source column points at: `id` when it
* is part of the target key, else a key column named like the source column, else
* the only key column the source does not also have. Null when that is ambiguous.
*/
function targetKeyColumn(target, source, column) {
	const pk = target.primaryKey;
	if (pk.includes("id")) return "id";
	if (pk.includes(column)) return column;
	if (pk.length === 1) return pk[0];
	const unshared = pk.filter((c) => !(c in source.columns));
	return unshared.length === 1 ? unshared[0] : null;
}
function generateBase(input, now = /* @__PURE__ */ new Date()) {
	const columnsByTable = /* @__PURE__ */ new Map();
	for (const c of input.columns) {
		const list = columnsByTable.get(c.table_name) ?? [];
		list.push(c);
		columnsByTable.set(c.table_name, list);
	}
	const entities = {};
	for (const t of input.tables) entities[t.table_name] = buildEntity(t.table_name, columnsByTable.get(t.table_name) ?? [], input.primaryKeys[t.table_name] ?? []);
	const relations = [];
	const seenIds = /* @__PURE__ */ new Set();
	/** Relation id -> the source column the relation is named after (for inverseName disambiguation). */
	const keyColumns = /* @__PURE__ */ new Map();
	const add = (r, keyColumn) => {
		const rel = {
			...r,
			id: relationId(r),
			cardinality: "many_to_one"
		};
		if (seenIds.has(rel.id)) return;
		seenIds.add(rel.id);
		keyColumns.set(rel.id, keyColumn);
		relations.push(rel);
	};
	const fkGroups = /* @__PURE__ */ new Map();
	for (const k of input.foreignKeys) {
		const key = `${k.source_table}\0${k.constraint_name}`;
		const list = fkGroups.get(key) ?? [];
		list.push(k);
		fkGroups.set(key, list);
	}
	const fkCovered = /* @__PURE__ */ new Set();
	for (const group of fkGroups.values()) {
		const { source_table: from, target_table: to } = group[0];
		const source = entities[from];
		const target = entities[to];
		if (!source || !target) continue;
		if (!group.every((k) => k.source_column in source.columns && k.target_column in target.columns)) continue;
		const join = [];
		for (const k of group) if (!join.some((p) => p.from === k.source_column && p.to === k.target_column)) join.push({
			from: k.source_column,
			to: k.target_column
		});
		for (const p of join) fkCovered.add(`${from}\0${p.from}`);
		const idPair = join.find((p) => p.from !== p.to && p.from.endsWith("_id") && p.from.length > 3);
		const named = idPair ? idPair.from.slice(0, -3) : null;
		const keyColumn = (join.find((p) => p.from !== p.to) ?? join[0]).from;
		add({
			from,
			to,
			join,
			name: humanize(named ?? to),
			inverseName: humanize(from),
			provenance: "foreign_key",
			confidence: "high"
		}, keyColumn);
	}
	for (const t of input.tables) {
		const source = entities[t.table_name];
		const ownPk = source.primaryKey.length === 1 ? source.primaryKey[0] : null;
		for (const column of Object.keys(source.columns)) {
			if (!column.endsWith("_id") || column.length <= 3) continue;
			if (column === ownPk || fkCovered.has(`${t.table_name}\0${column}`)) continue;
			const x = column.slice(0, -3);
			const targetKey = targetCandidates(x).find((c) => entities[c] && entities[c].primaryKey.length > 0);
			if (!targetKey) continue;
			const target = entities[targetKey];
			const keyColumn = targetKeyColumn(target, source, column);
			if (!keyColumn || !(keyColumn in target.columns)) continue;
			if (!compatibleTypes(source.columns[column].type, target.columns[keyColumn].type)) continue;
			const join = [{
				from: column,
				to: keyColumn
			}];
			for (const pk of target.primaryKey) if (pk !== keyColumn && pk in source.columns && pk in target.columns) join.push({
				from: pk,
				to: pk
			});
			if (targetKey === t.table_name && join.every((p) => p.from === p.to)) continue;
			add({
				from: t.table_name,
				to: targetKey,
				join,
				name: humanize(x),
				inverseName: humanize(t.table_name),
				provenance: "inferred",
				confidence: "medium"
			}, column);
		}
	}
	const pairCounts = /* @__PURE__ */ new Map();
	for (const r of relations) pairCounts.set(`${r.from}\0${r.to}`, (pairCounts.get(`${r.from}\0${r.to}`) ?? 0) + 1);
	for (const r of relations) if ((pairCounts.get(`${r.from}\0${r.to}`) ?? 0) > 1) r.inverseName = `${r.inverseName} (${keyColumns.get(r.id)})`;
	return {
		format: "selectr-schema",
		version: 2,
		name: input.name,
		generatedAt: now.toISOString(),
		generator: {
			name: "selectr-quick-generate",
			version: "1"
		},
		entities,
		relations,
		groups: [{
			label: "All tables",
			entities: Object.keys(entities)
		}]
	};
}
// node_modules/postgres-array/index.js
var require_postgres_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.parse = function(source, transform) {
		return new ArrayParser(source, transform).parse();
	};
	var ArrayParser = class ArrayParser {
		constructor(source, transform) {
			this.source = source;
			this.transform = transform || identity;
			this.position = 0;
			this.entries = [];
			this.recorded = [];
			this.dimension = 0;
		}
		isEof() {
			return this.position >= this.source.length;
		}
		nextCharacter() {
			var character = this.source[this.position++];
			if (character === "\\") return {
				value: this.source[this.position++],
				escaped: true
			};
			return {
				value: character,
				escaped: false
			};
		}
		record(character) {
			this.recorded.push(character);
		}
		newEntry(includeEmpty) {
			var entry;
			if (this.recorded.length > 0 || includeEmpty) {
				entry = this.recorded.join("");
				if (entry === "NULL" && !includeEmpty) entry = null;
				if (entry !== null) entry = this.transform(entry);
				this.entries.push(entry);
				this.recorded = [];
			}
		}
		consumeDimensions() {
			if (this.source[0] === "[") {
				while (!this.isEof()) if (this.nextCharacter().value === "=") break;
			}
		}
		parse(nested) {
			var character, parser, quote;
			this.consumeDimensions();
			while (!this.isEof()) {
				character = this.nextCharacter();
				if (character.value === "{" && !quote) {
					this.dimension++;
					if (this.dimension > 1) {
						parser = new ArrayParser(this.source.substr(this.position - 1), this.transform);
						this.entries.push(parser.parse(true));
						this.position += parser.position - 2;
					}
				} else if (character.value === "}" && !quote) {
					this.dimension--;
					if (!this.dimension) {
						this.newEntry();
						if (nested) return this.entries;
					}
				} else if (character.value === "\"" && !character.escaped) {
					if (quote) this.newEntry(true);
					quote = !quote;
				} else if (character.value === "," && !quote) this.newEntry();
				else this.record(character.value);
			}
			if (this.dimension !== 0) throw new Error("array dimension not balanced");
			return this.entries;
		}
	};
	function identity(value) {
		return value;
	}
}));
// node_modules/pg-types/lib/arrayParser.js
var require_arrayParser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var array = require_postgres_array();
	module.exports = { create: function(source, transform) {
		return { parse: function() {
			return array.parse(source, transform);
		} };
	} };
}));
// node_modules/postgres-date/index.js
var require_postgres_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
	var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
	var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
	var INFINITY = /^-?infinity$/;
	module.exports = function parseDate(isoDate) {
		if (INFINITY.test(isoDate)) return Number(isoDate.replace("i", "I"));
		var matches = DATE_TIME.exec(isoDate);
		if (!matches) return getDate(isoDate) || null;
		var isBC = !!matches[8];
		var year = parseInt(matches[1], 10);
		if (isBC) year = bcYearToNegativeYear(year);
		var month = parseInt(matches[2], 10) - 1;
		var day = matches[3];
		var hour = parseInt(matches[4], 10);
		var minute = parseInt(matches[5], 10);
		var second = parseInt(matches[6], 10);
		var ms = matches[7];
		ms = ms ? 1e3 * parseFloat(ms) : 0;
		var date;
		var offset = timeZoneOffset(isoDate);
		if (offset != null) {
			date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
			if (is0To99(year)) date.setUTCFullYear(year);
			if (offset !== 0) date.setTime(date.getTime() - offset);
		} else {
			date = new Date(year, month, day, hour, minute, second, ms);
			if (is0To99(year)) date.setFullYear(year);
		}
		return date;
	};
	function getDate(isoDate) {
		var matches = DATE.exec(isoDate);
		if (!matches) return;
		var year = parseInt(matches[1], 10);
		if (!!matches[4]) year = bcYearToNegativeYear(year);
		var month = parseInt(matches[2], 10) - 1;
		var day = matches[3];
		var date = new Date(year, month, day);
		if (is0To99(year)) date.setFullYear(year);
		return date;
	}
	function timeZoneOffset(isoDate) {
		if (isoDate.endsWith("+00")) return 0;
		var zone = TIME_ZONE.exec(isoDate.split(" ")[1]);
		if (!zone) return;
		var type = zone[1];
		if (type === "Z") return 0;
		var sign = type === "-" ? -1 : 1;
		return (parseInt(zone[2], 10) * 3600 + parseInt(zone[3] || 0, 10) * 60 + parseInt(zone[4] || 0, 10)) * sign * 1e3;
	}
	function bcYearToNegativeYear(year) {
		return -(year - 1);
	}
	function is0To99(num) {
		return num >= 0 && num < 100;
	}
}));
// node_modules/xtend/mutable.js
var require_mutable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = extend;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function extend(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	}
}));
// node_modules/postgres-interval/index.js
var require_postgres_interval = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var extend = require_mutable();
	module.exports = PostgresInterval;
	function PostgresInterval(raw) {
		if (!(this instanceof PostgresInterval)) return new PostgresInterval(raw);
		extend(this, parse(raw));
	}
	var properties = [
		"seconds",
		"minutes",
		"hours",
		"days",
		"months",
		"years"
	];
	PostgresInterval.prototype.toPostgres = function() {
		var filtered = properties.filter(this.hasOwnProperty, this);
		if (this.milliseconds && filtered.indexOf("seconds") < 0) filtered.push("seconds");
		if (filtered.length === 0) return "0";
		return filtered.map(function(property) {
			var value = this[property] || 0;
			if (property === "seconds" && this.milliseconds) value = (value + this.milliseconds / 1e3).toFixed(6).replace(/\.?0+$/, "");
			return value + " " + property;
		}, this).join(" ");
	};
	var propertiesISOEquivalent = {
		years: "Y",
		months: "M",
		days: "D",
		hours: "H",
		minutes: "M",
		seconds: "S"
	};
	var dateProperties = [
		"years",
		"months",
		"days"
	];
	var timeProperties = [
		"hours",
		"minutes",
		"seconds"
	];
	PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function() {
		var datePart = dateProperties.map(buildProperty, this).join("");
		var timePart = timeProperties.map(buildProperty, this).join("");
		return "P" + datePart + "T" + timePart;
		function buildProperty(property) {
			var value = this[property] || 0;
			if (property === "seconds" && this.milliseconds) value = (value + this.milliseconds / 1e3).toFixed(6).replace(/0+$/, "");
			return value + propertiesISOEquivalent[property];
		}
	};
	var NUMBER = "([+-]?\\d+)";
	var YEAR = NUMBER + "\\s+years?";
	var MONTH = NUMBER + "\\s+mons?";
	var DAY = NUMBER + "\\s+days?";
	var INTERVAL = new RegExp([
		YEAR,
		MONTH,
		DAY,
		"([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?"
	].map(function(regexString) {
		return "(" + regexString + ")?";
	}).join("\\s*"));
	var positions = {
		years: 2,
		months: 4,
		days: 6,
		hours: 9,
		minutes: 10,
		seconds: 11,
		milliseconds: 12
	};
	var negatives = [
		"hours",
		"minutes",
		"seconds",
		"milliseconds"
	];
	function parseMilliseconds(fraction) {
		var microseconds = fraction + "000000".slice(fraction.length);
		return parseInt(microseconds, 10) / 1e3;
	}
	function parse(interval) {
		if (!interval) return {};
		var matches = INTERVAL.exec(interval);
		var isNegative = matches[8] === "-";
		return Object.keys(positions).reduce(function(parsed, property) {
			var value = matches[positions[property]];
			if (!value) return parsed;
			value = property === "milliseconds" ? parseMilliseconds(value) : parseInt(value, 10);
			if (!value) return parsed;
			if (isNegative && ~negatives.indexOf(property)) value *= -1;
			parsed[property] = value;
			return parsed;
		}, {});
	}
}));
// node_modules/postgres-bytea/index.js
var require_postgres_bytea = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bufferFrom = Buffer.from || Buffer;
	module.exports = function parseBytea(input) {
		if (/^\\x/.test(input)) return bufferFrom(input.substr(2), "hex");
		var output = "";
		var i = 0;
		while (i < input.length) if (input[i] !== "\\") {
			output += input[i];
			++i;
		} else if (/[0-7]{3}/.test(input.substr(i + 1, 3))) {
			output += String.fromCharCode(parseInt(input.substr(i + 1, 3), 8));
			i += 4;
		} else {
			var backslashes = 1;
			while (i + backslashes < input.length && input[i + backslashes] === "\\") backslashes++;
			for (var k = 0; k < Math.floor(backslashes / 2); ++k) output += "\\";
			i += Math.floor(backslashes / 2) * 2;
		}
		return bufferFrom(output, "binary");
	};
}));
// node_modules/pg-types/lib/textParsers.js
var require_textParsers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var array = require_postgres_array();
	var arrayParser = require_arrayParser();
	var parseDate = require_postgres_date();
	var parseInterval = require_postgres_interval();
	var parseByteA = require_postgres_bytea();
	function allowNull(fn) {
		return function nullAllowed(value) {
			if (value === null) return value;
			return fn(value);
		};
	}
	function parseBool(value) {
		if (value === null) return value;
		return value === "TRUE" || value === "t" || value === "true" || value === "y" || value === "yes" || value === "on" || value === "1";
	}
	function parseBoolArray(value) {
		if (!value) return null;
		return array.parse(value, parseBool);
	}
	function parseBaseTenInt(string) {
		return parseInt(string, 10);
	}
	function parseIntegerArray(value) {
		if (!value) return null;
		return array.parse(value, allowNull(parseBaseTenInt));
	}
	function parseBigIntegerArray(value) {
		if (!value) return null;
		return array.parse(value, allowNull(function(entry) {
			return parseBigInteger(entry).trim();
		}));
	}
	var parsePointArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parsePoint(entry);
			return entry;
		}).parse();
	};
	var parseFloatArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parseFloat(entry);
			return entry;
		}).parse();
	};
	var parseStringArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value).parse();
	};
	var parseDateArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parseDate(entry);
			return entry;
		}).parse();
	};
	var parseIntervalArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parseInterval(entry);
			return entry;
		}).parse();
	};
	var parseByteAArray = function(value) {
		if (!value) return null;
		return array.parse(value, allowNull(parseByteA));
	};
	var parseInteger = function(value) {
		return parseInt(value, 10);
	};
	var parseBigInteger = function(value) {
		var valStr = String(value);
		if (/^\d+$/.test(valStr)) return valStr;
		return value;
	};
	var parseJsonArray = function(value) {
		if (!value) return null;
		return array.parse(value, allowNull(JSON.parse));
	};
	var parsePoint = function(value) {
		if (value[0] !== "(") return null;
		value = value.substring(1, value.length - 1).split(",");
		return {
			x: parseFloat(value[0]),
			y: parseFloat(value[1])
		};
	};
	var parseCircle = function(value) {
		if (value[0] !== "<" && value[1] !== "(") return null;
		var point = "(";
		var radius = "";
		var pointParsed = false;
		for (var i = 2; i < value.length - 1; i++) {
			if (!pointParsed) point += value[i];
			if (value[i] === ")") {
				pointParsed = true;
				continue;
			} else if (!pointParsed) continue;
			if (value[i] === ",") continue;
			radius += value[i];
		}
		var result = parsePoint(point);
		result.radius = parseFloat(radius);
		return result;
	};
	var init = function(register) {
		register(20, parseBigInteger);
		register(21, parseInteger);
		register(23, parseInteger);
		register(26, parseInteger);
		register(700, parseFloat);
		register(701, parseFloat);
		register(16, parseBool);
		register(1082, parseDate);
		register(1114, parseDate);
		register(1184, parseDate);
		register(600, parsePoint);
		register(651, parseStringArray);
		register(718, parseCircle);
		register(1e3, parseBoolArray);
		register(1001, parseByteAArray);
		register(1005, parseIntegerArray);
		register(1007, parseIntegerArray);
		register(1028, parseIntegerArray);
		register(1016, parseBigIntegerArray);
		register(1017, parsePointArray);
		register(1021, parseFloatArray);
		register(1022, parseFloatArray);
		register(1231, parseFloatArray);
		register(1014, parseStringArray);
		register(1015, parseStringArray);
		register(1008, parseStringArray);
		register(1009, parseStringArray);
		register(1040, parseStringArray);
		register(1041, parseStringArray);
		register(1115, parseDateArray);
		register(1182, parseDateArray);
		register(1185, parseDateArray);
		register(1186, parseInterval);
		register(1187, parseIntervalArray);
		register(17, parseByteA);
		register(114, JSON.parse.bind(JSON));
		register(3802, JSON.parse.bind(JSON));
		register(199, parseJsonArray);
		register(3807, parseJsonArray);
		register(3907, parseStringArray);
		register(2951, parseStringArray);
		register(791, parseStringArray);
		register(1183, parseStringArray);
		register(1270, parseStringArray);
	};
	module.exports = { init };
}));
// node_modules/pg-int8/index.js
var require_pg_int8 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BASE = 1e6;
	function readInt8(buffer) {
		var high = buffer.readInt32BE(0);
		var low = buffer.readUInt32BE(4);
		var sign = "";
		if (high < 0) {
			high = ~high + (low === 0);
			low = ~low + 1 >>> 0;
			sign = "-";
		}
		var result = "";
		var carry;
		var t;
		var digits;
		var pad;
		var l;
		var i;
		carry = high % BASE;
		high = high / BASE >>> 0;
		t = 4294967296 * carry + low;
		low = t / BASE >>> 0;
		digits = "" + (t - BASE * low);
		if (low === 0 && high === 0) return sign + digits + result;
		pad = "";
		l = 6 - digits.length;
		for (i = 0; i < l; i++) pad += "0";
		result = pad + digits + result;
		carry = high % BASE;
		high = high / BASE >>> 0;
		t = 4294967296 * carry + low;
		low = t / BASE >>> 0;
		digits = "" + (t - BASE * low);
		if (low === 0 && high === 0) return sign + digits + result;
		pad = "";
		l = 6 - digits.length;
		for (i = 0; i < l; i++) pad += "0";
		result = pad + digits + result;
		carry = high % BASE;
		high = high / BASE >>> 0;
		t = 4294967296 * carry + low;
		low = t / BASE >>> 0;
		digits = "" + (t - BASE * low);
		if (low === 0 && high === 0) return sign + digits + result;
		pad = "";
		l = 6 - digits.length;
		for (i = 0; i < l; i++) pad += "0";
		result = pad + digits + result;
		carry = high % BASE;
		t = 4294967296 * carry + low;
		digits = "" + t % BASE;
		return sign + digits + result;
	}
	module.exports = readInt8;
}));
// node_modules/pg-types/lib/binaryParsers.js
var require_binaryParsers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parseInt64 = require_pg_int8();
	var parseBits = function(data, bits, offset, invert, callback) {
		offset = offset || 0;
		invert = invert || false;
		callback = callback || function(lastValue, newValue, bits) {
			return lastValue * Math.pow(2, bits) + newValue;
		};
		var offsetBytes = offset >> 3;
		var inv = function(value) {
			if (invert) return ~value & 255;
			return value;
		};
		var mask = 255;
		var firstBits = 8 - offset % 8;
		if (bits < firstBits) {
			mask = 255 << 8 - bits & 255;
			firstBits = bits;
		}
		if (offset) mask = mask >> offset % 8;
		var result = 0;
		if (offset % 8 + bits >= 8) result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
		var bytes = bits + offset >> 3;
		for (var i = offsetBytes + 1; i < bytes; i++) result = callback(result, inv(data[i]), 8);
		var lastBits = (bits + offset) % 8;
		if (lastBits > 0) result = callback(result, inv(data[bytes]) >> 8 - lastBits, lastBits);
		return result;
	};
	var parseFloatFromBits = function(data, precisionBits, exponentBits) {
		var bias = Math.pow(2, exponentBits - 1) - 1;
		var sign = parseBits(data, 1);
		var exponent = parseBits(data, exponentBits, 1);
		if (exponent === 0) return 0;
		var precisionBitsCounter = 1;
		var parsePrecisionBits = function(lastValue, newValue, bits) {
			if (lastValue === 0) lastValue = 1;
			for (var i = 1; i <= bits; i++) {
				precisionBitsCounter /= 2;
				if ((newValue & 1 << bits - i) > 0) lastValue += precisionBitsCounter;
			}
			return lastValue;
		};
		var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);
		if (exponent == Math.pow(2, exponentBits + 1) - 1) {
			if (mantissa === 0) return sign === 0 ? Infinity : -Infinity;
			return NaN;
		}
		return (sign === 0 ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
	};
	var parseInt16 = function(value) {
		if (parseBits(value, 1) == 1) return -1 * (parseBits(value, 15, 1, true) + 1);
		return parseBits(value, 15, 1);
	};
	var parseInt32 = function(value) {
		if (parseBits(value, 1) == 1) return -1 * (parseBits(value, 31, 1, true) + 1);
		return parseBits(value, 31, 1);
	};
	var parseFloat32 = function(value) {
		return parseFloatFromBits(value, 23, 8);
	};
	var parseFloat64 = function(value) {
		return parseFloatFromBits(value, 52, 11);
	};
	var parseNumeric = function(value) {
		var sign = parseBits(value, 16, 32);
		if (sign == 49152) return NaN;
		var weight = Math.pow(1e4, parseBits(value, 16, 16));
		var result = 0;
		var ndigits = parseBits(value, 16);
		for (var i = 0; i < ndigits; i++) {
			result += parseBits(value, 16, 64 + 16 * i) * weight;
			weight /= 1e4;
		}
		var scale = Math.pow(10, parseBits(value, 16, 48));
		return (sign === 0 ? 1 : -1) * Math.round(result * scale) / scale;
	};
	var parseDate = function(isUTC, value) {
		var sign = parseBits(value, 1);
		var rawValue = parseBits(value, 63, 1);
		var result = /* @__PURE__ */ new Date((sign === 0 ? 1 : -1) * rawValue / 1e3 + 9466848e5);
		if (!isUTC) result.setTime(result.getTime() + result.getTimezoneOffset() * 6e4);
		result.usec = rawValue % 1e3;
		result.getMicroSeconds = function() {
			return this.usec;
		};
		result.setMicroSeconds = function(value) {
			this.usec = value;
		};
		result.getUTCMicroSeconds = function() {
			return this.usec;
		};
		return result;
	};
	var parseArray = function(value) {
		var dim = parseBits(value, 32);
		parseBits(value, 32, 32);
		var elementType = parseBits(value, 32, 64);
		var offset = 96;
		var dims = [];
		for (var i = 0; i < dim; i++) {
			dims[i] = parseBits(value, 32, offset);
			offset += 32;
			offset += 32;
		}
		var parseElement = function(elementType) {
			var length = parseBits(value, 32, offset);
			offset += 32;
			if (length == 4294967295) return null;
			var result;
			if (elementType == 23 || elementType == 20) {
				result = parseBits(value, length * 8, offset);
				offset += length * 8;
				return result;
			} else if (elementType == 25) {
				result = value.toString(this.encoding, offset >> 3, (offset += length << 3) >> 3);
				return result;
			} else console.log("ERROR: ElementType not implemented: " + elementType);
		};
		var parse = function(dimension, elementType) {
			var array = [];
			var i;
			if (dimension.length > 1) {
				var count = dimension.shift();
				for (i = 0; i < count; i++) array[i] = parse(dimension, elementType);
				dimension.unshift(count);
			} else for (i = 0; i < dimension[0]; i++) array[i] = parseElement(elementType);
			return array;
		};
		return parse(dims, elementType);
	};
	var parseText = function(value) {
		return value.toString("utf8");
	};
	var parseBool = function(value) {
		if (value === null) return null;
		return parseBits(value, 8) > 0;
	};
	var init = function(register) {
		register(20, parseInt64);
		register(21, parseInt16);
		register(23, parseInt32);
		register(26, parseInt32);
		register(1700, parseNumeric);
		register(700, parseFloat32);
		register(701, parseFloat64);
		register(16, parseBool);
		register(1114, parseDate.bind(null, false));
		register(1184, parseDate.bind(null, true));
		register(1e3, parseArray);
		register(1007, parseArray);
		register(1016, parseArray);
		register(1008, parseArray);
		register(1009, parseArray);
		register(25, parseText);
	};
	module.exports = { init };
}));
// node_modules/pg-types/lib/builtins.js
var require_builtins = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Following query was used to generate this file:
	
	SELECT json_object_agg(UPPER(PT.typname), PT.oid::int4 ORDER BY pt.oid)
	FROM pg_type PT
	WHERE typnamespace = (SELECT pgn.oid FROM pg_namespace pgn WHERE nspname = 'pg_catalog') -- Take only builting Postgres types with stable OID (extension types are not guaranted to be stable)
	AND typtype = 'b' -- Only basic types
	AND typelem = 0 -- Ignore aliases
	AND typisdefined -- Ignore undefined types
	*/
	module.exports = {
		BOOL: 16,
		BYTEA: 17,
		CHAR: 18,
		INT8: 20,
		INT2: 21,
		INT4: 23,
		REGPROC: 24,
		TEXT: 25,
		OID: 26,
		TID: 27,
		XID: 28,
		CID: 29,
		JSON: 114,
		XML: 142,
		PG_NODE_TREE: 194,
		SMGR: 210,
		PATH: 602,
		POLYGON: 604,
		CIDR: 650,
		FLOAT4: 700,
		FLOAT8: 701,
		ABSTIME: 702,
		RELTIME: 703,
		TINTERVAL: 704,
		CIRCLE: 718,
		MACADDR8: 774,
		MONEY: 790,
		MACADDR: 829,
		INET: 869,
		ACLITEM: 1033,
		BPCHAR: 1042,
		VARCHAR: 1043,
		DATE: 1082,
		TIME: 1083,
		TIMESTAMP: 1114,
		TIMESTAMPTZ: 1184,
		INTERVAL: 1186,
		TIMETZ: 1266,
		BIT: 1560,
		VARBIT: 1562,
		NUMERIC: 1700,
		REFCURSOR: 1790,
		REGPROCEDURE: 2202,
		REGOPER: 2203,
		REGOPERATOR: 2204,
		REGCLASS: 2205,
		REGTYPE: 2206,
		UUID: 2950,
		TXID_SNAPSHOT: 2970,
		PG_LSN: 3220,
		PG_NDISTINCT: 3361,
		PG_DEPENDENCIES: 3402,
		TSVECTOR: 3614,
		TSQUERY: 3615,
		GTSVECTOR: 3642,
		REGCONFIG: 3734,
		REGDICTIONARY: 3769,
		JSONB: 3802,
		REGNAMESPACE: 4089,
		REGROLE: 4096
	};
}));
// node_modules/pg-types/index.js
var require_pg_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	var textParsers = require_textParsers();
	var binaryParsers = require_binaryParsers();
	var arrayParser = require_arrayParser();
	var builtinTypes = require_builtins();
	exports.getTypeParser = getTypeParser;
	exports.setTypeParser = setTypeParser;
	exports.arrayParser = arrayParser;
	exports.builtins = builtinTypes;
	var typeParsers = {
		text: {},
		binary: {}
	};
	function noParse(val) {
		return String(val);
	}
	function getTypeParser(oid, format) {
		format = format || "text";
		if (!typeParsers[format]) return noParse;
		return typeParsers[format][oid] || noParse;
	}
	function setTypeParser(oid, format, parseFn) {
		if (typeof format == "function") {
			parseFn = format;
			format = "text";
		}
		typeParsers[format][oid] = parseFn;
	}
	textParsers.init(function(oid, converter) {
		typeParsers.text[oid] = converter;
	});
	binaryParsers.init(function(oid, converter) {
		typeParsers.binary[oid] = converter;
	});
}));
// node_modules/pg/lib/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var user;
	try {
		user = process.platform === "win32" ? process.env.USERNAME : process.env.USER;
	} catch {}
	module.exports = {
		host: "localhost",
		user,
		database: void 0,
		password: null,
		connectionString: void 0,
		port: 5432,
		rows: 0,
		binary: false,
		max: 10,
		idleTimeoutMillis: 3e4,
		client_encoding: "",
		ssl: false,
		sslnegotiation: void 0,
		application_name: void 0,
		fallback_application_name: void 0,
		options: void 0,
		parseInputDatesAsUTC: false,
		statement_timeout: false,
		lock_timeout: false,
		idle_in_transaction_session_timeout: false,
		query_timeout: false,
		connect_timeout: 0,
		keepalives: 1,
		keepalives_idle: 0
	};
	var pgTypes = require_pg_types();
	var parseBigInteger = pgTypes.getTypeParser(20, "text");
	var parseBigIntegerArray = pgTypes.getTypeParser(1016, "text");
	module.exports.__defineSetter__("parseInt8", function(val) {
		pgTypes.setTypeParser(20, "text", val ? pgTypes.getTypeParser(23, "text") : parseBigInteger);
		pgTypes.setTypeParser(1016, "text", val ? pgTypes.getTypeParser(1007, "text") : parseBigIntegerArray);
	});
}));
// node_modules/pg/lib/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var defaults = require_defaults();
	var nodeUtils = __require("util");
	var { isDate } = __require("util/types");
	var invalidDateDeprecationNotice = nodeUtils.deprecate(() => {}, "Sending an invalid date to Postgres is deprecated and will throw an error in the next major version of pg. Ensure any Date object passed as a query parameter is valid.", "PG_INVALID_DATE");
	function escapeElement(elementRepresentation) {
		return "\"" + elementRepresentation.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
	}
	function arrayString(val) {
		let result = "{";
		for (let i = 0; i < val.length; i++) {
			if (i > 0) result += ",";
			let item = val[i];
			if (item == null) result += "NULL";
			else if (Array.isArray(item)) result += arrayString(item);
			else if (ArrayBuffer.isView(item)) {
				if (!(item instanceof Buffer)) item = Buffer.from(item.buffer, item.byteOffset, item.byteLength);
				result += "\\\\x" + item.toString("hex");
			} else result += escapeElement(prepareValue(item));
		}
		result += "}";
		return result;
	}
	var prepareValue = function(val, seen) {
		if (val == null) return null;
		if (typeof val === "object") {
			if (val instanceof Buffer) return val;
			if (ArrayBuffer.isView(val)) return Buffer.from(val.buffer, val.byteOffset, val.byteLength);
			if (isDate(val)) {
				if (isNaN(val.getTime())) invalidDateDeprecationNotice();
				if (defaults.parseInputDatesAsUTC) return dateToStringUTC(val);
				else return dateToString(val);
			}
			if (Array.isArray(val)) return arrayString(val);
			return prepareObject(val, seen);
		}
		return val.toString();
	};
	function prepareObject(val, seen) {
		if (val && typeof val.toPostgres === "function") {
			seen = seen || [];
			if (seen.indexOf(val) !== -1) throw new Error("circular reference detected while preparing \"" + val + "\" for query");
			seen.push(val);
			return prepareValue(val.toPostgres(prepareValue), seen);
		}
		return JSON.stringify(val);
	}
	function dateToString(date) {
		let offset = -date.getTimezoneOffset();
		let year = date.getFullYear();
		const isBCYear = year < 1;
		if (isBCYear) year = Math.abs(year) + 1;
		let ret = String(year).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + "T" + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0") + "." + String(date.getMilliseconds()).padStart(3, "0");
		if (offset < 0) {
			ret += "-";
			offset *= -1;
		} else ret += "+";
		ret += String(Math.floor(offset / 60)).padStart(2, "0") + ":" + String(offset % 60).padStart(2, "0");
		if (isBCYear) ret += " BC";
		return ret;
	}
	function dateToStringUTC(date) {
		let year = date.getUTCFullYear();
		const isBCYear = year < 1;
		if (isBCYear) year = Math.abs(year) + 1;
		let ret = String(year).padStart(4, "0") + "-" + String(date.getUTCMonth() + 1).padStart(2, "0") + "-" + String(date.getUTCDate()).padStart(2, "0") + "T" + String(date.getUTCHours()).padStart(2, "0") + ":" + String(date.getUTCMinutes()).padStart(2, "0") + ":" + String(date.getUTCSeconds()).padStart(2, "0") + "." + String(date.getUTCMilliseconds()).padStart(3, "0");
		ret += "+00:00";
		if (isBCYear) ret += " BC";
		return ret;
	}
	function normalizeQueryConfig(config, values, callback) {
		config = typeof config === "string" ? { text: config } : cloneQueryConfig(config);
		if (values) {
			if (typeof values === "function") config.callback = values;
			else config.values = values;
		}
		if (callback) config.callback = callback;
		return config;
	}
	function cloneQueryConfig(config) {
		if (config == null) return config;
		return Object.defineProperties(Object.create(Object.getPrototypeOf(config)), Object.getOwnPropertyDescriptors(config));
	}
	var escapeIdentifier = function(str) {
		return "\"" + str.replace(/"/g, "\"\"") + "\"";
	};
	var escapeLiteral = function(str) {
		let hasBackslash = false;
		let escaped = "'";
		if (str == null) return "''";
		if (typeof str !== "string") return "''";
		for (let i = 0; i < str.length; i++) {
			const c = str[i];
			if (c === "'") escaped += c + c;
			else if (c === "\\") {
				escaped += c + c;
				hasBackslash = true;
			} else escaped += c;
		}
		escaped += "'";
		if (hasBackslash === true) escaped = " E" + escaped;
		return escaped;
	};
	module.exports = {
		prepareValue: function prepareValueWrapper(value) {
			return prepareValue(value);
		},
		normalizeQueryConfig,
		escapeIdentifier,
		escapeLiteral
	};
}));
// node_modules/pg/lib/crypto/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nodeCrypto = __require("crypto");
	module.exports = {
		postgresMd5PasswordHash,
		randomBytes,
		deriveKey,
		sha256,
		hashByName,
		hmacSha256,
		md5
	};
	/**
	* The Web Crypto API - grabbed from the Node.js library or the global
	* @type Crypto
	*/
	var webCrypto = nodeCrypto.webcrypto || globalThis.crypto;
	/**
	* The SubtleCrypto API for low level crypto operations.
	* @type SubtleCrypto
	*/
	var subtleCrypto = webCrypto.subtle;
	var textEncoder = new TextEncoder();
	/**
	*
	* @param {*} length
	* @returns
	*/
	function randomBytes(length) {
		return webCrypto.getRandomValues(Buffer.alloc(length));
	}
	async function md5(string) {
		try {
			return nodeCrypto.createHash("md5").update(string, "utf-8").digest("hex");
		} catch (e) {
			const data = typeof string === "string" ? textEncoder.encode(string) : string;
			const hash = await subtleCrypto.digest("MD5", data);
			return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
		}
	}
	async function postgresMd5PasswordHash(user, password, salt) {
		const inner = await md5(password + user);
		return "md5" + await md5(Buffer.concat([Buffer.from(inner), salt]));
	}
	/**
	* Create a SHA-256 digest of the given data
	* @param {Buffer} data
	*/
	async function sha256(text) {
		return await subtleCrypto.digest("SHA-256", text);
	}
	async function hashByName(hashName, text) {
		return await subtleCrypto.digest(hashName, text);
	}
	/**
	* Sign the message with the given key
	* @param {ArrayBuffer} keyBuffer
	* @param {string} msg
	*/
	async function hmacSha256(keyBuffer, msg) {
		const key = await subtleCrypto.importKey("raw", keyBuffer, {
			name: "HMAC",
			hash: "SHA-256"
		}, false, ["sign"]);
		return await subtleCrypto.sign("HMAC", key, textEncoder.encode(msg));
	}
	/**
	* Derive a key from the password and salt
	* @param {string} password
	* @param {Uint8Array} salt
	* @param {number} iterations
	*/
	async function deriveKey(password, salt, iterations) {
		const key = await subtleCrypto.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveBits"]);
		const params = {
			name: "PBKDF2",
			hash: "SHA-256",
			salt,
			iterations
		};
		return await subtleCrypto.deriveBits(params, key, 256, ["deriveBits"]);
	}
}));
// node_modules/pg/lib/crypto/cert-signatures.js
var require_cert_signatures = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function x509Error(msg, cert) {
		return /* @__PURE__ */ new Error("SASL channel binding: " + msg + " when parsing public certificate " + cert.toString("base64"));
	}
	function readASN1Length(data, index) {
		let length = data[index++];
		if (length < 128) return {
			length,
			index
		};
		const lengthBytes = length & 127;
		if (lengthBytes > 4) throw x509Error("bad length", data);
		length = 0;
		for (let i = 0; i < lengthBytes; i++) length = length << 8 | data[index++];
		return {
			length,
			index
		};
	}
	function readASN1OID(data, index) {
		if (data[index++] !== 6) throw x509Error("non-OID data", data);
		const { length: OIDLength, index: indexAfterOIDLength } = readASN1Length(data, index);
		index = indexAfterOIDLength;
		const lastIndex = index + OIDLength;
		const byte1 = data[index++];
		let oid = (byte1 / 40 >> 0) + "." + byte1 % 40;
		while (index < lastIndex) {
			let value = 0;
			while (index < lastIndex) {
				const nextByte = data[index++];
				value = value << 7 | nextByte & 127;
				if (nextByte < 128) break;
			}
			oid += "." + value;
		}
		return {
			oid,
			index
		};
	}
	function expectASN1Seq(data, index) {
		if (data[index++] !== 48) throw x509Error("non-sequence data", data);
		return readASN1Length(data, index);
	}
	function signatureAlgorithmHashFromCertificate(data, index) {
		if (index === void 0) index = 0;
		index = expectASN1Seq(data, index).index;
		const { length: certInfoLength, index: indexAfterCertInfoLength } = expectASN1Seq(data, index);
		index = indexAfterCertInfoLength + certInfoLength;
		index = expectASN1Seq(data, index).index;
		const { oid, index: indexAfterOID } = readASN1OID(data, index);
		switch (oid) {
			case "1.2.840.113549.1.1.4": return "MD5";
			case "1.2.840.113549.1.1.5": return "SHA-1";
			case "1.2.840.113549.1.1.11": return "SHA-256";
			case "1.2.840.113549.1.1.12": return "SHA-384";
			case "1.2.840.113549.1.1.13": return "SHA-512";
			case "1.2.840.113549.1.1.14": return "SHA-224";
			case "1.2.840.113549.1.1.15": return "SHA512-224";
			case "1.2.840.113549.1.1.16": return "SHA512-256";
			case "1.2.840.10045.4.1": return "SHA-1";
			case "1.2.840.10045.4.3.1": return "SHA-224";
			case "1.2.840.10045.4.3.2": return "SHA-256";
			case "1.2.840.10045.4.3.3": return "SHA-384";
			case "1.2.840.10045.4.3.4": return "SHA-512";
			case "1.2.840.113549.1.1.10": {
				index = indexAfterOID;
				index = expectASN1Seq(data, index).index;
				if (data[index++] !== 160) throw x509Error("non-tag data", data);
				index = readASN1Length(data, index).index;
				index = expectASN1Seq(data, index).index;
				const { oid: hashOID } = readASN1OID(data, index);
				switch (hashOID) {
					case "1.2.840.113549.2.5": return "MD5";
					case "1.3.14.3.2.26": return "SHA-1";
					case "2.16.840.1.101.3.4.2.1": return "SHA-256";
					case "2.16.840.1.101.3.4.2.2": return "SHA-384";
					case "2.16.840.1.101.3.4.2.3": return "SHA-512";
				}
				throw x509Error("unknown hash OID " + hashOID, data);
			}
			case "1.3.101.110":
			case "1.3.101.112": return "SHA-512";
			case "1.3.101.111":
			case "1.3.101.113": throw x509Error("Ed448 certificate channel binding is not currently supported by Postgres");
		}
		throw x509Error("unknown OID " + oid, data);
	}
	module.exports = { signatureAlgorithmHashFromCertificate };
}));
// node_modules/pg/lib/crypto/sasl.js
var require_sasl = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var crypto = require_utils();
	var { signatureAlgorithmHashFromCertificate } = require_cert_signatures();
	function saslprep(password) {
		return password.replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, " ").replace(/[\u00AD\u034F\u1806\u180B\u180C\u180D\u200C\u200D\u2060\uFE00-\uFE0F\uFEFF]/g, "").normalize("NFKC");
	}
	var DEFAULT_MAX_SCRAM_ITERATIONS = 1e5;
	function startSession(mechanisms, stream, scramMaxIterations = DEFAULT_MAX_SCRAM_ITERATIONS) {
		const candidates = ["SCRAM-SHA-256"];
		if (stream) candidates.unshift("SCRAM-SHA-256-PLUS");
		const mechanism = candidates.find((candidate) => mechanisms.includes(candidate));
		if (!mechanism) throw new Error("SASL: Only mechanism(s) " + candidates.join(" and ") + " are supported");
		if (mechanism === "SCRAM-SHA-256-PLUS" && typeof stream.getPeerCertificate !== "function") throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");
		const clientNonce = crypto.randomBytes(18).toString("base64");
		return {
			mechanism,
			clientNonce,
			response: (mechanism === "SCRAM-SHA-256-PLUS" ? "p=tls-server-end-point" : stream ? "y" : "n") + ",,n=*,r=" + clientNonce,
			message: "SASLInitialResponse",
			scramMaxIterations
		};
	}
	async function continueSession(session, password, serverData, stream) {
		if (session.message !== "SASLInitialResponse") throw new Error("SASL: Last message was not SASLInitialResponse");
		if (typeof password !== "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
		if (password === "") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");
		if (typeof serverData !== "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
		const sv = parseServerFirstMessage(serverData);
		if (!sv.nonce.startsWith(session.clientNonce)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
		else if (sv.nonce.length === session.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
		const scramMaxIterations = typeof session.scramMaxIterations === "number" ? session.scramMaxIterations : DEFAULT_MAX_SCRAM_ITERATIONS;
		if (scramMaxIterations !== 0 && sv.iteration > scramMaxIterations) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration count " + sv.iteration + " exceeds scramMaxIterations of " + scramMaxIterations);
		const clientFirstMessageBare = "n=*,r=" + session.clientNonce;
		const serverFirstMessage = "r=" + sv.nonce + ",s=" + sv.salt + ",i=" + sv.iteration;
		let channelBinding = stream ? "eSws" : "biws";
		if (session.mechanism === "SCRAM-SHA-256-PLUS") {
			const peerCert = stream.getPeerCertificate().raw;
			let hashName = signatureAlgorithmHashFromCertificate(peerCert);
			if (hashName === "MD5" || hashName === "SHA-1") hashName = "SHA-256";
			const certHash = await crypto.hashByName(hashName, peerCert);
			channelBinding = Buffer.concat([Buffer.from("p=tls-server-end-point,,"), Buffer.from(certHash)]).toString("base64");
		}
		const clientFinalMessageWithoutProof = "c=" + channelBinding + ",r=" + sv.nonce;
		const authMessage = clientFirstMessageBare + "," + serverFirstMessage + "," + clientFinalMessageWithoutProof;
		const saltBytes = Buffer.from(sv.salt, "base64");
		const saltedPassword = await crypto.deriveKey(saslprep(password), saltBytes, sv.iteration);
		const clientKey = await crypto.hmacSha256(saltedPassword, "Client Key");
		const storedKey = await crypto.sha256(clientKey);
		const clientSignature = await crypto.hmacSha256(storedKey, authMessage);
		const clientProof = xorBuffers(Buffer.from(clientKey), Buffer.from(clientSignature)).toString("base64");
		const serverKey = await crypto.hmacSha256(saltedPassword, "Server Key");
		const serverSignatureBytes = await crypto.hmacSha256(serverKey, authMessage);
		session.message = "SASLResponse";
		session.serverSignature = Buffer.from(serverSignatureBytes).toString("base64");
		session.response = clientFinalMessageWithoutProof + ",p=" + clientProof;
	}
	function finalizeSession(session, serverData) {
		if (session.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
		if (typeof serverData !== "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
		const { serverSignature } = parseServerFinalMessage(serverData);
		if (serverSignature !== session.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
	}
	/**
	* printable       = %x21-2B / %x2D-7E
	*                   ;; Printable ASCII except ",".
	*                   ;; Note that any "printable" is also
	*                   ;; a valid "value".
	*/
	function isPrintableChars(text) {
		if (typeof text !== "string") throw new TypeError("SASL: text must be a string");
		return text.split("").map((_, i) => text.charCodeAt(i)).every((c) => c >= 33 && c <= 43 || c >= 45 && c <= 126);
	}
	/**
	* base64-char     = ALPHA / DIGIT / "/" / "+"
	*
	* base64-4        = 4base64-char
	*
	* base64-3        = 3base64-char "="
	*
	* base64-2        = 2base64-char "=="
	*
	* base64          = *base64-4 [base64-3 / base64-2]
	*/
	function isBase64(text) {
		return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text);
	}
	function parseAttributePairs(text) {
		if (typeof text !== "string") throw new TypeError("SASL: attribute pairs text must be a string");
		return new Map(text.split(",").map((attrValue) => {
			if (!/^.=/.test(attrValue)) throw new Error("SASL: Invalid attribute pair entry");
			return [attrValue[0], attrValue.substring(2)];
		}));
	}
	function parseServerFirstMessage(data) {
		const attrPairs = parseAttributePairs(data);
		const nonce = attrPairs.get("r");
		if (!nonce) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
		else if (!isPrintableChars(nonce)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
		const salt = attrPairs.get("s");
		if (!salt) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
		else if (!isBase64(salt)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
		const iterationText = attrPairs.get("i");
		if (!iterationText) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
		else if (!/^[1-9][0-9]*$/.test(iterationText)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
		return {
			nonce,
			salt,
			iteration: parseInt(iterationText, 10)
		};
	}
	function parseServerFinalMessage(serverData) {
		const attrPairs = parseAttributePairs(serverData);
		const error = attrPairs.get("e");
		const serverSignature = attrPairs.get("v");
		if (error) throw new Error(`SASL: SCRAM-SERVER-FINAL-MESSAGE: server returned error: "${error}"`);
		if (!serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
		else if (!isBase64(serverSignature)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
		return { serverSignature };
	}
	function xorBuffers(a, b) {
		if (!Buffer.isBuffer(a)) throw new TypeError("first argument must be a Buffer");
		if (!Buffer.isBuffer(b)) throw new TypeError("second argument must be a Buffer");
		if (a.length !== b.length) throw new Error("Buffer lengths must match");
		if (a.length === 0) throw new Error("Buffers cannot be empty");
		return Buffer.from(a.map((_, i) => a[i] ^ b[i]));
	}
	module.exports = {
		startSession,
		continueSession,
		finalizeSession,
		DEFAULT_MAX_SCRAM_ITERATIONS
	};
}));
// node_modules/pg/lib/type-overrides.js
var require_type_overrides = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var types = require_pg_types();
	function TypeOverrides(userTypes) {
		this._types = userTypes || types;
		this.text = {};
		this.binary = {};
	}
	TypeOverrides.prototype.getOverrides = function(format) {
		switch (format) {
			case "text": return this.text;
			case "binary": return this.binary;
			default: return {};
		}
	};
	TypeOverrides.prototype.setTypeParser = function(oid, format, parseFn) {
		if (typeof format === "function") {
			parseFn = format;
			format = "text";
		}
		this.getOverrides(format)[oid] = parseFn;
	};
	TypeOverrides.prototype.getTypeParser = function(oid, format) {
		format = format || "text";
		return this.getOverrides(format)[oid] || this._types.getTypeParser(oid, format);
	};
	module.exports = TypeOverrides;
}));
// node_modules/pg-connection-string/index.js
var require_pg_connection_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function parse(str, options = {}) {
		if (str.charAt(0) === "/") {
			const config = str.split(" ");
			return {
				host: config[0],
				database: config[1]
			};
		}
		const config = Object.create(null);
		let result;
		let dummyHost = false;
		if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) str = encodeURI(str).replace(/%25(\d\d)/g, "%$1");
		try {
			try {
				result = new URL(str, "postgres://base");
			} catch (e) {
				result = new URL(str.replace("@/", "@___DUMMY___/"), "postgres://base");
				dummyHost = true;
			}
		} catch (err) {
			err.input && (err.input = "*****REDACTED*****");
			throw err;
		}
		for (const entry of result.searchParams.entries()) config[entry[0]] = entry[1];
		config.user = config.user || decodeURIComponent(result.username);
		config.password = config.password || decodeURIComponent(result.password);
		if (result.protocol == "socket:") {
			config.host = decodeURI(result.pathname);
			config.database = result.searchParams.get("db");
			config.client_encoding = result.searchParams.get("encoding");
			return config;
		}
		const hostname = (dummyHost ? "" : result.hostname).replace(/^\[(.+)\]$/, "$1");
		if (!config.host) config.host = decodeURIComponent(hostname);
		else if (hostname && /^%2f/i.test(hostname)) result.pathname = hostname + result.pathname;
		if (!config.port) config.port = result.port;
		const pathname = result.pathname.slice(1) || null;
		config.database = pathname ? decodeURI(pathname) : null;
		if (config.ssl === "true" || config.ssl === "1") config.ssl = true;
		if (config.ssl === "0") config.ssl = false;
		if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) config.ssl = {};
		if (config.sslnegotiation === "direct" && config.ssl === void 0) config.ssl = true;
		const fs = config.sslcert || config.sslkey || config.sslrootcert ? __require("fs") : null;
		if (config.sslcert) config.ssl.cert = fs.readFileSync(config.sslcert).toString();
		if (config.sslkey) config.ssl.key = fs.readFileSync(config.sslkey).toString();
		if (config.sslrootcert) config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
		if (options.useLibpqCompat && config.uselibpqcompat) throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");
		if (config.uselibpqcompat === "true" || options.useLibpqCompat) switch (config.sslmode) {
			case "disable":
				config.ssl = false;
				break;
			case "prefer":
				config.ssl.rejectUnauthorized = false;
				break;
			case "require":
				if (config.sslrootcert) config.ssl.checkServerIdentity = function() {};
				else config.ssl.rejectUnauthorized = false;
				break;
			case "verify-ca":
				if (!config.ssl.ca) throw new Error("SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.");
				config.ssl.checkServerIdentity = function() {};
		}
		else switch (config.sslmode) {
			case "disable":
				config.ssl = false;
				break;
			case "prefer":
			case "require":
			case "verify-ca":
			case "verify-full":
				if (config.sslmode !== "verify-full") deprecatedSslModeWarning(config.sslmode);
				break;
			case "no-verify": config.ssl.rejectUnauthorized = false;
		}
		return config;
	}
	function toConnectionOptions(sslConfig) {
		return Object.entries(sslConfig).reduce((c, [key, value]) => {
			if (value !== void 0 && value !== null) c[key] = value;
			return c;
		}, Object.create(null));
	}
	function toClientConfig(config) {
		return Object.entries(config).reduce((c, [key, value]) => {
			if (key === "ssl") {
				const sslConfig = value;
				if (typeof sslConfig === "boolean") c[key] = sslConfig;
				if (typeof sslConfig === "object") c[key] = toConnectionOptions(sslConfig);
			} else if (value !== void 0 && value !== null) {
				if (key === "port") {
					if (value !== "") {
						const v = parseInt(value, 10);
						if (isNaN(v)) throw new Error(`Invalid ${key}: ${value}`);
						c[key] = v;
					}
				} else c[key] = value;
			}
			return c;
		}, Object.create(null));
	}
	function parseIntoClientConfig(str) {
		return toClientConfig(parse(str));
	}
	function deprecatedSslModeWarning(sslmode) {
		if (!deprecatedSslModeWarning.warned && typeof process !== "undefined" && process.emitWarning) {
			deprecatedSslModeWarning.warned = true;
			process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${sslmode}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`);
		}
	}
	module.exports = parse;
	parse.parse = parse;
	parse.toClientConfig = toClientConfig;
	parse.parseIntoClientConfig = parseIntoClientConfig;
}));
// node_modules/pg/lib/connection-parameters.js
var require_connection_parameters = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var dns = __require("dns");
	var defaults = require_defaults();
	var parse = require_pg_connection_string().parse;
	var val = function(key, config, envVar) {
		if (config[key]) return config[key];
		if (envVar === void 0) envVar = process.env["PG" + key.toUpperCase()];
		else if (envVar === false) {} else envVar = process.env[envVar];
		return envVar || defaults[key];
	};
	var readSSLConfigFromEnvironment = function() {
		switch (process.env.PGSSLMODE) {
			case "disable": return false;
			case "prefer":
			case "require":
			case "verify-ca":
			case "verify-full": return true;
			case "no-verify": return { rejectUnauthorized: false };
		}
		return defaults.ssl;
	};
	var quoteParamValue = function(value) {
		return "'" + ("" + value).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
	};
	var add = function(params, config, paramName) {
		const value = config[paramName];
		if (value !== void 0 && value !== null) params.push(paramName + "=" + quoteParamValue(value));
	};
	var ConnectionParameters = class {
		constructor(config) {
			config = typeof config === "string" ? parse(config) : config || {};
			if (config.connectionString) config = Object.assign({}, config, parse(config.connectionString));
			this.user = val("user", config);
			this.database = val("database", config);
			if (this.database === void 0) this.database = this.user;
			this.port = parseInt(val("port", config), 10);
			this.host = val("host", config);
			Object.defineProperty(this, "password", {
				configurable: true,
				enumerable: false,
				writable: true,
				value: val("password", config)
			});
			this.binary = val("binary", config);
			this.options = val("options", config);
			this.ssl = typeof config.ssl === "undefined" ? readSSLConfigFromEnvironment() : config.ssl;
			if (typeof this.ssl === "string") {
				if (this.ssl === "true") this.ssl = true;
			}
			if (this.ssl === "no-verify") this.ssl = { rejectUnauthorized: false };
			if (this.ssl && this.ssl.key) Object.defineProperty(this.ssl, "key", { enumerable: false });
			this.sslnegotiation = val("sslnegotiation", config, "PGSSLNEGOTIATION");
			if (this.sslnegotiation !== void 0 && this.sslnegotiation !== "postgres" && this.sslnegotiation !== "direct") throw new Error(`Invalid sslnegotiation value: "${this.sslnegotiation}". Valid values are "postgres" and "direct".`);
			if (this.sslnegotiation === "direct" && !this.ssl) throw new Error("sslnegotiation=direct requires SSL to be enabled");
			this.client_encoding = val("client_encoding", config);
			this.replication = val("replication", config);
			this.isDomainSocket = !(this.host || "").indexOf("/");
			this.application_name = val("application_name", config, "PGAPPNAME");
			this.fallback_application_name = val("fallback_application_name", config, false);
			this.statement_timeout = val("statement_timeout", config, false);
			this.lock_timeout = val("lock_timeout", config, false);
			this.idle_in_transaction_session_timeout = val("idle_in_transaction_session_timeout", config, false);
			this.query_timeout = val("query_timeout", config, false);
			if (config.connectionTimeoutMillis === void 0) this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0;
			else this.connect_timeout = Math.floor(config.connectionTimeoutMillis / 1e3);
			if (config.keepAlive === false) this.keepalives = 0;
			else if (config.keepAlive === true) this.keepalives = 1;
			if (typeof config.keepAliveInitialDelayMillis === "number") this.keepalives_idle = Math.floor(config.keepAliveInitialDelayMillis / 1e3);
		}
		getLibpqConnectionString(cb) {
			const params = [];
			add(params, this, "user");
			add(params, this, "password");
			add(params, this, "port");
			add(params, this, "application_name");
			add(params, this, "fallback_application_name");
			add(params, this, "connect_timeout");
			add(params, this, "options");
			const ssl = typeof this.ssl === "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
			add(params, ssl, "sslmode");
			add(params, ssl, "sslca");
			add(params, ssl, "sslkey");
			add(params, ssl, "sslcert");
			add(params, ssl, "sslrootcert");
			add(params, this, "sslnegotiation");
			if (this.database) params.push("dbname=" + quoteParamValue(this.database));
			if (this.replication) params.push("replication=" + quoteParamValue(this.replication));
			if (this.host) params.push("host=" + quoteParamValue(this.host));
			if (this.isDomainSocket) return cb(null, params.join(" "));
			if (this.client_encoding) params.push("client_encoding=" + quoteParamValue(this.client_encoding));
			dns.lookup(this.host, function(err, address) {
				if (err) return cb(err, null);
				params.push("hostaddr=" + quoteParamValue(address));
				return cb(null, params.join(" "));
			});
		}
	};
	module.exports = ConnectionParameters;
}));
// node_modules/pg/lib/result.js
var require_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var types = require_pg_types();
	var matchRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;
	var Result = class {
		constructor(rowMode, types) {
			this.command = null;
			this.rowCount = null;
			this.oid = null;
			this.rows = [];
			this.fields = [];
			this._parsers = void 0;
			this._types = types;
			this.RowCtor = null;
			this.rowAsArray = rowMode === "array";
			if (this.rowAsArray) this.parseRow = this._parseRowAsArray;
			this._prebuiltEmptyResultObject = null;
		}
		addCommandComplete(msg) {
			let match;
			if (msg.text) match = matchRegexp.exec(msg.text);
			else match = matchRegexp.exec(msg.command);
			if (match) {
				this.command = match[1];
				if (match[3]) {
					this.oid = parseInt(match[2], 10);
					this.rowCount = parseInt(match[3], 10);
				} else if (match[2]) this.rowCount = parseInt(match[2], 10);
			}
		}
		_parseRowAsArray(rowData) {
			const row = new Array(rowData.length);
			for (let i = 0, len = rowData.length; i < len; i++) {
				const rawValue = rowData[i];
				if (rawValue !== null) row[i] = this._parsers[i](rawValue);
				else row[i] = null;
			}
			return row;
		}
		parseRow(rowData) {
			const row = { ...this._prebuiltEmptyResultObject };
			for (let i = 0, len = rowData.length; i < len; i++) {
				const rawValue = rowData[i];
				const field = this.fields[i].name;
				if (rawValue !== null) {
					const v = this.fields[i].format === "binary" ? Buffer.from(rawValue) : rawValue;
					row[field] = this._parsers[i](v);
				} else row[field] = null;
			}
			return row;
		}
		addRow(row) {
			this.rows.push(row);
		}
		addFields(fieldDescriptions) {
			this.fields = fieldDescriptions;
			if (this.fields.length) this._parsers = new Array(fieldDescriptions.length);
			const row = Object.create(null);
			for (let i = 0; i < fieldDescriptions.length; i++) {
				const desc = fieldDescriptions[i];
				row[desc.name] = null;
				if (this._types) this._parsers[i] = this._types.getTypeParser(desc.dataTypeID, desc.format || "text");
				else this._parsers[i] = types.getTypeParser(desc.dataTypeID, desc.format || "text");
			}
			this._prebuiltEmptyResultObject = { ...row };
		}
	};
	module.exports = Result;
}));
// node_modules/pg/lib/query.js
var require_query$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter } = __require("events");
	var Result = require_result();
	var utils = require_utils$1();
	var Query = class extends EventEmitter {
		constructor(config, values, callback) {
			super();
			config = utils.normalizeQueryConfig(config, values, callback);
			this.text = config.text;
			this.values = config.values;
			this.rows = config.rows;
			this.types = config.types;
			this.name = config.name;
			this.queryMode = config.queryMode;
			this.binary = config.binary;
			this.portal = config.portal || "";
			this.callback = config.callback;
			this._rowMode = config.rowMode;
			if (process.domain && config.callback) this.callback = process.domain.bind(config.callback);
			this._result = new Result(this._rowMode, this.types);
			this._results = this._result;
			this._canceledDueToError = false;
		}
		requiresPreparation() {
			if (this.queryMode === "extended") return true;
			if (this.name) return true;
			if (this.rows) return true;
			if (!this.text) return false;
			if (!this.values) return false;
			return this.values.length > 0;
		}
		_checkForMultirow() {
			if (this._result.command) {
				if (!Array.isArray(this._results)) this._results = [this._result];
				this._result = new Result(this._rowMode, this._result._types);
				this._results.push(this._result);
			}
		}
		handleRowDescription(msg) {
			this._checkForMultirow();
			this._result.addFields(msg.fields);
			this._accumulateRows = this.callback || !this.listeners("row").length;
		}
		handleDataRow(msg) {
			let row;
			if (this._canceledDueToError) return;
			try {
				row = this._result.parseRow(msg.fields);
			} catch (err) {
				this._canceledDueToError = err;
				return;
			}
			this.emit("row", row, this._result);
			if (this._accumulateRows) this._result.addRow(row);
		}
		handleCommandComplete(msg, connection) {
			this._checkForMultirow();
			this._result.addCommandComplete(msg);
			if (this.rows) connection.sync();
		}
		handleEmptyQuery(connection) {
			if (this.rows) connection.sync();
		}
		handleError(err, connection) {
			if (this._canceledDueToError) {
				err = this._canceledDueToError;
				this._canceledDueToError = false;
			}
			if (this.callback) return this.callback(err);
			this.emit("error", err);
		}
		handleReadyForQuery(con) {
			if (this._canceledDueToError) return this.handleError(this._canceledDueToError, con);
			if (this.callback) try {
				this.callback(null, this._results);
			} catch (err) {
				process.nextTick(() => {
					throw err;
				});
			}
			this.emit("end", this._results);
		}
		submit(connection) {
			if (typeof this.text !== "string" && typeof this.name !== "string") return /* @__PURE__ */ new Error("A query must have either text or a name. Supplying neither is unsupported.");
			const previous = connection.parsedStatements[this.name] || connection.submittedNamedStatements[this.name];
			if (this.text && previous && this.text !== previous) return /* @__PURE__ */ new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
			if (this.values && !Array.isArray(this.values)) return /* @__PURE__ */ new Error("Query values must be an array");
			if (this.requiresPreparation()) {
				connection.stream.cork && connection.stream.cork();
				try {
					this.prepare(connection);
				} finally {
					connection.stream.uncork && connection.stream.uncork();
				}
			} else connection.query(this.text);
			return null;
		}
		hasBeenParsed(connection) {
			return this.name && (connection.parsedStatements[this.name] !== void 0 || connection.submittedNamedStatements[this.name] !== void 0);
		}
		handlePortalSuspended(connection) {
			this._getRows(connection, this.rows);
		}
		_getRows(connection, rows) {
			connection.execute({
				portal: this.portal,
				rows
			});
			if (!rows) connection.sync();
			else connection.flush();
		}
		prepare(connection) {
			if (!this.hasBeenParsed(connection)) {
				connection.parse({
					text: this.text,
					name: this.name,
					types: this.types
				});
				if (this.name) connection.submittedNamedStatements[this.name] = this.text;
			}
			try {
				connection.bind({
					portal: this.portal,
					statement: this.name,
					values: this.values,
					binary: this.binary,
					valueMapper: utils.prepareValue
				});
			} catch (err) {
				connection.close({
					type: "S",
					name: this.name
				});
				connection.sync();
				this.handleError(err, connection);
				return;
			}
			connection.describe({
				type: "P",
				name: this.portal || ""
			});
			this._getRows(connection, this.rows);
		}
		handleCopyInResponse(connection) {
			connection.sendCopyFail("No source stream defined");
		}
		handleCopyData(msg, connection) {}
	};
	module.exports = Query;
}));
// node_modules/pg-protocol/dist/messages.js
var require_messages = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NoticeMessage = exports.DataRowMessage = exports.CommandCompleteMessage = exports.ReadyForQueryMessage = exports.NotificationResponseMessage = exports.BackendKeyDataMessage = exports.AuthenticationMD5Password = exports.ParameterStatusMessage = exports.ParameterDescriptionMessage = exports.RowDescriptionMessage = exports.Field = exports.CopyResponse = exports.CopyDataMessage = exports.DatabaseError = exports.copyDone = exports.emptyQuery = exports.replicationStart = exports.portalSuspended = exports.noData = exports.closeComplete = exports.bindComplete = exports.parseComplete = void 0;
	exports.parseComplete = {
		name: "parseComplete",
		length: 5
	};
	exports.bindComplete = {
		name: "bindComplete",
		length: 5
	};
	exports.closeComplete = {
		name: "closeComplete",
		length: 5
	};
	exports.noData = {
		name: "noData",
		length: 5
	};
	exports.portalSuspended = {
		name: "portalSuspended",
		length: 5
	};
	exports.replicationStart = {
		name: "replicationStart",
		length: 4
	};
	exports.emptyQuery = {
		name: "emptyQuery",
		length: 4
	};
	exports.copyDone = {
		name: "copyDone",
		length: 4
	};
	var DatabaseError = class extends Error {
		constructor(message, length, name) {
			super(message);
			this.length = length;
			this.name = name;
		}
	};
	exports.DatabaseError = DatabaseError;
	var CopyDataMessage = class {
		constructor(length, chunk) {
			this.length = length;
			this.chunk = chunk;
			this.name = "copyData";
		}
	};
	exports.CopyDataMessage = CopyDataMessage;
	var CopyResponse = class {
		constructor(length, name, binary, columnCount) {
			this.length = length;
			this.name = name;
			this.binary = binary;
			this.columnTypes = new Array(columnCount);
		}
	};
	exports.CopyResponse = CopyResponse;
	var Field = class {
		constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format) {
			this.name = name;
			this.tableID = tableID;
			this.columnID = columnID;
			this.dataTypeID = dataTypeID;
			this.dataTypeSize = dataTypeSize;
			this.dataTypeModifier = dataTypeModifier;
			this.format = format;
		}
	};
	exports.Field = Field;
	var RowDescriptionMessage = class {
		constructor(length, fieldCount) {
			this.length = length;
			this.fieldCount = fieldCount;
			this.name = "rowDescription";
			this.fields = new Array(this.fieldCount);
		}
	};
	exports.RowDescriptionMessage = RowDescriptionMessage;
	var ParameterDescriptionMessage = class {
		constructor(length, parameterCount) {
			this.length = length;
			this.parameterCount = parameterCount;
			this.name = "parameterDescription";
			this.dataTypeIDs = new Array(this.parameterCount);
		}
	};
	exports.ParameterDescriptionMessage = ParameterDescriptionMessage;
	var ParameterStatusMessage = class {
		constructor(length, parameterName, parameterValue) {
			this.length = length;
			this.parameterName = parameterName;
			this.parameterValue = parameterValue;
			this.name = "parameterStatus";
		}
	};
	exports.ParameterStatusMessage = ParameterStatusMessage;
	var AuthenticationMD5Password = class {
		constructor(length, salt) {
			this.length = length;
			this.salt = salt;
			this.name = "authenticationMD5Password";
		}
	};
	exports.AuthenticationMD5Password = AuthenticationMD5Password;
	var BackendKeyDataMessage = class {
		constructor(length, processID, secretKey) {
			this.length = length;
			this.processID = processID;
			this.secretKey = secretKey;
			this.name = "backendKeyData";
		}
	};
	exports.BackendKeyDataMessage = BackendKeyDataMessage;
	var NotificationResponseMessage = class {
		constructor(length, processId, channel, payload) {
			this.length = length;
			this.processId = processId;
			this.channel = channel;
			this.payload = payload;
			this.name = "notification";
		}
	};
	exports.NotificationResponseMessage = NotificationResponseMessage;
	var ReadyForQueryMessage = class {
		constructor(length, status) {
			this.length = length;
			this.status = status;
			this.name = "readyForQuery";
		}
	};
	exports.ReadyForQueryMessage = ReadyForQueryMessage;
	var CommandCompleteMessage = class {
		constructor(length, text) {
			this.length = length;
			this.text = text;
			this.name = "commandComplete";
		}
	};
	exports.CommandCompleteMessage = CommandCompleteMessage;
	var DataRowMessage = class {
		constructor(length, fields) {
			this.length = length;
			this.fields = fields;
			this.name = "dataRow";
			this.fieldCount = fields.length;
		}
	};
	exports.DataRowMessage = DataRowMessage;
	var NoticeMessage = class {
		constructor(length, message) {
			this.length = length;
			this.message = message;
			this.name = "notice";
		}
	};
	exports.NoticeMessage = NoticeMessage;
}));
// node_modules/pg-protocol/dist/buffer-writer.js
var require_buffer_writer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Writer = void 0;
	var Writer = class {
		constructor(size = 256) {
			this.size = size;
			this.offset = 5;
			this.headerPosition = 0;
			this.buffer = Buffer.allocUnsafe(size);
		}
		ensure(size) {
			if (this.buffer.length - this.offset < size) {
				const oldBuffer = this.buffer;
				const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
				this.buffer = Buffer.allocUnsafe(newSize);
				oldBuffer.copy(this.buffer, 0, 0, this.offset);
			}
		}
		addInt32(num) {
			this.ensure(4);
			this.buffer[this.offset++] = num >>> 24 & 255;
			this.buffer[this.offset++] = num >>> 16 & 255;
			this.buffer[this.offset++] = num >>> 8 & 255;
			this.buffer[this.offset++] = num >>> 0 & 255;
			return this;
		}
		addInt16(num) {
			this.ensure(2);
			this.buffer[this.offset++] = num >>> 8 & 255;
			this.buffer[this.offset++] = num >>> 0 & 255;
			return this;
		}
		addCString(string) {
			if (!string) this.ensure(1);
			else {
				const len = Buffer.byteLength(string);
				this.ensure(len + 1);
				this.buffer.write(string, this.offset, "utf-8");
				this.offset += len;
			}
			this.buffer[this.offset++] = 0;
			return this;
		}
		addString(string = "") {
			const len = Buffer.byteLength(string);
			this.ensure(len);
			this.buffer.write(string, this.offset);
			this.offset += len;
			return this;
		}
		addInt32PrefixedString(string) {
			const len = Buffer.byteLength(string);
			this.ensure(4 + len);
			const buffer = this.buffer;
			let offset = this.offset;
			buffer[offset++] = len >>> 24 & 255;
			buffer[offset++] = len >>> 16 & 255;
			buffer[offset++] = len >>> 8 & 255;
			buffer[offset++] = len >>> 0 & 255;
			buffer.write(string, offset, "utf-8");
			this.offset = offset + len;
			return this;
		}
		add(otherBuffer) {
			this.ensure(otherBuffer.length);
			otherBuffer.copy(this.buffer, this.offset);
			this.offset += otherBuffer.length;
			return this;
		}
		/**
		* Appends an uninitialized block of {@link size} bytes to the buffer and returns its offset.
		*/
		reserveUnsafe(size) {
			const offset = this.offset;
			this.ensure(size);
			this.offset += size;
			return offset;
		}
		join(code) {
			if (code) {
				this.buffer[this.headerPosition] = code;
				const length = this.offset - (this.headerPosition + 1);
				this.buffer.writeInt32BE(length, this.headerPosition + 1);
			}
			return this.buffer.slice(code ? 0 : 5, this.offset);
		}
		flush(code) {
			const result = this.join(code);
			this.offset = 5;
			this.headerPosition = 0;
			this.buffer = Buffer.allocUnsafe(this.size);
			return result;
		}
		clear() {
			this.offset = 5;
			this.headerPosition = 0;
		}
	};
	exports.Writer = Writer;
}));
// node_modules/pg-protocol/dist/serializer.js
var require_serializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serialize = void 0;
	var buffer_writer_1 = require_buffer_writer();
	var writer = new buffer_writer_1.Writer();
	var startup = (opts) => {
		writer.addInt16(3).addInt16(0);
		for (const key of Object.keys(opts)) writer.addCString(key).addCString(opts[key]);
		writer.addCString("client_encoding").addCString("UTF8");
		const bodyBuffer = writer.addCString("").flush();
		const length = bodyBuffer.length + 4;
		return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
	};
	var requestSsl = () => {
		const response = Buffer.allocUnsafe(8);
		response.writeInt32BE(8, 0);
		response.writeInt32BE(80877103, 4);
		return response;
	};
	var password = (password) => {
		return writer.addCString(password).flush(112);
	};
	var sendSASLInitialResponseMessage = function(mechanism, initialResponse) {
		writer.addCString(mechanism).addInt32PrefixedString(initialResponse);
		return writer.flush(112);
	};
	var sendSCRAMClientFinalMessage = function(additionalData) {
		return writer.addString(additionalData).flush(112);
	};
	var query = (text) => {
		return writer.addCString(text).flush(81);
	};
	var emptyArray = [];
	var parse = (query) => {
		const name = query.name || "";
		if (name.length > 63) {
			console.error("Warning! Postgres only supports 63 characters for query names.");
			console.error("You supplied %s (%s)", name, name.length);
			console.error("This can cause conflicts and silent errors executing queries");
		}
		const types = query.types || emptyArray;
		const len = types.length;
		const buffer = writer.addCString(name).addCString(query.text).addInt16(len);
		for (let i = 0; i < len; i++) buffer.addInt32(types[i]);
		return writer.flush(80);
	};
	var writeValues = function(values, valueMapper, formatsOffset) {
		const len = values.length;
		for (let i = 0; i < len; i++) {
			const mappedVal = valueMapper ? valueMapper(values[i], i) : values[i];
			let formatByte = 0;
			if (mappedVal == null) writer.addInt32(-1);
			else if (mappedVal instanceof Buffer) {
				formatByte = 1;
				writer.addInt32(mappedVal.length);
				writer.add(mappedVal);
			} else writer.addInt32PrefixedString(mappedVal);
			const buf = writer.buffer;
			buf[formatsOffset++] = 0;
			buf[formatsOffset++] = formatByte;
		}
	};
	var bind = (config = {}) => {
		const portal = config.portal || "";
		const statement = config.statement || "";
		const binary = config.binary || false;
		const values = config.values || emptyArray;
		const len = values.length;
		writer.addCString(portal).addCString(statement);
		writer.addInt16(len);
		const formatsOffset = writer.reserveUnsafe(len * 2);
		writer.addInt16(len);
		try {
			writeValues(values, config.valueMapper, formatsOffset);
		} catch (err) {
			writer.clear();
			throw err;
		}
		writer.addInt16(1);
		writer.addInt16(binary ? 1 : 0);
		return writer.flush(66);
	};
	var emptyExecute = Buffer.from([
		69,
		0,
		0,
		0,
		9,
		0,
		0,
		0,
		0,
		0
	]);
	var execute = (config) => {
		if (!config || !config.portal && !config.rows) return emptyExecute;
		const portal = config.portal || "";
		const rows = config.rows || 0;
		const portalLength = Buffer.byteLength(portal);
		const len = 4 + portalLength + 1 + 4;
		const buff = Buffer.allocUnsafe(1 + len);
		buff[0] = 69;
		buff.writeInt32BE(len, 1);
		buff.write(portal, 5, "utf-8");
		buff[portalLength + 5] = 0;
		buff.writeUInt32BE(rows, buff.length - 4);
		return buff;
	};
	var cancel = (processID, secretKey) => {
		const buffer = Buffer.allocUnsafe(16);
		buffer.writeInt32BE(16, 0);
		buffer.writeInt16BE(1234, 4);
		buffer.writeInt16BE(5678, 6);
		buffer.writeInt32BE(processID, 8);
		buffer.writeInt32BE(secretKey, 12);
		return buffer;
	};
	var cstringMessage = (code, string) => {
		const len = 4 + Buffer.byteLength(string) + 1;
		const buffer = Buffer.allocUnsafe(1 + len);
		buffer[0] = code;
		buffer.writeInt32BE(len, 1);
		buffer.write(string, 5, "utf-8");
		buffer[len] = 0;
		return buffer;
	};
	var emptyDescribePortal = writer.addCString("P").flush(68);
	var emptyDescribeStatement = writer.addCString("S").flush(68);
	var describe = (msg) => {
		return msg.name ? cstringMessage(68, `${msg.type}${msg.name || ""}`) : msg.type === "P" ? emptyDescribePortal : emptyDescribeStatement;
	};
	var close = (msg) => {
		return cstringMessage(67, `${msg.type}${msg.name || ""}`);
	};
	var copyData = (chunk) => {
		return writer.add(chunk).flush(100);
	};
	var copyFail = (message) => {
		return cstringMessage(102, message);
	};
	var codeOnlyBuffer = (code) => Buffer.from([
		code,
		0,
		0,
		0,
		4
	]);
	var flushBuffer = codeOnlyBuffer(72);
	var syncBuffer = codeOnlyBuffer(83);
	var endBuffer = codeOnlyBuffer(88);
	var copyDoneBuffer = codeOnlyBuffer(99);
	exports.serialize = {
		startup,
		password,
		requestSsl,
		sendSASLInitialResponseMessage,
		sendSCRAMClientFinalMessage,
		query,
		parse,
		bind,
		execute,
		describe,
		close,
		flush: () => flushBuffer,
		sync: () => syncBuffer,
		end: () => endBuffer,
		copyData,
		copyDone: () => copyDoneBuffer,
		copyFail,
		cancel
	};
}));
// node_modules/pg-protocol/dist/buffer-reader.js
var require_buffer_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BufferReader = void 0;
	var BufferReader = class {
		constructor(offset = 0) {
			this.offset = offset;
			this.buffer = Buffer.allocUnsafe(0);
			this.encoding = "utf-8";
		}
		setBuffer(offset, buffer) {
			this.offset = offset;
			this.buffer = buffer;
		}
		int16() {
			const result = this.buffer.readInt16BE(this.offset);
			this.offset += 2;
			return result;
		}
		byte() {
			const result = this.buffer[this.offset];
			this.offset++;
			return result;
		}
		int32() {
			const result = this.buffer.readInt32BE(this.offset);
			this.offset += 4;
			return result;
		}
		uint32() {
			const result = this.buffer.readUInt32BE(this.offset);
			this.offset += 4;
			return result;
		}
		string(length) {
			const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
			this.offset += length;
			return result;
		}
		cstring() {
			const start = this.offset;
			let end = start;
			while (this.buffer[end++]);
			this.offset = end;
			return this.buffer.toString(this.encoding, start, end - 1);
		}
		bytes(length) {
			const result = this.buffer.slice(this.offset, this.offset + length);
			this.offset += length;
			return result;
		}
	};
	exports.BufferReader = BufferReader;
}));
// node_modules/pg-protocol/dist/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Parser = void 0;
	var messages_1 = require_messages();
	var buffer_reader_1 = require_buffer_reader();
	var CODE_LENGTH = 1;
	var HEADER_LENGTH = 5;
	var LATEINIT_LENGTH = -1;
	var emptyBuffer = Buffer.allocUnsafe(0);
	var Parser = class {
		constructor(opts) {
			this.buffer = emptyBuffer;
			this.bufferLength = 0;
			this.bufferOffset = 0;
			this.reader = new buffer_reader_1.BufferReader();
			if ((opts === null || opts === void 0 ? void 0 : opts.mode) === "binary") throw new Error("Binary mode not supported yet");
			this.mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || "text";
		}
		parse(buffer, callback) {
			this.mergeBuffer(buffer);
			const bufferFullLength = this.bufferOffset + this.bufferLength;
			let offset = this.bufferOffset;
			while (offset + HEADER_LENGTH <= bufferFullLength) {
				const code = this.buffer[offset];
				const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
				const fullMessageLength = CODE_LENGTH + length;
				if (fullMessageLength + offset <= bufferFullLength) {
					callback(this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer));
					offset += fullMessageLength;
				} else break;
			}
			if (offset === bufferFullLength) {
				this.buffer = emptyBuffer;
				this.bufferLength = 0;
				this.bufferOffset = 0;
			} else {
				this.bufferLength = bufferFullLength - offset;
				this.bufferOffset = offset;
			}
		}
		mergeBuffer(buffer) {
			if (this.bufferLength > 0) {
				const newLength = this.bufferLength + buffer.byteLength;
				if (newLength + this.bufferOffset > this.buffer.byteLength) {
					let newBuffer;
					if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) newBuffer = this.buffer;
					else {
						let newBufferLength = this.buffer.byteLength * 2;
						while (newLength >= newBufferLength) newBufferLength *= 2;
						newBuffer = Buffer.allocUnsafe(newBufferLength);
					}
					this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
					this.buffer = newBuffer;
					this.bufferOffset = 0;
				}
				buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
				this.bufferLength = newLength;
			} else {
				this.buffer = buffer;
				this.bufferOffset = 0;
				this.bufferLength = buffer.byteLength;
			}
		}
		handlePacket(offset, code, length, bytes) {
			const { reader } = this;
			reader.setBuffer(offset, bytes);
			let message;
			switch (code) {
				case 50:
					message = messages_1.bindComplete;
					break;
				case 49:
					message = messages_1.parseComplete;
					break;
				case 51:
					message = messages_1.closeComplete;
					break;
				case 110:
					message = messages_1.noData;
					break;
				case 115:
					message = messages_1.portalSuspended;
					break;
				case 99:
					message = messages_1.copyDone;
					break;
				case 87:
					message = messages_1.replicationStart;
					break;
				case 73:
					message = messages_1.emptyQuery;
					break;
				case 68:
					message = parseDataRowMessage(reader);
					break;
				case 67:
					message = parseCommandCompleteMessage(reader);
					break;
				case 90:
					message = parseReadyForQueryMessage(reader);
					break;
				case 65:
					message = parseNotificationMessage(reader);
					break;
				case 82:
					message = parseAuthenticationResponse(reader, length);
					break;
				case 83:
					message = parseParameterStatusMessage(reader);
					break;
				case 75:
					message = parseBackendKeyData(reader);
					break;
				case 69:
					message = parseErrorMessage(reader, "error");
					break;
				case 78:
					message = parseErrorMessage(reader, "notice");
					break;
				case 84:
					message = parseRowDescriptionMessage(reader);
					break;
				case 116:
					message = parseParameterDescriptionMessage(reader);
					break;
				case 71:
					message = parseCopyInMessage(reader);
					break;
				case 72:
					message = parseCopyOutMessage(reader);
					break;
				case 100:
					message = parseCopyData(reader, length);
					break;
				default: return new messages_1.DatabaseError("received invalid response: " + code.toString(16), length, "error");
			}
			reader.setBuffer(0, emptyBuffer);
			message.length = length;
			return message;
		}
	};
	exports.Parser = Parser;
	var parseReadyForQueryMessage = (reader) => {
		const status = reader.string(1);
		return new messages_1.ReadyForQueryMessage(LATEINIT_LENGTH, status);
	};
	var parseCommandCompleteMessage = (reader) => {
		const text = reader.cstring();
		return new messages_1.CommandCompleteMessage(LATEINIT_LENGTH, text);
	};
	var parseCopyData = (reader, length) => {
		const chunk = reader.bytes(length - 4);
		return new messages_1.CopyDataMessage(LATEINIT_LENGTH, chunk);
	};
	var parseCopyInMessage = (reader) => parseCopyMessage(reader, "copyInResponse");
	var parseCopyOutMessage = (reader) => parseCopyMessage(reader, "copyOutResponse");
	var parseCopyMessage = (reader, messageName) => {
		const isBinary = reader.byte() !== 0;
		const columnCount = reader.int16();
		const message = new messages_1.CopyResponse(LATEINIT_LENGTH, messageName, isBinary, columnCount);
		for (let i = 0; i < columnCount; i++) message.columnTypes[i] = reader.int16();
		return message;
	};
	var parseNotificationMessage = (reader) => {
		const processId = reader.int32();
		const channel = reader.cstring();
		const payload = reader.cstring();
		return new messages_1.NotificationResponseMessage(LATEINIT_LENGTH, processId, channel, payload);
	};
	var parseRowDescriptionMessage = (reader) => {
		const fieldCount = reader.int16();
		const message = new messages_1.RowDescriptionMessage(LATEINIT_LENGTH, fieldCount);
		for (let i = 0; i < fieldCount; i++) message.fields[i] = parseField(reader);
		return message;
	};
	var parseField = (reader) => {
		const name = reader.cstring();
		const tableID = reader.uint32();
		const columnID = reader.int16();
		const dataTypeID = reader.uint32();
		const dataTypeSize = reader.int16();
		const dataTypeModifier = reader.int32();
		const mode = reader.int16() === 0 ? "text" : "binary";
		return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
	};
	var parseParameterDescriptionMessage = (reader) => {
		const parameterCount = reader.int16();
		const message = new messages_1.ParameterDescriptionMessage(LATEINIT_LENGTH, parameterCount);
		for (let i = 0; i < parameterCount; i++) message.dataTypeIDs[i] = reader.uint32();
		return message;
	};
	var parseDataRowMessage = (reader) => {
		const fieldCount = reader.int16();
		const fields = new Array(fieldCount);
		for (let i = 0; i < fieldCount; i++) {
			const len = reader.int32();
			fields[i] = len === -1 ? null : reader.string(len);
		}
		return new messages_1.DataRowMessage(LATEINIT_LENGTH, fields);
	};
	var parseParameterStatusMessage = (reader) => {
		const name = reader.cstring();
		const value = reader.cstring();
		return new messages_1.ParameterStatusMessage(LATEINIT_LENGTH, name, value);
	};
	var parseBackendKeyData = (reader) => {
		const processID = reader.int32();
		const secretKey = reader.int32();
		return new messages_1.BackendKeyDataMessage(LATEINIT_LENGTH, processID, secretKey);
	};
	var parseAuthenticationResponse = (reader, length) => {
		const code = reader.int32();
		const message = {
			name: "authenticationOk",
			length
		};
		switch (code) {
			case 0: break;
			case 3:
				if (message.length === 8) message.name = "authenticationCleartextPassword";
				break;
			case 5:
				if (message.length === 12) {
					message.name = "authenticationMD5Password";
					const salt = reader.bytes(4);
					return new messages_1.AuthenticationMD5Password(LATEINIT_LENGTH, salt);
				}
				break;
			case 10:
				{
					message.name = "authenticationSASL";
					message.mechanisms = [];
					let mechanism;
					do {
						mechanism = reader.cstring();
						if (mechanism) message.mechanisms.push(mechanism);
					} while (mechanism);
				}
				break;
			case 11:
				message.name = "authenticationSASLContinue";
				message.data = reader.string(length - 8);
				break;
			case 12:
				message.name = "authenticationSASLFinal";
				message.data = reader.string(length - 8);
				break;
			default: throw new Error("Unknown authenticationOk message type " + code);
		}
		return message;
	};
	var parseErrorMessage = (reader, name) => {
		const fields = {};
		let fieldType = reader.string(1);
		while (fieldType !== "\0") {
			fields[fieldType] = reader.cstring();
			fieldType = reader.string(1);
		}
		const messageValue = fields.M;
		const message = name === "notice" ? new messages_1.NoticeMessage(LATEINIT_LENGTH, messageValue) : new messages_1.DatabaseError(messageValue, LATEINIT_LENGTH, name);
		message.severity = fields.S;
		message.code = fields.C;
		message.detail = fields.D;
		message.hint = fields.H;
		message.position = fields.P;
		message.internalPosition = fields.p;
		message.internalQuery = fields.q;
		message.where = fields.W;
		message.schema = fields.s;
		message.table = fields.t;
		message.column = fields.c;
		message.dataType = fields.d;
		message.constraint = fields.n;
		message.file = fields.F;
		message.line = fields.L;
		message.routine = fields.R;
		return message;
	};
}));
// node_modules/pg-protocol/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DatabaseError = exports.serialize = void 0;
	exports.parse = parse;
	var messages_1 = require_messages();
	Object.defineProperty(exports, "DatabaseError", {
		enumerable: true,
		get: function() {
			return messages_1.DatabaseError;
		}
	});
	var serializer_1 = require_serializer();
	Object.defineProperty(exports, "serialize", {
		enumerable: true,
		get: function() {
			return serializer_1.serialize;
		}
	});
	var parser_1 = require_parser();
	function parse(stream, callback) {
		const parser = new parser_1.Parser();
		stream.on("data", (buffer) => parser.parse(buffer, callback));
		return new Promise((resolve) => stream.on("end", () => resolve()));
	}
}));
// node_modules/pg-cloudflare/dist/empty.js
var require_empty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {};
}));
// node_modules/pg/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { getStream, getSecureStream } = getStreamFuncs();
	module.exports = {
		/**
		* Get a socket stream compatible with the current runtime environment.
		* @returns {Duplex}
		*/
		getStream,
		/**
		* Get a TLS secured socket, compatible with the current environment,
		* using the socket and other settings given in `options`.
		* @returns {Duplex}
		*/
		getSecureStream
	};
	/**
	* The stream functions that work in Node.js
	*/
	function getNodejsStreamFuncs() {
		function getStream(ssl) {
			return new (__require("net")).Socket();
		}
		function getSecureStream(options) {
			return __require("tls").connect(options);
		}
		return {
			getStream,
			getSecureStream
		};
	}
	/**
	* The stream functions that work in Cloudflare Workers
	*/
	function getCloudflareStreamFuncs() {
		function getStream(ssl) {
			const { CloudflareSocket } = require_empty();
			return new CloudflareSocket(ssl);
		}
		function getSecureStream(options) {
			options.socket.startTls(options);
			return options.socket;
		}
		return {
			getStream,
			getSecureStream
		};
	}
	/**
	* Are we running in a Cloudflare Worker?
	*
	* @returns true if the code is currently running inside a Cloudflare Worker.
	*/
	function isCloudflareRuntime() {
		if (typeof navigator === "object" && navigator !== null && typeof navigator.userAgent === "string") return navigator.userAgent === "Cloudflare-Workers";
		if (typeof Response === "function") {
			const resp = new Response(null, { cf: { thing: true } });
			if (typeof resp.cf === "object" && resp.cf !== null && resp.cf.thing) return true;
		}
		return false;
	}
	function getStreamFuncs() {
		if (isCloudflareRuntime()) return getCloudflareStreamFuncs();
		return getNodejsStreamFuncs();
	}
}));
// node_modules/pg/lib/connection.js
var require_connection = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = __require("events").EventEmitter;
	var { parse, serialize } = require_dist();
	var stream = require_stream();
	var { getStream } = stream;
	var flushBuffer = serialize.flush();
	var syncBuffer = serialize.sync();
	var endBuffer = serialize.end();
	var Connection = class extends EventEmitter {
		constructor(config) {
			super();
			config = config || {};
			this.stream = config.stream || getStream(config.ssl);
			if (typeof this.stream === "function") this.stream = this.stream(config);
			this._keepAlive = config.keepAlive;
			this._keepAliveInitialDelayMillis = config.keepAliveInitialDelayMillis;
			this.parsedStatements = {};
			this.submittedNamedStatements = {};
			this.ssl = config.ssl || false;
			this.sslNegotiation = config.sslNegotiation || "postgres";
			this._ending = false;
			this._emitMessage = false;
			const self = this;
			this.on("newListener", function(eventName) {
				if (eventName === "message") self._emitMessage = true;
			});
		}
		connect(port, host) {
			const self = this;
			this._connecting = true;
			this.stream.setNoDelay(true);
			this.stream.connect(port, host);
			this.stream.once("connect", function() {
				if (self._keepAlive) self.stream.setKeepAlive(true, self._keepAliveInitialDelayMillis);
				self.emit("connect");
			});
			const reportStreamError = function(error) {
				if (self._ending && (error.code === "ECONNRESET" || error.code === "EPIPE")) return;
				self.emit("error", error);
			};
			this.stream.on("error", reportStreamError);
			this.stream.on("close", function() {
				self.emit("end");
			});
			if (!this.ssl) return this.attachListeners(this.stream);
			if (this.sslNegotiation === "direct") return this.stream.once("connect", function() {
				self.upgradeToSSL(host, reportStreamError);
			});
			this.stream.once("data", function(buffer) {
				switch (buffer.toString("utf8")) {
					case "S": break;
					case "N":
						self.stream.end();
						return self.emit("error", /* @__PURE__ */ new Error("The server does not support SSL connections"));
					default:
						self.stream.end();
						return self.emit("error", /* @__PURE__ */ new Error("There was an error establishing an SSL connection"));
				}
				self.upgradeToSSL(host, reportStreamError);
			});
		}
		upgradeToSSL(host, reportStreamError) {
			const self = this;
			const options = {
				socket: self.stream,
				host
			};
			if (self.ssl !== true) {
				Object.assign(options, self.ssl);
				if ("key" in self.ssl) options.key = self.ssl.key;
			}
			if (self.sslNegotiation === "direct") options.ALPNProtocols = ["postgresql"];
			const net = __require("net");
			if (net.isIP && net.isIP(host) === 0) options.servername = host;
			try {
				self.stream = stream.getSecureStream(options);
			} catch (err) {
				return self.emit("error", err);
			}
			self.attachListeners(self.stream);
			self.stream.on("error", reportStreamError);
			self.emit("sslconnect");
		}
		attachListeners(stream) {
			parse(stream, (msg) => {
				const eventName = msg.name === "error" ? "errorMessage" : msg.name;
				if (this._emitMessage) this.emit("message", msg);
				this.emit(eventName, msg);
			});
		}
		requestSsl() {
			this.stream.write(serialize.requestSsl());
		}
		startup(config) {
			this.stream.write(serialize.startup(config));
		}
		cancel(processID, secretKey) {
			this._send(serialize.cancel(processID, secretKey));
		}
		password(password) {
			this._send(serialize.password(password));
		}
		sendSASLInitialResponseMessage(mechanism, initialResponse) {
			this._send(serialize.sendSASLInitialResponseMessage(mechanism, initialResponse));
		}
		sendSCRAMClientFinalMessage(additionalData) {
			this._send(serialize.sendSCRAMClientFinalMessage(additionalData));
		}
		_send(buffer) {
			if (!this.stream.writable) return false;
			return this.stream.write(buffer);
		}
		query(text) {
			this._send(serialize.query(text));
		}
		parse(query) {
			this._send(serialize.parse(query));
		}
		bind(config) {
			this._send(serialize.bind(config));
		}
		execute(config) {
			this._send(serialize.execute(config));
		}
		flush() {
			if (this.stream.writable) this.stream.write(flushBuffer);
		}
		sync() {
			this._send(syncBuffer);
		}
		ref() {
			this.stream.ref();
		}
		unref() {
			this.stream.unref();
		}
		end() {
			this._ending = true;
			if (!this._connecting || !this.stream.writable) {
				this.stream.end();
				return;
			}
			return this.stream.write(endBuffer, () => {
				this.stream.end();
			});
		}
		close(msg) {
			this._send(serialize.close(msg));
		}
		describe(msg) {
			this._send(serialize.describe(msg));
		}
		sendCopyFromChunk(chunk) {
			this._send(serialize.copyData(chunk));
		}
		endCopyFrom() {
			this._send(serialize.copyDone());
		}
		sendCopyFail(msg) {
			this._send(serialize.copyFail(msg));
		}
	};
	module.exports = Connection;
}));
// node_modules/split2/index.js
var require_split2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Transform } = __require("stream");
	var { StringDecoder } = __require("string_decoder");
	var kLast = Symbol("last");
	var kDecoder = Symbol("decoder");
	function transform(chunk, enc, cb) {
		let list;
		if (this.overflow) {
			list = this[kDecoder].write(chunk).split(this.matcher);
			if (list.length === 1) return cb();
			list.shift();
			this.overflow = false;
		} else {
			this[kLast] += this[kDecoder].write(chunk);
			list = this[kLast].split(this.matcher);
		}
		this[kLast] = list.pop();
		for (let i = 0; i < list.length; i++) try {
			push(this, this.mapper(list[i]));
		} catch (error) {
			return cb(error);
		}
		this.overflow = this[kLast].length > this.maxLength;
		if (this.overflow && !this.skipOverflow) {
			cb(/* @__PURE__ */ new Error("maximum buffer reached"));
			return;
		}
		cb();
	}
	function flush(cb) {
		this[kLast] += this[kDecoder].end();
		if (this[kLast]) try {
			push(this, this.mapper(this[kLast]));
		} catch (error) {
			return cb(error);
		}
		cb();
	}
	function push(self, val) {
		if (val !== void 0) self.push(val);
	}
	function noop(incoming) {
		return incoming;
	}
	function split(matcher, mapper, options) {
		matcher = matcher || /\r?\n/;
		mapper = mapper || noop;
		options = options || {};
		switch (arguments.length) {
			case 1:
				if (typeof matcher === "function") {
					mapper = matcher;
					matcher = /\r?\n/;
				} else if (typeof matcher === "object" && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
					options = matcher;
					matcher = /\r?\n/;
				}
				break;
			case 2: if (typeof matcher === "function") {
				options = mapper;
				mapper = matcher;
				matcher = /\r?\n/;
			} else if (typeof mapper === "object") {
				options = mapper;
				mapper = noop;
			}
		}
		options = Object.assign({}, options);
		options.autoDestroy = true;
		options.transform = transform;
		options.flush = flush;
		options.readableObjectMode = true;
		const stream = new Transform(options);
		stream[kLast] = "";
		stream[kDecoder] = new StringDecoder("utf8");
		stream.matcher = matcher;
		stream.mapper = mapper;
		stream.maxLength = options.maxLength;
		stream.skipOverflow = options.skipOverflow || false;
		stream.overflow = false;
		stream._destroy = function(err, cb) {
			this._writableState.errorEmitted = false;
			cb(err);
		};
		return stream;
	}
	module.exports = split;
}));
// node_modules/pgpass/lib/helper.js
var require_helper = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path = __require("path");
	var Stream = __require("stream").Stream;
	var split = require_split2();
	var util = __require("util");
	var defaultPort = 5432;
	var isWin = process.platform === "win32";
	var warnStream = process.stderr;
	var S_IRWXG = 56;
	var S_IRWXO = 7;
	var S_IFMT = 61440;
	var S_IFREG = 32768;
	function isRegFile(mode) {
		return (mode & S_IFMT) == S_IFREG;
	}
	var fieldNames = [
		"host",
		"port",
		"database",
		"user",
		"password"
	];
	var nrOfFields = fieldNames.length;
	var passKey = fieldNames[nrOfFields - 1];
	function warn() {
		if (warnStream instanceof Stream && true === warnStream.writable) {
			var args = Array.prototype.slice.call(arguments).concat("\n");
			warnStream.write(util.format.apply(util, args));
		}
	}
	Object.defineProperty(module.exports, "isWin", {
		get: function() {
			return isWin;
		},
		set: function(val) {
			isWin = val;
		}
	});
	module.exports.warnTo = function(stream) {
		var old = warnStream;
		warnStream = stream;
		return old;
	};
	module.exports.getFileName = function(rawEnv) {
		var env = rawEnv || process.env;
		return env.PGPASSFILE || (isWin ? path.join(env.APPDATA || "./", "postgresql", "pgpass.conf") : path.join(env.HOME || "./", ".pgpass"));
	};
	module.exports.usePgPass = function(stats, fname) {
		if (Object.prototype.hasOwnProperty.call(process.env, "PGPASSWORD")) return false;
		if (isWin) return true;
		fname = fname || "<unkn>";
		if (!isRegFile(stats.mode)) {
			warn("WARNING: password file \"%s\" is not a plain file", fname);
			return false;
		}
		if (stats.mode & (S_IRWXG | S_IRWXO)) {
			warn("WARNING: password file \"%s\" has group or world access; permissions should be u=rw (0600) or less", fname);
			return false;
		}
		return true;
	};
	var matcher = module.exports.match = function(connInfo, entry) {
		return fieldNames.slice(0, -1).reduce(function(prev, field, idx) {
			if (idx == 1) {
				if (Number(connInfo[field] || defaultPort) === Number(entry[field])) return prev && true;
			}
			return prev && (entry[field] === "*" || entry[field] === connInfo[field]);
		}, true);
	};
	module.exports.getPassword = function(connInfo, stream, cb) {
		var pass;
		var lineStream = stream.pipe(split());
		function onLine(line) {
			var entry = parseLine(line);
			if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
				pass = entry[passKey];
				lineStream.end();
			}
		}
		var onEnd = function() {
			stream.destroy();
			cb(pass);
		};
		var onErr = function(err) {
			stream.destroy();
			warn("WARNING: error on reading file: %s", err);
			cb(void 0);
		};
		stream.on("error", onErr);
		lineStream.on("data", onLine).on("end", onEnd).on("error", onErr);
	};
	var parseLine = module.exports.parseLine = function(line) {
		if (line.length < 11 || line.match(/^\s+#/)) return null;
		var curChar = "";
		var prevChar = "";
		var fieldIdx = 0;
		var startIdx = 0;
		var obj = {};
		var isLastField = false;
		var addToObj = function(idx, i0, i1) {
			var field = line.substring(i0, i1);
			if (!Object.hasOwnProperty.call(process.env, "PGPASS_NO_DEESCAPE")) field = field.replace(/\\([:\\])/g, "$1");
			obj[fieldNames[idx]] = field;
		};
		for (var i = 0; i < line.length - 1; i += 1) {
			curChar = line.charAt(i + 1);
			prevChar = line.charAt(i);
			isLastField = fieldIdx == nrOfFields - 1;
			if (isLastField) {
				addToObj(fieldIdx, startIdx);
				break;
			}
			if (i >= 0 && curChar == ":" && prevChar !== "\\") {
				addToObj(fieldIdx, startIdx, i + 1);
				startIdx = i + 2;
				fieldIdx += 1;
			}
		}
		obj = Object.keys(obj).length === nrOfFields ? obj : null;
		return obj;
	};
	var isValidEntry = module.exports.isValidEntry = function(entry) {
		var rules = {
			0: function(x) {
				return x.length > 0;
			},
			1: function(x) {
				if (x === "*") return true;
				x = Number(x);
				return isFinite(x) && x > 0 && x < 9007199254740992 && Math.floor(x) === x;
			},
			2: function(x) {
				return x.length > 0;
			},
			3: function(x) {
				return x.length > 0;
			},
			4: function(x) {
				return x.length > 0;
			}
		};
		for (var idx = 0; idx < fieldNames.length; idx += 1) {
			var rule = rules[idx];
			if (!rule(entry[fieldNames[idx]] || "")) return false;
		}
		return true;
	};
}));
// node_modules/pgpass/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	__require("path");
	var fs = __require("fs");
	var helper = require_helper();
	module.exports = function(connInfo, cb) {
		var file = helper.getFileName();
		fs.stat(file, function(err, stat) {
			if (err || !helper.usePgPass(stat, file)) return cb(void 0);
			var st = fs.createReadStream(file);
			helper.getPassword(connInfo, st, cb);
		});
	};
	module.exports.warnTo = helper.warnTo;
}));
// node_modules/pg/lib/client.js
var require_client$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = __require("events").EventEmitter;
	var utils = require_utils$1();
	var nodeUtils = __require("util");
	var sasl = require_sasl();
	var TypeOverrides = require_type_overrides();
	var ConnectionParameters = require_connection_parameters();
	var Query = require_query$1();
	var defaults = require_defaults();
	var Connection = require_connection();
	var crypto = require_utils();
	var activeQueryDeprecationNotice = nodeUtils.deprecate(() => {}, "Client.activeQuery is deprecated and will be removed in pg@9.0");
	var queryQueueDeprecationNotice = nodeUtils.deprecate(() => {}, "Client.queryQueue is deprecated and will be removed in pg@9.0.");
	var pgPassDeprecationNotice = nodeUtils.deprecate(() => {}, "pgpass support is deprecated and will be removed in pg@9.0. You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code.");
	var byoPromiseDeprecationNotice = nodeUtils.deprecate(() => {}, "Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0.");
	var queryQueueLengthDeprecationNotice = nodeUtils.deprecate(() => {}, "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");
	function coerceNumberOrDefault(value, defaultValue) {
		if (typeof value === "number") return Number.isFinite(value) ? value : defaultValue;
		if (typeof value === "string" && value.trim() !== "") {
			const n = Number(value);
			return Number.isFinite(n) ? n : defaultValue;
		}
		return defaultValue;
	}
	var Client = class extends EventEmitter {
		constructor(config) {
			super();
			this.connectionParameters = new ConnectionParameters(config);
			this.user = this.connectionParameters.user;
			this.database = this.connectionParameters.database;
			this.port = this.connectionParameters.port;
			this.host = this.connectionParameters.host;
			Object.defineProperty(this, "password", {
				configurable: true,
				enumerable: false,
				writable: true,
				value: this.connectionParameters.password
			});
			this.replication = this.connectionParameters.replication;
			const c = config || {};
			if (c.Promise) byoPromiseDeprecationNotice();
			this._Promise = c.Promise || global.Promise;
			this._types = new TypeOverrides(c.types);
			this._ending = false;
			this._ended = false;
			this._connecting = false;
			this._connected = false;
			this._connectionError = false;
			this._queryable = true;
			this._activeQuery = null;
			this._txStatus = null;
			this.enableChannelBinding = Boolean(c.enableChannelBinding);
			this.scramMaxIterations = coerceNumberOrDefault(c.scramMaxIterations, sasl.DEFAULT_MAX_SCRAM_ITERATIONS);
			this.connection = c.connection || new Connection({
				stream: c.stream,
				ssl: this.connectionParameters.ssl,
				sslNegotiation: this.connectionParameters.sslnegotiation,
				keepAlive: c.keepAlive || false,
				keepAliveInitialDelayMillis: c.keepAliveInitialDelayMillis || 0,
				encoding: this.connectionParameters.client_encoding || "utf8"
			});
			this._queryQueue = [];
			this._sentQueryQueue = [];
			this.pipeline = Boolean(c.pipeline);
			this.binary = c.binary || defaults.binary;
			this.processID = null;
			this.secretKey = null;
			this.ssl = this.connectionParameters.ssl || false;
			this.sslNegotiation = this.connectionParameters.sslnegotiation || "postgres";
			if (this.ssl && this.ssl.key) Object.defineProperty(this.ssl, "key", { enumerable: false });
			this._connectionTimeoutMillis = c.connectionTimeoutMillis || 0;
		}
		get activeQuery() {
			activeQueryDeprecationNotice();
			return this._activeQuery;
		}
		set activeQuery(val) {
			activeQueryDeprecationNotice();
			this._activeQuery = val;
		}
		_getActiveQuery() {
			return this._activeQuery;
		}
		_errorAllQueries(err) {
			const enqueueError = (query) => {
				process.nextTick(() => {
					query.handleError(err, this.connection);
				});
			};
			const activeQuery = this._getActiveQuery();
			if (activeQuery) {
				enqueueError(activeQuery);
				this._activeQuery = null;
			}
			this._sentQueryQueue.forEach(enqueueError);
			this._sentQueryQueue.length = 0;
			this._queryQueue.forEach(enqueueError);
			this._queryQueue.length = 0;
		}
		_connect(callback) {
			const self = this;
			const con = this.connection;
			this._connectionCallback = callback;
			if (this._connecting || this._connected) {
				const err = /* @__PURE__ */ new Error("Client has already been connected. You cannot reuse a client.");
				process.nextTick(() => {
					callback(err);
				});
				return;
			}
			this._connecting = true;
			if (this._connectionTimeoutMillis > 0) {
				this.connectionTimeoutHandle = setTimeout(() => {
					con._ending = true;
					con.stream.destroy(/* @__PURE__ */ new Error("timeout expired"));
				}, this._connectionTimeoutMillis);
				if (this.connectionTimeoutHandle.unref) this.connectionTimeoutHandle.unref();
			}
			if (this.host && this.host.indexOf("/") === 0) con.connect(this.host + "/.s.PGSQL." + this.port);
			else con.connect(this.port, this.host);
			con.on("connect", function() {
				if (self.ssl) {
					if (self.sslNegotiation !== "direct") con.requestSsl();
				} else con.startup(self.getStartupConf());
			});
			con.on("sslconnect", function() {
				con.startup(self.getStartupConf());
			});
			this._attachListeners(con);
			con.once("end", () => {
				const error = this._ending ? /* @__PURE__ */ new Error("Connection terminated") : /* @__PURE__ */ new Error("Connection terminated unexpectedly");
				clearTimeout(this.connectionTimeoutHandle);
				this._errorAllQueries(error);
				this._ended = true;
				if (!this._ending) {
					if (this._connecting && !this._connectionError) {
						if (this._connectionCallback) this._connectionCallback(error);
						else this._handleErrorEvent(error);
					} else if (!this._connectionError) this._handleErrorEvent(error);
				}
				process.nextTick(() => {
					this.emit("end");
				});
			});
		}
		connect(callback) {
			if (callback) {
				this._connect(callback);
				return;
			}
			return new this._Promise((resolve, reject) => {
				this._connect((error) => {
					if (error) reject(error);
					else resolve(this);
				});
			});
		}
		_attachListeners(con) {
			con.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this));
			con.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this));
			con.on("authenticationSASL", this._handleAuthSASL.bind(this));
			con.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this));
			con.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this));
			con.on("backendKeyData", this._handleBackendKeyData.bind(this));
			con.on("error", this._handleErrorEvent.bind(this));
			con.on("errorMessage", this._handleErrorMessage.bind(this));
			con.on("readyForQuery", this._handleReadyForQuery.bind(this));
			con.on("notice", this._handleNotice.bind(this));
			con.on("rowDescription", this._handleRowDescription.bind(this));
			con.on("dataRow", this._handleDataRow.bind(this));
			con.on("portalSuspended", this._handlePortalSuspended.bind(this));
			con.on("emptyQuery", this._handleEmptyQuery.bind(this));
			con.on("commandComplete", this._handleCommandComplete.bind(this));
			con.on("parseComplete", this._handleParseComplete.bind(this));
			con.on("copyInResponse", this._handleCopyInResponse.bind(this));
			con.on("copyData", this._handleCopyData.bind(this));
			con.on("notification", this._handleNotification.bind(this));
		}
		_getPassword(cb) {
			const con = this.connection;
			if (typeof this.password === "function") this._Promise.resolve().then(() => this.password(this.connectionParameters)).then((pass) => {
				if (pass !== void 0) {
					if (typeof pass !== "string") {
						con.emit("error", /* @__PURE__ */ new TypeError("Password must be a string"));
						return;
					}
					this.connectionParameters.password = this.password = pass;
				} else this.connectionParameters.password = this.password = null;
				cb();
			}).catch((err) => {
				con.emit("error", err);
			});
			else if (this.password !== null) cb();
			else try {
				require_lib$1()(this.connectionParameters, (pass) => {
					if (void 0 !== pass) {
						pgPassDeprecationNotice();
						this.connectionParameters.password = this.password = pass;
					}
					cb();
				});
			} catch (e) {
				this.emit("error", e);
			}
		}
		_handleAuthCleartextPassword(msg) {
			this._getPassword(() => {
				this.connection.password(this.password);
			});
		}
		_handleAuthMD5Password(msg) {
			this._getPassword(async () => {
				try {
					const hashedPassword = await crypto.postgresMd5PasswordHash(this.user, this.password, msg.salt);
					this.connection.password(hashedPassword);
				} catch (e) {
					this.emit("error", e);
				}
			});
		}
		_handleAuthSASL(msg) {
			this._getPassword(() => {
				try {
					this.saslSession = sasl.startSession(msg.mechanisms, this.enableChannelBinding && this.connection.stream, this.scramMaxIterations);
					this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
				} catch (err) {
					this.connection.emit("error", err);
				}
			});
		}
		async _handleAuthSASLContinue(msg) {
			try {
				await sasl.continueSession(this.saslSession, this.password, msg.data, this.enableChannelBinding && this.connection.stream);
				this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
			} catch (err) {
				this.connection.emit("error", err);
			}
		}
		_handleAuthSASLFinal(msg) {
			try {
				sasl.finalizeSession(this.saslSession, msg.data);
				this.saslSession = null;
			} catch (err) {
				this.connection.emit("error", err);
			}
		}
		_handleBackendKeyData(msg) {
			this.processID = msg.processID;
			this.secretKey = msg.secretKey;
		}
		_handleReadyForQuery(msg) {
			if (this._connecting) {
				this._connecting = false;
				this._connected = true;
				clearTimeout(this.connectionTimeoutHandle);
				if (this._connectionCallback) {
					this._connectionCallback(null, this);
					this._connectionCallback = null;
				}
				this.emit("connect");
			}
			const activeQuery = this._getActiveQuery();
			this._activeQuery = null;
			this._txStatus = msg?.status ?? null;
			this.readyForQuery = true;
			if (activeQuery) activeQuery.handleReadyForQuery(this.connection);
			this._pulseQueryQueue();
		}
		_handleErrorWhileConnecting(err) {
			if (this._connectionError) return;
			this._connectionError = true;
			clearTimeout(this.connectionTimeoutHandle);
			if (this._connectionCallback) return this._connectionCallback(err);
			this.emit("error", err);
		}
		_handleErrorEvent(err) {
			if (this._connecting) return this._handleErrorWhileConnecting(err);
			this._queryable = false;
			this._errorAllQueries(err);
			this.emit("error", err);
		}
		_handleErrorMessage(msg) {
			if (this._connecting) return this._handleErrorWhileConnecting(msg);
			const activeQuery = this._getActiveQuery();
			if (!activeQuery) {
				this._handleErrorEvent(msg);
				return;
			}
			this._activeQuery = null;
			if (activeQuery.name) delete this.connection.submittedNamedStatements[activeQuery.name];
			activeQuery.handleError(msg, this.connection);
		}
		_handleRowDescription(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected rowDescription message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleRowDescription(msg);
		}
		_handleDataRow(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected dataRow message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleDataRow(msg);
		}
		_handlePortalSuspended(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected portalSuspended message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handlePortalSuspended(this.connection);
		}
		_handleEmptyQuery(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected emptyQuery message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleEmptyQuery(this.connection);
		}
		_handleCommandComplete(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected commandComplete message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleCommandComplete(msg, this.connection);
		}
		_handleParseComplete() {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected parseComplete message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			if (activeQuery.name) {
				this.connection.parsedStatements[activeQuery.name] = activeQuery.text;
				delete this.connection.submittedNamedStatements[activeQuery.name];
			}
		}
		_handleCopyInResponse(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected copyInResponse message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleCopyInResponse(this.connection);
		}
		_handleCopyData(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected copyData message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleCopyData(msg, this.connection);
		}
		_handleNotification(msg) {
			this.emit("notification", msg);
		}
		_handleNotice(msg) {
			this.emit("notice", msg);
		}
		getStartupConf() {
			const params = this.connectionParameters;
			const data = {
				user: params.user,
				database: params.database
			};
			const appName = params.application_name || params.fallback_application_name;
			if (appName) data.application_name = appName;
			if (params.replication) data.replication = "" + params.replication;
			if (params.statement_timeout) data.statement_timeout = String(parseInt(params.statement_timeout, 10));
			if (params.lock_timeout) data.lock_timeout = String(parseInt(params.lock_timeout, 10));
			if (params.idle_in_transaction_session_timeout) data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10));
			if (params.options) data.options = params.options;
			return data;
		}
		cancel(client, query) {
			if (client.activeQuery === query) {
				const con = this.connection;
				if (this.host && this.host.indexOf("/") === 0) con.connect(this.host + "/.s.PGSQL." + this.port);
				else con.connect(this.port, this.host);
				con.on("connect", function() {
					con.cancel(client.processID, client.secretKey);
				});
			} else if (client._queryQueue.indexOf(query) !== -1) client._queryQueue.splice(client._queryQueue.indexOf(query), 1);
			else if (client._sentQueryQueue.indexOf(query) !== -1) query.callback = () => {};
		}
		setTypeParser(oid, format, parseFn) {
			return this._types.setTypeParser(oid, format, parseFn);
		}
		getTypeParser(oid, format) {
			return this._types.getTypeParser(oid, format);
		}
		escapeIdentifier(str) {
			return utils.escapeIdentifier(str);
		}
		escapeLiteral(str) {
			return utils.escapeLiteral(str);
		}
		_pulseQueryQueue() {
			if (this.pipeline) {
				this._pulsePipelinedQueryQueue();
				return;
			}
			if (this.readyForQuery === true) {
				this._activeQuery = this._queryQueue.shift();
				const activeQuery = this._getActiveQuery();
				if (activeQuery) {
					this.readyForQuery = false;
					this.hasExecuted = true;
					const queryError = activeQuery.submit(this.connection);
					if (queryError) process.nextTick(() => {
						activeQuery.handleError(queryError, this.connection);
						this.readyForQuery = true;
						this._pulseQueryQueue();
					});
				} else if (this.hasExecuted) {
					this._activeQuery = null;
					this.emit("drain");
				}
			}
		}
		_pulsePipelinedQueryQueue() {
			if (!this._connected || !this._queryable) return;
			while (this._queryQueue.length > 0) {
				const query = this._queryQueue.shift();
				this.hasExecuted = true;
				const queryError = query.submit(this.connection);
				if (queryError) {
					process.nextTick(() => {
						query.handleError(queryError, this.connection);
					});
					continue;
				}
				this._sentQueryQueue.push(query);
			}
			if (this.readyForQuery && !this._activeQuery && this._sentQueryQueue.length > 0) {
				this._activeQuery = this._sentQueryQueue.shift();
				this.readyForQuery = false;
			}
			if (!this._activeQuery && this._sentQueryQueue.length === 0 && this._queryQueue.length === 0 && this.hasExecuted) this.emit("drain");
		}
		query(config, values, callback) {
			let query;
			let result;
			if (config == null) throw new TypeError("Client was passed a null or undefined query");
			if (typeof config.submit === "function") {
				result = query = config;
				if (!query.callback) {
					if (typeof values === "function") query.callback = values;
					else if (callback) query.callback = callback;
				}
			} else {
				query = new Query(config, values, callback);
				if (!query.callback) result = new this._Promise((resolve, reject) => {
					query.callback = (err, res) => err ? reject(err) : resolve(res);
				}).catch((err) => {
					Error.captureStackTrace(err);
					throw err;
				});
				else if (typeof query.callback !== "function") throw new TypeError("callback is not a function");
			}
			const readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
			if (readTimeout) {
				const queryCallback = query.callback || (() => {});
				const readTimeoutTimer = setTimeout(() => {
					const error = /* @__PURE__ */ new Error("Query read timeout");
					process.nextTick(() => {
						query.handleError(error, this.connection);
					});
					queryCallback(error);
					query.callback = () => {};
					const index = this._queryQueue.indexOf(query);
					if (index > -1) this._queryQueue.splice(index, 1);
					else if (this.pipeline) {
						this.connection.stream.destroy();
						return;
					}
					this._pulseQueryQueue();
				}, readTimeout);
				query.callback = (err, res) => {
					clearTimeout(readTimeoutTimer);
					queryCallback(err, res);
				};
			}
			if (this.binary && !query.binary) query.binary = true;
			if (query._result && !query._result._types) query._result._types = this._types;
			if (this.pipeline) {
				const portalQuery = typeof config.submit === "function" && !(query instanceof Query) ? "Custom query classes such as pg-cursor and pg-query-stream are" : query.rows ? "The `rows` option is" : null;
				if (portalQuery) {
					process.nextTick(() => {
						query.handleError(/* @__PURE__ */ new Error(`${portalQuery} not supported in pipeline mode`), this.connection);
					});
					return result;
				}
			}
			if (!this._queryable) {
				process.nextTick(() => {
					query.handleError(/* @__PURE__ */ new Error("Client has encountered a connection error and is not queryable"), this.connection);
				});
				return result;
			}
			if (this._ending) {
				process.nextTick(() => {
					query.handleError(/* @__PURE__ */ new Error("Client was closed and is not queryable"), this.connection);
				});
				return result;
			}
			if (this._queryQueue.length > 0 && !this.pipeline) queryQueueLengthDeprecationNotice();
			this._queryQueue.push(query);
			this._pulseQueryQueue();
			return result;
		}
		ref() {
			this.connection.ref();
		}
		unref() {
			this.connection.unref();
		}
		getTransactionStatus() {
			return this._txStatus;
		}
		end(cb) {
			this._ending = true;
			if (!this.connection._connecting || this._ended) {
				if (cb) {
					cb();
					return;
				} else return this._Promise.resolve();
			}
			if (!this._queryable) this.connection.stream.destroy();
			else if (this.pipeline && (this._getActiveQuery() || this._sentQueryQueue.length > 0 || this._queryQueue.length > 0)) this.once("drain", () => this.connection.end());
			else if (this._getActiveQuery()) this.connection.stream.destroy();
			else this.connection.end();
			if (cb) this.connection.once("end", cb);
			else return new this._Promise((resolve) => {
				this.connection.once("end", resolve);
			});
		}
		get queryQueue() {
			queryQueueDeprecationNotice();
			return this._queryQueue;
		}
	};
	Client.Query = Query;
	module.exports = Client;
}));
// node_modules/pg-pool/index.js
var require_pg_pool = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = __require("events").EventEmitter;
	var NOOP = function() {};
	var removeWhere = (list, predicate) => {
		const i = list.findIndex(predicate);
		return i === -1 ? void 0 : list.splice(i, 1)[0];
	};
	var IdleItem = class {
		constructor(client, idleListener, timeoutId) {
			this.client = client;
			this.idleListener = idleListener;
			this.timeoutId = timeoutId;
		}
	};
	var PendingItem = class {
		constructor(callback) {
			this.callback = callback;
		}
	};
	function throwOnDoubleRelease() {
		throw new Error("Release called on client which has already been released to the pool.");
	}
	function promisify(Promise, callback) {
		if (callback) return {
			callback,
			result: void 0
		};
		let rej;
		let res;
		const cb = function(err, client) {
			err ? rej(err) : res(client);
		};
		return {
			callback: cb,
			result: new Promise(function(resolve, reject) {
				res = resolve;
				rej = reject;
			}).catch((err) => {
				Error.captureStackTrace(err);
				throw err;
			})
		};
	}
	function makeIdleListener(pool, client) {
		return function idleListener(err) {
			err.client = client;
			client.removeListener("error", idleListener);
			client.on("error", () => {
				pool.log("additional client error after disconnection due to error", err);
			});
			pool._remove(client);
			pool.emit("error", err, client);
		};
	}
	var Pool = class extends EventEmitter {
		constructor(options, Client) {
			super();
			this.options = Object.assign({}, options);
			if (options != null && "password" in options) Object.defineProperty(this.options, "password", {
				configurable: true,
				enumerable: false,
				writable: true,
				value: options.password
			});
			if (options != null && options.ssl && options.ssl.key) Object.defineProperty(this.options.ssl, "key", { enumerable: false });
			this.options.max = this.options.max || this.options.poolSize || 10;
			this.options.min = this.options.min || 0;
			this.options.maxUses = this.options.maxUses || Infinity;
			this.options.allowExitOnIdle = this.options.allowExitOnIdle || false;
			this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0;
			this.log = this.options.log || function() {};
			this.Client = this.options.Client || Client || require_lib().Client;
			this.Promise = this.options.Promise || global.Promise;
			if (typeof this.options.idleTimeoutMillis === "undefined") this.options.idleTimeoutMillis = 1e4;
			this._clients = [];
			this._idle = [];
			this._expired = /* @__PURE__ */ new WeakSet();
			this._pendingQueue = [];
			this._endCallback = void 0;
			this.ending = false;
			this.ended = false;
		}
		_promiseTry(f) {
			const Promise = this.Promise;
			if (typeof Promise.try === "function") return Promise.try(f);
			return new Promise((resolve) => resolve(f()));
		}
		_isFull() {
			return this._clients.length >= this.options.max;
		}
		_isAboveMin() {
			return this._clients.length > this.options.min;
		}
		_pulseQueue() {
			this.log("pulse queue");
			if (this.ended) {
				this.log("pulse queue ended");
				return;
			}
			if (this.ending) {
				this.log("pulse queue on ending");
				if (this._idle.length) this._idle.slice().map((item) => {
					this._remove(item.client);
				});
				if (!this._clients.length) {
					this.ended = true;
					this._endCallback();
				}
				return;
			}
			if (!this._pendingQueue.length) {
				this.log("no queued requests");
				return;
			}
			if (!this._idle.length && this._isFull()) return;
			const pendingItem = this._pendingQueue.shift();
			if (this._idle.length) {
				const idleItem = this._idle.pop();
				clearTimeout(idleItem.timeoutId);
				const client = idleItem.client;
				client.ref && client.ref();
				const idleListener = idleItem.idleListener;
				return this._acquireClient(client, pendingItem, idleListener, false);
			}
			if (!this._isFull()) return this.newClient(pendingItem);
			throw new Error("unexpected condition");
		}
		_remove(client, callback) {
			const removed = removeWhere(this._idle, (item) => item.client === client);
			if (removed !== void 0) clearTimeout(removed.timeoutId);
			this._clients = this._clients.filter((c) => c !== client);
			const context = this;
			client.end(() => {
				context.emit("remove", client);
				if (typeof callback === "function") callback();
			});
		}
		connect(cb) {
			if (this.ending) {
				const err = /* @__PURE__ */ new Error("Cannot use a pool after calling end on the pool");
				return cb ? cb(err) : this.Promise.reject(err);
			}
			const response = promisify(this.Promise, cb);
			const result = response.result;
			if (this._isFull() || this._idle.length) {
				if (this._idle.length) process.nextTick(() => this._pulseQueue());
				if (!this.options.connectionTimeoutMillis) {
					this._pendingQueue.push(new PendingItem(response.callback));
					return result;
				}
				const queueCallback = (err, res, done) => {
					clearTimeout(tid);
					response.callback(err, res, done);
				};
				const pendingItem = new PendingItem(queueCallback);
				const tid = setTimeout(() => {
					removeWhere(this._pendingQueue, (i) => i.callback === queueCallback);
					pendingItem.timedOut = true;
					response.callback(/* @__PURE__ */ new Error("timeout exceeded when trying to connect"));
				}, this.options.connectionTimeoutMillis);
				if (tid.unref) tid.unref();
				this._pendingQueue.push(pendingItem);
				return result;
			}
			this.newClient(new PendingItem(response.callback));
			return result;
		}
		newClient(pendingItem) {
			const client = new this.Client(this.options);
			this._clients.push(client);
			const idleListener = makeIdleListener(this, client);
			this.log("checking client timeout");
			let tid;
			let timeoutHit = false;
			if (this.options.connectionTimeoutMillis) tid = setTimeout(() => {
				if (client.connection) {
					this.log("ending client due to timeout");
					timeoutHit = true;
					client.connection.stream.destroy();
				} else if (!client.isConnected()) {
					this.log("ending client due to timeout");
					timeoutHit = true;
					client.end();
				}
			}, this.options.connectionTimeoutMillis);
			this.log("connecting new client");
			client.connect((err) => {
				if (tid) clearTimeout(tid);
				client.on("error", idleListener);
				if (err) {
					this.log("client failed to connect", err);
					this._clients = this._clients.filter((c) => c !== client);
					if (timeoutHit) err = new Error("Connection terminated due to connection timeout", { cause: err });
					this._pulseQueue();
					if (!pendingItem.timedOut) pendingItem.callback(err, void 0, NOOP);
				} else {
					this.log("new client connected");
					if (this.options.onConnect) {
						this._promiseTry(() => this.options.onConnect(client)).then(() => {
							this._afterConnect(client, pendingItem, idleListener);
						}, (hookErr) => {
							this._clients = this._clients.filter((c) => c !== client);
							client.end(() => {
								this._pulseQueue();
								if (!pendingItem.timedOut) pendingItem.callback(hookErr, void 0, NOOP);
							});
						});
						return;
					}
					return this._afterConnect(client, pendingItem, idleListener);
				}
			});
		}
		_afterConnect(client, pendingItem, idleListener) {
			if (this.options.maxLifetimeSeconds !== 0) {
				const maxLifetimeTimeout = setTimeout(() => {
					this.log("ending client due to expired lifetime");
					this._expired.add(client);
					if (this._idle.findIndex((idleItem) => idleItem.client === client) !== -1) this._acquireClient(client, new PendingItem((err, client, clientRelease) => clientRelease()), idleListener, false);
				}, this.options.maxLifetimeSeconds * 1e3);
				maxLifetimeTimeout.unref();
				client.once("end", () => clearTimeout(maxLifetimeTimeout));
			}
			return this._acquireClient(client, pendingItem, idleListener, true);
		}
		_acquireClient(client, pendingItem, idleListener, isNew) {
			if (isNew) this.emit("connect", client);
			this.emit("acquire", client);
			client.release = this._releaseOnce(client, idleListener);
			client.removeListener("error", idleListener);
			if (!pendingItem.timedOut) {
				if (isNew && this.options.verify) this.options.verify(client, (err) => {
					if (err) {
						client.release(err);
						return pendingItem.callback(err, void 0, NOOP);
					}
					pendingItem.callback(void 0, client, client.release);
				});
				else pendingItem.callback(void 0, client, client.release);
			} else if (isNew && this.options.verify) this.options.verify(client, client.release);
			else client.release();
		}
		_releaseOnce(client, idleListener) {
			let released = false;
			return (err) => {
				if (released) throwOnDoubleRelease();
				released = true;
				this._release(client, idleListener, err);
			};
		}
		_release(client, idleListener, err) {
			client.on("error", idleListener);
			client._poolUseCount = (client._poolUseCount || 0) + 1;
			this.emit("release", err, client);
			if (err || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
				if (client._poolUseCount >= this.options.maxUses) this.log("remove expended client");
				return this._remove(client, this._pulseQueue.bind(this));
			}
			if (this._expired.has(client)) {
				this.log("remove expired client");
				this._expired.delete(client);
				return this._remove(client, this._pulseQueue.bind(this));
			}
			let tid;
			if (this.options.idleTimeoutMillis && this._isAboveMin()) {
				tid = setTimeout(() => {
					if (this._isAboveMin()) {
						this.log("remove idle client");
						this._remove(client, this._pulseQueue.bind(this));
					}
				}, this.options.idleTimeoutMillis);
				if (this.options.allowExitOnIdle) tid.unref();
			}
			if (this.options.allowExitOnIdle) client.unref();
			this._idle.push(new IdleItem(client, idleListener, tid));
			this._pulseQueue();
		}
		query(text, values, cb) {
			if (typeof text === "function") {
				const response = promisify(this.Promise, text);
				setImmediate(function() {
					return response.callback(/* @__PURE__ */ new Error("Passing a function as the first parameter to pool.query is not supported"));
				});
				return response.result;
			}
			if (typeof values === "function") {
				cb = values;
				values = void 0;
			}
			const response = promisify(this.Promise, cb);
			cb = response.callback;
			this.connect((err, client) => {
				if (err) return cb(err);
				let clientReleased = false;
				const onError = (err) => {
					if (clientReleased) return;
					clientReleased = true;
					client.release(err);
					cb(err);
				};
				client.once("error", onError);
				this.log("dispatching query");
				try {
					client.query(text, values, (err, res) => {
						this.log("query dispatched");
						client.removeListener("error", onError);
						if (clientReleased) return;
						clientReleased = true;
						client.release(err);
						if (err) return cb(err);
						return cb(void 0, res);
					});
				} catch (err) {
					client.release(err);
					return cb(err);
				}
			});
			return response.result;
		}
		end(cb) {
			this.log("ending");
			if (this.ending) {
				const err = /* @__PURE__ */ new Error("Called end on pool more than once");
				return cb ? cb(err) : this.Promise.reject(err);
			}
			this.ending = true;
			const promised = promisify(this.Promise, cb);
			this._endCallback = promised.callback;
			this._pulseQueue();
			return promised.result;
		}
		get waitingCount() {
			return this._pendingQueue.length;
		}
		get idleCount() {
			return this._idle.length;
		}
		get expiredCount() {
			return this._clients.reduce((acc, client) => acc + (this._expired.has(client) ? 1 : 0), 0);
		}
		get totalCount() {
			return this._clients.length;
		}
	};
	module.exports = Pool;
}));
// node_modules/pg/lib/native/query.js
var require_query = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = __require("events").EventEmitter;
	var util = __require("util");
	var utils = require_utils$1();
	var NativeQuery = module.exports = function(config, values, callback) {
		EventEmitter.call(this);
		config = utils.normalizeQueryConfig(config, values, callback);
		this.text = config.text;
		this.values = config.values;
		this.name = config.name;
		this.queryMode = config.queryMode;
		this.callback = config.callback;
		this.state = "new";
		this._arrayMode = config.rowMode === "array";
		this._emitRowEvents = false;
		this.on("newListener", function(event) {
			if (event === "row") this._emitRowEvents = true;
		}.bind(this));
	};
	util.inherits(NativeQuery, EventEmitter);
	var errorFieldMap = {
		sqlState: "code",
		statementPosition: "position",
		messagePrimary: "message",
		messageDetail: "detail",
		messageHint: "hint",
		context: "where",
		schemaName: "schema",
		tableName: "table",
		columnName: "column",
		dataTypeName: "dataType",
		constraintName: "constraint",
		sourceFile: "file",
		sourceLine: "line",
		sourceFunction: "routine"
	};
	NativeQuery.prototype.handleError = function(err) {
		const fields = this.native && this.native.pq.resultErrorFields();
		if (fields) for (const key in fields) {
			const normalizedFieldName = errorFieldMap[key] || key;
			err[normalizedFieldName] = fields[key];
		}
		if (this.callback) this.callback(err);
		else this.emit("error", err);
		this.state = "error";
	};
	NativeQuery.prototype.then = function(onSuccess, onFailure) {
		return this._getPromise().then(onSuccess, onFailure);
	};
	NativeQuery.prototype.catch = function(callback) {
		return this._getPromise().catch(callback);
	};
	NativeQuery.prototype._getPromise = function() {
		if (this._promise) return this._promise;
		this._promise = new Promise(function(resolve, reject) {
			this._once("end", resolve);
			this._once("error", reject);
		}.bind(this));
		return this._promise;
	};
	NativeQuery.prototype.submit = function(client) {
		this.state = "running";
		const self = this;
		this.native = client.native;
		client.native.arrayMode = this._arrayMode;
		let after = function(err, rows, results) {
			client.native.arrayMode = false;
			setImmediate(function() {
				self.emit("_done");
			});
			if (err) return self.handleError(err);
			if (self._emitRowEvents) {
				if (results.length > 1) rows.forEach((rowOfRows, i) => {
					rowOfRows.forEach((row) => {
						self.emit("row", row, results[i]);
					});
				});
				else rows.forEach(function(row) {
					self.emit("row", row, results);
				});
			}
			self.state = "end";
			self.emit("end", results);
			if (self.callback) self.callback(null, results);
		};
		if (process.domain) after = process.domain.bind(after);
		if (this.name) {
			if (this.name.length > 63) {
				console.error("Warning! Postgres only supports 63 characters for query names.");
				console.error("You supplied %s (%s)", this.name, this.name.length);
				console.error("This can cause conflicts and silent errors executing queries");
			}
			const values = (this.values || []).map(utils.prepareValue);
			if (client.namedQueries[this.name] !== void 0) {
				if (this.text && client.namedQueries[this.name] !== this.text) {
					const err = /* @__PURE__ */ new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
					return after(err);
				}
				return client.native.execute(this.name, values, after);
			}
			return client.native.prepare(this.name, this.text, values.length, function(err) {
				if (err) return after(err);
				client.namedQueries[self.name] = self.text;
				return self.native.execute(self.name, values, after);
			});
		} else if (this.values) {
			if (!Array.isArray(this.values)) return after(/* @__PURE__ */ new Error("Query values must be an array"));
			const vals = this.values.map(utils.prepareValue);
			client.native.query(this.text, vals, after);
		} else if (this.queryMode === "extended") client.native.query(this.text, [], after);
		else client.native.query(this.text, after);
	};
}));
// node_modules/pg/lib/native/client.js
var require_client = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nodeUtils = __require("util");
	var Native;
	try {
		Native = __require("pg-native");
	} catch (e) {
		throw e;
	}
	var TypeOverrides = require_type_overrides();
	var EventEmitter = __require("events").EventEmitter;
	var util = __require("util");
	var ConnectionParameters = require_connection_parameters();
	var NativeQuery = require_query();
	var queryQueueLengthDeprecationNotice = nodeUtils.deprecate(() => {}, "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");
	var Client = module.exports = function(config) {
		EventEmitter.call(this);
		config = config || {};
		this._Promise = config.Promise || global.Promise;
		this._types = new TypeOverrides(config.types);
		this.native = new Native({ types: this._types });
		this._queryQueue = [];
		this._ending = false;
		this._connecting = false;
		this._connected = false;
		this._queryable = true;
		this.pipeline = Boolean(config.pipeline);
		this._pipelineInFlight = false;
		const cp = this.connectionParameters = new ConnectionParameters(config);
		if (config.nativeConnectionString) cp.nativeConnectionString = config.nativeConnectionString;
		this.user = cp.user;
		Object.defineProperty(this, "password", {
			configurable: true,
			enumerable: false,
			writable: true,
			value: cp.password
		});
		this.database = cp.database;
		this.host = cp.host;
		this.port = cp.port;
		this.namedQueries = {};
	};
	Client.Query = NativeQuery;
	util.inherits(Client, EventEmitter);
	Client.prototype._errorAllQueries = function(err) {
		const enqueueError = (query) => {
			process.nextTick(() => {
				query.native = this.native;
				query.handleError(err);
			});
		};
		if (this._hasActiveQuery()) {
			enqueueError(this._activeQuery);
			this._activeQuery = null;
		}
		this._queryQueue.forEach(enqueueError);
		this._queryQueue.length = 0;
	};
	Client.prototype._connect = function(cb) {
		const self = this;
		if (this._connecting) {
			process.nextTick(() => cb(/* @__PURE__ */ new Error("Client has already been connected. You cannot reuse a client.")));
			return;
		}
		this._connecting = true;
		this.connectionParameters.getLibpqConnectionString(function(err, conString) {
			if (self.connectionParameters.nativeConnectionString) conString = self.connectionParameters.nativeConnectionString;
			if (err) return cb(err);
			self.native.connect(conString, function(err) {
				if (err) {
					self.native.end();
					return cb(err);
				}
				self._connected = true;
				self.native.on("error", function(err) {
					self._queryable = false;
					self._errorAllQueries(err);
					self.emit("error", err);
				});
				self.native.on("notification", function(msg) {
					self.emit("notification", {
						channel: msg.relname,
						payload: msg.extra
					});
				});
				self.emit("connect");
				self._pulseQueryQueue(true);
				cb(null, this);
			});
		});
	};
	Client.prototype.connect = function(callback) {
		if (callback) {
			this._connect(callback);
			return;
		}
		return new this._Promise((resolve, reject) => {
			this._connect((error) => {
				if (error) reject(error);
				else resolve(this);
			});
		});
	};
	Client.prototype.query = function(config, values, callback) {
		let query;
		let result;
		let readTimeout;
		let readTimeoutTimer;
		let queryCallback;
		if (config === null || config === void 0) throw new TypeError("Client was passed a null or undefined query");
		else if (typeof config.submit === "function") {
			readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
			result = query = config;
			if (typeof values === "function") config.callback = values;
		} else {
			readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
			query = new NativeQuery(config, values, callback);
			if (!query.callback) {
				let resolveOut, rejectOut;
				result = new this._Promise((resolve, reject) => {
					resolveOut = resolve;
					rejectOut = reject;
				}).catch((err) => {
					Error.captureStackTrace(err);
					throw err;
				});
				query.callback = (err, res) => err ? rejectOut(err) : resolveOut(res);
			}
		}
		if (readTimeout) {
			queryCallback = query.callback || (() => {});
			readTimeoutTimer = setTimeout(() => {
				const error = /* @__PURE__ */ new Error("Query read timeout");
				process.nextTick(() => {
					query.handleError(error, this.connection);
				});
				queryCallback(error);
				query.callback = () => {};
				const index = this._queryQueue.indexOf(query);
				if (index > -1) this._queryQueue.splice(index, 1);
				this._pulseQueryQueue();
			}, readTimeout);
			query.callback = (err, res) => {
				clearTimeout(readTimeoutTimer);
				queryCallback(err, res);
			};
		}
		if (!this._queryable) {
			query.native = this.native;
			process.nextTick(() => {
				query.handleError(/* @__PURE__ */ new Error("Client has encountered a connection error and is not queryable"));
			});
			return result;
		}
		if (this._ending) {
			query.native = this.native;
			process.nextTick(() => {
				query.handleError(/* @__PURE__ */ new Error("Client was closed and is not queryable"));
			});
			return result;
		}
		if (this._queryQueue.length > 0 && !this.pipeline) queryQueueLengthDeprecationNotice();
		this._queryQueue.push(query);
		this._pulseQueryQueue();
		return result;
	};
	Client.prototype.end = function(cb) {
		const self = this;
		this._ending = true;
		if (this._connecting && !this._connected) this.once("connect", () => {
			this.end(() => {});
		});
		let result;
		if (!cb) result = new this._Promise(function(resolve, reject) {
			cb = (err) => err ? reject(err) : resolve();
		});
		const doEnd = function() {
			self.native.end(function() {
				self._connected = false;
				self._errorAllQueries(/* @__PURE__ */ new Error("Connection terminated"));
				process.nextTick(() => {
					self.emit("end");
					if (cb) cb();
				});
			});
		};
		if (this.pipeline && (this._pipelineInFlight || this._queryQueue.length > 0)) this.once("drain", doEnd);
		else doEnd();
		return result;
	};
	Client.prototype._hasActiveQuery = function() {
		return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
	};
	Client.prototype._pulseQueryQueue = function(initialConnection) {
		if (!this._connected) return;
		if (this.pipeline && !initialConnection) return this._pulsePipelinedQueryQueue();
		if (this._hasActiveQuery()) return;
		const query = this._queryQueue.shift();
		if (!query) {
			if (!initialConnection) this.emit("drain");
			return;
		}
		this._activeQuery = query;
		query.submit(this);
		const self = this;
		query.once("_done", function() {
			self._pulseQueryQueue();
		});
	};
	Client.prototype._pulsePipelinedQueryQueue = function() {
		if (!this._connected || this._pipelineInFlight) return;
		if (this._queryQueue.length === 0) {
			if (this.hasExecuted) this.emit("drain");
			return;
		}
		this._pipelineInFlight = true;
		const self = this;
		const queries = [];
		const nativeQueries = [];
		const utils = require_utils$1();
		while (this._queryQueue.length > 0) {
			const query = this._queryQueue.shift();
			this.hasExecuted = true;
			nativeQueries.push(query);
			const values = query.values ? query.values.map(utils.prepareValue) : null;
			const pipelineEntry = {
				text: query.text,
				name: query.name,
				arrayMode: query._arrayMode
			};
			if (values) pipelineEntry.values = values;
			if (query.name && this.namedQueries[query.name]) pipelineEntry._alreadyPrepared = true;
			queries.push(pipelineEntry);
		}
		this.native.pipeline(queries, function(err, results) {
			self._pipelineInFlight = false;
			if (err) {
				self._connected = false;
				self._queryable = false;
				for (let i = 0; i < nativeQueries.length; i++) {
					const q = nativeQueries[i];
					q.native = self.native;
					q.handleError(err);
				}
				self._errorAllQueries(err);
				self.emit("error", err);
				self.emit("end");
				return;
			}
			for (let i = 0; i < nativeQueries.length; i++) {
				const q = nativeQueries[i];
				const r = results[i];
				q.native = self.native;
				if (r.err) q.handleError(r.err);
				else {
					if (q.name) self.namedQueries[q.name] = q.text;
					q.state = "end";
					q.emit("end", r.result);
					if (q.callback) q.callback(null, r.result);
				}
				setImmediate(function() {
					q.emit("_done");
				});
			}
			self._pulsePipelinedQueryQueue();
		});
	};
	Client.prototype.cancel = function(query) {
		if (this._activeQuery === query) this.native.cancel(function() {});
		else if (this._queryQueue.indexOf(query) !== -1) this._queryQueue.splice(this._queryQueue.indexOf(query), 1);
	};
	Client.prototype.ref = function() {};
	Client.prototype.unref = function() {};
	Client.prototype.setTypeParser = function(oid, format, parseFn) {
		return this._types.setTypeParser(oid, format, parseFn);
	};
	Client.prototype.getTypeParser = function(oid, format) {
		return this._types.getTypeParser(oid, format);
	};
	Client.prototype.isConnected = function() {
		return this._connected;
	};
	Client.prototype.getTransactionStatus = function() {
		return this.native.getTransactionStatus();
	};
}));
// node_modules/pg/lib/native/index.js
var require_native = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_client();
}));
// node_modules/pg/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Client = require_client$1();
	var defaults = require_defaults();
	var Connection = require_connection();
	var Result = require_result();
	var utils = require_utils$1();
	var Pool = require_pg_pool();
	var TypeOverrides = require_type_overrides();
	var { DatabaseError } = require_dist();
	var { escapeIdentifier, escapeLiteral } = require_utils$1();
	var poolFactory = (Client) => {
		return class BoundPool extends Pool {
			constructor(options) {
				super(options, Client);
			}
		};
	};
	var PG = function(clientConstructor) {
		this.defaults = defaults;
		this.Client = clientConstructor;
		this.Query = this.Client.Query;
		this.Pool = poolFactory(this.Client);
		this._pools = [];
		this.Connection = Connection;
		this.types = require_pg_types();
		this.DatabaseError = DatabaseError;
		this.TypeOverrides = TypeOverrides;
		this.escapeIdentifier = escapeIdentifier;
		this.escapeLiteral = escapeLiteral;
		this.Result = Result;
		this.utils = utils;
	};
	var clientConstructor = Client;
	var forceNative = false;
	try {
		forceNative = !!process.env.NODE_PG_FORCE_NATIVE;
	} catch {}
	if (forceNative) clientConstructor = require_native();
	module.exports = new PG(clientConstructor);
	Object.defineProperty(module.exports, "native", {
		configurable: true,
		enumerable: false,
		get() {
			let native = null;
			try {
				native = new PG(require_native());
			} catch (err) {
				if (err.code !== "MODULE_NOT_FOUND") throw err;
			}
			Object.defineProperty(module.exports, "native", { value: native });
			return native;
		}
	});
}));
// node_modules/pg/esm/index.mjs
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
import_lib.default.Client;
import_lib.default.Pool;
import_lib.default.Connection;
import_lib.default.types;
import_lib.default.Query;
import_lib.default.DatabaseError;
import_lib.default.escapeIdentifier;
import_lib.default.escapeLiteral;
import_lib.default.Result;
import_lib.default.TypeOverrides;
import_lib.default.defaults;
var esm_default = import_lib.default;
// skills/selectr-schema/src/connection.ts
var SCHEME = "postgres(?:ql)?:\\/\\/";
var USERINFO_RE = new RegExp(`(${SCHEME})(?:(?:(?!${SCHEME})[^@\\n])*@)+`, "gi");
var PASSWORD_RE = /(password\s*=\s*)(?:'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?|[^&\s]*)/gi;
/**
* Strip secrets from text that may echo a connection URL: the userinfo of every
* postgres:// or postgresql:// URL, and any `password=` value.
*/
function redact(text) {
	return text.replace(USERINFO_RE, "$1***@").replace(PASSWORD_RE, "$1***");
}
var errorMessage = (e) => e instanceof Error ? e.message : String(e);
/** Quote a Postgres identifier. Identifiers come from the catalogue or the validated base only. */
function quoteIdent(name) {
	return `"${name.replaceAll("\"", "\"\"")}"`;
}
/** The connection URL from `--url-file` (first non-empty line), else SELECTR_SCHEMA_PG_URL. */
function resolveUrl(opts) {
	if (opts.urlFile) {
		let text;
		try {
			text = readFileSync(opts.urlFile, "utf8");
		} catch (e) {
			throw new Error(redact(`Could not read ${opts.urlFile}: ${errorMessage(e)}`));
		}
		const line = text.split(/\r?\n/).map((l) => l.trim()).find((l) => l !== "");
		if (!line) throw new Error(`${opts.urlFile} is empty: expected a connection URL on its first line`);
		return line;
	}
	const fromEnv = process.env.SELECTR_SCHEMA_PG_URL?.trim();
	if (fromEnv) return fromEnv;
	throw new Error("No database connection: set SELECTR_SCHEMA_PG_URL or pass --url-file <path>");
}
/**
* Open a read-only, time-limited session. Every failure is rethrown with a
* redacted message so the URL's credentials never reach stderr.
*/
async function connect(url, opts) {
	const timeoutMs = Math.trunc(opts.timeoutMs);
	let client;
	try {
		client = new esm_default.Client({
			connectionString: url,
			application_name: "selectr-schema",
			options: `-c default_transaction_read_only=on -c statement_timeout=${timeoutMs}`,
			connectionTimeoutMillis: timeoutMs,
			query_timeout: timeoutMs + 5e3,
			keepAlive: true
		});
		client.on("error", () => {});
		await client.connect();
		const { rows } = await client.query("SELECT current_setting('default_transaction_read_only') AS read_only, (SELECT setting FROM pg_settings WHERE name = 'statement_timeout') AS timeout_ms");
		if (rows[0]?.read_only !== "on") throw new Error("Refusing to continue: the session is not read-only");
		if (Number(rows[0]?.timeout_ms) !== timeoutMs) throw new Error(`Refusing to continue: statement_timeout is ${rows[0]?.timeout_ms}ms, expected ${timeoutMs}ms`);
		return client;
	} catch (e) {
		await client?.end().catch(() => {});
		throw new Error(redact(errorMessage(e)));
	}
}
// skills/selectr-schema/src/files.ts
/** The parsed JSON in `path`. Throws what readFileSync or JSON.parse throws. */
var parseJsonFile = (path) => JSON.parse(readFileSync(path, "utf8"));
/** The parsed JSON in `path`. Throws `Could not read <path>: ...` when it cannot be read or parsed. */
function readJson(path) {
	try {
		return parseJsonFile(path);
	} catch (e) {
		throw new Error(`Could not read ${path}: ${errorMessage(e)}`);
	}
}
var isObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
/** Write `value` as 2-space JSON with a trailing newline, creating the parent directory. */
function writeJson(path, value) {
	mkdirSync(dirname(resolve(path)), { recursive: true });
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
/** One problem as every command prints it. */
var formatProblem = (p) => `${p.level} ${p.where}: ${p.message}`;
/** An input file a command cannot use, with the exit code that says why: 1 for findings, 2 for unusable input. */
var InputFileError = class extends Error {
	exitCode;
	constructor(message, exitCode) {
		super(message);
		this.exitCode = exitCode;
	}
};
/** The exit code for a failure reading inputs: an InputFileError's own, else 2. */
var exitCodeFor = (e) => e instanceof InputFileError ? e.exitCode : 2;
/** The introspection file at `path`. Throws when it is unreadable or not one. */
function readIntrospection(path) {
	const json = readJson(path);
	if (!isObject(json) || json.format !== "selectr-introspection" || json.version !== 1 || !Array.isArray(json.tables) || !Array.isArray(json.foreignKeys)) throw new Error(`${path}: not a selectr-introspection file (run introspect first)`);
	return json;
}
/**
* The validated base at `path`. A base that does not validate is a finding the
* user must fix (InputFileError, exit 1, with every problem); an unreadable or
* unsupported file cannot be used at all (exit 2).
*/
function readBase(path) {
	const json = readJson(path);
	try {
		return validateBase(json).base;
	} catch (e) {
		if (e instanceof SchemaValidationError) throw new InputFileError(`${path} does not validate:\n${e.problems.map(formatProblem).join("\n")}`, 1);
		if (e instanceof UnsupportedSchemaError) throw new InputFileError(`${path}: not a Selectr schema v2 file`, 2);
		throw e;
	}
}
// skills/selectr-schema/src/command.ts
var DEFAULT_TIMEOUT_MS = 15e3;
/** The `--timeout-ms` value (default 15000). Throws when it is not a positive integer. */
function parseTimeoutMs(raw) {
	if (raw === void 0) return DEFAULT_TIMEOUT_MS;
	const ms = Number(raw);
	if (!Number.isInteger(ms) || ms <= 0) throw new Error(`--timeout-ms must be a positive integer, got "${raw}"`);
	return ms;
}
// skills/selectr-schema/src/introspect.ts
var TABLES_SQL = `
  WITH RECURSIVE tbl AS (
    SELECT c.oid, c.relname, c.relkind
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = $1 AND c.relkind IN ('r', 'p') AND NOT c.relispartition
  ), rels AS (
    SELECT t.oid AS root, t.oid, t.relkind, c.reltuples
    FROM tbl t JOIN pg_class c ON c.oid = t.oid
    UNION ALL
    SELECT p.root, ch.oid, ch.relkind, ch.reltuples
    FROM rels p
    JOIN pg_inherits inh ON inh.inhparent = p.oid
    JOIN pg_class ch ON ch.oid = inh.inhrelid
    WHERE p.relkind = 'p'
  ), est AS (
    -- A partitioned parent has no rows of its own and is never analyzed: sum its leaves.
    -- A table never analyzed reports -1: unknown, so it is left out of the sum, and a
    -- table (or a parent with leaves) none of which was analyzed has no estimate (NULL).
    -- A parent without leaves can hold no rows: 0.
    SELECT root,
           CASE WHEN count(*) FILTER (WHERE relkind <> 'p') = 0 THEN 0
                ELSE SUM(reltuples) FILTER (WHERE relkind <> 'p' AND reltuples >= 0)
           END::bigint AS rows
    FROM rels GROUP BY root
  )
  SELECT t.relname::text AS name,
         t.relkind = 'p' AS partitioned,
         est.rows::text AS estimated_rows,
         obj_description(t.oid, 'pg_class') AS comment,
         CASE WHEN t.relkind = 'p' THEN pg_get_partkeydef(t.oid) END AS partition_key
  FROM tbl t JOIN est ON est.root = t.oid
  ORDER BY t.relname COLLATE "C"`;
var COLUMNS_SQL = `
  SELECT c.relname::text AS table_name,
         a.attname::text AS name,
         format_type(a.atttypid, a.atttypmod) AS data_type,
         -- A domain reports its base type, as information_schema does; the domain name is kept apart.
         bt.typname::text AS udt_name,
         CASE WHEN t.typtype = 'd' THEN t.typname::text END AS domain,
         NOT a.attnotnull AS nullable,
         col_description(c.oid, a.attnum) AS comment,
         -- Enum labels for an enum column or an array of enums, in the enum's sort order.
         (SELECT array_agg(e.enumlabel::text ORDER BY e.enumsortorder)
          FROM pg_enum e WHERE e.enumtypid = et.oid) AS enum_values
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
  JOIN pg_type t ON t.oid = a.atttypid
  -- Follow a chain of domains down to the first non-domain type.
  CROSS JOIN LATERAL (
    WITH RECURSIVE chain AS (
      SELECT t.oid, t.typtype, t.typbasetype, t.typname, t.typcategory, t.typelem
      UNION ALL
      SELECT p.oid, p.typtype, p.typbasetype, p.typname, p.typcategory, p.typelem
      FROM chain JOIN pg_type p ON p.oid = chain.typbasetype
      WHERE chain.typtype = 'd'
    )
    SELECT * FROM chain WHERE typtype <> 'd'
  ) bt
  LEFT JOIN pg_type et ON et.typtype = 'e' AND et.oid = CASE WHEN bt.typcategory = 'A' THEN bt.typelem ELSE bt.oid END
  WHERE n.nspname = $1 AND c.relkind IN ('r', 'p') AND NOT c.relispartition
  ORDER BY c.relname COLLATE "C", a.attnum`;
var CONSTRAINT_COLUMNS_SQL = `
  SELECT cls.relname::text AS table_name, con.conname::text AS name,
         array_agg(att.attname::text ORDER BY k.ord) AS columns
  FROM pg_constraint con
  JOIN pg_class cls ON cls.oid = con.conrelid
  JOIN pg_namespace ns ON ns.oid = cls.relnamespace
  CROSS JOIN LATERAL unnest(con.conkey) WITH ORDINALITY AS k(attnum, ord)
  JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = k.attnum
  WHERE con.contype = $2::"char" AND ns.nspname = $1 AND NOT cls.relispartition
  GROUP BY con.oid, cls.relname, con.conname
  ORDER BY cls.relname COLLATE "C", con.conname COLLATE "C"`;
var FOREIGN_KEYS_SQL = `
  SELECT c.conname::text AS name,
         sc.relname::text AS source_table,
         tcl.relname::text AS target_table,
         tcl.relnamespace <> n.oid AS cross_schema,
         array_agg(sa.attname::text ORDER BY k.pos) AS source_columns,
         array_agg(ta.attname::text ORDER BY k.pos) AS target_columns
  FROM pg_constraint c
  JOIN pg_class sc ON sc.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = sc.relnamespace
  JOIN pg_class tcl ON tcl.oid = c.confrelid
  -- Pair source and target columns by position in the constraint.
  CROSS JOIN LATERAL unnest(c.conkey, c.confkey) WITH ORDINALITY AS k(src_attnum, tgt_attnum, pos)
  JOIN pg_attribute sa ON sa.attrelid = c.conrelid AND sa.attnum = k.src_attnum
  JOIN pg_attribute ta ON ta.attrelid = c.confrelid AND ta.attnum = k.tgt_attnum
  -- Partitions carry clones of their parent's constraints; report the parents only.
  -- Targets in another schema are flagged: they cannot be relations of this model.
  WHERE c.contype = 'f' AND n.nspname = $1
    AND NOT sc.relispartition AND NOT tcl.relispartition
  GROUP BY c.oid, c.conname, sc.relname, tcl.relname, tcl.relnamespace, n.oid
  ORDER BY sc.relname COLLATE "C", c.conname COLLATE "C"`;
var INDEXES_SQL = `
  SELECT t.relname::text AS table_name, i.relname::text AS name,
         -- Key columns only (indnkeyatts excludes INCLUDE columns). An expression slot has
         -- attnum 0: report its expression text, which pg_get_indexdef gives per position.
         (SELECT array_agg(CASE WHEN x.attnum = 0 THEN pg_get_indexdef(ix.indexrelid, x.pos::int, true) ELSE a.attname::text END ORDER BY x.pos)
          FROM unnest(ix.indkey) WITH ORDINALITY AS x(attnum, pos)
          LEFT JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = x.attnum
          WHERE x.pos <= ix.indnkeyatts) AS columns,
         ix.indisunique AS unique,
         ix.indpred IS NOT NULL AS partial,
         pg_get_expr(ix.indpred, ix.indrelid) AS predicate
  FROM pg_index ix
  JOIN pg_class t ON t.oid = ix.indrelid
  JOIN pg_class i ON i.oid = ix.indexrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = $1 AND t.relkind IN ('r', 'p') AND NOT t.relispartition
  ORDER BY t.relname COLLATE "C", i.relname COLLATE "C"`;
var CHECKS_SQL = `
  SELECT cls.relname::text AS table_name, con.conname::text AS name,
         pg_get_constraintdef(con.oid) AS definition
  FROM pg_constraint con
  JOIN pg_class cls ON cls.oid = con.conrelid
  JOIN pg_namespace ns ON ns.oid = cls.relnamespace
  WHERE con.contype = 'c' AND ns.nspname = $1 AND NOT cls.relispartition
  ORDER BY cls.relname COLLATE "C", con.conname COLLATE "C"`;
/**
* Read the catalogue of one schema. Never touches row data. All queries run in
* one repeatable-read transaction so they describe the same snapshot.
*/
async function introspect(client, dbSchema) {
	const q = async (sql, params = [dbSchema]) => (await client.query(sql, params)).rows;
	await client.query("BEGIN READ ONLY ISOLATION LEVEL REPEATABLE READ");
	let rows;
	try {
		rows = {
			meta: (await q("SELECT current_database()::text AS database, current_setting('server_version') AS server_version", []))[0],
			tables: await q(TABLES_SQL),
			columns: await q(COLUMNS_SQL),
			pks: await q(CONSTRAINT_COLUMNS_SQL, [dbSchema, "p"]),
			uniques: await q(CONSTRAINT_COLUMNS_SQL, [dbSchema, "u"]),
			fks: await q(FOREIGN_KEYS_SQL),
			indexes: await q(INDEXES_SQL),
			checks: await q(CHECKS_SQL)
		};
		await client.query("COMMIT");
	} catch (e) {
		await client.query("ROLLBACK").catch(() => {});
		throw e;
	}
	const { meta, tables, columns, pks, uniques, fks, indexes, checks } = rows;
	const primaryKeys = {};
	for (const r of pks) primaryKeys[r.table_name] = r.columns;
	const inSchemaFks = fks.filter((r) => !r.cross_schema);
	return {
		format: "selectr-introspection",
		version: 1,
		database: meta.database,
		serverVersion: meta.server_version,
		dbSchema,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		tables: tables.map((r) => ({
			name: r.name,
			partitioned: r.partitioned,
			estimatedRows: r.estimated_rows === null ? null : Number(r.estimated_rows),
			comment: r.comment,
			partitionKey: r.partition_key
		})),
		columns: columns.map((r) => ({
			table: r.table_name,
			name: r.name,
			dataType: r.data_type,
			udtName: r.udt_name,
			nullable: r.nullable,
			comment: r.comment,
			enumValues: r.enum_values,
			domain: r.domain
		})),
		primaryKeys,
		uniqueConstraints: uniques.map((r) => ({
			table: r.table_name,
			name: r.name,
			columns: r.columns
		})),
		foreignKeys: inSchemaFks.map((r) => ({
			name: r.name,
			sourceTable: r.source_table,
			sourceColumns: r.source_columns,
			targetTable: r.target_table,
			targetColumns: r.target_columns
		})),
		indexes: indexes.map((r) => ({
			table: r.table_name,
			name: r.name,
			columns: r.columns,
			unique: r.unique,
			partial: r.partial,
			predicate: r.predicate
		})),
		checks: checks.map((r) => ({
			table: r.table_name,
			name: r.name,
			definition: r.definition
		})),
		skippedForeignKeys: fks.length - inSchemaFks.length
	};
}
/** The generator's input: the app's snake_case introspection types, one FK row per column pair. */
function toGenerateInput(intro, name) {
	const tables = intro.tables.map((t) => ({
		table_name: t.name,
		table_schema: intro.dbSchema,
		estimated_row_count: t.estimatedRows ?? 0
	}));
	const columns = intro.columns.map((c) => ({
		table_name: c.table,
		column_name: c.name,
		data_type: c.dataType,
		udt_name: c.udtName
	}));
	const foreignKeys = intro.foreignKeys.flatMap((fk) => fk.sourceColumns.map((source, i) => ({
		constraint_name: fk.name,
		source_table: fk.sourceTable,
		source_column: source,
		target_table: fk.targetTable,
		target_column: fk.targetColumns[i]
	})));
	return {
		name,
		tables,
		columns,
		primaryKeys: intro.primaryKeys,
		foreignKeys
	};
}
var USAGE$4 = "introspect --out <path> [--schema <name>] [--url-file <path>] [--timeout-ms <n>]   Read a schema's catalogue (read-only) into a JSON file";
var introspectCommand = {
	usage: USAGE$4,
	async run(args) {
		let parsed;
		try {
			parsed = parseArgs({
				args,
				options: {
					schema: {
						type: "string",
						default: "public"
					},
					out: { type: "string" },
					"url-file": { type: "string" },
					"timeout-ms": { type: "string" }
				}
			});
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		const { schema, out } = parsed.values;
		if (!out) {
			console.error(`Usage: ${USAGE$4}`);
			return 2;
		}
		let timeoutMs;
		try {
			timeoutMs = parseTimeoutMs(parsed.values["timeout-ms"]);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		let client;
		try {
			client = await connect(resolveUrl({ urlFile: parsed.values["url-file"] }), { timeoutMs });
			const intro = await introspect(client, schema);
			writeJson(out, intro);
			if (intro.tables.length === 0) console.error(redact(`Warning: no tables found in schema "${schema}"`));
			if (intro.skippedForeignKeys > 0) console.error(`skipped ${intro.skippedForeignKeys} foreign keys to other schemas`);
			console.error(`${intro.tables.length} tables, ${intro.foreignKeys.length} foreign keys`);
			return 0;
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		} finally {
			await client?.end().catch(() => {});
		}
	}
};
// skills/selectr-schema/src/draft.ts
var GENERATOR = {
	name: "selectr-schema-skill",
	version: "1.0.0"
};
/**
* The generator's base plus what the catalogue knows beyond it: nullability,
* comments as descriptions, enum labels as allowed values, and the schema name.
*/
function draftBase(intro, opts) {
	const base = generateBase(toGenerateInput(intro, opts.name), opts.now);
	for (const c of intro.columns) {
		const def = base.entities[c.table]?.columns[c.name];
		if (!def) continue;
		def.nullable = c.nullable;
		if (c.comment) def.description = c.comment;
		if (c.enumValues && c.enumValues.length > 0) {
			def.allowedValues = [...c.enumValues];
			def.allowedValuesOpen = false;
		}
	}
	for (const t of intro.tables) {
		const entity = base.entities[t.name];
		if (!entity) continue;
		if (t.comment) entity.description = t.comment;
		if (intro.dbSchema !== "public") entity.dbSchema = intro.dbSchema;
	}
	base.generator = { ...GENERATOR };
	base.sources = [{
		kind: "introspection",
		ref: intro.database
	}];
	return base;
}
/** The plain column names of a `partitionKey` such as `LIST (shop_id, "Region")`; expressions are not columns and are left out. */
function partitionKeyColumns(partitionKey) {
	const open = partitionKey.indexOf("(");
	const close = partitionKey.lastIndexOf(")");
	if (open < 0 || close < open) return [];
	const items = [];
	let depth = 0;
	let quoted = false;
	let item = "";
	for (const ch of partitionKey.slice(open + 1, close)) {
		if (ch === "\"") quoted = !quoted;
		if (!quoted && ch === "(") depth++;
		if (!quoted && ch === ")") depth--;
		if (!quoted && depth === 0 && ch === ",") {
			items.push(item);
			item = "";
		} else item += ch;
	}
	items.push(item);
	return items.flatMap((raw) => {
		const slot = KEY_SLOT_RE.exec(raw.trim());
		if (!slot) return [];
		return [slot[2] !== void 0 ? slot[2].replaceAll("\"\"", "\"") : slot[1]];
	});
}
var IDENT = "(?:[A-Za-z_][A-Za-z0-9_$]*|\"(?:[^\"]|\"\")*\")";
var QUALIFIED = `${IDENT}(?:\\.${IDENT})?`;
var KEY_SLOT_RE = new RegExp(`^(?:([A-Za-z_][A-Za-z0-9_$]*)|"((?:[^"]|"")*)")(?:\\s+COLLATE\\s+${QUALIFIED})?(?:\\s+${QUALIFIED})?$`, "i");
/**
* The type a scope column must have to be the tenancy: that of the scope entity's
* single primary-key column when there is one, else the most common type of the
* column across tables (a tie goes to the type met first, and `tie` lists the
* tied types). `source` says which.
*/
function scopeType(base, column, scopeEntity) {
	const tenant = scopeEntity !== void 0 ? base.entities[scopeEntity] : void 0;
	if (tenant && tenant.primaryKey.length === 1 && Object.hasOwn(tenant.columns, tenant.primaryKey[0])) return {
		type: tenant.columns[tenant.primaryKey[0]].type,
		source: `${scopeEntity}.${tenant.primaryKey[0]}`
	};
	const counts = /* @__PURE__ */ new Map();
	for (const entity of Object.values(base.entities)) {
		if (!Object.hasOwn(entity.columns, column)) continue;
		const type = canonicalType(entity.columns[column].type);
		counts.set(type, (counts.get(type) ?? 0) + 1);
	}
	let best = "";
	for (const [type, n] of counts) if (n > (counts.get(best) ?? 0)) best = type;
	const tie = [...counts].filter(([, n]) => n === counts.get(best)).map(([type]) => type);
	return {
		type: best,
		source: `the most common type of ${column}`,
		...tie.length > 1 && { tie }
	};
}
/**
* Declare the model's scope on a drafted base, with relation ids recomputed
* under it. `scoped: true` goes on every entity (the scope entity itself
* excepted) whose scope column is NOT NULL and has the scope's type (see
* scopeType; numeric widths count as one type); each other entity carrying the
* column is listed in `notScoped` with the reason. A relation whose new id repeats
* an earlier one is dropped and described in `dropped`. A tie for the scope's type
* is described in `notes`. Throws when the scope names nothing.
*/
function withScope(base, scope, intro, dropped = [], notScoped = [], notes = []) {
	const { column } = scope;
	const result = structuredClone(base);
	if (!Object.values(result.entities).some((e) => Object.hasOwn(e.columns, column))) throw new Error(`no table has the column "${column}"`);
	if (scope.entity !== void 0 && !Object.hasOwn(result.entities, scope.entity)) throw new Error(`unknown scope entity "${scope.entity}"`);
	const partitioned = intro.tables.some((t) => t.partitionKey !== null && partitionKeyColumns(t.partitionKey).includes(column));
	result.scope = {
		label: scope.label,
		column,
		...scope.entity !== void 0 && { entity: scope.entity },
		...partitioned && { partitioned: true }
	};
	const expected = scopeType(result, column, scope.entity);
	if (expected.tie) notes.push(`scope type tie: ${expected.tie.join(", ")}; chose ${expected.type}`);
	for (const [key, entity] of Object.entries(result.entities)) {
		if (key === scope.entity || !Object.hasOwn(entity.columns, column)) continue;
		const def = entity.columns[column];
		if (def.nullable) notScoped.push({
			entity: key,
			reason: `${column} is nullable`
		});
		else if (!compatibleTypes(def.type, expected.type)) notScoped.push({
			entity: key,
			reason: `${column} is ${def.type}, but the scope's type is ${expected.type} (${expected.source})`
		});
		else entity.scoped = true;
	}
	const ids = idScope(result);
	const seen = /* @__PURE__ */ new Set();
	result.relations = [];
	for (const r of base.relations) {
		const id = relationId(r, ids);
		if (seen.has(id)) {
			dropped.push(`relation ${id}: duplicate after scope change`);
			continue;
		}
		seen.add(id);
		result.relations.push({
			...structuredClone(r),
			id
		});
	}
	return result;
}
/** Why a previous base's scope cannot be declared on `base` any more, or null when it can. */
function scopeMisfit(base, scope) {
	if (scope.entity !== void 0 && !Object.hasOwn(base.entities, scope.entity)) return `entity "${scope.entity}" no longer exists`;
	if (!Object.values(base.entities).some((e) => Object.hasOwn(e.columns, scope.column))) return `column "${scope.column}" is on no table any more`;
	return null;
}
var unknownColumns = (entity, columns) => columns.filter((c) => !Object.hasOwn(entity.columns, c));
var describeMissing = (columns) => columns.map((c) => `unknown column "${c}"`).join(", ");
/** Carry the column-level curation of one entity into the draft's entity. */
function carryColumns(target, previous, key, dropped) {
	for (const [name, prev] of Object.entries(previous.columns)) {
		const def = Object.hasOwn(target.columns, name) ? target.columns[name] : void 0;
		const curated = prev.description !== void 0 || prev.allowedValues !== void 0 || prev.allowedValuesOpen !== void 0 || prev.sensitive !== void 0;
		if (!def) {
			if (curated) dropped.push(`column ${key}.${name}: column no longer exists`);
			continue;
		}
		if (prev.description !== void 0) def.description = prev.description;
		if (prev.sensitive !== void 0) def.sensitive = prev.sensitive;
		if (prev.allowedValues !== void 0) {
			def.allowedValues = [...prev.allowedValues];
			if (prev.allowedValuesOpen !== void 0) def.allowedValuesOpen = prev.allowedValuesOpen;
			else delete def.allowedValuesOpen;
		} else if (prev.allowedValuesOpen !== void 0) def.allowedValuesOpen = prev.allowedValuesOpen;
	}
}
/**
* Each previous field wins when everything it names still exists; what names a
* vanished column is dropped on its own and the draft's own value stays.
*/
function carryEntity(target, previous, key, scopeColumn, dropped) {
	const drop = (field, why) => dropped.push(`entity ${key}.${field}: ${why}`);
	if (previous.label !== void 0) target.label = previous.label;
	if (previous.description !== void 0) target.description = previous.description;
	if (previous.kind !== void 0) target.kind = previous.kind;
	if (previous.scoped !== void 0) {
		if (previous.scoped && (!scopeColumn || !Object.hasOwn(target.columns, scopeColumn))) drop("scoped", scopeColumn ? `scope column "${scopeColumn}" is not on this table` : "the schema no longer has a scope");
		else target.scoped = previous.scoped;
	}
	for (const field of ["titleColumns", "searchColumns"]) {
		const list = previous[field];
		if (!list) continue;
		const missing = unknownColumns(target, list);
		if (missing.length > 0) drop(field, describeMissing(missing));
		else target[field] = [...list];
	}
	if (previous.defaultSort) {
		const missing = unknownColumns(target, [previous.defaultSort.column]);
		if (missing.length > 0) drop("defaultSort", describeMissing(missing));
		else target.defaultSort = { ...previous.defaultSort };
	}
	if (previous.timeline) {
		const missing = unknownColumns(target, [previous.timeline.timestampColumn, ...previous.timeline.summaryColumns]);
		if (missing.length > 0) drop("timeline", describeMissing(missing));
		else target.timeline = {
			timestampColumn: previous.timeline.timestampColumn,
			summaryColumns: [...previous.timeline.summaryColumns]
		};
	}
	if (previous.lookupKeys) {
		const kept = [];
		for (const k of previous.lookupKeys) if (Object.hasOwn(target.columns, k.column)) kept.push({ ...k });
		else drop("lookupKeys", describeMissing([k.column]));
		if (kept.length > 0) target.lookupKeys = kept;
	}
	if (previous.computedFields) {
		const kept = [];
		for (const f of previous.computedFields) if (Object.hasOwn(target.columns, f.source)) kept.push({
			...f,
			path: [...f.path]
		});
		else drop("computedFields", `${f.name}: ${describeMissing([f.source])}`);
		if (kept.length > 0) target.computedFields = kept;
	}
	carryColumns(target, previous, key, dropped);
}
/**
* Lay a previous base's curation over a freshly generated draft. Facts (tables,
* columns, keys) always come from the draft; what people wrote wins where it
* still fits. What no longer fits is dropped and reported, so the result is
* always valid.
*/
function carryForward(draft, previous) {
	const base = structuredClone(draft);
	const dropped = [];
	if (previous.description !== void 0) base.description = previous.description;
	if (previous.scope && !base.scope) {
		const misfit = scopeMisfit(base, previous.scope);
		if (misfit !== null) dropped.push(`scope: ${misfit}`);
		else base.scope = { ...previous.scope };
	}
	for (const [key, prev] of Object.entries(previous.entities)) {
		const target = Object.hasOwn(base.entities, key) ? base.entities[key] : void 0;
		if (!target) dropped.push(`entity ${key}: table no longer exists`);
		else carryEntity(target, prev, key, base.scope?.column, dropped);
	}
	const ids = idScope(base);
	const relations = [];
	const indexById = /* @__PURE__ */ new Map();
	const fromPrevious = /* @__PURE__ */ new Set();
	for (const r of draft.relations) {
		const id = relationId(r, ids);
		if (indexById.has(id)) continue;
		indexById.set(id, relations.length);
		relations.push({
			...structuredClone(r),
			id
		});
	}
	previous.relations.forEach((prev, i) => {
		const rel = {
			...structuredClone(prev),
			id: relationId(prev, ids)
		};
		const problems = relationRefProblems(rel, base.entities, `relations[${i}]`);
		const existing = indexById.get(rel.id);
		if (fromPrevious.has(rel.id)) dropped.push(`relation ${rel.id}: duplicate after scope change`);
		else if (problems.length > 0) {
			const note = existing !== void 0 ? " (the generated relation stays)" : "";
			dropped.push(`relation ${prev.id}: ${problems.map((p) => p.message).join("; ")}${note}`);
		} else {
			fromPrevious.add(rel.id);
			const generated = existing !== void 0 ? relations[existing] : void 0;
			if (generated?.provenance === "foreign_key") {
				rel.provenance = generated.provenance;
				rel.confidence = generated.confidence;
			} else if (rel.provenance === "foreign_key") {
				rel.provenance = "curated";
				if (rel.confidence === "high") rel.confidence = "medium";
				dropped.push(`relation ${rel.id}: foreign key no longer in the catalogue, kept as curated`);
			}
			if (existing !== void 0) relations[existing] = rel;
			else {
				indexById.set(rel.id, relations.length);
				relations.push(rel);
			}
		}
	});
	base.relations = relations;
	if (previous.groups) {
		const groups = [];
		for (const g of previous.groups) {
			const entities = g.entities.filter((e) => Object.hasOwn(base.entities, e));
			if (entities.length > 0) groups.push({
				label: g.label,
				entities
			});
			else dropped.push(`group ${g.label}: none of its entities exist any more`);
		}
		const placed = new Set(groups.flatMap((g) => g.entities));
		const fresh = Object.keys(base.entities).filter((e) => !placed.has(e));
		if (fresh.length > 0) {
			const existing = groups.find((g) => g.label === "New tables");
			if (existing) existing.entities.push(...fresh);
			else groups.push({
				label: "New tables",
				entities: fresh
			});
		}
		base.groups = groups;
	}
	if (previous.unresolved) {
		const kept = [];
		for (const u of previous.unresolved) if (Object.hasOwn(base.entities, u.entity) && Object.hasOwn(base.entities[u.entity].columns, u.column)) kept.push({ ...u });
		else dropped.push(`unresolved ${u.entity}.${u.column}: no longer exists`);
		if (kept.length > 0) base.unresolved = kept;
		else delete base.unresolved;
	}
	const sources = [...base.sources ?? []];
	for (const s of previous.sources ?? []) if (!sources.some((x) => x.kind === s.kind && x.ref === s.ref)) sources.push({ ...s });
	if (sources.length > 0) base.sources = sources;
	return {
		base,
		dropped
	};
}
/** `shop_id` -> `Shop`: the humanised column without a trailing `_id`. */
var defaultScopeLabel = (column) => humanize(column.replace(/(.)_id$/i, "$1"));
/** A path with symlinks resolved where the file (or at least its directory) exists. */
function canonicalPath(path) {
	const abs = resolve(path);
	try {
		return realpathSync(abs);
	} catch {
		try {
			return join(realpathSync(dirname(abs)), basename(abs));
		} catch {
			return abs;
		}
	}
}
/** True for anything at the path, a dangling symlink included. */
function pathExists(path) {
	try {
		lstatSync(path);
		return true;
	} catch {
		return false;
	}
}
var USAGE$3 = "draft <introspection.json> --name <name> --out <base.json> [--previous <base.json>] [--force] [--scope <column> [--scope-label <text>] [--scope-entity <entity>]]   Draft a starting base from an introspection, declaring the scope and carrying a previous base's curation forward. Refuses an existing --out without --force";
var draftCommand = {
	usage: USAGE$3,
	async run(args) {
		let parsed;
		try {
			parsed = parseArgs({
				args,
				allowPositionals: true,
				options: {
					name: { type: "string" },
					out: { type: "string" },
					previous: { type: "string" },
					force: { type: "boolean" },
					scope: { type: "string" },
					"scope-label": { type: "string" },
					"scope-entity": { type: "string" }
				}
			});
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		const [introPath, ...extra] = parsed.positionals;
		const { name, out, previous: previousPath, force, scope: scopeColumn } = parsed.values;
		const scopeLabel = parsed.values["scope-label"];
		const scopeEntity = parsed.values["scope-entity"];
		if (!introPath || extra.length > 0 || !name || !out || scopeColumn === "" || scopeColumn === void 0 && (scopeLabel !== void 0 || scopeEntity !== void 0)) {
			console.error(`Usage: ${USAGE$3}`);
			return 2;
		}
		if (!force && pathExists(out)) {
			const isPrevious = previousPath !== void 0 && canonicalPath(out) === canonicalPath(previousPath);
			console.error(redact(isPrevious ? `--out is the same file as --previous (${out}); pass --force to overwrite it` : `${out} already exists; pass --force to overwrite it`));
			return 2;
		}
		let previous;
		let intro;
		try {
			intro = readIntrospection(introPath);
			if (previousPath) previous = readBase(previousPath);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return exitCodeFor(e);
		}
		try {
			let base = draftBase(intro, { name });
			let scope;
			if (scopeColumn !== void 0) {
				const prevScope = previous?.scope;
				const same = prevScope?.column === scopeColumn ? prevScope : void 0;
				if (prevScope && !same) console.error(redact(`--scope "${scopeColumn}" replaces the previous base's scope "${prevScope.column}"`));
				const keepEntity = same?.entity !== void 0 && Object.hasOwn(base.entities, same.entity);
				if (same?.entity !== void 0 && !keepEntity && scopeEntity === void 0) console.error(redact(`dropped scope entity "${same.entity}": table no longer exists`));
				const entity = scopeEntity ?? (keepEntity ? same.entity : void 0);
				scope = {
					label: scopeLabel ?? same?.label ?? defaultScopeLabel(scopeColumn),
					column: scopeColumn,
					entity
				};
			} else if (previous?.scope && scopeMisfit(base, previous.scope) === null) {
				const { label, column, entity } = previous.scope;
				scope = {
					label,
					column,
					entity
				};
			}
			const notScoped = [];
			if (scope) {
				const dropped = [];
				const notes = [];
				base = withScope(base, scope, intro, dropped, notScoped, notes);
				for (const line of notes) console.error(redact(line));
				for (const line of dropped) console.error(redact(`dropped ${line}`));
			}
			if (previous) {
				const carried = carryForward(base, previous);
				base = carried.base;
				for (const line of carried.dropped) console.error(redact(`dropped ${line}`));
			}
			for (const { entity, reason } of notScoped) {
				const kept = Object.hasOwn(base.entities, entity) && base.entities[entity].scoped === true;
				console.error(redact(`${kept ? "scoped by the previous base" : "not scoped"} ${entity}: ${reason}`));
			}
			let problems;
			try {
				validateBase(JSON.parse(JSON.stringify(base)));
			} catch (e) {
				if (!(e instanceof SchemaValidationError)) throw e;
				problems = e.problems.map(formatProblem).join("\n");
			}
			if (problems !== void 0 && previous) {
				console.error(redact(`The drafted base does not validate, nothing written:\n${problems}`));
				return 1;
			}
			writeJson(out, base);
			console.error(`${Object.keys(base.entities).length} entities, ${base.relations.length} relations`);
			if (problems !== void 0) {
				console.error(redact(`The drafted base does not validate:\n${problems}`));
				return 1;
			}
			return 0;
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
	}
};
/** Palette keys in display order; default entity colors cycle through these. */
var ENTITY_COLORS = Object.keys({
	rose: "bg-rose-500/20 text-rose-400 border-rose-800/40",
	amber: "bg-amber-500/20 text-amber-400 border-amber-800/40",
	blue: "bg-blue-500/20 text-blue-400 border-blue-800/40",
	green: "bg-green-500/20 text-green-400 border-green-800/40",
	violet: "bg-violet-500/20 text-violet-400 border-violet-800/40",
	cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-800/40",
	emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-800/40",
	orange: "bg-orange-500/20 text-orange-400 border-orange-800/40",
	lime: "bg-lime-500/20 text-lime-400 border-lime-800/40",
	teal: "bg-teal-500/20 text-teal-400 border-teal-800/40",
	fuchsia: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-800/40",
	red: "bg-red-500/20 text-red-400 border-red-800/40",
	indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-800/40",
	purple: "bg-purple-500/20 text-purple-400 border-purple-800/40",
	gray: "bg-surface-alt/20 text-text-secondary border-border/40"
});
// src/lib/filter-operators.ts
/** The operators the backend's `build_where_clause` accepts. */
var FILTER_OPERATORS = [
	"=",
	"!=",
	">",
	"<",
	">=",
	"<=",
	"LIKE",
	"ILIKE",
	"IS NULL",
	"IS NOT NULL",
	"IN",
	"CONTAINS"
];
// src/lib/model/overlay-path.ts
/** Whether `seg` names an entry of `node`: an own key of an object, or an in-bounds index of a list. */
function hasEntry(node, seg) {
	if (Array.isArray(node)) return typeof seg === "number" && Number.isInteger(seg) && seg >= 0 && seg < node.length;
	return typeof node === "object" && node !== null && typeof seg === "string" && hasOwn(node, seg);
}
/** The child `seg` of `node`; only call it once `hasEntry(node, seg)` holds. */
var childOf = (node, seg) => node[seg];
/** The value at `path` in `root`, or undefined when a step doesn't resolve (or the path is empty). */
function entryAt(root, path) {
	if (path.length === 0) return void 0;
	let node = root;
	for (const seg of path) {
		if (!hasEntry(node, seg)) return void 0;
		node = childOf(node, seg);
	}
	return node;
}
// src/lib/model/virtual.ts
/** Resolve relation `id` as a to-one hop leaving entity `from`, or say why it cannot be. */
function borrowStep(relations, from, id) {
	const relation = hasOwn(relations, id) ? relations[id] : void 0;
	if (!relation) return { error: `unknown relation "${id}"` };
	if (relation.join.some((p) => p.match === "array")) return { error: `relation "${id}" joins on an array column, which cannot be borrowed through` };
	const { cardinality } = relation;
	if (relation.from === from && (cardinality === "many_to_one" || cardinality === "one_to_one")) return {
		relation: id,
		direction: "out",
		target: relation.to
	};
	if (relation.to === from && (cardinality === "one_to_many" || cardinality === "one_to_one")) return {
		relation: id,
		direction: "in",
		target: relation.from
	};
	if (relation.from === from || relation.to === from) return { error: `relation "${id}" is to-many from ${from}, so it would multiply rows` };
	return { error: `relation "${id}" does not touch ${from}` };
}
// src/lib/model/merge.ts
/** Label of the group that collects virtual entities no group lists. */
var MY_ENTITIES = "My entities";
function mergeModel(base, overlay, opts = {}) {
	const problems = [];
	const warn = (where, message, fix) => problems.push({
		level: "warning",
		where: `overlay: ${where}`,
		message,
		...fix && { fix: {
			...fix,
			expected: entryAt(overlay, fix.path)
		} }
	});
	if (overlay && opts.baseFilename !== void 0 && overlay.base !== opts.baseFilename) warn("base", `overlay was written for "${overlay.base}" but is being applied to "${opts.baseFilename}"`);
	const entities = {};
	Object.entries(base.entities).forEach(([key, be], i) => {
		const columns = {};
		for (const [name, col] of Object.entries(be.columns)) columns[name] = { ...col };
		entities[key] = {
			...be,
			key,
			columns,
			color: ENTITY_COLORS[i % ENTITY_COLORS.length],
			fieldLayout: {},
			computedFields: [...be.computedFields ?? []]
		};
	});
	for (const [key, eo] of Object.entries(overlay?.entities ?? {})) {
		if (!hasOwn(entities, key)) {
			warn(`entities.${key}`, `unknown entity "${key}"`, {
				path: ["entities", key],
				repoint: { kind: "entity" }
			});
			continue;
		}
		applyEntityOverlay(entities[key], eo, `entities.${key}`, warn);
	}
	const relations = {};
	for (const r of base.relations) relations[r.id] = { ...r };
	const ro = overlay?.relations;
	for (const [id, patch] of Object.entries(ro?.patch ?? {})) {
		if (!hasOwn(relations, id)) {
			warn(`relations.patch.${id}`, `unknown relation "${id}"`, {
				path: [
					"relations",
					"patch",
					id
				],
				repoint: { kind: "relation" }
			});
			continue;
		}
		const { name, inverseName, confidence, provenance, note } = patch;
		const fields = {
			name,
			inverseName,
			confidence,
			provenance,
			note
		};
		for (const [field, value] of Object.entries(fields)) if (value !== void 0) relations[id][field] = value;
	}
	const ids = idScope(base);
	(ro?.hide ?? []).forEach((id, i) => {
		if (!hasOwn(relations, id)) warn(`relations.hide[${i}]`, `unknown relation "${id}"`, {
			path: [
				"relations",
				"hide",
				i
			],
			repoint: { kind: "relation" }
		});
		else delete relations[id];
	});
	(ro?.add ?? []).forEach((r, i) => {
		const at = `relations.add[${i}]`;
		const found = relationRefProblems(r, entities, at);
		const expected = relationId(r, ids);
		if (r.id !== expected) found.push({
			level: "error",
			where: `${at}.id`,
			message: `id should be "${expected}"`
		});
		if (hasOwn(relations, r.id)) found.push({
			level: "error",
			where: `${at}.id`,
			message: `duplicate relation id "${r.id}"`
		});
		if (found.length > 0) {
			for (const p of found) warn(p.where, p.message, { path: [
				"relations",
				"add",
				i
			] });
			return;
		}
		relations[r.id] = { ...r };
	});
	const virtualEntities = {};
	const isBaseEntity = (k) => hasOwn(base.entities, k);
	for (const [key, ve] of Object.entries(overlay?.virtualEntities ?? {})) {
		const at = `virtualEntities.${key}`;
		const built = buildVirtualEntity(key, ve, isBaseEntity, entities, relations, at, warn);
		if (typeof built === "string") {
			warn(at, built, { path: ["virtualEntities", key] });
			continue;
		}
		entities[key] = built;
		virtualEntities[key] = ve;
	}
	const known = (k) => hasOwn(entities, k);
	let groups;
	if (overlay?.groups) groups = overlay.groups.map((g, gi) => ({
		label: g.label,
		entities: g.entities.filter((k, ei) => {
			if (known(k)) return true;
			warn(`groups[${gi}].entities[${ei}]`, `unknown entity "${k}"`, { path: [
				"groups",
				gi,
				"entities",
				ei
			] });
			return false;
		})
	}));
	else if (base.groups) groups = base.groups.map((g) => ({
		label: g.label,
		entities: [...g.entities]
	}));
	else groups = [{
		label: "Entities",
		entities: Object.keys(base.entities)
	}];
	const ungrouped = Object.keys(virtualEntities).filter((k) => !groups.some((g) => g.entities.includes(k)));
	if (ungrouped.length > 0) {
		const mine = groups.find((g) => g.label === MY_ENTITIES);
		if (mine) mine.entities.push(...ungrouped);
		else groups.push({
			label: MY_ENTITIES,
			entities: ungrouped
		});
	}
	let scope = base.scope ? { ...base.scope } : null;
	if (overlay?.scope) {
		if (!scope) warn("scope", "overlay sets a scope label but the base schema declares no scope", { path: ["scope"] });
		else if (overlay.scope.label !== void 0) scope.label = overlay.scope.label;
	}
	return {
		name: base.name,
		description: base.description,
		scope,
		entities,
		relations,
		groups,
		virtualEntities,
		unresolved: base.unresolved ?? [],
		problems
	};
}
/** Apply one entity's overlay onto its (already cloned) merged entity. Only presentation and fact metadata are read. */
function applyEntityOverlay(ent, eo, at, warn) {
	const path = ["entities", ent.key];
	const hasColumn = (c) => hasOwn(ent.columns, c);
	(eo.computedFields ?? []).forEach((f, i) => {
		if (!hasColumn(f.source)) {
			warn(`${at}.computedFields[${i}]`, `unknown source column "${f.source}" on ${ent.key}`, { path: [
				...path,
				"computedFields",
				i
			] });
			return;
		}
		const existing = ent.computedFields.findIndex((c) => c.name === f.name);
		if (existing >= 0) ent.computedFields[existing] = { ...f };
		else ent.computedFields.push({ ...f });
	});
	if (eo.label !== void 0) ent.label = eo.label;
	if (eo.color !== void 0) ent.color = eo.color;
	const columnList = (field) => {
		const list = eo[field];
		if (!list) return;
		const bad = list.filter((c) => !hasColumn(c));
		if (bad.length > 0) warn(`${at}.${field}`, `unknown column "${bad[0]}" on ${ent.key}`, { path: [...path, field] });
		else ent[field] = [...list];
	};
	columnList("titleColumns");
	columnList("searchColumns");
	if (eo.defaultSort) {
		if (!hasColumn(eo.defaultSort.column)) warn(`${at}.defaultSort`, `unknown column "${eo.defaultSort.column}" on ${ent.key}`, { path: [...path, "defaultSort"] });
		else ent.defaultSort = { ...eo.defaultSort };
	}
	if (eo.fieldLayout) ent.fieldLayout = resolveFieldLayout(ent, eo.fieldLayout, `${at}.fieldLayout`, [...path, "fieldLayout"], warn);
	for (const [name, patch] of Object.entries(eo.columns ?? {})) {
		if (!hasColumn(name)) {
			warn(`${at}.columns.${name}`, `unknown column "${name}" on ${ent.key}`, {
				path: [
					...path,
					"columns",
					name
				],
				repoint: {
					kind: "column",
					on: ent.key
				}
			});
			continue;
		}
		const { description, allowedValues, allowedValuesOpen, sensitive } = patch;
		const fields = {
			description,
			allowedValues,
			allowedValuesOpen,
			sensitive
		};
		for (const [field, value] of Object.entries(fields)) if (value !== void 0) ent.columns[name][field] = value;
	}
}
/**
* A field layout with the names the entity doesn't have dropped, each with a warning. Lists may name columns or
* computed fields. `at` is the layout's `where` locator and `path` its place in the overlay.
*/
function resolveFieldLayout(ent, layout, at, path, warn) {
	const hasField = (c) => hasOwn(ent.columns, c) || ent.computedFields.some((f) => f.name === c);
	const resolved = {};
	for (const side of ["pinned", "hidden"]) {
		const list = layout[side];
		if (!list) continue;
		resolved[side] = list.filter((c, i) => {
			if (hasField(c)) return true;
			warn(`${at}.${side}[${i}]`, `unknown field "${c}" on ${ent.key}`, {
				path: [
					...path,
					side,
					i
				],
				repoint: {
					kind: "field",
					on: ent.key
				}
			});
			return false;
		});
	}
	return resolved;
}
/**
* The entity for one virtual entity definition: a copy of its merged base with
* the borrowed columns added, or the reason the definition is broken.
* `isReal` says whether a key names a real (non-virtual) entity.
*/
function buildVirtualEntity(key, ve, isReal, entities, relations, at, warn) {
	if (isReal(key)) return `"${key}" is already an entity`;
	const baseEntity = isReal(ve.base) ? entities[ve.base] : void 0;
	if (!baseEntity) return `unknown base entity "${ve.base}" (a virtual entity must be built on a real entity)`;
	for (const c of ve.conditions) {
		if (!hasOwn(baseEntity.columns, c.column)) return `unknown column "${c.column}" on ${ve.base}`;
		if (!FILTER_OPERATORS.includes(c.operator)) return `unsupported operator "${c.operator}"`;
		if (c.operator === "IN" && !Array.isArray(c.value)) return "IN needs a list of values";
		if (c.operator !== "IN" && Array.isArray(c.value)) return "only IN takes a list";
	}
	const columns = {};
	for (const [name, col] of Object.entries(baseEntity.columns)) columns[name] = { ...col };
	const taken = /* @__PURE__ */ new Set([...Object.keys(columns), ...baseEntity.computedFields.map((f) => f.name)]);
	const borrow = [];
	for (const b of ve.borrow ?? []) {
		if (!/^[A-Za-z0-9_]+$/.test(b.as)) return `"${b.as}" is not a valid column name`;
		if (taken.has(b.as)) return `"${b.as}" is already a field of ${key}`;
		if (b.via.length === 0) return `borrow "${b.as}" needs at least one relation in via`;
		const steps = [];
		let from = ve.base;
		for (const id of b.via) {
			const step = borrowStep(relations, from, id);
			if ("error" in step) return step.error;
			steps.push(step);
			from = step.target;
		}
		const target = entities[from];
		if (!hasOwn(target.columns, b.column)) return `unknown column "${b.column}" on ${from}`;
		columns[b.as] = {
			type: target.columns[b.column].type,
			nullable: true,
			description: `From ${target.label}`
		};
		taken.add(b.as);
		borrow.push({
			as: b.as,
			column: b.column,
			via: [...b.via],
			steps
		});
	}
	const entity = {
		...baseEntity,
		key,
		label: ve.label,
		color: ve.color ?? baseEntity.color,
		columns,
		computedFields: [...baseEntity.computedFields],
		fieldLayout: {},
		virtual: {
			base: ve.base,
			conditions: structuredClone(ve.conditions),
			borrow
		}
	};
	if (ve.fieldLayout) entity.fieldLayout = resolveFieldLayout(entity, ve.fieldLayout, `${at}.fieldLayout`, [
		"virtualEntities",
		key,
		"fieldLayout"
	], warn);
	return entity;
}
var OVERLAY_SUFFIX = ".selectr-overlay.json";
/** `<stem>.selectr-schema.json` -> `<stem>.selectr-overlay.json`. */
function overlayPathFor(basePath) {
	return `${basePath.endsWith(".selectr-schema.json") ? basePath.slice(0, -20) : basePath}${OVERLAY_SUFFIX}`;
}
// skills/selectr-schema/src/validate.ts
function loadOverlay(path) {
	try {
		const { overlay, problems } = validateOverlay(parseJsonFile(path));
		return {
			overlay,
			problems
		};
	} catch (e) {
		const detail = e instanceof SchemaValidationError ? e.problems.map((p) => `${p.where}: ${p.message}`).join("; ") : errorMessage(e);
		return {
			overlay: null,
			problems: [{
				level: "error",
				where: "overlay",
				message: `Ignored ${basename(path)}: ${detail}`
			}]
		};
	}
}
/**
* Validate the base at `basePath` and its overlay (`overlayPath`, else the
* file next to the base when it exists), mirroring loadModelFiles' problem
* order. Throws `Could not read <path>: ...` when the base is unreadable.
*/
function validateFiles(basePath, overlayPath) {
	const json = readJson(basePath);
	const overlayFile = overlayPath ?? overlayPathFor(basePath);
	const overlayResult = overlayPath || existsSync(overlayFile) ? loadOverlay(overlayFile) : {
		overlay: null,
		problems: []
	};
	try {
		const { base, problems: baseProblems } = validateBase(json);
		const model = mergeModel(base, overlayResult.overlay, { baseFilename: basename(basePath) });
		return {
			problems: [
				...baseProblems,
				...overlayResult.problems,
				...model.problems
			],
			unsupported: false
		};
	} catch (e) {
		if (e instanceof UnsupportedSchemaError) return {
			problems: [],
			unsupported: true
		};
		if (e instanceof SchemaValidationError) return {
			problems: [...e.problems, ...overlayResult.problems],
			unsupported: false
		};
		throw e;
	}
}
var USAGE$2 = "validate <base> [--overlay <path>]   Check a base schema (and its overlay) with the app's validator";
var validateCommand = {
	usage: USAGE$2,
	async run(args) {
		let parsed;
		try {
			parsed = parseArgs({
				args,
				allowPositionals: true,
				options: { overlay: { type: "string" } }
			});
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		const [basePath, ...extra] = parsed.positionals;
		if (!basePath || extra.length > 0) {
			console.error(`Usage: ${USAGE$2}`);
			return 2;
		}
		let result;
		try {
			result = validateFiles(basePath, parsed.values.overlay);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		if (result.unsupported) {
			console.error(redact(`${basePath}: not a Selectr schema v2 file`));
			return 2;
		}
		for (const p of result.problems) console.log(formatProblem(p));
		const errors = result.problems.filter((p) => p.level === "error").length;
		console.log(`${errors} errors, ${result.problems.length - errors} warnings`);
		return errors > 0 ? 1 : 0;
	}
};
// skills/selectr-schema/src/verify-joins.ts
/** Every outcome, in the order reports list them. */
var OUTCOMES = [
	"verified",
	"unconfirmed",
	"contradicted",
	"no-data",
	"error"
];
var DEFAULTS = {
	sample: 200,
	threshold: .95,
	floor: .5,
	minSample: 20
};
/** A relation worth sampling: not already verified, and either inferred or short of high confidence. */
function needsVerification(r) {
	return r.provenance !== "verified" && (r.provenance === "inferred" || r.confidence !== "high");
}
function classify(sampled, resolved, opts) {
	if (sampled === 0) return "no-data";
	const share = resolved / sampled;
	if (sampled >= opts.minSample && share >= opts.threshold) return "verified";
	if (share < opts.floor) return "contradicted";
	return "unconfirmed";
}
/**
* Postgres error messages can quote row values (`invalid input syntax for type
* uuid: "abc"`). Replace everything between the first and last double quote, so
* a value that itself holds a `"` cannot leak a tail. This also hides quoted
* identifiers (`relation "…" does not exist`): losing that diagnostic detail is
* the accepted price of never leaking a value.
*/
function scrubQuoted(message) {
	return message.replace(/"[\s\S]*"/, "\"…\"");
}
var tableRef = (e) => `${quoteIdent(e.dbSchema ?? "public")}.${quoteIdent(e.table)}`;
function entityOf(base, key) {
	const entity = Object.hasOwn(base.entities, key) ? base.entities[key] : void 0;
	if (!entity) throw new Error(`unknown entity "${key}"`);
	return entity;
}
var PLAIN_TYPE_RE = /^[a-z_][a-z0-9_]*$/;
/**
* The column types of one join pair, from the base, when they differ: the source
* side is the element type for a `match: "array"` pair. Null when they agree or
* either column is missing.
*/
function joinTypeDifference(base, r, p) {
	const fromEntity = Object.hasOwn(base.entities, r.from) ? base.entities[r.from] : void 0;
	const toEntity = Object.hasOwn(base.entities, r.to) ? base.entities[r.to] : void 0;
	const fromType = fromEntity && Object.hasOwn(fromEntity.columns, p.from) ? fromEntity.columns[p.from].type : void 0;
	const toType = toEntity && Object.hasOwn(toEntity.columns, p.to) ? toEntity.columns[p.to].type : void 0;
	if (typeof fromType !== "string" || typeof toType !== "string") return null;
	return canonicalType(p.match === "array" && fromType.endsWith("[]") ? fromType.slice(0, -2) : fromType) === canonicalType(toType) ? null : {
		from: fromType,
		to: toType
	};
}
/**
* The cast that makes a source unit comparable with its target column, so the
* target's index stays usable: `::"<target type>"`, or "" when the types agree, both
* are numeric, or the target type is not a plain name. The cast names the type by
* its pg_type name (canonicalType): a quoted identifier is never a keyword, so
* `::"integer"` would not resolve.
*/
function unitCast(base, r, p) {
	const difference = joinTypeDifference(base, r, p);
	if (difference === null) return "";
	const target = canonicalType(difference.to);
	if (isNumericType(difference.from.replace(/\[\]$/, "")) && isNumericType(target)) return "";
	return PLAIN_TYPE_RE.test(target) ? `::${quoteIdent(target)}` : "";
}
/**
* The scope column when it applies to this relation's source rows, else null: the
* source entity is `scoped: true` (carrying the column is not enough, since an
* unscoped entity's rows outside every scope must be sampled too) and has the column.
*/
function scopeColumnFor(base, r) {
	const column = base.scope?.column;
	const source = entityOf(base, r.from);
	return column !== void 0 && source.scoped === true && Object.hasOwn(source.columns, column) ? column : null;
}
/**
* The conditions that choose sample rows from the source (alias `s`): every join
* `from` column non-null (and every array column non-empty), the from-side
* condition, and the scope when given.
* Values are appended to `params`. They are compared with untyped parameters, so
* Postgres reads them as the column's type: indexes and partition pruning on the
* column stay usable, and a value the type rejects fails the statement.
*/
function sourceFilters(base, r, scopeValue, params) {
	const filters = r.join.map((p) => `s.${quoteIdent(p.from)} IS NOT NULL`);
	for (const p of r.join) if (p.match === "array") filters.push(`cardinality(s.${quoteIdent(p.from)}) > 0`);
	if (r.condition?.side === "from") {
		params.push(String(r.condition.equals));
		filters.push(`s.${quoteIdent(r.condition.column)} = $${params.length}`);
	}
	const scopeColumn = scopeColumnFor(base, r);
	if (scopeValue !== null && scopeColumn !== null) {
		params.push(scopeValue);
		filters.push(`s.${quoteIdent(scopeColumn)} = $${params.length}`);
	}
	return filters;
}
/**
* Count, over up to `sample` units drawn from the source, how many have a target
* row. A unit is a source row, or an array element for a `match: "array"` pair,
* cast to the target column's type when the base gives the pair different types.
* Parameters are bound in order: from-side condition, scope, to-side condition,
* sample size.
*
* The sample `u` is referenced twice, so Postgres materializes it (on every
* version; the MATERIALIZED keyword would need 12+), and both counts see the same
* units. Counting the resolved ones in a subquery of their own lets the planner
* run the existence check as a semi-join.
*/
function buildVerifySql(base, r, opts) {
	const from = entityOf(base, r.from);
	const to = entityOf(base, r.to);
	const params = [];
	const filters = sourceFilters(base, r, opts.scopeValue, params);
	const arrayPair = r.join.find((p) => p.match === "array");
	const units = r.join.map((p, i) => `${p === arrayPair ? "e.v" : `s.${quoteIdent(p.from)}`} AS c${i}`);
	const targetFilters = r.join.map((p, i) => `t.${quoteIdent(p.to)} = u.c${i}${unitCast(base, r, p)}`);
	if (arrayPair) filters.push("e.v IS NOT NULL");
	if (r.condition?.side === "to") {
		params.push(String(r.condition.equals));
		targetFilters.push(`t.${quoteIdent(r.condition.column)} = $${params.length}`);
	}
	params.push(opts.sample);
	const unnest = arrayPair ? `\n    CROSS JOIN LATERAL unnest(s.${quoteIdent(arrayPair.from)}) AS e(v)` : "";
	return {
		sql: `WITH u AS (
  SELECT ${units.join(", ")}
    FROM ${tableRef(from)} s${unnest}
    WHERE ${filters.join(" AND ")}
    LIMIT $${params.length}
)
SELECT (SELECT count(*) FROM u)::int AS sampled,
       (SELECT count(*) FROM u WHERE EXISTS (
         SELECT 1 FROM ${tableRef(to)} t WHERE ${targetFilters.join(" AND ")}
       ))::int AS resolved`,
		params
	};
}
var SCOPE_SAMPLE = 1e3;
/**
* The most frequent scope value among the first source rows that pass the
* relation's own filters, as text, so the sample comes from a tenant with data
* (the first row may belong to a nearly empty one). Null when the scope does not
* apply or no row qualifies. The value is only ever fed back into the sampling
* query, where it is bound again and read as the column's type.
*/
async function pickScopeValue(client, base, r) {
	const scopeColumn = scopeColumnFor(base, r);
	if (scopeColumn === null) return null;
	const params = [];
	const filters = [`s.${quoteIdent(scopeColumn)} IS NOT NULL`, ...sourceFilters(base, r, null, params)];
	const sql = `SELECT v FROM (SELECT s.${quoteIdent(scopeColumn)}::text AS v FROM ${tableRef(entityOf(base, r.from))} s WHERE ${filters.join(" AND ")} LIMIT ${SCOPE_SAMPLE}) x GROUP BY v ORDER BY count(*) DESC, v LIMIT 1`;
	const { rows } = await client.query(sql, params);
	return rows[0]?.v ?? null;
}
/** The session died (as opposed to one statement failing): nothing more can be sampled. */
var ConnectionLostError = class extends Error {};
var SESSION_ENDING_STATE = /^(08|57P0[123])/;
async function connectionLost(client, e) {
	const code = e?.code;
	if (typeof code === "string" && /^[0-9A-Z]{5}$/.test(code)) return SESSION_ENDING_STATE.test(code);
	try {
		await client.query("SELECT 1");
		return false;
	} catch {
		return true;
	}
}
/**
* Sample one relation. A failing statement becomes an `error` outcome rather
* than an exception; a lost connection throws `ConnectionLostError`.
*/
async function verifyRelation(client, base, r, opts) {
	const failed = (error, scoped = false) => ({
		id: r.id,
		sampled: 0,
		resolved: 0,
		share: null,
		outcome: "error",
		scoped,
		error
	});
	if (r.join.filter((p) => p.match === "array").length > 1) return failed("more than one array pair");
	try {
		let scopeValue = null;
		if (scopeColumnFor(base, r) !== null) {
			scopeValue = await pickScopeValue(client, base, r);
			if (scopeValue === null) return {
				id: r.id,
				sampled: 0,
				resolved: 0,
				share: null,
				outcome: "no-data",
				scoped: false
			};
		}
		const { sql, params } = buildVerifySql(base, r, {
			sample: opts.sample,
			scopeValue
		});
		const { rows } = await client.query(sql, params);
		const sampled = Number(rows[0].sampled);
		const resolved = Number(rows[0].resolved);
		return {
			id: r.id,
			sampled,
			resolved,
			share: sampled === 0 ? null : resolved / sampled,
			outcome: classify(sampled, resolved, {
				threshold: opts.threshold,
				floor: DEFAULTS.floor,
				minSample: DEFAULTS.minSample
			}),
			scoped: scopeValue !== null
		};
	} catch (e) {
		const message = redact(scrubQuoted(errorMessage(e)));
		if (await connectionLost(client, e)) throw new ConnectionLostError(message);
		return failed(message);
	}
}
/** The run's outcome counts on one line: `<n> relations: <a> verified, <b> unconfirmed, ...`, every outcome in a fixed order. */
function summaryLine(results) {
	const counts = OUTCOMES.map((o) => `${results.filter((r) => r.outcome === o).length} ${o}`);
	return `${results.length} relations: ${counts.join(", ")}`;
}
/**
* Verified relations become `verified`/`high`, except a foreign key, which keeps
* its provenance (the catalogue is the stronger evidence) and only gains `high`.
* Contradicted ones lose confidence; the rest are untouched.
*/
function applyOutcomes(base, results) {
	const outcomes = new Map(results.map((r) => [r.id, r.outcome]));
	return {
		...base,
		relations: base.relations.map((r) => {
			const outcome = outcomes.get(r.id);
			if (outcome === "verified") return {
				...r,
				provenance: r.provenance === "foreign_key" ? "foreign_key" : "verified",
				confidence: "high"
			};
			if (outcome === "contradicted") return {
				...r,
				confidence: "low"
			};
			return r;
		})
	};
}
var USAGE$1 = "verify-joins <base> --report <path> [--sample <n>] [--threshold <0-1>] [--all] [--write] [--url-file <path>] [--timeout-ms <n>]   Sample live data to check uncertain joins (read-only)";
/** Fail early, before any sampling, when the report cannot be written. Creates the parent directory like the final write would. */
function assertWritable(path) {
	try {
		mkdirSync(dirname(path), { recursive: true });
		let isDirectory = false;
		try {
			isDirectory = statSync(path).isDirectory();
			if (!isDirectory) accessSync(path, constants.W_OK);
		} catch (e) {
			if (e.code !== "ENOENT") throw e;
			accessSync(dirname(path), constants.W_OK);
		}
		if (isDirectory) throw new Error("is a directory");
	} catch (e) {
		throw new Error(`Cannot write the report to ${path}: ${errorMessage(e)}`);
	}
}
var verifyJoinsCommand = {
	usage: USAGE$1,
	async run(args) {
		let parsed;
		try {
			parsed = parseArgs({
				args,
				allowPositionals: true,
				options: {
					sample: { type: "string" },
					threshold: { type: "string" },
					all: { type: "boolean" },
					write: { type: "boolean" },
					report: { type: "string" },
					"url-file": { type: "string" },
					"timeout-ms": { type: "string" }
				}
			});
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		const [basePath, ...extra] = parsed.positionals;
		const { report: reportPath } = parsed.values;
		if (!basePath || extra.length > 0 || !reportPath) {
			console.error(`Usage: ${USAGE$1}`);
			return 2;
		}
		const sample = parsed.values.sample === void 0 ? DEFAULTS.sample : Number(parsed.values.sample);
		const threshold = parsed.values.threshold === void 0 ? DEFAULTS.threshold : Number(parsed.values.threshold);
		let timeoutMs;
		try {
			if (!Number.isInteger(sample) || sample <= 0) throw new Error(`--sample must be a positive integer, got "${parsed.values.sample}"`);
			if (!(threshold > 0 && threshold <= 1)) throw new Error(`--threshold must be above 0 and at most 1, got "${parsed.values.threshold}"`);
			timeoutMs = parseTimeoutMs(parsed.values["timeout-ms"]);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		let base;
		try {
			base = readBase(basePath);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return exitCodeFor(e);
		}
		const relations = parsed.values.all ? base.relations : base.relations.filter(needsVerification);
		if (relations.length > 0 && sample < DEFAULTS.minSample) console.error(`Warning: --sample ${sample} is below the minimum of ${DEFAULTS.minSample} needed to verify a relation`);
		try {
			assertWritable(reportPath);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		const results = [];
		const makeReport = () => ({
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			sample,
			threshold,
			results
		});
		let client;
		try {
			if (relations.length > 0) client = await connect(resolveUrl({ urlFile: parsed.values["url-file"] }), { timeoutMs });
			for (const r of relations) {
				const result = await verifyRelation(client, base, r, {
					sample,
					threshold
				});
				results.push(result);
				console.error(`${result.outcome} ${r.id} (${result.resolved}/${result.sampled})${result.error ? `: ${result.error}` : ""}`);
			}
		} catch (e) {
			if (e instanceof ConnectionLostError) {
				console.error(redact(`Connection lost after ${results.length} of ${relations.length} relations, stopping: ${e.message}`));
				try {
					writeJson(reportPath, makeReport());
				} catch (writeError) {
					console.error(redact(errorMessage(writeError)));
				}
			} else console.error(redact(errorMessage(e)));
			return 2;
		} finally {
			await client?.end().catch(() => {});
		}
		console.error(relations.length === 0 ? "No relations need verification" : summaryLine(results));
		const report = makeReport();
		let updated;
		if (parsed.values.write && results.some((r) => r.outcome === "verified" || r.outcome === "contradicted")) {
			updated = applyOutcomes(base, results);
			try {
				validateBase(updated);
			} catch (e) {
				console.error("Refusing to write: the updated base does not validate");
				if (e instanceof SchemaValidationError) for (const p of e.problems) console.error(redact(formatProblem(p)));
				else console.error(redact(errorMessage(e)));
				return 1;
			}
		}
		try {
			writeJson(reportPath, report);
			if (updated) writeJson(basePath, updated);
		} catch (e) {
			console.error(redact(errorMessage(e)));
			return 2;
		}
		return 0;
	}
};
// skills/selectr-schema/src/review-checks.ts
var PROVENANCES = [
	"foreign_key",
	"declared",
	"curated",
	"inferred",
	"verified"
];
var CONFIDENCES = [
	"high",
	"medium",
	"low"
];
var SENSITIVE_TOKENS = "email|phone|ssn|tax_id|tax_number|passport|password|secret|token|card_number|card_last4|card_holder|card_fingerprint|pan|iban|account_number|address|birth|dob|ip_address|first_name|last_name|full_name|middle_name|display_name|ip_city|ip_region|ip_country|geo_location";
var SENSITIVE_RE = new RegExp(`(^|_)(${SENSITIVE_TOKENS})(_|$)`);
var SENSITIVE_AT_END_RE = new RegExp(`(^|_)(${SENSITIVE_TOKENS})$`);
var FLAG_RE = /^(is|has)_/;
var ABOUT_THE_DATA_RE = /_(ids?|type|count|amount|at)$/;
/** `billingAddress` / `IPAddress` -> `billing_address` / `ip_address`: camelCase segments become underscore runs. */
var snakeCase = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z])([A-Z][a-z])/g, "$1_$2").toLowerCase();
/**
* A column whose name suggests personal or secret data. Names that end like a
* reference, kind, count, amount or timestamp, or start like a flag, are left out,
* unless the sensitive token itself ends the name (`customer_tax_id` is the tax id).
*/
function isPossiblySensitive(column) {
	const name = snakeCase(column);
	if (!SENSITIVE_RE.test(name) || FLAG_RE.test(name)) return false;
	return !ABOUT_THE_DATA_RE.test(name) || SENSITIVE_AT_END_RE.test(name);
}
var isIdLike = (column) => /_ids?$/i.test(column) || /[a-z0-9]Ids?$/.test(column);
var REVIEWER_HEADING = "## For the reviewer";
var REVIEWER_HEADING_RE = /^## For the reviewer[ \t]*$/m;
var NONE = "None.";
var bullets = (lines) => lines.length > 0 ? lines.map((l) => `- ${l}`).join("\n") : NONE;
/** One line of markdown: ids and messages may hold newlines, and a line starting `## ` would be a heading. */
var oneLine = (s) => s.replace(/\s+/g, " ").trim();
/** Inline code on one line, fenced with more backticks than the text holds. */
function code(text) {
	const flat = oneLine(text);
	const fence = "`".repeat(Math.max(0, ...[...flat.matchAll(/`+/g)].map((m) => m[0].length)) + 1);
	return /^`|`$/.test(flat) ? `${fence} ${flat} ${fence}` : `${fence}${flat}${fence}`;
}
var UNREADABLE_NOTE = "The base could not be read; the sections below are not meaningful.";
function validationSection(problems, unreadableBase) {
	const note = unreadableBase ? `${UNREADABLE_NOTE}\n\n` : "";
	if (problems.length === 0) return `${note}${NONE}`;
	const errors = problems.filter((p) => p.level === "error").length;
	const lines = problems.map((p) => `${p.level} ${oneLine(p.where)}: ${oneLine(p.message)}`);
	return `${note}${errors} errors, ${problems.length - errors} warnings\n\n${bullets(lines)}`;
}
function provenanceTable(base) {
	const count = (provenance, confidence) => base.relations.filter((r) => r.provenance === provenance && r.confidence === confidence).length;
	const rows = PROVENANCES.map((p) => `| ${p} | ${CONFIDENCES.map((c) => count(p, c)).join(" | ")} |`);
	return [
		`| Provenance | ${CONFIDENCES.join(" | ")} |`,
		`|---|${CONFIDENCES.map(() => "---:|").join("")}`,
		...rows
	].join("\n");
}
/**
* Catalogue tables with no entity, and foreign keys between modelled tables with
* no relation of the same shape.
*
* Two entities may sit on one table (a table can be modelled twice under
* different keys). A foreign key is then covered when any pair of them has the
* relation: the other pairs are not gaps, and listing them would bury real ones.
*/
function catalogueGaps(base, intro) {
	const keysByTable = /* @__PURE__ */ new Map();
	for (const [key, entity] of Object.entries(base.entities)) keysByTable.set(entity.table, [...keysByTable.get(entity.table) ?? [], key]);
	const covered = new Set(base.relations.map((r) => r.id));
	const ids = idScope(base);
	const uncoveredForeignKeys = [];
	for (const fk of intro.foreignKeys) {
		const froms = keysByTable.get(fk.sourceTable);
		const tos = keysByTable.get(fk.targetTable);
		if (!froms || !tos) continue;
		const join = fk.sourceColumns.map((from, i) => ({
			from,
			to: fk.targetColumns[i]
		}));
		if (!froms.some((from) => tos.some((to) => covered.has(relationId({
			from,
			to,
			join,
			condition: null
		}, ids))))) uncoveredForeignKeys.push(oneLine(`${fk.sourceTable}(${fk.sourceColumns.join(", ")}) → ${fk.targetTable}(${fk.targetColumns.join(", ")})`));
	}
	return {
		missingTables: intro.tables.map((t) => t.name).filter((name) => !keysByTable.has(name)),
		uncoveredForeignKeys
	};
}
function coverageSection(base, intro) {
	const parts = [`Entities: ${Object.keys(base.entities).length}. Relations: ${base.relations.length}.`, provenanceTable(base)];
	if (!intro) parts.push("### Catalogue tables missing from the base\n\nNot run (no introspection given).", "### Catalogue foreign keys without a relation\n\nNot run (no introspection given).");
	else {
		const { missingTables, uncoveredForeignKeys } = catalogueGaps(base, intro);
		parts.push(`### Catalogue tables missing from the base\n\n${bullets(missingTables.map(code))}`, `### Catalogue foreign keys without a relation\n\n${bullets(uncoveredForeignKeys)}`);
	}
	return parts.join("\n\n");
}
function typeDifferenceSection(base) {
	const lines = [];
	for (const r of base.relations) for (const p of r.join) {
		const difference = joinTypeDifference(base, r, p);
		if (difference) lines.push(`${code(r.id)}: ${oneLine(p.from)} (${oneLine(difference.from)}) → ${oneLine(p.to)} (${oneLine(difference.to)})`);
	}
	return bullets(lines);
}
function unconfirmedSection(base, report) {
	const results = new Map((report?.results ?? []).map((r) => [r.id, r]));
	return bullets(base.relations.filter((r) => r.confidence !== "high" && r.provenance !== "verified").map((r) => {
		const head = `${code(r.id)} — ${r.provenance}, ${r.confidence}`;
		if (!report) return head;
		const result = results.get(r.id);
		return result ? `${head}; ${result.outcome} (${result.resolved}/${result.sampled})` : `${head}; not in the verify report`;
	}));
}
var allResolved = (r) => r.resolved === r.sampled;
var VERIFY_GROUPS = [
	{
		heading: "Unconfirmed, all resolved (sample too small)",
		test: (r) => r.outcome === "unconfirmed" && allResolved(r)
	},
	{
		heading: "Unconfirmed, partly resolved",
		test: (r) => r.outcome === "unconfirmed" && !allResolved(r)
	},
	{
		heading: "Contradicted",
		test: (r) => r.outcome === "contradicted"
	},
	{
		heading: "No data",
		test: (r) => r.outcome === "no-data"
	},
	{
		heading: "Errors",
		test: (r) => r.outcome === "error"
	}
];
/** The per-outcome counts, then every relation that did not verify, by outcome, with its counts. */
function verifySection(report) {
	if (!report) return "Not run.";
	const lines = OUTCOMES.map((o) => `${o}: ${report.results.filter((r) => r.outcome === o).length}`);
	const parts = [`Run ${oneLine(String(report.generatedAt))} (sample ${report.sample}, threshold ${report.threshold}).`, bullets(lines)];
	for (const { heading, test } of VERIFY_GROUPS) {
		const results = report.results.filter(test);
		if (results.length === 0) continue;
		const line = (r) => {
			const head = `${code(r.id)} (${r.resolved}/${r.sampled})`;
			return r.outcome === "error" ? `${head}: ${redact(scrubQuoted(oneLine(r.error ?? "unknown error")))}` : head;
		};
		parts.push(`${heading}:\n\n${bullets(results.map(line))}`);
	}
	return parts.join("\n\n");
}
function unresolvedSection(base) {
	return bullets((base.unresolved ?? []).map((u) => `${code(`${u.entity}.${u.column}`)}${u.note ? ` — ${oneLine(u.note)}` : ""}`));
}
/** Id-like columns no relation starts from, that are not listed in `unresolved` or `lookupKeys`, a primary key column or the scope column. */
function orphanIdSection(base) {
	const used = /* @__PURE__ */ new Set();
	const key = (entity, column) => JSON.stringify([entity, column]);
	for (const r of base.relations) for (const p of r.join) used.add(key(r.from, p.from));
	for (const u of base.unresolved ?? []) used.add(key(u.entity, u.column));
	for (const [name, entity] of Object.entries(base.entities)) for (const k of entity.lookupKeys ?? []) used.add(key(name, k.column));
	const lines = [];
	for (const [name, entity] of Object.entries(base.entities)) for (const column of Object.keys(entity.columns)) {
		if (!isIdLike(column) || used.has(key(name, column)) || entity.primaryKey.includes(column) || column === base.scope?.column) continue;
		lines.push(code(`${name}.${column}`));
	}
	return bullets(lines);
}
function sensitiveSection(base) {
	const lines = [];
	for (const [key, entity] of Object.entries(base.entities)) for (const [name, def] of Object.entries(entity.columns)) if (def.sensitive !== true && isPossiblySensitive(name)) lines.push(code(`${key}.${name}`));
	return bullets(lines);
}
var untitledSection = (base) => bullets(Object.entries(base.entities).filter(([, e]) => !e.titleColumns || e.titleColumns.length === 0).map(([key]) => code(key)));
/** The mechanical half of `<stem>.selectr-review.md`; the reviewer fills in "For the reviewer". */
function reviewChecks(input) {
	const { base, problems, introspection, verifyReport, unreadableBase = false } = input;
	const sections = [
		["Validation", validationSection(problems, unreadableBase)],
		["Coverage", coverageSection(base, introspection)],
		["Join pairs whose column types differ", typeDifferenceSection(base)],
		["Unconfirmed relations", unconfirmedSection(base, verifyReport)],
		["Verify-joins", verifySection(verifyReport)],
		["Unresolved", unresolvedSection(base)],
		["Id-like columns without a relation", orphanIdSection(base)],
		["Possibly sensitive columns not flagged", sensitiveSection(base)],
		["Entities without title columns", untitledSection(base)]
	];
	return `${`# Review: ${oneLine(base.name)}\n\nMechanical checks by \`selectr-schema review-checks\`; the reviewer's notes are under For the reviewer.`}\n\n${sections.map(([title, body]) => `## ${title}\n\n${body}`).join("\n\n")}\n\n${REVIEWER_HEADING}\n`;
}
/**
* `fresh` (from reviewChecks) with the reviewer's notes from a previous run:
* everything from `existing`'s "For the reviewer" heading to its end replaces
* the empty section. Without that heading, `fresh` stands as it is.
*/
function keepReviewerNotes(fresh, existing) {
	const kept = existing === null ? null : REVIEWER_HEADING_RE.exec(existing);
	const mine = REVIEWER_HEADING_RE.exec(fresh);
	if (kept === null || mine === null) return fresh;
	return fresh.slice(0, mine.index) + existing.slice(kept.index);
}
function readVerifyReport(path) {
	const json = readJson(path);
	if (!isObject(json) || !Array.isArray(json.results)) throw new Error(`${path}: not a verify-joins report`);
	return json;
}
/**
* The base for a review when validation found errors: the file as it is when it
* is shaped well enough to read, else an empty one, so the report is still written.
*/
function readableBase(json, problems) {
	if (!problems.some((p) => p.level === "error")) return {
		base: json,
		unreadable: false
	};
	try {
		reviewChecks({
			base: json,
			problems
		});
		return {
			base: json,
			unreadable: false
		};
	} catch {
		const obj = isObject(json) ? json : {};
		return {
			base: {
				...obj,
				name: typeof obj.name === "string" ? obj.name : "(unnamed)",
				entities: {},
				relations: []
			},
			unreadable: true
		};
	}
}
var USAGE = "review-checks <base> [--overlay <path>] [--introspection <introspection.json>] [--verify-report <report.json>] --out <review.md>   Write the mechanical half of the reviewer's report";
// skills/selectr-schema/src/cli.ts
var commands = {
	draft: draftCommand,
	introspect: introspectCommand,
	"review-checks": {
		usage: USAGE,
		async run(args) {
			let parsed;
			try {
				parsed = parseArgs({
					args,
					allowPositionals: true,
					options: {
						overlay: { type: "string" },
						introspection: { type: "string" },
						"verify-report": { type: "string" },
						out: { type: "string" }
					}
				});
			} catch (e) {
				console.error(redact(errorMessage(e)));
				return 2;
			}
			const [basePath, ...extra] = parsed.positionals;
			const { overlay, introspection: introPath, "verify-report": reportPath, out } = parsed.values;
			if (!basePath || extra.length > 0 || !out) {
				console.error(`Usage: ${USAGE}`);
				return 2;
			}
			let problems;
			let base;
			let unreadableBase;
			let intro;
			let report;
			let existing = null;
			try {
				const validated = validateFiles(basePath, overlay);
				if (validated.unsupported) throw new Error(`${basePath}: not a Selectr schema v2 file`);
				problems = validated.problems;
				({base, unreadable: unreadableBase} = readableBase(readJson(basePath), problems));
				if (introPath) intro = readIntrospection(introPath);
				if (reportPath) report = readVerifyReport(reportPath);
				if (existsSync(out)) existing = readFileSync(out, "utf8");
			} catch (e) {
				console.error(redact(errorMessage(e)));
				return 2;
			}
			try {
				const text = keepReviewerNotes(reviewChecks({
					base,
					problems,
					introspection: intro,
					verifyReport: report,
					unreadableBase
				}), existing);
				mkdirSync(dirname(resolve(out)), { recursive: true });
				writeFileSync(out, text);
			} catch (e) {
				console.error(redact(errorMessage(e)));
				return 2;
			}
			const errors = problems.filter((p) => p.level === "error").length;
			console.error(`${errors} errors, ${problems.length - errors} warnings; review written to ${out}`);
			return errors > 0 ? 1 : 0;
		}
	},
	validate: validateCommand,
	"verify-joins": verifyJoinsCommand
};
function usage() {
	return `Usage: selectr-schema <command> [options]\n\nCommands:\n${Object.values(commands).map((c) => `  ${c.usage}`).join("\n")}`;
}
async function main(argv) {
	const [name, ...args] = argv;
	if (name === "--help" || name === "-h") {
		console.log(usage());
		return 0;
	}
	const command = name !== void 0 && Object.hasOwn(commands, name) ? commands[name] : void 0;
	if (!command) {
		console.error(usage());
		return 2;
	}
	return command.run(args);
}
var entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(realpathSync(entry)).href) main(process.argv.slice(2)).then((code) => process.exit(code));
export { main };
