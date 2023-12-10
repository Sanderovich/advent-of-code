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
	const map = path.reduce((acc, { x, y }) => acc.set(`${x}:${y}`, true), new Map());
	const rows = path
		.reduce((acc, { x, y, char }) => {
			if (!acc[y]) {
				acc[y] = [];
			}

			acc[y].push({ x, char });
			acc[y].sort((a, b) => a.x - b.x);
			return acc;
		}, {});

	let total = 0;

	function relationPP(P, polygon) {
		const between = (p, a, b) => p >= a && p <= b || p <= a && p >= b
		let inside = false
		for (let i = polygon.length-1, j = 0; j < polygon.length; i = j, j++) {
			const A = polygon[i]
			const B = polygon[j]
			// corner cases
			if (P.x == A.x && P.y == A.y || P.x == B.x && P.y == B.y) return 0
			if (A.y == B.y && P.y == A.y && between(P.x, A.x, B.x)) return 0

			if (between(P.y, A.y, B.y)) { // if P inside the vertical range
				// filter out "ray pass vertex" problem by treating the line a little lower
				if (P.y == A.y && B.y >= A.y || P.y == B.y && A.y >= B.y) continue
				// calc cross product `PA X PB`, P lays on left side of AB if c > 0
				const c = (A.x - P.x) * (B.y - P.y) - (B.x - P.x) * (A.y - P.y)
				if (c == 0) return 0
				if ((A.y < B.y) == (c > 0)) inside = !inside
			}
		}

		return inside? 1 : -1
	}

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (map.has(`${x}:${y}`)) continue;
			const result = relationPP({ x, y }, path);
			if (result === 1) {
				total++;
			}
		}
	}

	console.log({ total });
};

first();
second();
