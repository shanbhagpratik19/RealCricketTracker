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
        let totalBalls = 0;
        let highestScore = 0;

        let fifties = 0;
        let hundreds = 0;

        let totalWickets = 0;

        let dismissals = 0;

        const matchSet =
            new Set();

        const inningsSnapshot =
            await getDocs(
                collection(
                    db,
                    "innings"
                )
            );

        inningsSnapshot.forEach((doc) => {

            const record =
                doc.data();

            /* =====================
               BATTING
            ===================== */

            if (
                record.type === "batter" &&
                record.playerName === player.name
            ) {

                const runs =
                    Number(
                        record.runs || 0
                    );

                const balls =
                    Number(
                        record.balls || 0
                    );

                totalRuns += runs;
                totalBalls += balls;

                if (
                    runs >
                    highestScore
                ) {
                    highestScore =
                        runs;
                }

                if (
                    runs >= 50 &&
                    runs < 100
                ) {
                    fifties++;
                }

                if (
                    runs >= 100
                ) {
                    hundreds++;
                }

                const dismissal =
                    (
                        record.dismissal || ""
                    )
                    .trim()
                    .toLowerCase();

                if (
                    dismissal !== "" &&
                    dismissal !== "not out" &&
                    dismissal !== "*"
                ) {
                    dismissals++;
                }

                if (
                    record.matchId
                ) {
                    matchSet.add(
                        record.matchId
                    );
                }
            }

            /* =====================
               BOWLING
            ===================== */

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

        const matches =
            matchSet.size;

        const battingAverage =
            dismissals > 0
                ? (
                    totalRuns /
                    dismissals
                  ).toFixed(2)
                : totalRuns.toFixed(2);

        const strikeRate =
            totalBalls > 0
                ? (
                    (totalRuns / totalBalls)
                    * 100
                  ).toFixed(2)
                : "0.00";

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
                    <strong>50s:</strong>
                    ${fifties}
                </p>

                <p>
                    <strong>100s:</strong>
                    ${hundreds}
                </p>

                <p>
                    <strong>Batting Average:</strong>
                    ${battingAverage}
                </p>

                <p>
                    <strong>Strike Rate:</strong>
                    ${strikeRate}
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
