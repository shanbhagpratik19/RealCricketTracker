import { db, collection, addDoc } from "./firestore.js";

console.log("RealCricketTracker Loaded");

window.saveMatch = async function () {

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

        console.error(error);

        alert("Error saving match.");
    }
};
