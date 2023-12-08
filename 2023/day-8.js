import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 8 });
const lines = input.trim().split(/\n/);

const direction = {
	'L': 0,
	'R': 1
};

const START = 'AAA';
const END = 'ZZZ';

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

const instructions = lines[0]
	.split('');

const nodes = lines
	.slice(2)
	.reduce((acc, line) => {
		const [ node, adjacent ] = line.split(' = ');
		acc[node] = adjacent.match(/([1-9]|[A-Z])+/g);
		return acc;
	}, {});

const step = (next, end) => {
	let steps = 0;
	let pointer = 0;
	do {
		const instruction = instructions[pointer];
		next = nodes[next][direction[instruction]];

		pointer = pointer >= instructions.length - 1 ? 0 : pointer + 1;
		steps++;
	} while (!next.endsWith(end));

	return steps
};

const first = () => {
	const steps = step(START, END);
	console.log({ steps });
};

const second = () => {
	const starts = Object.keys(nodes).filter(n => n.endsWith('A'));
	const total = starts.reduce((acc, next) => lcm(acc, step(next, 'Z')), 1);

	console.log({ total });
};

first();
second();
