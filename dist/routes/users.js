"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) { return res.send('respond with a resource'); });
exports.default = router;
