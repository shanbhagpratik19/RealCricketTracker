alert("app.js loaded");

import { db, collection, addDoc } from "./firestore.js";

alert("Firestore imported");

window.saveMatch = async function () {

    alert("Save button clicked");

    const team1 = document.getElementById("team1")?.value;
    const team2 = document.getElementById("team2")?.value;
    const format = document.getElementById("format")?.value;
    const venue = document.getElementById("venue")?.value;

    try {

        await addDoc(collection(db, "matches"), {
            team1,
            team2,
            format,
            venue,
            createdAt: new Date().toISOString()
        });

        alert("Match saved to Firestore!");

    } catch (error) {

        alert("Firebase Error: " + error.message);
    }
};
