export function updateGems() {
    let gems = document.querySelectorAll('canvas');

    for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        if (gem.parentNode.classList.contains('locked')) {
            continue;
        } 
        let ctx = gem.getContext('2d');
        const numSides = (_ => {
            const r = Math.random();
            if (r < 0.08) return 3;
            else if (r < 0.4) return 4;
            else if (r < 0.43) return 5;
            else if (r < 0.98) return 6;
            return 7;
        })();

        const halfWidth = gem.width / 2;
        const halfHeight = gem.height / 2;

        let topSideSize = Math.random() < 0.28 ? (Math.random()>0.5) : Math.random();
        if (topSideSize > 0.92) {
            topSideSize = 1;
        }
        else if (topSideSize < 0.08) {
            topSideSize = 0;
        }

        const innerTopSize = (_ => {
            const r = Math.random() * 3;
            if (r < 0.9) return Math.random()>0.5;
            else if (r < 1.8) return topSideSize;
            const s = Math.random();
            if (s<0.1) return 0;
            else if (s > 0.9) return 1;
            return s;
        })();

        const fullProportion = 1;
        let gemWidth, gemHeight;
        gemWidth = gemHeight = fullProportion;
        if (numSides === 4 || numSides === 6 && topSideSize > 0.1) {
            const rng = Math.random();
            if (rng < 0.34) {
                gemHeight = 0.5 + 0.45 * Math.random();
            }
            else if (rng < 0.68) {
                gemWidth = 0.5 + 0.45 * Math.random();
            }
        }

        const maxRadius = (_ => {
            switch (numSides) {
                case 3:
                    return 0.4;
                case 4:
                    return 0.6;
                case 5:
                    return 0.7;
                default:
                    return 0.8;
            }
        })();
        const innerRadius = maxRadius * Math.max(Math.random(), Math.random());

        console.log(numSides, topSideSize);

        ctx.lineWidth = 6;
        ctx.lineJoin = "round";

        const angleOffset = -Math.PI / 2;
        const yOffset = (Math.sin(angleOffset + (Math.PI / numSides) * topSideSize) + Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * Math.floor(numSides / 2)))) / -3;
        let angle;

        const [hue, sat, val] = (_ => {
            const r = Math.random();
            if (gem.classList.contains("type-1")) return [350, 100, 47];
            else if (gem.classList.contains("type-2")) return [50, 100, 50];
            else if (gem.classList.contains("type-3")) return [106, 69, 57];
            else if (gem.classList.contains("type-4")) return [270, 100, 70];
            return [0, 0, 50];
        })();
        const color = angle => `hsl(${hue}, ${sat}%, ${Math.round(40 + 60 * Math.pow(0.5 + 0.5 * Math.cos(angle + 0.5), Math.random() < 0.7 ? 3 : 8))}%)`;

        ctx.beginPath();
        ctx.moveTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-topSideSize)),
            halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-topSideSize)));
        for (let i = 0; i < numSides; i++) {
            ctx.lineTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * i)),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * i)));

            ctx.lineTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)));

            ctx.lineTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)));

            ctx.lineTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * (i + 1))),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * (i + 1))));
        }

        ctx.closePath();
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${val}%)`;
        ctx.fill();

        for (let i = 0; i < numSides; i++) {

            ctx.beginPath();

            ctx.moveTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * i)),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * i)));

            ctx.lineTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)));

            ctx.lineTo(halfWidth + innerRadius * halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (innerTopSize + 2 * i)),
                halfHeight * (1 + yOffset) + innerRadius * halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (innerTopSize + 2 * i)));

            ctx.lineTo(halfWidth + innerRadius * halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-innerTopSize + 2 * i)),
                halfHeight * (1 + yOffset) + innerRadius * halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-innerTopSize + 2 * i)));

            ctx.closePath();

            angle = Math.PI * 2 * i / numSides;
            ctx.fillStyle = color(angle);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * i)));

            ctx.lineTo(halfWidth + halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * (i + 1))),
                halfHeight * (1 + yOffset) + halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-topSideSize + 2 * (i + 1))));

            ctx.lineTo(halfWidth + innerRadius * halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (-innerTopSize + 2 * (i + 1))),
                halfHeight * (1 + yOffset) + innerRadius * halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (-innerTopSize + 2 * (i + 1))));

            ctx.lineTo(halfWidth + innerRadius * halfWidth * gemWidth * Math.cos(angleOffset + (Math.PI / numSides) * (innerTopSize + 2 * i)),
                halfHeight * (1 + yOffset) + innerRadius * halfHeight * gemHeight * Math.sin(angleOffset + (Math.PI / numSides) * (innerTopSize + 2 * i)));

            ctx.closePath();

            angle = Math.PI * (2 * i + 1) / numSides;
            ctx.fillStyle = color(angle);
            ctx.fill();
            ctx.stroke();
        }
    }
}