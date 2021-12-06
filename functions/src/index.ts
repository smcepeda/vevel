import * as functions from "firebase-functions";
import {auth} from "firebase-admin/lib/auth";
import UserRecord = auth.UserRecord;
import {onUserCreated} from "./DataStorage";
import {firestore} from "./ConfigFirebase";
const express = require('express');
// const fetch = require('node-fetch');
// const parser = require('fast-xml-parser');
// const cors = require('cors');

const regionalFunctions = functions.region('europe-west1');

export const onUserCreatedTrigger = regionalFunctions
  .auth
  .user()
  .onCreate(async (user:  UserRecord) =>
    onUserCreated(firestore, user));



const app = express();


const opts : functions.RuntimeOptions = {
  memory : '256MB',
  timeoutSeconds : 100
}

export const api = regionalFunctions.runWith(opts).https.onRequest(app);