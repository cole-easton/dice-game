export function updateGems() {
    let gems = document.querySelectorAll('canvas');

    for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        if (gem.parentNode.classList.contains('locked')) {
            continue;
        }
        if (gem.classList.contains("type-0")) {
            drawRock(gem);
        }
        else {
            drawGem(gem);
        }
    }

    function drawGem(canvas) {
        const ctx = canvas.getContext('2d');
        const numSides = Math.floor(3 + 6*Math.random());

        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        let topSideSize = Math.random() < 0.20 ? (Math.random() > 0.5) : Math.random();
        if (topSideSize > 0.85) {
            topSideSize = 1;
        }
        else if (topSideSize < 0.15) {
            topSideSize = 0;
        }
        const innerTopSize = (_ => {
            const r = Math.random() * 3;
            if (r < 1) return Math.random() > 0.5;
            let s;
            if (r < 1.5) s = topSideSize;
            else s = Math.random();
            if (s < 0.2) return 0;
            else if (s > 0.8) return 1;
            return s;
        })();
        console.log(numSides, topSideSize, innerTopSize);

        const fullProportion = .95;
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
        const innerRadius = maxRadius * Math.max(Math.random(), Math.random(), Math.random());

        ctx.lineWidth = 6;
        ctx.lineJoin = "round";

        const angleOffset = -Math.PI / 2;
        const yOffset = (Math.sin(angleOffset + (Math.PI / numSides) * topSideSize) + Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * Math.floor(numSides / 2)))) / -3;
        let angle;
        //const red = t => [10*t+346, 100, 70.56*t*t+0.17*t+29.28];
        //const yellow = t => [Math.min(48.89 * t + 22.22, 60), 100, 155.22 * t * t * t - 155.014 * t * t + 59.794 * t + 40];
        
        const toHSL = arr => `hsl(${arr[0]}, ${arr[1]}%, ${arr[2]}%)`;
        const [minL, minH, centerL, centerH, floorH, ceilH] = (_ => {
            if (canvas.classList.contains("type-1")) return [30, 347, 47, 351, 0, 359];
            else if (canvas.classList.contains("type-2")) return [47, 34, 50, 56, 0, 61];
            else if (canvas.classList.contains("type-3")) return [33, 105, 57, 107, 0, 107];
            else if (canvas.classList.contains("type-4")) return [50, 260, 70, 253, 253, 260];
            return [40, 225, 65, 230, 225, 240];
        })();
        const color = angle => {
            const L = minL + (100-minL)*Math.pow(0.5 + 0.5 * Math.cos(angle+0.5), 3);
            return toHSL([Math.min(Math.max(minH + (centerH-minH)/(centerL-minL)*(L-minL), floorH), ceilH), 100, L]);
        }
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
        ctx.fillStyle = toHSL([centerH, 100, centerL]); //create unique center value for each color to be evaled at; .65 temp
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

    function drawRock(canvas) {
        const ctx = canvas.getContext('2d');
        let numSides = Math.floor(5 + 5 * Math.random());
			let angles = new Array(numSides - 4).fill().map(_ => Math.PI * 2 * Math.random()).concat(new Array(4).fill().map((_, i) => 0.2 * Math.random() - 0.1 + Math.PI / 2 * i)).sort();
			const offset = Math.random()*2+Math.PI;
			console.log(new Array(4).fill().map((_, i) => 0.2 * Math.random() - 0.1 + Math.PI / 2 * i));
			let j = 0;
			while (j < numSides) {
				if (Math.abs(angles[(j + 1) % numSides] - angles[j]) < 0.25 || Math.abs(angles[(j + 1) % numSides] - angles[j] + 2*Math.PI) < 0.25) {
					angles.splice(j, 1);
					numSides--;
				}
				else {
					j++;
				}
			}
			angles = angles.map(a=>a+offset);
			const outerRadii = new Array(numSides).fill().map(_ => Math.random()<0.4?1:0.65 + 0.35 * Math.random());
			outerRadii[0]=1;
			for (let i = 0; i < numSides; i++) {
				if (outerRadii[i] < outerRadii[(i + 1) % numSides] && outerRadii[i] < outerRadii[(i - 1 + numSides) % numSides]) {
					outerRadii[i] = (outerRadii[(i + 1) % numSides] + outerRadii[(i - 1 + numSides) % numSides]) / 2
				}
			}
			const innerRadii = outerRadii.map(n => n * (0.4 + 0.3 * Math.random()));
			for (let i = 0; i < numSides; i++) {
				if (innerRadii[i] < innerRadii[(i + 1) % numSides] && innerRadii[i] < innerRadii[(i - 1 + numSides) % numSides]) {
					innerRadii[i] = (innerRadii[(i + 1) % numSides] + innerRadii[(i - 1 + numSides) % numSides]) / 2
				}
			}
			const halfWidth = canvas.width / 2;
			const halfHeight = canvas.height / 2;

			const topSideSize = Math.random() < 0.35 ? 0 : Math.random();
			const innerTopSize = (_ => {
				const r = Math.random() * 3;
				if (r < 1) return 0;
				else if (r < 2) return topSideSize;
				return Math.random();
			})();

			const fullProportion = 0.95;
			let gemWidth, gemHeight;
			gemWidth = gemHeight = fullProportion;
			if (numSides === 4 || numSides === 6 && topSideSize > 0.1) {
				const rng = Math.random();
				if (rng < 0.34) {
					gemHeight = 0.5 + 0.45 * Math.random();
				}
				else if (rng < 0.68) {
					gemHeight = 0.5 + 0.45 * Math.random();
				}
			}

			ctx.lineWidth = 6;
			ctx.lineJoin = "round";

			const angleOffset = -Math.PI / 2;
			const yOffset = (Math.sin(angleOffset + (Math.PI / numSides) * topSideSize) + Math.sin(angleOffset + (Math.PI / numSides) * (topSideSize + 2 * Math.floor(numSides / 2)))) / -3;
			let angle;

			const [hue, sat, val] = (_ => {
				const r = Math.random();
				if (r < 0.3) return [350, 100, 47];
				else if (r < 0.6) return [50, 100, 50];
				else if (r < 0.8) return [106, 69, 57];
				return [270, 100, 70];
			})();
			const lightness = angle => Math.round(40 +  50* (0.5 + 0.5 * Math.cos(angle + 0.5)));

			ctx.beginPath();
			ctx.moveTo(halfWidth + outerRadii[0] * halfWidth * gemWidth * Math.cos(angles[0]),
				halfHeight * (1 + yOffset) + outerRadii[0] * halfHeight * gemHeight * Math.sin(angles[0]));
			for (let i = 0; i < numSides; i++) {
				ctx.lineTo(halfWidth + outerRadii[i] * halfWidth * gemWidth * Math.cos(angles[i]),
					halfHeight * (1 + yOffset) + outerRadii[i] * halfHeight * gemHeight * Math.sin(angles[i]));

				ctx.lineTo(halfWidth + outerRadii[(i + 1) % numSides] * halfWidth * gemWidth * Math.cos(angles[(i + 1) % numSides]),
					halfHeight * (1 + yOffset) + outerRadii[(i + 1) % numSides] * halfHeight * gemHeight * Math.sin(angles[(i + 1) % numSides]));

				ctx.lineTo(halfWidth + outerRadii[(i + 1) % numSides] * halfWidth * gemWidth * Math.cos(angles[(i + 1) % numSides]),
					halfHeight * (1 + yOffset) + outerRadii[(i + 1) % numSides] * halfHeight * gemHeight * Math.sin(angles[(i + 1) % numSides]));

				ctx.lineTo(halfWidth + outerRadii[i] * halfWidth * gemWidth * Math.cos(angles[i]),
					halfHeight * (1 + yOffset) + outerRadii[i] * halfHeight * gemHeight * Math.sin(angles[i]));
			}

			ctx.closePath();
			ctx.fillStyle = `hsl(240, 10%, 50%)`;
			ctx.fill();

			for (let i = 0; i < numSides; i++) {

				ctx.beginPath();

				ctx.moveTo(halfWidth + outerRadii[i] * halfWidth * gemWidth * Math.cos(angles[i]),
					halfHeight * (1 + yOffset) + outerRadii[i] * halfHeight * gemHeight * Math.sin(angles[i]));

				ctx.lineTo(halfWidth + outerRadii[(i + 1) % numSides] * halfWidth * gemWidth * Math.cos(angles[(i + 1) % numSides]),
					halfHeight * (1 + yOffset) + outerRadii[(i + 1) % numSides] * halfHeight * gemHeight * Math.sin(angles[(i + 1) % numSides]));

				ctx.lineTo(halfWidth + innerRadii[(i + 1) % numSides] * halfWidth * gemWidth * Math.cos(angles[(i + 1) % numSides]),
					halfHeight * (1 + yOffset) + innerRadii[(i + 1) % numSides] * halfHeight * gemHeight * Math.sin(angles[(i + 1) % numSides]));

				ctx.lineTo(halfWidth + innerRadii[i] * halfWidth * gemWidth * Math.cos(angles[i]),
					halfHeight * (1 + yOffset) + innerRadii[i] * halfHeight * gemHeight * Math.sin(angles[i]));

				ctx.closePath();

				angle = angles[i+1];
				ctx.fillStyle = `hsl(240, 8%, ${(lightness(angles[i]-angleOffset)+lightness(angles[(i+1)%numSides]-angleOffset))/2}%)`;
				ctx.fill();
				ctx.stroke();
			}
    }
}