import { getInput } from "../get-input.js";

const memoize = fn => {
	const cache = new Map();

	return (...args) => {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}

		const result = fn(...args);
		cache.set(key, result);

		return result;
	}
}

const repeat = (string, times, separator) => new Array(times).fill(string).join(separator)
const sum = numbers => numbers.reduce((acc, i) => acc + i, 0);

const input = await getInput({ year: 2023, day: 12 });
const parse = mode => input
	.trim()
	.split(/\n/)
	.map(l => {
		const [ springs, groups ] = l.split(' ');
		return {
			springs: repeat(springs, mode.repeat, '?'),
			groups: repeat(groups, mode.repeat, ',').split(',').map(Number),
		};
	});

const OPERATIONAL = '.';
const BROKEN = '#'

const OPTIONS = [ OPERATIONAL, BROKEN ];

const isOperational = i => i === OPERATIONAL;
const isBroken = i => i === BROKEN;

const step = memoize((springs, groups) => {
	if (!springs.length) {
		return !groups.length ? 1 : 0;
	}

	if (!groups.length) {
		return springs.match(/^([.?])+$/g) ? 1 : 0;
	}

	if (springs.length < sum(groups) + groups.length - 1) {
		return 0;
	}

	if (isOperational(springs[0])) {
		return step(springs.slice(1), groups);
	}

	if (isBroken(springs[0])) {
		const [ group, ...left ] = groups;
		for (let i = 1; i < group; i++) {
			if (isOperational(springs[i])) return 0;
		}

		if (isBroken(springs[group])) {
			return 0;
		}

		return step(springs.slice(group + 1), left);
	}

	return OPTIONS.reduce((acc, option) => acc + step(option + springs.slice(1), groups), 0);
})

const run = mode => {
	const sum = parse(mode).reduce((acc, { springs, groups }) => {
		const possibilities = step(springs, groups);
		return acc + possibilities;
	}, 0);

	console.log({ sum });
};

const FIRST_MODE = { repeat: 1 };
const SECOND_MODE = { repeat: 5 };

run(FIRST_MODE);
run(SECOND_MODE);
