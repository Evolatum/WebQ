import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
//const db = admin.firestore();

import * as sgMail from "@sendgrid/mail";

const API_KEY = functions.config().sendgrid.key;
console.log("Key: " + API_KEY)
const TEMPLATE_ID = functions.config().sendgrid.template;
console.log("Temp ID: " + TEMPLATE_ID)
sgMail.setApiKey(API_KEY);

export const welcomeEmail= functions.auth.user().onCreate(user => {

    const msg =  {
        to: user.email,
        from: "webqsolutionsdev@gmail.com",
        templateId: "d-63ef99ca12ab4886b6b0aff5211b5d12",
        dynamic_template_data: {
            name: "name",
        },
    };

    return sgMail.send(msg);

});


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
// response.send(TEMPLATE_ID);
// });
