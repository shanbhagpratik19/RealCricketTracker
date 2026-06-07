import {
    db,
    collection,
    getDocs
} from "./firestore.js";

async function loadMatches() {

    const container =
        document.getElementById(
            "matchesList"
        );

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "matches"
                )
            );

        let html = "";

        snapshot.forEach((doc) => {

            const match =
                doc.data();

            html += `
                <a
                    href="match.html?id=${doc.id}"
                    style="
                        text-decoration:none;
                        color:inherit;
                    "
                >

                    <div class="match-card">

                        <h3>
                            ${match.team1}
                            vs
                            ${match.team2}
                        </h3>

                        <p>
                            ${match.format}
                        </p>

                        <p>
                            ${match.venue}
                        </p>

                        <p>
                            ${match.result || "Result Pending"}
                        </p>

                    </div>

                </a>
            `;
        });

        container.innerHTML =
            html || "No matches found.";

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to load matches.";
    }
}

loadMatches();
