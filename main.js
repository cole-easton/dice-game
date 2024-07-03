let total = 0;
const indices = new Array(5).fill(0);
const locks = new Array(5).fill(false);
const dieContainer = document.getElementById("die-container");
const dice = Array.from(document.getElementById("die-container").children);
const scoreBoxes = Array.from(document.querySelectorAll(".scorebox"));
const totalBox = document.getElementById("totalbox");
const scorecard = document.getElementById("scorecard");
const rollsLeftBox = document.getElementById("rolls-left");
console.log(dice);
const rollButton = document.getElementById("roll");
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
        }
        else {
            rollButton.classList.add("disabled");
            //TODO 
            //end game stuff
        }
        
    }
}

