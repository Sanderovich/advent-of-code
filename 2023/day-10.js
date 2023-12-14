import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 10 });
const grid = input
	.trim()
	.split(/\n/)
	.map(i => i.split(''));

const START_CHAR = 'S';
let START = undefined;
for (const [ y, row ] of grid.entries()) {
	const x = row.indexOf(START_CHAR);
	if (x > -1) {
		START = { x, y, char: START_CHAR };
		break;
	}
}

const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

const between = (p, a, b) => p >= a && p <= b || p <= a && p >= b;

const adjacents = [
	{ x: 0,  y: -1, direction: UP },
	{ x: -1, y: 0,  direction: LEFT },
	{ x: 1,  y: 0,  direction: RIGHT },
	{ x: 0,  y: 1,  direction: DOWN },
];

const nodes = {
	'.': () => false,
	'S': (n, d) => {
		if (d === UP) return [ '7', 'F', '|' ].includes(n.char);
		if (d === DOWN) return [ 'L', 'J', '|' ].includes(n.char);
		if (d === LEFT) return [ 'L', 'F', '-' ].includes(n.char);
		if (d === RIGHT) return [ '7', 'J', '-' ].includes(n.char);
		return false;
	},
	'|': (n, d) => {
		if (d === UP) return [ '7', 'F', '|', 'S' ].includes(n.char);
		if (d === DOWN) return [ 'L', 'J', '|', 'S' ].includes(n.char);
		return false;
	},
	'-': (n, d) => {
		if (d === LEFT) return [ 'L', 'F', '-', 'S' ].includes(n.char);
		if (d === RIGHT) return [ '7', 'J', '-', 'S' ].includes(n.char);
		return false;
	},
	'L': (n, d) => {
		if (d === RIGHT) return [ '-', 'J', '7', 'S' ].includes(n.char);
		if (d === UP) return [ '7', '|', 'F', 'S' ].includes(n.char);
		return false;
	},
	'J': (n, d) => {
		if (d === LEFT) return [ '-', 'L', 'F', 'S' ].includes(n.char);
		if (d === UP) return [ '7', '|', 'F', 'S' ].includes(n.char);
		return false;
	},
	'7': (n, d) => {
		if (d === LEFT) return [ '-', 'L', 'F', 'S' ].includes(n.char);
		if (d === DOWN) return [ 'L', '|', 'J', 'S'].includes(n.char);
		return false;
	},
	'F': (n, d) => {
		if (d === RIGHT) return [ '-', 'J', '7', 'S' ].includes(n.char);
		if (d === DOWN) return [ 'L', '|', 'J', 'S' ].includes(n.char);
		return false;
	},
}

const equal = (a, b) => a.x === b.x && a.y === b.y;
const connects = (a, b, direction) => nodes[a.char](b, direction);

const getPath = () => {
	const path = [];

	let previous = undefined;
	let item = START;

	while (!previous || !equal(item, START)) {
		for (const i of adjacents) {
			const adjacent = { x: item.x + i.x, y: item.y + i.y, char: grid[item.y + i.y]?.[item.x + i.x] };
			if (!adjacent.char || (previous && equal(adjacent, previous))) {
				continue;
			}

			if (connects(item, adjacent, i.direction)) {
				path.push(adjacent);
				previous = item;
				item = adjacent
				break;
			}
		}
	}

	return path;
}

const first = () => {
	const path = getPath();
	const answer = Math.ceil((path.length - 1) / 2);

	console.log({ answer });
};

const second = () => {
	const path = getPath();
	const map = path.reduce((acc, { x, y, char }) => acc.set(`${x}:${y}`, char), new Map());

	function isInside(p, polygon) {
		let inside = false

		for (let i = polygon.length - 1, j = 0; j < polygon.length; i = j, j++) {
			const a = polygon[i]
			const b = polygon[j]

			if (equal(p, a) || equal(p, b)) return false
			if (a.y === b.y && p.y === a.y && between(p.x, a.x, b.x)) return false

			if (between(p.y, a.y, b.y)) {
				if (p.y === a.y && b.y >= a.y || p.y === b.y && a.y >= b.y) continue

				const c = (a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y - p.y)
				if (c === 0) return false
				if ((a.y < b.y) === (c > 0)) inside = !inside
			}
		}

		return inside;
	}

	let total = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (map.has(`${x}:${y}`)) continue;

			let hits = 0;
			for (let xx = x + 1; xx < grid[0].length; xx++) {
				const item = map.get(`${xx}:${y}`);
				if (item === '|') {
					hits++;
				} else if (item !== undefined) {
					hits--;
				}
			}

			if (hits >= 0 && hits % 2 !== 0) {
				console.log(`${x}:${y}`);
				total++;
			}
		}
	}

	console.log({ total });
};

first();
second();
