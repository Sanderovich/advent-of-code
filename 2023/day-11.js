import { getInput } from '../get-input.js';

const input = await getInput({ year: 2023, day: 11 });
const grid = input
	.trim()
	.split(/\n/)
	.map(l => l.trim().split(''));

const GALAXY = '#';
const SPACE = '.';

const isGalaxy = i => i === GALAXY;
const isSpace = i => i === SPACE;

const isRowEmpty = y => grid[y].every(isSpace)
const isColumnEmpty = x => grid.every(i => isSpace(i[x]));

const getGalaxies = mode => {
	const galaxies = [];
	let xOffset = 0;
	let yOffset = 0;
	let counter = 1;
	for (let y = 0; y < grid.length; y++) {
		if (isRowEmpty(y)) yOffset += mode.expansion;

		for (let x = 0; x < grid[0].length; x++) {
			if (isColumnEmpty(x)) xOffset += mode.expansion;

			const item = grid[y][x];
			if (isGalaxy(item)) {
				galaxies.push({ x: x + xOffset, y: y + yOffset, id: counter });
				counter++;
			}
		}

		xOffset = 0;
	}

	return galaxies;
}

const manhattan = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
const getId = (a, b) => `${Math.min(a.id, b.id)}:${Math.max(a.id, b.id)}`

const getDistances = galaxies => {
	const result = galaxies.reduce((acc, a) => {
		for (const b of galaxies) {
			const id = getId(a, b);
			if (b.id === a.id || acc[id]) continue;
			acc[id] = manhattan(a, b);
		}

		return acc;
	}, {});

	return Object.values(result);
};

const run = mode => {
	const galaxies = getGalaxies(mode)
	const sum = getDistances(galaxies).reduce((acc, d) => acc + d, 0);

	console.log({ sum });
};

const FIRST_MODE = { expansion: 1 };
const SECOND_MODE = { expansion: 1000000 - 1 };

run(FIRST_MODE);
run(SECOND_MODE);
