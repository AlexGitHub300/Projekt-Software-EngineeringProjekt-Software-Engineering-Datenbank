// Importiere Firebase v9 Funktionen
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase-Konfiguration mit API-Schlüssel und Projektdaten
const firebaseConfig = {
  apiKey: "AIzaSyCZr4S1QLfWhkSxLfRYYdL7aBowBddmrnM",
  authDomain: "quiz-datenbank.firebaseapp.com",
  projectId: "quiz-datenbank",
  storageBucket: "quiz-datenbank.appspot.com",
  messagingSenderId: "442973378183",
  appId: "1:442973378183:web:2929f07ad7fea30fe98a22",
};

// Firebase initialisieren und Firestore-Datenbankzugriff erstellen
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);



// Funktion zum Hochladen und Speichern des JSON-Inhalts in Firestore
async function uploadFile() {
  const fileInput = document.getElementById("fileInput"); // Eingabefeld für die Datei
  const file = fileInput.files[0]; // Wählt die erste Datei im Input-Feld aus

  // Überprüft, ob eine Datei ausgewählt wurde
  if (!file) {
    alert("Bitte wähle eine Datei aus.");
    return;
  }
  // Überprüft, ob die ausgewählte Datei eine JSON-Datei ist
  if (file.type !== "application/json") {
    alert("Bitte wähle eine JSON-Datei aus.");
    return;
  }

  const statusElement = document.getElementById("status"); // Status-Element, um den Status anzuzeigen
  statusElement.textContent = "Datei wird hochgeladen..."; // Status auf "Datei wird hochgeladen" setzen

  const user = auth.currentUser; // Holt den aktuellen Benutzer aus Firebase Auth
  if (!user) {
    alert("Bitte melde dich zuerst an, um Dateien hochzuladen.");
    return;
  }

  try {
    const reader = new FileReader(); // FileReader-Instanz, um die Datei zu lesen
    reader.readAsText(file);  // Datei als Text lesen

    // Wenn die Datei erfolgreich gelesen wurde
    reader.onload = async function () {
      try {
        const jsonData = JSON.parse(reader.result); // Parse den JSON-Inhalt der Datei

        // Speichern der Datei-Daten
        const fileData = {
          fileName: file.name,
          content: jsonData,
          uploadedAt: new Date(),
          ownerId: user.uid, // Benutzer-ID hinzufügen
        };
        // Speichern der Datei in Firestore
        await addDoc(collection(firestore, "Datenbank"), fileData);

        // Statusnachricht, dass die Datei erfolgreich hochgeladen wurde
        statusElement.textContent = "Datei erfolgreich hochgeladen und gespeichert!";
        console.log("Datei-Inhalt erfolgreich in Firestore gespeichert!");
      } catch (error) {
        console.error("Fehler beim Verarbeiten der JSON-Datei: ", error);
        statusElement.textContent = "Fehler beim Verarbeiten der Datei.";
      }
    };
    // Fehlerbehandlung beim Laden der Datei
    reader.onerror = function (error) {
      console.error("Fehler beim Laden der Datei: ", error);
      statusElement.textContent = "Fehler beim Laden der Datei.";
    };
  } catch (error) {
    console.error("Fehler beim Hochladen oder Speichern: ", error);
    statusElement.textContent = "Ein Fehler ist aufgetreten.";
  }
}


// Funktion für den globalen Zugriff auf uploadFile
window.uploadFile = uploadFile;






