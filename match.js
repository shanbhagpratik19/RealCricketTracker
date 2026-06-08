import {
    db,
    doc,
    getDoc,
    updateDoc,
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
   INNINGS LABELS
========================= */

async function saveInningsLabels() {

    try {

        const matchRef =
            doc(db, "matches", matchId);

        await updateDoc(
            matchRef,
            {
                innings1Label:
                    document.getElementById("innings1Label").value,

                innings2Label:
                    document.getElementById("innings2Label").value,

                innings3Label:
                    document.getElementById("innings3Label").value,

                innings4Label:
                    document.getElementById("innings4Label").value
            }
        );

        alert("Labels saved!");

        loadMatch();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

window.saveInningsLabels =
    saveInningsLabels;

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

    let innings = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    snapshot.forEach((doc) => {

        const batter =
            doc.data();

        const inn =
            batter.inningsNumber || 1;

        innings[inn].push(batter);

    });

    let html = "";

    for (let i = 1; i <= 4; i++) {

        if (
            innings[i].length === 0
        ) continue;

        let runs = 0;
        let wickets = 0;
        let balls = 0;

        innings[i].forEach((batter) => {

            runs +=
                Number(batter.runs || 0);

            balls +=
                Number(batter.balls || 0);

            const dismissal =
                (batter.dismissal || "")
                    .trim()
                    .toLowerCase();

            if (
                dismissal !== "" &&
                dismissal !== "*" &&
                dismissal !== "not out"
            ) {
                wickets++;
            }

        });

        const overs =
            Math.floor(balls / 6)
            + "."
            + (balls % 6);

        html += `
            <div class="match-card">

                <h2>
                    Innings ${i}
                </h2>

                <h3>
                    ${runs}/${wickets}
                </h3>

                <p>
                    Overs:
                    ${overs}
                </p>

            </div>
        `;
    }

    inningsSummary.innerHTML =
        html || "No innings data.";
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

    let innings = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    snapshot.forEach((doc) => {

        const batter =
            doc.data();

        const inn =
            batter.inningsNumber || 1;

        innings[inn].push(batter);

    });

    let html = "";

    for (let i = 1; i <= 4; i++) {

        if (
            innings[i].length === 0
        ) continue;

        html += `
            <div class="match-card">

                <h2>
                    Innings ${i}
                </h2>

            </div>
        `;

        innings[i].forEach((batter) => {

            html += `
                <div class="match-card">

                    <strong>
                        ${batter.playerName}
                    </strong>

                    <br>

                    ${batter.runs}
                    (${batter.balls})

                    <br>

                    4s:
                    ${batter.fours || 0}

                    |

                    6s:
                    ${batter.sixes || 0}

                    <br>

                    ${batter.dismissal}

                </div>
            `;
        });

    }

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

    let innings = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    snapshot.forEach((doc) => {

        const bowler =
            doc.data();

        const inn =
            bowler.inningsNumber || 1;

        innings[inn].push(bowler);

    });

    let html = "";

    for (let i = 1; i <= 4; i++) {

        if (
            innings[i].length === 0
        ) continue;

        html += `
            <div class="match-card">
                <h2>
                    Bowling - Innings ${i}
                </h2>
            </div>
        `;

        innings[i].forEach((bowler) => {

            html += `
                <div class="match-card">

                    <strong>
                        ${bowler.bowlerName}
                    </strong>

                    <br>

                    ${bowler.overs} -
                    ${bowler.maidens} -
                    ${bowler.runsConceded} -
                    ${bowler.wickets}

                </div>
            `;
        });

    }

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
