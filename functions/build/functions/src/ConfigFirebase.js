"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.firestore = void 0;
var admin = require("firebase-admin");
admin.initializeApp();
exports.firestore = admin.firestore();
exports.storage = admin.storage();
exports.firestore.settings({ ignoreUndefinedProperties: true });