// Echtzeit-Listener für die Sammlung "Datenbank" (Firestore)
function setupRealtimeListener() {
  const datenbankCollection = collection(firestore, "Datenbank");

  // Setzt einen Echtzeit-Listener für die Sammlung
  onSnapshot(datenbankCollection, (snapshot) => {
    const fileList = document.getElementById("fileList"); // Holt das Element, das die Datei-Liste darstellt
    fileList.innerHTML = ""; // Löscht die aktuelle Liste, um sie mit neuen Daten zu füllen

    const user = auth.currentUser; // Holt den aktuellen Benutzer
    if (!user) {
      console.error("Kein Benutzer eingeloggt.");
      return;
    }
    // Geht alle Dokumente (Dateien) durch
    snapshot.forEach((doc) => {
      const fileData = doc.data(); // Holt die Daten aus jedem Dokument

      // Erstellt ein Listenelement für jede Datei
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${fileData.fileName || "Unbekannter Name"}</strong> - 
        <button onclick="downloadFile('${doc.id}')">Herunterladen</button>
        ${fileData.ownerId === user.uid
          ? `<button onclick="deleteFile('${doc.id}')">Löschen</button>` : ""}`;
      // Fügt das Listenelement zur Datei-Liste hinzu
      fileList.appendChild(listItem);
    });

  });
}


// Rufe die Funktion auf, um den Echtzeit-Listener zu aktivieren
setupRealtimeListener();




// Importiere Firestore-Funktionen für den Datei-Download
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Funktion zum Abrufen und Herunterladen der gespeicherten JSON-Datei
async function downloadFile(documentId) {
  try {
    // Abrufen des Dokuments aus Firestore
    const docRef = doc(firestore, "Datenbank", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fileData = docSnap.data();

      // Überprüfen, ob der content-Array vorhanden ist
      const jsonContent = fileData.content;

      if (!Array.isArray(jsonContent)) {
        console.error("Der Inhalt ist kein Array oder fehlt.");
        return;
      }

      // JSON-Daten formatieren und speichern
      const formattedJson = JSON.stringify(jsonContent, null, 2); // Formatieren für bessere Lesbarkeit
      const blob = new Blob([formattedJson], { type: "application/json" });

      // Temporärer Download-Link erstellen
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileData.fileName || "download.json"; // Name der heruntergeladenen Datei
      document.body.appendChild(a);
      a.click(); // Klickt den Link, um den Download zu starten
      document.body.removeChild(a); // Entfernt den Link nach dem Download
      URL.revokeObjectURL(url); // Widerruft den URL-Blob

      //Wartung und überprüfung richtiges herunterladen
      console.log("Datei erfolgreich heruntergeladen!");
    } else {
      console.log("Dokument nicht gefunden!");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Datei: ", error);
  }
}

// Funktion für globalen Zugriff verfügbar machen
window.downloadFile = downloadFile;


// Importiere Firestore-Funktionen zum Löschen von Dokumenten
import { deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Funktion zum Löschen eines Dokuments aus Firestore
async function deleteFile(documentId) {
  try {
    const docRef = doc(firestore, "Datenbank", documentId);

    // Löscht das Dokument aus der Firestore-Datenbank
    await deleteDoc(docRef);
    alert("Dokument erfolgreich gelöscht.");
  } catch (error) {
    alert("Ein Fehler ist beim Löschen aufgetreten.");
  }
}

// Funktion für globalen Zugriff verfügbar machen
window.deleteFile = deleteFile;



// Importiere Firebase Auth Funktionen
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Initialisiere Firebase Auth
const auth = getAuth();

// Funktion zum Überprüfen des Anmeldestatus
function checkLoginStatus() {
  const user = auth.currentUser; // Holt den aktuellen Benutzer

  if (user) {

    document.getElementById("loginStatus").textContent = `Angemeldet als: ${user.displayName || user.email}`; // Zeigt den Benutzernamen oder die E-Mail an
  } else {
    document.getElementById("loginStatus").textContent = "Nicht angemeldet"; // Zeigt "Nicht angemeldet" an
  }
}




// Funktion zum Ausloggen
async function logout() {
  try {
    // Abmelden des Benutzers
    await signOut(auth);


    // Weiterleitung zur Login-Seite
    window.location.href = "index.html"; // Weiterleitung zur Login-Seite
  } catch (error) {
  }
}

// Funktion für globalen Zugriff verfügbar machen
window.logout = logout;





// Rufe die Funktion auf, um den aktuellen Status anzuzeigen
checkLoginStatus();

// Echtzeit-Überwachung des Anmeldestatus
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Benutzer ist eingeloggt: ", user.uid);
    document.getElementById("loginStatus").textContent = `Angemeldet als: ${user.displayName || user.email}`;
  } else {
    console.log("Kein Benutzer eingeloggt.");
    document.getElementById("loginStatus").textContent = "Nicht angemeldet";
  }
});








