import require$$0 from "util";
import { r as requireIsProperty } from "./is-property.mjs";
var generateFunction;
var hasRequiredGenerateFunction;
function requireGenerateFunction() {
  if (hasRequiredGenerateFunction) return generateFunction;
  hasRequiredGenerateFunction = 1;
  var util = require$$0;
  var isProperty = requireIsProperty();
  var INDENT_START = /[\{\[]/;
  var INDENT_END = /[\}\]]/;
  var RESERVED = [
    "do",
    "if",
    "in",
    "for",
    "let",
    "new",
    "try",
    "var",
    "case",
    "else",
    "enum",
    "eval",
    "null",
    "this",
    "true",
    "void",
    "with",
    "await",
    "break",
    "catch",
    "class",
    "const",
    "false",
    "super",
    "throw",
    "while",
    "yield",
    "delete",
    "export",
    "import",
    "public",
    "return",
    "static",
    "switch",
    "typeof",
    "default",
    "extends",
    "finally",
    "package",
    "private",
    "continue",
    "debugger",
    "function",
    "arguments",
    "interface",
    "protected",
    "implements",
    "instanceof",
    "NaN",
    "undefined"
  ];
  var RESERVED_MAP = {};
  for (var i = 0; i < RESERVED.length; i++) {
    RESERVED_MAP[RESERVED[i]] = true;
  }
  var isVariable = function(name) {
    return isProperty(name) && !RESERVED_MAP.hasOwnProperty(name);
  };
  var formats = {
    s: function(s) {
      return "" + s;
    },
    d: function(d) {
      return "" + Number(d);
    },
    o: function(o) {
      return JSON.stringify(o);
    }
  };
  var genfun = function() {
    var lines = [];
    var indent = 0;
    var vars = {};
    var push = function(str) {
      var spaces = "";
      while (spaces.length < indent * 2) spaces += "  ";
      lines.push(spaces + str);
    };
    var pushLine = function(line2) {
      if (INDENT_END.test(line2.trim()[0]) && INDENT_START.test(line2[line2.length - 1])) {
        indent--;
        push(line2);
        indent++;
        return;
      }
      if (INDENT_START.test(line2[line2.length - 1])) {
        push(line2);
        indent++;
        return;
      }
      if (INDENT_END.test(line2.trim()[0])) {
        indent--;
        push(line2);
        return;
      }
      push(line2);
    };
    var line = function(fmt) {
      if (!fmt) return line;
      if (arguments.length === 1 && fmt.indexOf("\n") > -1) {
        var lines2 = fmt.trim().split("\n");
        for (var i2 = 0; i2 < lines2.length; i2++) {
          pushLine(lines2[i2].trim());
        }
      } else {
        pushLine(util.format.apply(util, arguments));
      }
      return line;
    };
    line.scope = {};
    line.formats = formats;
    line.sym = function(name) {
      if (!name || !isVariable(name)) name = "tmp";
      if (!vars[name]) vars[name] = 0;
      return name + (vars[name]++ || "");
    };
    line.property = function(obj, name) {
      if (arguments.length === 1) {
        name = obj;
        obj = "";
      }
      name = name + "";
      if (isProperty(name)) return obj ? obj + "." + name : name;
      return obj ? obj + "[" + JSON.stringify(name) + "]" : JSON.stringify(name);
    };
    line.toString = function() {
      return lines.join("\n");
    };
    line.toFunction = function(scope) {
      if (!scope) scope = {};
      var src = "return (" + line.toString() + ")";
      Object.keys(line.scope).forEach(function(key) {
        if (!scope[key]) scope[key] = line.scope[key];
      });
      var keys = Object.keys(scope).map(function(key) {
        return key;
      });
      var vals = keys.map(function(key) {
        return scope[key];
      });
      return Function.apply(null, keys.concat(src)).apply(null, vals);
    };
    if (arguments.length) line.apply(null, arguments);
    return line;
  };
  genfun.formats = formats;
  generateFunction = genfun;
  return generateFunction;
}
export {
  requireGenerateFunction as r
};
