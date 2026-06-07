import {
    db,
    doc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "./firestore.js";

const container =
    document.getElementById("matchDetails");

const inningsSummary =
    document.getElementById("inningsSummary");

const battingCard =
    document.getElementById("battingCard");

const bowlingCard =
    document.getElementById("bowlingCard");

const wicketCard =
    document.getElementById("wicketCard");

const phaseCard =
    document.getElementById("phaseCard");

const params =
    new URLSearchParams(
        window.location.search
    );

const matchId =
    params.get("id");

/* =========================
   BATTERS
========================= */

async function saveBatter() {

    try {

        await addDoc(
            collection(db, "innings"),
            {
                matchId,
                inningsNumber:
                    document.getElementById("inningsNumber").value,

                playerName:
                    document.getElementById("playerName").value,

                runs:
                    document.getElementById("runs").value,

                balls:
                    document.getElementById("balls").value,

                fours:
                    document.getElementById("fours").value,

                sixes:
                    document.getElementById("sixes").value,

                dismissal:
                    document.getElementById("dismissal").value,

                type: "batter",

                createdAt:
                    new Date().toISOString()
            }
        );

        alert("Batter saved!");

        loadBattingCard();
        loadInningsSummary();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

window.saveBatter = saveBatter;

/* =========================
   BOWLERS
========================= */

async function saveBowler() {

    try {

        await addDoc(
            collection(db, "innings"),
            {
                matchId,

                inningsNumber:
                    document.getElementById("bowlingInnings").value,

                bowlerName:
                    document.getElementById("bowlerName").value,

                overs:
                    document.getElementById("overs").value,

                maidens:
                    document.getElementById("maidens").value,

                runsConceded:
                    document.getElementById("runsConceded").value,

                wickets:
                    document.getElementById("wickets").value,

                type: "bowler",

                createdAt:
                    new Date().toISOString()
            }
        );

        alert("Bowler saved!");

        loadBowlingCard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

window.saveBowler = saveBowler;

/* =========================
   WICKETS
========================= */

async function saveWicket() {

    try {

        await addDoc(
            collection(db, "innings"),
            {
                matchId,

                score:
                    document.getElementById("wicketScore").value,

                player:
                    document.getElementById("wicketPlayer").value,

                runs:
                    document.getElementById("wicketRuns").value,

                balls:
                    document.getElementById("wicketBalls").value,

                over:
                    document.getElementById("wicketOver").value,

                dismissal:
                    document.getElementById("wicketDismissal").value,

                type: "wicket",

                createdAt:
                    new Date().toISOString()
            }
        );

        alert("Wicket saved!");

        loadWickets();
        loadInningsSummary();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

window.saveWicket = saveWicket;

/* =========================
   ODI PHASES
========================= */

async function savePhase() {

    try {

        await addDoc(
            collection(db, "phases"),
            {
                matchId,

                inningsNumber:
                    document.getElementById("phaseInnings").value,

                phaseName:
                    document.getElementById("phaseName").value,

                runs:
                    document.getElementById("phaseRuns").value,

                wickets:
                    document.getElementById("phaseWickets").value,

                runRate:
                    document.getElementById("phaseRunRate").value,

                topBatter:
                    document.getElementById("topBatter").value,

                topBowler:
                    document.getElementById("topBowler").value,

                summary:
                    document.getElementById("phaseSummary").value,

                createdAt:
                    new Date().toISOString()
            }
        );

        alert("Phase saved!");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

window.savePhase = savePhase;

async function loadPhases() {

    if (!phaseCard) return;

    const q = query(
        collection(db, "phases"),
        where("matchId", "==", matchId)
    );

    const snapshot =
        await getDocs(q);

    const phaseOrder = [
        "0-10 Overs",
        "11-20 Overs",
        "21-30 Overs",
        "31-40 Overs",
        "41-50 Overs"
    ];

    let phases = [];

    snapshot.forEach((doc) => {

        phases.push(doc.data());

    });

    phases.sort((a, b) => {

        return (
            phaseOrder.indexOf(a.phaseName)
            -
            phaseOrder.indexOf(b.phaseName)
        );

    });

    let html = "";

    phases.forEach((phase) => {

        const projectedScore =
            (
                Number(phase.runRate || 0)
                * 50
            ).toFixed(0);

        html += `
            <div class="match-card">

                <h3>
                    ${phase.phaseName}
                </h3>

                <p>
                    ${phase.runs}/${phase.wickets}
                </p>

                <p>
                    RR:
                    ${phase.runRate}
                </p>

                <p>
                    Projected Score:
                    ${projectedScore}
                </p>

                <p>
                    <strong>Top Batter:</strong>
                    ${phase.topBatter}
                </p>

                <p>
                    <strong>Top Bowler:</strong>
                    ${phase.topBowler}
                </p>

                <p>
                    ${phase.summary}
                </p>

            </div>
        `;
    });

    phaseCard.innerHTML =
        html || "No phases recorded.";
}

/* =========================
   INNINGS SUMMARY
========================= */

async function loadInningsSummary() {

    const q = query(
        collection(db, "innings"),
        where("matchId", "==", matchId),
        where("type", "==", "batter")
    );

    const snapshot =
        await getDocs(q);

    let totalRuns = 0;
    let totalBalls = 0;
    let totalWickets = 0;

    snapshot.forEach((doc) => {

        const batter =
            doc.data();

        totalRuns +=
            Number(batter.runs || 0);

        totalBalls +=
            Number(batter.balls || 0);

        if (
            batter.dismissal &&
            batter.dismissal.trim() !== "" &&
            batter.dismissal.toLowerCase() !== "not out"
        ) {
            totalWickets++;
        }

    });

    const overs =
        Math.floor(totalBalls / 6) +
        "." +
        (totalBalls % 6);

    const runRate =
        totalBalls > 0
            ? ((totalRuns / totalBalls) * 6)
                .toFixed(2)
            : "0.00";

    inningsSummary.innerHTML = `
        <div class="match-card">

            <h3>
                ${totalRuns}/${totalWickets}
            </h3>

            <p>
                Overs:
                ${overs}
            </p>

            <p>
                Run Rate:
                ${runRate}
            </p>

        </div>
    `;
}

/* =========================
   MATCH DETAILS
========================= */

async function loadMatch() {

    if (!matchId) {

        container.innerHTML =
            "No match selected.";

        return;
    }

    try {

        const matchRef =
            doc(db, "matches", matchId);

        const matchSnap =
            await getDoc(matchRef);

        if (!matchSnap.exists()) {

            container.innerHTML =
                "Match not found.";

            return;
        }

        const match =
            matchSnap.data();

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

            </div>
        `;

    } catch (error) {

        console.error(error);
    }
}

/* =========================
   LOAD BATTERS
========================= */

async function loadBattingCard() {

    const q = query(
        collection(db, "innings"),
        where("matchId", "==", matchId),
        where("type", "==", "batter")
    );

    const snapshot =
        await getDocs(q);

    let html = "";

    snapshot.forEach((doc) => {

        const batter =
            doc.data();

        html += `
            <div class="match-card">
                <strong>${batter.playerName}</strong>
                <br>
                ${batter.runs} (${batter.balls})
                <br>
                4s: ${batter.fours} | 6s: ${batter.sixes}
                <br>
                ${batter.dismissal}
            </div>
        `;
    });

    battingCard.innerHTML =
        html || "No batters added.";
}

/* =========================
   LOAD BOWLERS
========================= */

async function loadBowlingCard() {

    const q = query(
        collection(db, "innings"),
        where("matchId", "==", matchId),
        where("type", "==", "bowler")
    );

    const snapshot =
        await getDocs(q);

    let html = "";

    snapshot.forEach((doc) => {

        const bowler =
            doc.data();

        html += `
            <div class="match-card">
                <strong>${bowler.bowlerName}</strong>
                <br>
                ${bowler.overs}-${bowler.maidens}-${bowler.runsConceded}-${bowler.wickets}
            </div>
        `;
    });

    bowlingCard.innerHTML =
        html || "No bowlers added.";
}

/* =========================
   LOAD WICKETS
========================= */

async function loadWickets() {

    const q = query(
        collection(db, "innings"),
        where("matchId", "==", matchId),
        where("type", "==", "wicket")
    );

    const snapshot =
        await getDocs(q);

    let html = "";

    snapshot.forEach((doc) => {

        const wicket =
            doc.data();

        html += `
            <div class="match-card">
                <strong>${wicket.score}</strong>
                <br>
                ${wicket.player}
                ${wicket.runs} (${wicket.balls})
                <br>
                Over: ${wicket.over}
                <br>
                ${wicket.dismissal}
            </div>
        `;
    });

    wicketCard.innerHTML =
        html || "No wickets recorded.";
}

/* =========================
   INIT
========================= */

loadMatch();
loadInningsSummary();
loadBattingCard();
loadBowlingCard();
loadWickets();
loadPhases();
