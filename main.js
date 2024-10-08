import * as CardGenerator from "./cardGenerator.js";
import * as GemManager from './gems.js';

run(false);

export function run(isDaily) {
    let total = 0;
    const indices = new Array(5).fill(0);
    const locks = new Array(5).fill(false);
    const dieContainer = document.getElementById("die-container");
    const dice = Array.from(document.getElementById("die-container").children);
    const scoreBoxes = Array.from(document.querySelectorAll(".scorebox"));
    const totalBox = document.getElementById("totalbox");
    const scorecard = document.getElementById("scorecard");
    const rollsLeftBox = document.getElementById("rolls-left");
    const messageBox = document.getElementById("message-box");
    const modal = document.getElementById("end-game-modal");
    const nonModal = document.getElementById("non-modal");
    const rollButton = document.getElementById("roll");
    const replayButton = document.getElementById("replay-button");

    const statTotalBox = document.getElementById("stat-total");
    const statBestBox = document.getElementById("stat-best");
    const statMedianBox = document.getElementById("stat-median");
    const statMeanBox = document.getElementById("stat-mean");
    const statRecentBox = document.getElementById("stat-recent");

    const key = "eqy-scores";
    let turnRolls = 3;
    let turns = 9;

    let card = isDaily ? CardGenerator.getDailyCard() : CardGenerator.getRandomCard();

    const getCurrentRoll = _ => new Array(5).fill().map((_, i) => card[indices[i]][i]);
    const rollDice = _ => {
        for (let i = 0; i < 5; i++) {
            if (!locks[i]) {
                indices[i]++;
            }
        }
        turnRolls--;
        rollsLeftBox.textContent = turnRolls;
        if (!turnRolls) {
            rollButton.classList.add("disabled");
            messageBox.textContent = "All rolls for this turn have been used.  Click a scorebox to select you scoring category."
        }
        else {
            messageBox.textContent = "Click dice to lock them.  Locked dice have a red border; unlocked dice have a black border. "
        }
        scorecard.classList.remove("disabled");
        dieContainer.classList.remove("disabled");
    }

    const countDice = roll => {
        let total = 0;
        for (let i = 0; i < 5; i++) {
            switch (roll[i]) {
                case 1: case 2:
                    total += 2;
                    break;
                case 3:
                    total += 4;
                    break;
                case 4:
                    total += 7;
            }
        }
        return total;
    }

    const maxOfKind = roll => {
        const totals = new Array(5).fill(0);
        roll.forEach(n => totals[n]++);
        return Math.max(...totals);
    }

    const hasAllColors = roll => {
        const hasColor = new Array(5).fill(false);
        roll.forEach(n => hasColor[n] = true);
        hasColor[0] = true;
        return hasColor.reduce((a, c) => a && c, true);
    }

    const getScores = roll => [roll.reduce((a, c) => a + (c === 1 ? 2 : 0), 0),
    roll.reduce((a, c) => a + (c === 2 ? 2 : 0), 0),
    roll.reduce((a, c) => a + (c === 3 ? 4 : 0), 0),
    roll.reduce((a, c) => a + (c === 4 ? 7 : 0), 0),
    maxOfKind(roll) >= 3 ? countDice(roll) : 0,
    maxOfKind(roll) >= 4 ? countDice(roll) : 0,
    maxOfKind(roll) === 5 ? countDice(roll) : 0,
    hasAllColors(roll) ? countDice(roll) : 0, countDice(roll)];

    const displayRoll = (roll) => {
        dice.forEach((die, i) => {
            if (!die.classList.contains('locked')) {
                die.innerHTML = `<canvas width=200 height=200 class="gem type-${roll[i]}"></canvas>`;
            }
        });
        GemManager.updateGems();
    }

    const displayScores = (roll) => {
        const scores = getScores(roll);
        scoreBoxes.forEach((box, i) => {
            if (!box.classList.contains("selected")) {
                box.textContent = scores[i];
            }
        });
    }

    rollButton.onclick = _ => {
        rollDice();
        const roll = getCurrentRoll();
        displayRoll(roll);
        displayScores(roll);
    }

    for (let i = 0; i < 5; i++) {
        dice[i].onclick = e => {
            e.currentTarget.classList.toggle("locked");
            locks[i] = !locks[i];
        }
    }

    scorecard.onclick = e => {
        if (e.target.classList.contains("scorebox") && !e.target.classList.contains("selected")) {
            turns--;
            e.target.classList.add("selected");
            total += parseInt(e.target.textContent);
            totalBox.textContent = total;
            dice.forEach(die => die.classList.remove("locked"));
            locks.fill(false);
            turnRolls = 3;
            rollsLeftBox.textContent = turnRolls;
            dieContainer.classList.add("disabled");
            if (turns) {
                rollButton.classList.remove("disabled");
                scorecard.classList.add("disabled");
                messageBox.textContent = `Click the "Roll" button to begin your next turn.  No dice may be locked between turns.`
            }
            else { //game is over 
                rollButton.classList.add("disabled");
                messageBox.textContent = `Congratulations! You've completed the game with a final score of ${total} points.`;

                const scores = JSON.parse(localStorage.getItem(key)) ?? [];
                scores.unshift(total);
                localStorage.setItem(key, JSON.stringify(scores));

                modal.style.display = "block";
                nonModal.classList.add("disabled");

                statTotalBox.textContent = total;
                (async _ => { //async so that even if array gets really long, app doesn't hang
                    const length = scores.length;
                    const mean = Math.round(scores.reduce((a, e) => a + e, 0) / length);
                    if (statMeanBox) {
                        statMeanBox.textContent = mean;
                    }

                    let recentTotal = 0;
                    let recentWeight = 0;
                    for (let i = 0; i < 12; i++) {
                        if (i < length) {
                            recentTotal += (12 - i) * scores[i];
                            recentWeight += 12 - i;
                        }
                        else {
                            break;
                        }
                    }
                    const recentMean = Math.round(recentTotal / recentWeight);
                    if (statRecentBox) {
                        statRecentBox.textContent = recentMean;
                    }

                    scores.sort((a, b) => b - a);
                    const median = (length % 2) ? scores[Math.floor(length / 2)] : Math.round(0.5 * scores[length / 2] + 0.5 * scores[length / 2 - 1]);
                    if (statMedianBox) {
                        statMedianBox.textContent = median;
                    }

                    statBestBox.textContent = scores[0];
                })();
            }

        }
    }

    replayButton.onclick = _ => {
        indices.fill(0);
        locks.fill(false);
        total = 0;
        turnRolls = 3;
        turns = 9;
        card = isDaily ? CardGenerator.getDailyCard() : CardGenerator.getRandomCard();
        scoreBoxes.forEach(e => {
            e.textContent = "";
            e.classList.remove("selected");
        });
        totalBox.textContent = "";
        rollButton.classList.remove("disabled");
        scorecard.classList.add("disabled");
        messageBox.textContent = `Click the "Roll" button to the right to begin.`;
        modal.style.display = "none";
        nonModal.classList.remove("disabled");
    };
}