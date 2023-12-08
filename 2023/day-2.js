import { getInput } from "../get-input.js";

const input = await getInput({ year: 2023, day: 2 });

const games = input
    .trim()
    .split(/\n/)
    .map(i => i
            .match(/\d+ (?:blue|red|green)/g)
            .map(j => {
                const [ number, color ] = j.split(' ');
                return [ parseInt(number), color ];
            })
    );

const rules = {
    'red': 12,
    'green': 13,
    'blue': 14,
}

const first = () => {
    const sum = games.reduce((_sum, game, id) => {
        const valid = game.every(([ amount, color ]) => amount <= rules[color])
        return valid ? _sum + (id + 1) : _sum;
    }, 0);

    console.log('sum', sum);
}

const second = () => {
    const sum = games.reduce((_sum, game) => {
        const max = game.reduce((_max, [ amount, color ]) => {
            if (amount > _max[color]) {
                _max[color] = amount;
            }
            return _max;
        }, { 'red': 0, 'green': 0, 'blue': 0 })

        const power = Object.values(max)
            .reduce((acc, item) => acc * item, 1)
        return _sum + power;
    }, 0);

    console.log('sum', sum);
}

first();
second();
