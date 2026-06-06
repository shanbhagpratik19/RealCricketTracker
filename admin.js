import { db, collection, addDoc } from "./firestore.js";

window.saveMatch = async function () {

    const team1 = document.getElementById("team1")?.value;
    const team2 = document.getElementById("team2")?.value;
    const format = document.getElementById("format")?.value;
    const venue = document.getElementById("venue")?.value;

    const series = document.getElementById("series")?.value;
    const season = document.getElementById("season")?.value;

    const matchType =
        document.getElementById("matchType")?.value;

    const tossWinner =
        document.getElementById("tossWinner")?.value;

    const tossDecision =
        document.getElementById("tossDecision")?.value;

    const status =
        document.getElementById("status")?.value;

    const playerOfMatch =
        document.getElementById("playerOfMatch")?.value;

    const result =
        document.getElementById("result")?.value;

    try {

        await addDoc(collection(db, "matches"), {

            team1,
            team2,
            format,
            venue,

            series,
            season,

            matchType,

            tossWinner,
            tossDecision,

            status,

            playerOfMatch,
            result,

            createdAt:
                new Date().toISOString()

        });

        alert("Match saved successfully!");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
};

window.savePlayer = async function () {

    const name =
        document.getElementById("playerName")?.value;

    const team =
        document.getElementById("playerTeam")?.value;

    const role =
        document.getElementById("playerRole")?.value;

    const battingStyle =
        document.getElementById("battingStyle")?.value;

    const bowlingStyle =
        document.getElementById("bowlingStyle")?.value;

    try {

        await addDoc(collection(db, "players"), {

            name,
            team,
            role,
            battingStyle,
            bowlingStyle,

            testMatches: 0,
            testRuns: 0,
            testAverage: 0,
            testHundreds: 0,
            testFifties: 0,
            testWickets: 0,

            odiMatches: 0,
            odiRuns: 0,
            odiAverage: 0,
            odiHundreds: 0,
            odiFifties: 0,
            odiWickets: 0,

            t20Matches: 0,
            t20Runs: 0,
            t20Average: 0,
            t20StrikeRate: 0,
            t20Fifties: 0,
            t20Wickets: 0,

            createdAt:
                new Date().toISOString()

        });

        alert("Player saved successfully!");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
};
