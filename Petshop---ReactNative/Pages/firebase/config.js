import firebase from "firebase";

// 
// Configuração do projeto no firebase
//
const firebaseConfig = {
  apiKey: "AIzaSyCVgE-PaK8THfUZcfT23Tq3LHTQnPAdaU0",
  authDomain: "petshopcaobrabo-reactnative.firebaseapp.com",
  projectId: "petshopcaobrabo-reactnative",
  storageBucket: "petshopcaobrabo-reactnative.firebasestorage.app",
  messagingSenderId: "684652381715",
  appId: "1:684652381715:web:d3abdf2e6a5913d6a721e6"
};


if (!firebase.apps.length) {
  console.log("inicilizando firebase...");
  firebase.initializeApp(firebaseConfig);
}
else
  console.log("algum problema :(");

export default firebase;