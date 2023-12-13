import { getInput } from '../get-input.js';

const transform = map => {
	const result = Array(map[0].length).fill('');
	for (const row of map) {
		[ ...row ].forEach((c, i) => result[i] += c);
	}

	return result;
}

const input = await getInput({ year: 2023, day: 13 });
const maps = input
	.trim()
	.split(/\n\n/)
	.map(m => {
		const split = m.split(/\n/);
		const vertical = transform(split);

		return [
			{ map: split, add: i => 100 * i },
			{ map: vertical, add: i => i }
		];
	});

const check = (map, row) => {
	for (let i = row - 1, j = row; i >= 0 && j < map.length; i--, j++) {
		if (map[i] !== map[j]) return false;
	}

	return true;
};

const checkSmudge = (map, row) => {
	let smudge = false;
	for (let i = row - 1, j = row; i >= 0 && j < map.length; i--, j++) {
		for (let k = 0; k < map[i].length; k++) {
			if (map[i][k] !== map[j][k]) {
				if (smudge) return false;
				smudge = true;
			}
		}
	}

	return smudge;
};

const getReflectionLine = (map, isReflectionRow) => {
	for (let y = 1; y < map.length; y++) {
		if (isReflectionRow(map, y)) {
			return y;
		}
	}

	return undefined;
};

const run = mode => {
	const total = maps.reduce((acc, orientations) => {
		for (const orientation of orientations) {
			const line = getReflectionLine(orientation.map, mode.check);
			if (line) {
				return acc + orientation.add(line);
			}
		}
	}, 0);

	console.log({ total });
};

const FIRST_MODE = { check };
const SECOND_MODE = { check: checkSmudge };

run(FIRST_MODE);
run(SECOND_MODE);
