import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 9 });
const lines  = input
	.trim()
	.split(/\n/)
	.map(l => l.split(' ').map(Number));

const calc = (a, operator, b) => {
	switch (operator) {
		case '-':
			return a - b;
		case '+':
			return a + b;
		default:
			throw new Error(`Operator:${operator} is not supported.`);
	}
};

const step = (numbers, mode) => {
	const diff = [];
	for (let idx = 0; idx <= numbers.length - 2; idx++) {
		diff.push(numbers[idx + 1] - numbers[idx]);
	}

	const equal = diff.every(i => i === diff[0]);
	const next = equal ? diff.pop() : step(diff, mode)

	return calc(mode.getItem(numbers), mode.operator, next);
};

const run = mode => {
	const total = lines.reduce((acc, line) => acc + step(line, mode), 0);
	console.log({ total });
};

const FIRST_MODE = { operator: '+', getItem: numbers => numbers[numbers.length - 1] };
const SECOND_MODE = { operator: '-', getItem: numbers => numbers[0] };

run(FIRST_MODE);
run(SECOND_MODE);
