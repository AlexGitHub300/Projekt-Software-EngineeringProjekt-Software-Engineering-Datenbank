// Firebase SDKs importieren
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";




// Firebase-Konfiguration (API-Schlüssel und andere Projekt-Daten)
const firebaseConfig = {
  apiKey: "AIzaSyCZr4S1QLfWhkSxLfRYYdL7aBowBddmrnM",
  authDomain: "quiz-datenbank.firebaseapp.com",
  projectId: "quiz-datenbank",
  storageBucket: "quiz-datenbank.firebasestorage.com",
  messagingSenderId: "442973378183",
  appId: "1:442973378183:web:2929f07ad7fea30fe98a22"
};

// Firebase initialisieren mit der Konfiguration
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);






// Zugriff auf das Submit-Element (Button für Formularübermittlung)
const submit = document.getElementById('submit');

// Event Listener für das Klicken auf den "Submit"-Button
submit.addEventListener("click", function (event) {
  event.preventDefault()

  // Eingabewerte von der HTML-Seite holen
  const email = document.getElementById('email').value; // E-Mail-Adresse aus dem Input-Feld holen
  const password = document.getElementById('password').value; // Passwort aus dem Input-Feld holen

  // Überprüfen, ob die E-Mail-Adresse gültig ist
  if (!email.includes('@') || email.length < 5) {
    alert("Bitte geben Sie eine gültige E-Mail-Adresse ein."); // Wenn die E-Mail ungültig ist, zeigen wir eine Fehlermeldung
    return;
  }
  // Überprüfen, ob das Passwort mindestens 6 Zeichen lang ist
  if (password.length < 6) {
    alert("Das Passwort muss mindestens 6 Zeichen lang sein.");
    return;
  }
  // Firebase Authentifizierung: Benutzer mit E-Mail und Passwort erstellen
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {// Erfolgreiche Registrierung

      const user = userCredential.user; // Benutzerobjekt des erfolgreich erstellten Nutzers
      alert("Benutzer erfolgreich erstellt!") // Erfolgsnachricht

    })
    // Fehlerbehandlung
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("errorMessage")

    });


});