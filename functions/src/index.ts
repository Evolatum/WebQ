import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
//const db = admin.firestore();

import * as sgMail from "@sendgrid/mail";

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const welcomeEmail= functions.auth.user().onCreate(user => {

    const msg =  {
        to: user.email,
        from: "webqsolutionsdev@gmail.com",
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            name: "name",
        },
    };

    console.log("aasdf")
    console.log(msg)
    return sgMail.send(msg);
    

});


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
// response.send(TEMPLATE_ID);
// });
