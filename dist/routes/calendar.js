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
Object.defineProperty(exports, "__esModule", { value: true });
var graph = require("@microsoft/microsoft-graph-client");
var express = require("express");
var auth_1 = require("../helpers/auth");
var router = express.Router();
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var parms, accessToken, userName, client, start, end, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parms = { title: 'Calendar', active: { calendar: true } };
                    return [4 /*yield*/, auth_1.getAccessToken(req.cookies, res)];
                case 1:
                    accessToken = _a.sent();
                    userName = req.cookies.graph_user_name;
                    if (!(accessToken && userName)) return [3 /*break*/, 6];
                    parms.user = userName;
                    client = graph.Client.init({
                        authProvider: function (done) {
                            done(null, accessToken);
                        }
                    });
                    start = new Date(new Date().setHours(0, 0, 0));
                    end = new Date(new Date(start).setDate(start.getDate() + 7));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, client
                            .api("/me/calendarView?startDateTime=" + start.toISOString() + "&endDateTime=" + end.toISOString())
                            .top(10)
                            .select('subject,start,end,attendees')
                            .orderby('start/dateTime DESC')
                            .get()];
                case 3:
                    result = _a.sent();
                    console.log(JSON.stringify(result, null, 2));
                    parms.events = result.value;
                    res.render('calendar', parms);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    parms.message = 'Error retrieving events';
                    parms.error = { status: err_1.code + ": " + err_1.message };
                    parms.debug = JSON.stringify(err_1.body, null, 2);
                    res.render('error', parms);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.redirect('/');
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
});
exports.default = router;
