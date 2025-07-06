"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var cors_1 = require("cors");
// Route imports
var api_js_1 = require("./api/api.js");
var PORT = 8080;
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] //ow yeah
}));
app.use(express_1.default.static("build")); // Adjust path if needed for your static files
app.use(express_1.default.json());
// Routes
app.use('/', api_js_1.default);
server.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});
