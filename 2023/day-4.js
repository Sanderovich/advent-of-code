import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 4 });

const parse = list => list
	.split(' ')
	.filter(Boolean)
	.map(i => parseInt(i));

const cards = input
	.trim()
	.split(/\n/)
	.map(l => {
		const start = l.indexOf(':') + 1;
		const [ winning, scratch ] = l
			.substring(start)
			.split('|')
			.map(i => parse(i));
		return winning.reduce((acc, i) => scratch.includes(i) ? acc + 1 : acc, 0)
	});

const first = () => {
	const sum = cards.filter(Boolean).reduce((_sum, hits) => _sum + Math.pow(2, hits - 1), 0);
	console.log({ sum });
};

const second = () => {
	const items = Array(cards.length).fill(1);
	for (const [ idx, hits ] of cards.entries()) {
		for (let c = 1; c <= hits; c++) {
			items[ idx + c ] += 1 * items[ idx ];
		}
	}

	const total = items.reduce((acc, i) => acc + i, 0);
	console.log({ total });
};

first();
second();

