const key = "eqy-scores";
const data = JSON.parse(localStorage.getItem(key)) ?? [];
const sortedData = data.toSorted((a,b)=>b-a);
const length = data.length;

export function getMean() {
    return data.reduce((a, e) => a + e, 0) / length;
}

const mean = getMean();

export function getStandardDeviation() {
    if (length===1) {
        return NaN;
    }
    return Math.sqrt(data.reduce((a, e) => a+(e-mean)*(e-mean), 0) / (length-1));
}

const sd = getStandardDeviation();

export function getSkewness() {
    return data.reduce((a,e)=>a+Math.pow((e-mean)/sd,3)/length);
}

export function getMedian() {
    return (length % 2) ? sortedData[Math.floor(length / 2)] : 0.5 * sortedData[length / 2] + 0.5 * sortedData[length / 2 - 1];
}

function getModeAndFreq() {
    let mode = sortedData[0];
    let max = 1;
    let currentMax = 1;
    for (let i = 1; i < length; i++) {
        if (sortedData[i]===sortedData[i-1]) {
            currentMax++;
        }
        else if (currentMax>max){
            max = currentMax;
            currentMax = 1;
            mode = sortedData[i-1];
        }
    }

    return [mode, max];
}

const median = getMedian();
const Q1 = sortedData[Math.round((sortedData.length-1)*.75)];
const Q3 = sortedData[Math.round((sortedData.length-1)*.25)];
console.log(median);
const IQR = Q3-Q1;
const lowerFence = median-1.5*IQR;
const upperFence = median + 1.5*IQR;
console.log(lowerFence, upperFence);

const filteredData = sortedData.filter(d => d>=lowerFence&&d<=upperFence);
console.log(filteredData);

const chartMin = filteredData[filteredData.length-1];
const chartMax = filteredData[0];
const bars = Math.min(16, chartMax-chartMin+1);

const step = (chartMax-chartMin)/bars;

const bins = new Array(bars).fill(0);
for (let i = 1; i < length; i++) {
    const bin = Math.floor((data[i]-chartMin)/step);
    if (0<=bin && bin<bars) {
        bins[bin]++
    }
    else if (data[i]===chartMax) {
        bins[bars-1]++;
    }
}
const maxFreq = bins.reduce((a,e)=>Math.max(a,e),1);
const chart  = document.querySelector(".chart");
for (let i = 0; i < bars; i++) {
    const lower = Math.ceil(chartMin+i*step);
    const upper = Math.ceil(chartMin+(i+1)*(step)-1);
    if (upper<lower) continue;
    const label = upper===lower?lower:`<span>${upper}&ndash; ${lower}</span>`;
    const bar = document.createElement("div");
    bar.classList.add("chart-bar");
    bar.style.height = `${100*bins[i]/maxFreq}%`;
    bar.innerHTML = label;
    chart.appendChild(bar);
}

document.getElementById("stat-plays").textContent = length;
document.getElementById("stat-max").textContent = sortedData[0];
document.getElementById("stat-min").textContent = sortedData[sortedData.length-1];
document.getElementById("stat-mean").textContent = mean.toFixed(1);
document.getElementById("stat-median").textContent = getMedian();
document.getElementById("stat-mode").textContent = getModeAndFreq()[0];
document.getElementById("stat-sd").textContent = sd.toFixed(2);
document.getElementById("stat-skew").textContent = getSkewness().toFixed(1);
document.getElementById("stat-q1").textContent =Q1;
document.getElementById("stat-q3").textContent =Q3;
document.getElementById("stat-lf").textContent = Math.ceil(lowerFence);
document.getElementById("stat-uf").textContent =Math.floor(upperFence);








