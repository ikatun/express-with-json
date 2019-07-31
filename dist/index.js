"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var defaultErrorInfo = {
    statusCode: 500,
};
var JsonErrorResponse = /** @class */ (function (_super) {
    __extends(JsonErrorResponse, _super);
    function JsonErrorResponse(body, errorInfo) {
        if (errorInfo === void 0) { errorInfo = defaultErrorInfo; }
        var _this = _super.call(this) || this;
        _this.body = body;
        _this.errorInfo = errorInfo;
        // @ts-ignore
        _this.__proto__ = JsonErrorResponse.prototype; // required for instanceof to work after transpilation
        return _this;
    }
    JsonErrorResponse.prototype.writeResponse = function (res) {
        var statusCode = this.errorInfo.statusCode;
        if (statusCode !== undefined) {
            res.status(statusCode);
        }
        res.send(this.body);
    };
    return JsonErrorResponse;
}(Error));
exports.JsonErrorResponse = JsonErrorResponse;
exports.jsonHandler = function (handler) { return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var handlerResponse, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, handler(req, res)];
            case 1:
                handlerResponse = _a.sent();
                res.json(handlerResponse);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                if (e_1 instanceof JsonErrorResponse) {
                    e_1.writeResponse(res);
                }
                else {
                    next(e_1);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); }; };
exports.middlewareHandler = function (handler) { return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (handler.length > 2) {
                    return [2 /*return*/, handler(req, res, next)];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, handler(req, res)];
            case 2:
                _a.sent();
                next();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                if (e_2 instanceof JsonErrorResponse) {
                    e_2.writeResponse(res);
                }
                else {
                    next(e_2);
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }; };
function last(xs) {
    return xs[xs.length - 1];
}
function init(xs) {
    return xs.slice(0, -1);
}
function toRegularExpressArgs(handlers) {
    return init(handlers).map(exports.middlewareHandler).concat([exports.jsonHandler(last(handlers))]);
}
function withJson(express) {
    express['getJson'] = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return express.get.apply(express, [path].concat(toRegularExpressArgs(handlers)));
    };
    express['patchJson'] = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return express.patch.apply(express, [path].concat(toRegularExpressArgs(handlers)));
    };
    express['postJson'] = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return express.post.apply(express, [path].concat(toRegularExpressArgs(handlers)));
    };
    express['deleteJson'] = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return express.delete.apply(express, [path].concat(toRegularExpressArgs(handlers)));
    };
    express['putJson'] = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return express.put.apply(express, [path].concat(toRegularExpressArgs(handlers)));
    };
    express['useAsync'] = function () {
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        return express.use.apply(express, handlers.map(exports.middlewareHandler));
    };
    return express;
}
exports.withJson = withJson;
exports.default = withJson;
