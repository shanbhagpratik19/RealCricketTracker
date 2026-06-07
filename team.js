import {
    db,
    collection,
    getDocs
} from "./firestore.js";

const container =
    document.getElementById(
        "teamProfile"
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const teamName =
    params.get("name");

async function loadTeam() {

    if (!teamName) {

        container.innerHTML =
            "No team selected.";

        return;
    }

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "players"
                )
            );

        let players = [];

        snapshot.forEach((doc) => {

            const player =
                doc.data();

            if (
                player.team === teamName
            ) {
                players.push(
                    player
                );
            }

        });

        let html = `
            <div class="match-card">

                <h2>
                    ${teamName}
                </h2>

                <p>
                    Players:
                    ${players.length}
                </p>

                <hr>

                <h3>
                    Squad
                </h3>
        `;

        players.forEach((player) => {

            html += `
                <p>
                    ${player.name}
                    (${player.role})
                </p>
            `;
        });

        html += `
            </div>
        `;

        container.innerHTML =
            html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to load team.";
    }
}

loadTeam();
