import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
//const db = admin.firestore();

import * as sgMail from "@sendgrid/mail";

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const welcomeEmail = functions.auth.user().onCreate(user => {

    const msg =  {
        to: user.email,
        from: "webqsolutionsdev@gmail.com",
        templateId: TEMPLATE_ID,
        // dynamic_template_data: {
        //     name: user.displayName
        // },
    };
    console.log("Email: " + user.email)
    console.log("Name: " + user.displayName)
    console.log("Full: " + JSON.stringify(user))

    return sgMail.send(msg);

});

export const mailSend = functions.database.ref("mail").onUpdate((change, context) => {
    const before = change.before.val()
    const after = change.after.val()

    if (before.text === after.text) {
        console.log("No change")
        return null
    }

    const text = "false"
    change.after.ref.update({ text })

        const msg =  {
            to: before.text,
            from: "webqsolutionsdev@gmail.com",
            templateId: "d-bb3d07360a654cf68e1d563f39e38593",
            // dynamic_template_data: {
            //     name: user.displayName
            // },
        };
        return sgMail.send(msg)
})




//functions.auth.user().onProfileUpdated fix to update instead of only on create

export const sendByeEmail = functions.auth.user().onDelete((user) => {
    const msg =  {
        to: user.email,
        from: "webqsolutionsdev@gmail.com",
        templateId: "d-d482ec3ba3d843ab8ee49ce975b9ca02",
        dynamic_template_data: {
            name: user.displayName
        },
    };

    return sgMail.send(msg);

});





// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
// response.send(TEMPLATE_ID);
// });
