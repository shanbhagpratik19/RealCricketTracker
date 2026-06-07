import {
    db,
    doc,
    getDoc
} from "./firestore.js";

const container =
    document.getElementById(
        "playerProfile"
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const playerId =
    params.get("id");

async function loadPlayer() {

    if (!playerId) {

        container.innerHTML =
            "No player selected.";

        return;
    }

    try {

        const playerRef =
            doc(
                db,
                "players",
                playerId
            );

        const playerSnap =
            await getDoc(playerRef);

        if (!playerSnap.exists()) {

            container.innerHTML =
                "Player not found.";

            return;
        }

        const player =
            playerSnap.data();

        container.innerHTML = `
            <div class="match-card">

                <h2>
                    ${player.name}
                </h2>

                <p>
                    <strong>Team:</strong>
                    ${player.team}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${player.role}
                </p>

                <p>
                    <strong>Batting Style:</strong>
                    ${player.battingStyle}
                </p>

                <p>
                    <strong>Bowling Style:</strong>
                    ${player.bowlingStyle}
                </p>

                <hr>

                <h3>
                    Career Statistics
                </h3>

                <p>
                    Matches:
                    Coming Soon
                </p>

                <p>
                    Runs:
                    Coming Soon
                </p>

                <p>
                    Wickets:
                    Coming Soon
                </p>

            </div>
        `;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to load player.";
    }
}

loadPlayer();
