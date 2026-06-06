import { db, collection, getDocs } from "./firestore.js";

async function loadMatches() {

    const container = document.getElementById("recentMatches");

    if (!container) return;

    container.innerHTML = "Loading matches...";

    try {

        const snapshot = await getDocs(
            collection(db, "matches")
        );

        let html = "";

        snapshot.forEach((doc) => {

            const match = doc.data();

            html += `
                <div style="padding:10px; margin-bottom:10px;">
                    <strong>${match.team1} vs ${match.team2}</strong>
                    <br>
                    ${match.format} • ${match.venue}
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (error) {

     console.error(error);

        container.innerHTML = "Unable to load matches.";
    }
}

loadMatches();
