//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
const cyrb128 = str => {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

const sfc32 = (a, b, c, d) => {
    return _ => {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

const date = new Date();
const seed = cyrb128(`${date.getDay()}.${date.getMonth}.${date.getFullYear}`);
const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

const getRow = seedWithDate => (f => new Array(5).fill().map(_ => f()))(_ => {
    const random = seedWithDate?rand:Math.random;
    switch (Math.floor(10 * random())) {
        case 0: return 0;
        case 1: case 2: case 3: return 1;
        case 4: case 5: case 6: return 2;
        case 7: case 8: return 3;
        case 9: return 4;
        default: return "ERROR";
    }
});


function getCard(seedWithDate) {
    const card = [];
    for (let i = 0; i < 27; i++) {
        card.push(getRow(seedWithDate));
    }
    return card;
}

export function getRandomCard() {
    return getCard(false);
}

export function getDailyCard() {
    return getCard(true);
}
