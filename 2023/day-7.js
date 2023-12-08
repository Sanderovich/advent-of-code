import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 7 });
const lines = input.trim().split(/\n/);

const HAND_LENGTH = 5;
const PART = 2;

const LETTERS = [ 'A', 'K', 'Q', 'T', 'J' ];
const ITEMS = [ 'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ]

const getCount = hand => {
	const result = hand.reduce((acc, i) => {
		acc[i] ? acc[i]++ : acc[i] = 1;
		return acc;
	}, {});

	return Object.values(result).sort((a, b) => b - a);
};

const verify = (hand, ...expected) => {
	const c = getCount(hand);
	return expected.every((e, i) => c[i] === e);
}

const types = {
	7: hand => hand.every(i => i === hand[0]),
	6: hand => verify(hand, 4, 1),
	5: hand => verify(hand, 3, 2),
	4: hand => verify(hand, 3, 1, 1),
	3: hand => verify(hand, 2, 2, 1),
	2: hand => verify(hand, 2, 1, 1, 1),
	1: hand => new Set(hand).size === HAND_LENGTH,
}

const getTypeA = hand => {
	for (const [ score, comparator ] of Object.entries(types)) {
		if (comparator(hand)) {
			return parseInt(score);
		}
	}

	throw new Error(`Cannot get type of hand:${hand}`);
};

const getTypeB = hand => {
	const jIndexes = hand
		.map((i, idx) => i === 'J' ? idx : -1)
		.filter(i => i > -1);

	if (!jIndexes.length) {
		for (const [ score, comparator ] of Object.entries(types)) {
			if (comparator(hand)) {
				return parseInt(score);
			}
		}
	}

	const step = (previous, i) => {
		const copy = previous.slice();
		const j = jIndexes[i];

		let highest = 0;
		for (const letter of ITEMS) {
			copy[j] = letter;
			if (i < jIndexes.length - 1) {
				const result = step(copy, i + 1);
				if (result > highest) {
					highest = result;
				}

				continue;
			}

			for (const [ score, comparator ] of Object.entries(types)) {
				if (!comparator(copy)) {
					continue;
				}

				const result = parseInt(score);
				if (result > highest) {
					highest = result;
				}
			}
		}


		return highest;
	}

	return step(hand.slice(), 0);
};

const getType = hand => {
	return PART === 1 ? getTypeA(hand) : getTypeB(hand);
};

const compare = (a, b) => {
	for (const [ idx, i ] of a.hand.entries()) {
		const j = b.hand[idx];
		const iNumber = parseInt(i);
		const jNumber = parseInt(j);
		if (Number.isInteger(iNumber) && Number.isInteger(jNumber)) {
			const result = iNumber - jNumber;
			if (result === 0) {
				continue;
			}
			return result;
		}

		if (!Number.isInteger(iNumber) && !Number.isInteger(jNumber)) {
			const iIndex = LETTERS.indexOf(i);
			const jIndex = LETTERS.indexOf(j);

			const result = jIndex - iIndex;
			if (result === 0) {
				continue;
			}
			return result;
		}

		if (Number.isInteger(iNumber)) {
			// TODO: change this to return -1 for PART 1
			return j === 'J' ? 1 : -1;
		}

		// TODO: change this to return 1 for PART 1
		return i === 'J' ? -1 : 1;
	}
}

const cards = lines
	.reduce((acc, c) => {
		let [ hand, bid ] = c.split(' ');
		bid = parseInt(bid);
		hand = hand.split('');

		const type = getType(hand);

		acc.push({ hand, bid, type });
		return acc
	}, [])
	.sort((a, b) => {
		const result = a.type - b.type;
		if (result !== 0) {
			return result;
		}

		return compare(a, b);
	});


const run = () => {
	const total = cards.reduce((acc, c, rank) => {
		acc += c.bid * (rank + 1);
		return acc;
	}, 0);

	console.log({ total });
};

run();
