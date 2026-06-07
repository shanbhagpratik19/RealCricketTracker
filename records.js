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

    const battingTotals = {};
    const wicketTotals = {};

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
        }

        if (
            record.type === "bowler"
        ) {

            const wickets =
                Number(
                    record.wickets || 0
                );

            wicketTotals[
                record.bowlerName
            ] =
                (
                    wicketTotals[
                        record.bowlerName
                    ] || 0
                ) + wickets;
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

    container.innerHTML = `

        <div class="match-card">

            <h2>
                Highest Individual Score
            </h2>

            <p>
                ${highestScorer}
                -
                ${highestScore}
            </p>

        </div>

        <div class="match-card">

            <h2>
                Most Career Runs
            </h2>

            <p>
                ${mostRunsPlayer}
                -
                ${mostRuns}
            </p>

        </div>

        <div class="match-card">

            <h2>
                Most Career Wickets
            </h2>

            <p>
                ${mostWicketsPlayer}
                -
                ${mostWickets}
            </p>

        </div>

    `;
}

loadRecords();
