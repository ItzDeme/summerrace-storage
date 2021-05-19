import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import React, { useState, useEffect } from "react";
import Container from "./Components/Container";
import Footer from "./Components/Footer";
import Form from "./Components/Form";
import Header from "./Components/Header";
import details from "../src/test folder/details.json";
require("dotenv").config();
//you know the database stuff
function App() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  //sets isLoggedIn via google auth
  const [isLoggedIn, setIsLoggedIn] = useState(firebase.auth().currentUser);
  const [isVerified, setIsVerified] = useState(false);
  //verification check
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        if (isVerified != null) {
          setIsLoggedIn(true);
        } else {
          console.log("it's null");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);
  //javascript responsive functionality
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  var useWindowDimensions = function () {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );
    //handles the width dimensions of the website
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  };
  const { height, width } = useWindowDimensions();

  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="full-width">
          <Header firebase={firebase} setIsLoggedIn={setIsLoggedIn} />

          <div className="container-fluid">
            <div className="">
              <Container
                width={width}
                firebase={firebase}
                typeOf="Non-Consumable"
              />
              <Container width={width} firebase={firebase} typeOf="Equip" />
              <Container
                width={width}
                firebase={firebase}
                typeOf="Consumable"
              />
            </div>
          </div>
        </div>
      ) : (
        <Form
          firebase={firebase}
          setIsLoggedIn={setIsLoggedIn}
          isVerified={isVerified}
          details={details}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
