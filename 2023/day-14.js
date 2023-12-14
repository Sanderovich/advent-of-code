import { getInput } from "../get-input.js";

const ROUNDED = 'O';
const SQUARE = '#';

const isRounded = i => i === ROUNDED;
const isSquare = i => i === SQUARE;

const add = (o, y, x) => {
	if (!o[y]) {
		o[y] = {};
	}

	o[y][x] = true;
}

const input = await getInput({ year: 2023, day: 14 });
const grid = input
	.trim()
	.split(/\n/)
	.map(l => l.split(''));

const parse = () => {
	const round = {};
	const square = {};

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			const item = grid[y][x];
			if (isRounded(item)) add(round, y, x);
			if (isSquare(item)) add(square, y, x);
		}
	}

	return { round, square };
}

const closest = (map, x, y) => {
	for (let row = y - 1; row >= 0; row--) {
		if (map[row]?.[x]) return row + 1;
	}

	return 0;
}

const first = () => {
	const { round, square } = parse();
	let total = 0;
	for (const y in round) {
		const row = round[y];

		for (const x in row) {
			const yNew = Math.max(closest(round, x, y), closest(square, x, y));
			delete round[y][x];
			add(round, yNew, x);

			total += grid.length - yNew;
		}
	}

	console.log({ total });
}

first();
