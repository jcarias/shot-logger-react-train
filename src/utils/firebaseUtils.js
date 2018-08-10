import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDk6v-qZv-eO4d3XVqbI-D8PWBwOxutNt8",
  authDomain: "shot-logger.firebaseapp.com",
  databaseURL: "https://shot-logger.firebaseio.com",
  projectId: "shot-logger",
  storageBucket: "shot-logger.appspot.com",
  messagingSenderId: "595769913693"
};

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
