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
const rollButton = document.getElementById("roll");

const statTotalBox = document.getElementById("stat-total");
const statMedianBox = document.getElementById("stat-median");
const statMeanBox = document.getElementById("stat-mean");
const statRecentBox = document.getElementById("stat-recent");


const key = "eqy-scores";
let turnRolls = 3;
let turns = 9;
let scoringAllowed = false;

const getRow = _ => (f => new Array(5).fill().map(_ => f()))(_ => {
    switch (Math.floor(10 * Math.random())) {
        case 0: return 0;
        case 1: case 2: case 3: return 1;
        case 4: case 5: case 6: return 2;
        case 7: case 8: return 3;
        case 9: return 4;
        default: return "ERROR";
    }
});
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
        die.innerHTML = `<div class="berry type-${roll[i]}"></div>`
    });
}

const displayScores = (roll) => {
    const scores = getScores(roll);
    scoreBoxes.forEach((box, i) => {
        if (!box.classList.contains("selected")) {
            box.textContent = scores[i];
        }
    });
}

const card = [];
for (let i = 0; i < 27; i++) {
    card.push(getRow());
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
            statTotalBox.textContent = total;
            (async _ => { //async so that even if array gets really long, app doesn't hang
                const length = scores.length;
                const mean = Math.round(scores.reduce((a, e) => a + e, 0) / length);
                statMeanBox.textContent = mean;

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
                statRecentBox.textContent = recentMean;

                scores.sort();
                const median = (length % 2) ? scores[Math.floor(length / 2)] :  Math.round(0.5 * scores[length / 2] + 0.5*scores[length / 2 - 1]);
                statMedianBox.textContent = median;
            })();
        }

    }
}

document.getElementById("x-button").onclick = _ => modal.style.display = "none";
