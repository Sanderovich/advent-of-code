import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 5 });
const lines = input.trim().split(/\n\n/);

const parseMap = map => map
	.split(/\n/)
	.slice(1)
	.map(l => l.split(' ').map(Number));

const seeds = lines[0]
	.match(/ [0-9]+/g)
	.map(n => parseInt(n));

const maps = lines
	.slice(1)
	.map(m => parseMap(m));

const isInRange = (i, start, length) => {
	return start <= i && i <= start + length - 1;
}

const lowest = items => items.reduce((_lowest, i) => {
	if (i < _lowest) {
		_lowest = i;
	}

	return _lowest;
}, Number.MAX_VALUE)

const first = () => {
	const current = seeds.slice();

	for (const map of maps) {

		for (let i = 0; i < current.length; i++) {
			const item = current[i];

			for (const range of map) {
				const [ destination, source, length ] = range;
				if (!isInRange(item, source, length)) {
					continue;
				}

				const offset = Math.abs(source - item);
				current[ i ] = destination + offset;
				break;
			}
		}
	}

	const answer = lowest(current);

	console.log({ answer });
};

const second = () => {
	const current = seeds.slice();
	const _maps = [ ...maps ].reverse();
	let lowest = Infinity;

	const exists = item => {
		for (let i = 0; i < current.length; i += 2) {
			const start = current[i];
			const end = current[i] + current[i + 1] - 1;
			if (start <= item && item <= end) {
				return true;
			}
		}

		return false;
	};

	for (let i = 0; i < Infinity; i++) {
		let item = i;

		for (const map of _maps) {
			for (const range of map) {
				const [ source, destination, length ] = range;
				if (!isInRange(item, source, length)) {
					continue;
				}

				const offset = Math.abs(source - item);
				item = destination + offset;
				break;
			}
		}

		if (exists(item)) {
			lowest = i;
			break;
		}
	}

	console.log({ lowest });
};

first();
second();
