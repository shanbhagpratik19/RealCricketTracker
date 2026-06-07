import {
    db,
    doc,
    getDoc,
    collection,
    getDocs
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

        let totalRuns = 0;
        let highestScore = 0;
        let totalWickets = 0;
        let matches = 0;

        const inningsSnapshot =
            await getDocs(
                collection(
                    db,
                    "innings"
                )
            );

        const matchSet =
            new Set();

        inningsSnapshot.forEach((doc) => {

            const record =
                doc.data();

            /* Batting Stats */

            if (
                record.type === "batter" &&
                record.playerName === player.name
            ) {

                const runs =
                    Number(
                        record.runs || 0
                    );

                totalRuns += runs;

                if (
                    runs >
                    highestScore
                ) {
                    highestScore =
                        runs;
                }

                if (
                    record.matchId
                ) {
                    matchSet.add(
                        record.matchId
                    );
                }
            }

            /* Bowling Stats */

            if (
                record.type === "bowler" &&
                record.bowlerName === player.name
            ) {

                totalWickets +=
                    Number(
                        record.wickets || 0
                    );

                if (
                    record.matchId
                ) {
                    matchSet.add(
                        record.matchId
                    );
                }
            }

        });

        matches =
            matchSet.size;

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
                    <strong>Matches:</strong>
                    ${matches}
                </p>

                <p>
                    <strong>Runs:</strong>
                    ${totalRuns}
                </p>

                <p>
                    <strong>Highest Score:</strong>
                    ${highestScore}
                </p>

                <p>
                    <strong>Wickets:</strong>
                    ${totalWickets}
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
