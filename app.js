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
                <a href="match.html?id=${doc.id}" style="text-decoration:none;color:inherit;">
                    <div class="match-card">
                        <h3>${match.team1} vs ${match.team2}</h3>
                        <p>${match.format}</p>
                        <p>${match.venue}</p>
                    </div>
                </a>
            `;
        });

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML = "Unable to load matches.";
    }
}

loadMatches();
