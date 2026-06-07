import {
    db,
    collection,
    getDocs
} from "./firestore.js";

const container =
    document.getElementById(
        "recordsContainer"
    );

async function loadRecords() {

    let highestScore = 0;
    let highestScorer = "";

    let mostRuns = 0;
    let mostRunsPlayer = "";

    let mostWickets = 0;
    let mostWicketsPlayer = "";

    let mostHundreds = 0;
    let mostHundredsPlayer = "";

    let mostFifties = 0;
    let mostFiftiesPlayer = "";

    let bestBowlingWickets = 0;
    let bestBowlingRuns = 9999;
    let bestBowler = "";

    const battingTotals = {};
    const wicketTotals = {};
    const hundredTotals = {};
    const fiftyTotals = {};

    const snapshot =
        await getDocs(
            collection(
                db,
                "innings"
            )
        );

    snapshot.forEach((doc) => {

        const record =
            doc.data();

        if (
            record.type === "batter"
        ) {

            const runs =
                Number(
                    record.runs || 0
                );

            if (
                runs >
                highestScore
            ) {

                highestScore =
                    runs;

                highestScorer =
                    record.playerName;
            }

            battingTotals[
                record.playerName
            ] =
                (
                    battingTotals[
                        record.playerName
                    ] || 0
                ) + runs;

            if (
                runs >= 100
            ) {

                hundredTotals[
                    record.playerName
                ] =
                    (
                        hundredTotals[
                            record.playerName
                        ] || 0
                    ) + 1;
            }

            if (
                runs >= 50 &&
                runs < 100
            ) {

                fiftyTotals[
                    record.playerName
                ] =
                    (
                        fiftyTotals[
                            record.playerName
                        ] || 0
                    ) + 1;
            }
        }

        if (
            record.type === "bowler"
        ) {

            const wickets =
                Number(
                    record.wickets || 0
                );

            const runsConceded =
                Number(
                    record.runsConceded || 0
                );

            wicketTotals[
                record.bowlerName
            ] =
                (
                    wicketTotals[
                        record.bowlerName
                    ] || 0
                ) + wickets;

            if (
                wickets >
                bestBowlingWickets
            ) {

                bestBowlingWickets =
                    wickets;

                bestBowlingRuns =
                    runsConceded;

                bestBowler =
                    record.bowlerName;
            }
        }

    });

    Object.entries(
        battingTotals
    ).forEach(([name, runs]) => {

        if (
            runs >
            mostRuns
        ) {

            mostRuns =
                runs;

            mostRunsPlayer =
                name;
        }

    });

    Object.entries(
        wicketTotals
    ).forEach(([name, wickets]) => {

        if (
            wickets >
            mostWickets
        ) {

            mostWickets =
                wickets;

            mostWicketsPlayer =
                name;
        }

    });

    Object.entries(
        hundredTotals
    ).forEach(([name, count]) => {

        if (
            count >
            mostHundreds
        ) {

            mostHundreds =
                count;

            mostHundredsPlayer =
                name;
        }

    });

    Object.entries(
        fiftyTotals
    ).forEach(([name, count]) => {

        if (
            count >
            mostFifties
        ) {

            mostFifties =
                count;

            mostFiftiesPlayer =
                name;
        }

    });

    container.innerHTML = `

        <div class="match-card">
            <h2>Highest Individual Score</h2>
            <p>${highestScorer} - ${highestScore}</p>
        </div>

        <div class="match-card">
            <h2>Most Career Runs</h2>
            <p>${mostRunsPlayer} - ${mostRuns}</p>
        </div>

        <div class="match-card">
            <h2>Most Career Wickets</h2>
            <p>${mostWicketsPlayer} - ${mostWickets}</p>
        </div>

        <div class="match-card">
            <h2>Most 100s</h2>
            <p>${mostHundredsPlayer} - ${mostHundreds}</p>
        </div>

        <div class="match-card">
            <h2>Most 50s</h2>
            <p>${mostFiftiesPlayer} - ${mostFifties}</p>
        </div>

        <div class="match-card">
            <h2>Best Bowling Figures</h2>
            <p>${bestBowler} - ${bestBowlingWickets}/${bestBowlingRuns}</p>
        </div>

    `;
}

loadRecords();
