"use strict";
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
var jwt = require("jsonwebtoken");
var simpleOauth2 = require("simple-oauth2");
var id = 'c9968a27-658a-4ec0-930e-e664f883565b';
var secret = 'vyilueTHSP48oWFT641^_-=';
var tokenHost = 'https://login.microsoftonline.com';
var authorizePath = 'common/oauth2/v2.0/authorize';
var tokenPath = 'common/oauth2/v2.0/token';
var redirect_uri = 'http://localhost:3000/authorize';
var scope = 'openid profile offline_access User.Read Mail.Read Calendars.Read';
var credentials = {
    client: {
        id: id,
        secret: secret
    },
    auth: {
        tokenHost: tokenHost,
        authorizePath: authorizePath,
        tokenPath: tokenPath
    }
};
var oauth2 = simpleOauth2.create(credentials);
exports.getAuthUrl = function () {
    var returnVal = oauth2.authorizationCode.authorizeURL({
        redirect_uri: redirect_uri,
        scope: scope
    });
    return returnVal;
};
var saveValuesToCookie = function (token, res) {
    var user = jwt.decode(token.id_token);
    res.cookie('graph_access_token', token.access_token, {
        maxAge: 3600000,
        httpOnly: true
    });
    res.cookie('graph_user_name', user.name, { maxAge: 3600000, httpOnly: true });
    res.cookie('graph_refresh_token', token.refresh_token, {
        maxAge: 7200000,
        httpOnly: true
    });
    res.cookie('graph_token_expires', token.expires_at.getTime(), {
        maxAge: 3600000,
        httpOnly: true
    });
};
exports.getAccessToken = function (cookies, res) { return __awaiter(_this, void 0, void 0, function () {
    var token, FIVE_MINUTES, expiration, refresh_token, newToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = cookies.graph_access_token;
                if (token) {
                    FIVE_MINUTES = 300000;
                    expiration = new Date(cookies.graph_token_expires - FIVE_MINUTES);
                    if (expiration > new Date()) {
                        return [2 /*return*/, token];
                    }
                }
                refresh_token = cookies.graph_refresh_token;
                if (!refresh_token) return [3 /*break*/, 2];
                return [4 /*yield*/, oauth2.accessToken
                        .create({ refresh_token: refresh_token })
                        .refresh()];
            case 1:
                newToken = _a.sent();
                saveValuesToCookie(newToken, res);
                return [2 /*return*/, newToken.token.access_token];
            case 2: return [2 /*return*/, null];
        }
    });
}); };
exports.getTokenFromCode = function (auth_code, res) { return __awaiter(_this, void 0, void 0, function () {
    var result, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, oauth2.authorizationCode.getToken({
                    code: auth_code,
                    redirect_uri: redirect_uri,
                    scope: scope
                })];
            case 1:
                result = _a.sent();
                token = oauth2.accessToken.create(result).token;
                saveValuesToCookie(token, res);
                return [2 /*return*/, token.access_token];
        }
    });
}); };
exports.clearCookies = function (res) {
    res.clearCookie('graph_access_token', { maxAge: 3600000, httpOnly: true });
    res.clearCookie('graph_user_name', { maxAge: 3600000, httpOnly: true });
    res.clearCookie('graph_refresh_token', { maxAge: 7200000, httpOnly: true });
    res.clearCookie('graph_token_expires', { maxAge: 3600000, httpOnly: true });
};
