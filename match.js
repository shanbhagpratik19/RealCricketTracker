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

const battingCard =
    document.getElementById("battingCard");

const params =
    new URLSearchParams(
        window.location.search
    );

const matchId =
    params.get("id");

window.saveBatter = async function () {

    const inningsNumber =
        document.getElementById("inningsNumber").value;

    const playerName =
        document.getElementById("playerName").value;

    const runs =
        document.getElementById("runs").value;

    const balls =
        document.getElementById("balls").value;

    const fours =
        document.getElementById("fours").value;

    const sixes =
        document.getElementById("sixes").value;

    const dismissal =
        document.getElementById("dismissal").value;

    try {

        await addDoc(
            collection(db, "innings"),
            {
                matchId,
                inningsNumber,
                playerName,
                runs,
                balls,
                fours,
                sixes,
                dismissal,
                type: "batter",
                createdAt:
                    new Date().toISOString()
            }
        );

        alert("Batter saved!");

        loadBattingCard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
};

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

        container.innerHTML =
            "Unable to load match.";
    }
}

async function loadBattingCard() {

    if (!battingCard) return;

    try {

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

                    <strong>
                        ${batter.playerName}
                    </strong>

                    <br>

                    ${batter.runs}
                    (${batter.balls})

                    <br>

                    4s:
                    ${batter.fours}

                    |

                    6s:
                    ${batter.sixes}

                    <br>

                    ${batter.dismissal}

                </div>
            `;
        });

        if (html === "") {

            html =
                "No batters added.";
        }

        battingCard.innerHTML =
            html;

    } catch (error) {

        console.error(error);
    }
}

loadMatch();
loadBattingCard();
