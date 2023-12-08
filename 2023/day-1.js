import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 1 });
const lines = input.trim().split(/\n/);

const map = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
}

const concat = (...numbers) => parseInt(numbers.join(''));
const textToInt = text => map[text] || parseInt(text);

const first = () => {
    const sum = lines.reduce((acc, line) => {
        const matches = line.match(/[1-9]/g);
        if (!matches.length) return acc;

        return acc + concat(matches[0], matches[matches.length - 1]);
    }, 0)

    console.log({ sum });
}


const second = () => {
    const regex = /(?<=([1-9]|one|two|three|four|five|six|seven|eight|nine))/g;

    const sum = lines.reduce((acc, line) => {
        const matches = Array.from(line.matchAll(regex), i => textToInt(i[1]))
        if (!matches.length) return acc;

        return acc + concat(matches[0], matches[matches.length - 1]);
    }, 0);

    console.log({ sum });
};

first();
second();
