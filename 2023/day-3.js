import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 3 });

const isGear = char => char === '*';
const isSymbol = char => !Number.isInteger(char) && char !== '.';
const isNumber = char => Number.isInteger(parseInt(char));

const grid = input
    .trim()
    .split(/\n/)
    .map(l => l.split('').map(i => isNumber(i) ? parseInt(i) : i));

const startX = (x, y) => {
    let xStart = x - 1;
    let item = grid[y][xStart];
    while (isNumber(item)) {
        xStart--;
        item = grid[y][xStart];
    }

    return xStart + 1;
}

let visited = {};
const isVisited = (x, y) => visited[y]?.includes(x);
const pushVisited = (x, y) => {
    if (!visited[y]) visited[y] = [];
    visited[y].push(x);
}

const number = (x, y) => {
    let xStart = startX(x, y);
    if (isVisited(xStart, y)) {
        return undefined;
    }

    let result = '';
    let item = grid[y][xStart];

    while (isNumber(item)) {
        pushVisited(xStart, y);
        result += item;

        xStart++;
        item = grid[y][xStart];
    }

    return parseInt(result);
}

const adjacent = (x, y, amount = undefined, calcResult) => {
    const result = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            if (xOffset === 0 && yOffset === 0) continue;

            const _x = x + xOffset;
            const _y = y + yOffset;
            const item = grid[_y][_x];
            if (!Number.isInteger(item)) continue;

            const _result = number(_x, _y, item);
            if (_result) {
                result.push(_result);
            }
        }
    }

    if (amount && result.length !== amount) {
        throw new Error(`Result length did not match required amount:${amount}`);
    }

    return calcResult(result);
}

const sum = (filter, amount, calcResult) => {
    let i = 0;
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];

        for (let x = 0; x < row.length; x++) {
            if (filter(row[x])) {
                continue;
            }

            try {
                i += adjacent(x, y, amount, calcResult)
            } catch(e) {
                // limit was reached
            }
        }
    }

    console.log({ i });
}

const first = () => {
    sum(
        char => !isSymbol(char),
        undefined,
        result => result.reduce((acc, item) => acc + item, 0),
    );
}

const second = () => {
    visited = {};
    sum(
        char => !isGear(char),
        2,
        result => result[0] * result[1],
    );
}

first();
second();
