import { db, collection, getDocs } from "./firestore.js";

const container =
    document.getElementById("matchDetails");

async function loadMatch() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "matches")
            );

        let match = null;

        snapshot.forEach((doc) => {

            if (!match) {
                match = doc.data();
            }

        });

        if (!match) {

            container.innerHTML =
                "No match found.";

            return;
        }

        container.innerHTML = `
            <div class="match-card">

                <h2>
                    ${match.team1}
                    vs
                    ${match.team2}
                </h2>

                <p><strong>Format:</strong> ${match.format}</p>

                <p><strong>Venue:</strong> ${match.venue}</p>

                <p><strong>Series:</strong> ${match.series || "N/A"}</p>

                <p><strong>Season:</strong> ${match.season || "N/A"}</p>

                <p><strong>Status:</strong> ${match.status || "N/A"}</p>

                <p>
                    <strong>Toss:</strong>
                    ${match.tossWinner || "N/A"}
                    chose to
                    ${match.tossDecision || "N/A"}
                </p>

                <p>
                    <strong>Player Of Match:</strong>
                    ${match.playerOfMatch || "N/A"}
                </p>

                <p>
                    <strong>Result:</strong>
                    ${match.result || "N/A"}
                </p>

            </div>
        `;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to load match.";
    }
}

loadMatch();
