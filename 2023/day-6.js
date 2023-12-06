const input = `
Time:        48     87     69     81
Distance:   255   1288   1117   1623`;

const lines = input
	.trim()
	.split(/\n/)

const step = r => {
	const total = r.reduce((acc, [ time, distance ]) => {
		let wins = 0;
		for (let i = 1; i < time; i++) {
			const travelled = i * (time - i);
			if (travelled > distance) {
				wins++;
			}
		}

		acc === 0 ? acc = wins : acc = acc * wins;
		return acc;
	}, 0);

	console.log({ total });
};

const [ time, distances ] = lines.map(l => l.match(/[0-9]+/g).map(Number));
const iFirst = time.reduce((acc, t, i) => {
	acc.push([ t, distances[i] ]);
	return acc;
}, []);
step(iFirst);

const iSecond = lines
	.map(l => {
		const n = l
			.split(':')[1]
			.replaceAll(' ','')
		return parseInt(n);
	});
step([ iSecond ]);


