const indices = new Array(5).fill(0);
const locks = new Array(5).fill(false);
const dice = Array.from(document.getElementById("jar-container").children);
console.log(dice);
const rollButton = document.getElementById("roll");

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
}
const displayRoll = (roll) => {
    dice.forEach((die, i) => {
        die.innerHTML = `<div class="berry type-${roll[i]}"></div>`
    });
}

const card = [];
for (let i = 0; i < 27; i++) {
    card.push(getRow());
}


let roll = getCurrentRoll();
console.log(roll);
rollDice();
roll = getCurrentRoll();
console.log(roll);

rollButton.onclick = _ => {
    rollDice();
    displayRoll(getCurrentRoll());
}


