// firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebaseConfig from "./firebaseConfig";

const app = firebase.apps[0];
if (!app) {
  firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
