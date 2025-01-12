// Importiere die Funktionen, die aus der Firebase SDK benötigt werden
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Importiere Authentifizierungsfunktionen
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";




// Firebase-Konfiguration: enthält die Projektinformationen, die Firebase benötigt
const firebaseConfig = {
  apiKey: "AIzaSyCZr4S1QLfWhkSxLfRYYdL7aBowBddmrnM",
  authDomain: "quiz-datenbank.firebaseapp.com",
  projectId: "quiz-datenbank",
  storageBucket: "quiz-datenbank.firebasestorage.com",
  messagingSenderId: "442973378183",
  appId: "1:442973378183:web:2929f07ad7fea30fe98a22"
};

// Initialisiere die Firebase-App mit der Konfiguration und Firebase-Authentifizierung
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);






// Event-Listener für den Login-Button hinzufügen
const submit = document.getElementById('submitlogin');
submit.addEventListener("click", function (event) {
  event.preventDefault()

  // Eingabewerte aus den Input-Feldern holen
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validierung der E-Mail-Adresse
  if (!email.includes('@') || email.length < 5) {
    alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");  // Warnung ausgeben
    return;
  }

  // Validierung des Passworts
  if (password.length < 6) {
    alert("Das Passwort muss mindestens 6 Zeichen lang sein.");
    return;
  }
  // Firebase-Methode, um sich mit E-Mail und Passwort anzumelden
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      // Erfolgreiche Anmeldung
      const user = userCredential.user; // Benutzerinformationen aus der Anmeldung abrufen

      // Überprüfen, ob eine Weiterleitungs-URL gespeichert wurde
      const redirectUrl = localStorage.getItem("redirectTo") || "datenbank.html";
      localStorage.removeItem("redirectTo");
      window.location.href = redirectUrl; // Weiterleitung zur Zielseite
    })
    // Fehlerbehandlung bei der Anmeldung
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");

    });


});