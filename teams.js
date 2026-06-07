import {
    db,
    collection,
    getDocs
} from "./firestore.js";

async function loadTeams() {

    const container =
        document.getElementById(
            "teamsList"
        );

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "players"
                )
            );

        const teams =
            new Set();

        snapshot.forEach((doc) => {

            const player =
                doc.data();

            if (
                player.team
            ) {
                teams.add(
                    player.team
                );
            }

        });

        let html = "";

        teams.forEach((team) => {

            html += `
                <a
                    href="team.html?name=${encodeURIComponent(team)}"
                    style="
                        text-decoration:none;
                        color:inherit;
                    "
                >

                    <div class="match-card">

                        <h3>
                            ${team}
                        </h3>

                    </div>

                </a>
            `;
        });

        container.innerHTML =
            html;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to load teams.";
    }
}

loadTeams();
