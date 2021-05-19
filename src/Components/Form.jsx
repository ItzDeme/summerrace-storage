import React, { useState } from "react";

import chest from "../images/treasurechest.png";
function Form(props) {
  const [userIsRegistered, setUserRegistered] = useState(false);
  const register = "Register";
  const login = "Login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = props.firebase;
  const [wrong, setWrong] = useState(false);
  const [error, setError] = useState("");
  const details = props.details;

  //sets email and passwords onChange
  function handleInputs(event) {
    if (event.target.type === "email") {
      setEmail(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  }
  //form functionality
  function handleForm(event) {
    //signing UP with email and password
    if (event.target.name === register) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          user.sendEmailVerification().then(
            function () {
              // Email sent.
              setUserRegistered(true);
              if (!props.isVerified) {
                const notVerified = "Check your email!";
                errorHandler(notVerified);
              }
            },
            function (error) {
              errorHandler(error);
            }
          );

          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          errorHandler(errorMessage);
        });
    } else {
      //Signing in with Email and password
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;

          // tells you to check your email if you haven't again
          if (!user.emailVerified) {
            const notVerified = "Check your email!";
            errorHandler(notVerified);
          } else {
            firebase
              .database()
              .ref("/users/")
              .orderByChild("email")
              .equalTo(user.email)
              .once("value", (snapshot) => {
                if (snapshot.exists()) {
                  props.setIsLoggedIn(true);
                } else {
                  writeUserData(user);
                  props.setIsLoggedIn(true);
                }
              });
          }
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          errorHandler(errorMessage);
        });

      setUserRegistered(true);
    }
    event.preventDefault();
  }
  //creates the datase info for the user
  const writeUserData = (user) => {
    const firestore = firebase.database().ref("/users/");
    let data = {
      email: user.email,
      id: user.uid,
      items: details,
    };
    firestore.child(user.uid).set(data);
  };
  //hands the errors, and shows the errors on the form
  function errorHandler(err) {
    setError(err);
    setWrong(true);
  }

  return (
    <div className="form-holder">
      <div
        className={`form-hanlder${userIsRegistered ? " is-registered" : ""}`}
        onClick={() => {
          setUserRegistered(true);
        }}
      >
        Sign In
      </div>
      <div
        className={`form-hanlder${!userIsRegistered ? " is-registered" : ""}`}
        onClick={() => {
          setUserRegistered(false);
        }}
      >
        Register
      </div>
      <form
        className="form-signin"
        name={userIsRegistered ? login : register}
        onSubmit={handleForm}
      >
        <div class="text-center mb-4">
          <img class="mb-4" src={chest} alt="" width="72" height="72" />
          <h1 class="h3 mb-3 font-weight-normal">
            {userIsRegistered ? login : register}
          </h1>
        </div>

        <div class="form-label-group">
          <input
            onChange={handleInputs}
            autoComplete="off"
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            required="true"
            autofocus=""
            name="email"
          />
        </div>

        <div class="form-label-group">
          <input
            onChange={handleInputs}
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required="true"
            name="password"
          />
        </div>
        {wrong && <p className="wrong">{error}</p>}
        <div class="checkbox mb-3"></div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">
          {userIsRegistered ? login : register}
        </button>
      </form>
    </div>
  );
}

export default Form;
