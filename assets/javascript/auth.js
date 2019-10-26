$(document).ready(function(){
    // Firebase configuration
    var firebaseKey0 = 'AIzaSyDV2j';
    var firebaseKey1 = 'Ss1bJRIJLygAN';
    var firebaseKey2 = 'SbPVqFILaUL6CHgs';
    // var firebaseConfig = {
    //     apiKey: firebaseKey0+firebaseKey1+firebaseKey2,
    //     authDomain: "webq-d2f02.firebaseapp.com",
    //     databaseURL: "https://webq-d2f02.firebaseio.com",
    //     projectId: "webq-d2f02",
    //     storageBucket: "webq-d2f02.appspot.com",
    //     messagingSenderId: "165215674699",
    //     appId: "1:165215674699:web:ef997945ed83af9c97c8ce",
    //     measurementId: "G-TBK5ELGWZC"
    // };
    // Reference to Joaquin's Firebase
    var firebaseConfig = {
        apiKey: 'AIzaSyAV0ZNNwoumTV_zFiKnNDTImLDgziMu5ow',
        authDomain: 'email-cloud-functions.firebaseapp.com',
        databaseURL: "https://email-cloud-functions.firebaseio.com",
        projectId: "email-cloud-functions",
        storageBucket: "email-cloud-functions.appspot.com",
        messagingSenderId: "328211862949",
        appId: "1:328211862949:web:e57d91ff8473b9cebec44c",
        measurementId: "G-DSS25211TE"
      };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    
    // Get current user profile;
    var user = firebase.auth().currentUser;

    // Initialize FirebaseUI widget
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    // Initialize referente to Firebase Real-Time DB
    var database = firebase.database();
    var dbRef = database.ref("developer");
    var developer = {};
    var gitHubAuth = new firebase.auth.GithubAuthProvider();

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
            },  
            uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            $("#loader").hide();
            // document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: './index.html',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
        };

    $("#logoff").on("click", function(user){
        // event.preventDefault();
        if(user){
            firebase.auth().signOut().then(function() {
            // Sign-out successful.
            }).catch(function(error) {
            // An error happened.
            console.log("Error: " + error);
            });
        }
    });


    // Handling whether user is logged in or not
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $("#logoff").show();
            dbRef.child(user.uid).once('value')
                .then(function(snapshot){
                        if(snapshot.val()){
                            console.log("user exists");
                            localStorage.setItem("uid",user.uid);
                        }else{
                            console.log("adding user");
                            insertUserData(user);
                            localStorage.setItem("uid",user.uid);
                        }
                });
        } else {
            // No user is signed in.
            $("#userLogged").hide();
            ui.start('#firebase-auth-container', uiConfig);
        }
    });


    // Function to insert data for the first time
    function insertUserData(user){
        var user = firebase.auth().currentUser;
        developer.displayName = user.displayName;
        developer.email = user.email;
        console.log(user.displayName);
        user.updateProfile({displayName : developer.displayName})
            .then(function(){
                console.log(user.displayName);
            }).catch(function(error){
                console.log("valio verga");
            });

        dbRef.child(user.uid).set(developer);
    }

    // Function to insert data skills
    function saveChanges(user, userRateMXN, userSkills, userCurrencyPreference){
        firebase.database().ref('developer/' + user.uid).set({
            'displayName' : user.displayName,
            'email' : user.email,
            'userRateMXN' : userRateMXN,
            // 'userSkills' : {userSkills},
            'userCurrencyPreference' : userCurrencyPreference
          }, function(error) {
            if (error) {
            //   console.log("algo fallo");
            } else {
            //   console.log("yeiiii");
            }
          });
    }

    firebase.auth().signInWithPopup(gitHubAuth).then(function(result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });


    //Holds all skills initialized as false
    var userSkills = {
        'Angular':false,
        'Express':false,
        'Django':false,
        'Flask':false,
        'GraphQL':false,
        'MongoDB':false,
        'MySQL':false,
        'Node.js':false,
        'React':false,
    }

    //Checks if any change is made to a skill checkmark, and toggles boolean value
    $(document).on("change",".developerCheck .checkContainer", function(){
        userSkills[$(this).children()[0].innerHTML] = !userSkills[$(this).children()[0].innerHTML]
    });
    
    //Saves changes made to user preferences
    $(document).on("click","#saveChanges", function(){
        var user = firebase.auth().currentUser;
        var userCurrencyPreference = $("#currency").text();
        var userRateMXN = $(`#sliderRate`).val().trim();

        //Esto es lo que se guarda en database
        console.log(userRateMXN, userSkills, userCurrencyPreference);
        console.log(user);
        if (user) {
            // dbRef.child(user.uid).once('value')
            //     .then(function(snapshot){
                   saveChanges(user,userRateMXN, userSkills, userCurrencyPreference);
            // });
        }
    });
        
});