console.log("RealCricketTracker Loaded");
console.log("Firebase configuration file created");
function saveMatch() {

    const team1 = document.getElementById("team1")?.value;
    const team2 = document.getElementById("team2")?.value;
    const format = document.getElementById("format")?.value;
    const venue = document.getElementById("venue")?.value;

    alert(
        `Match Saved

${team1} vs ${team2}
${format}
${venue}`
    );
}
