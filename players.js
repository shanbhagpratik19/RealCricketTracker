import { db, collection, getDocs } from "./firestore.js";

async function loadPlayers() {

    const container =
        document.getElementById("playersList");

    try {

        const snapshot =
            await getDocs(
                collection(db, "players")
            );

        let html = "";

        snapshot.forEach((doc) => {

            const player = doc.data();

            html += `
                <div class="match-card">
                    <h3>${player.name}</h3>
                    <p>${player.team}</p>
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to load players.";
    }
}

loadPlayers();
