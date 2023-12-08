import fs from 'node:fs';
import path from 'node:path';

import { SECRET } from "./secret.js";

export const getInput = async ({ year, day }) => {
	const inputPath = path.join(`${year}`, `day-${day}-input.txt`);
	if (fs.existsSync(inputPath)) {
		return fs
			.readFileSync(inputPath)
			.toString();
	}

	const headers = new Headers({ 'Cookie': `session=${SECRET.session}` });
	const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, { headers });
	if (!response.ok) {
		throw new Error(`Failed to fetch input for year:${year} day:${day}`);
	}

	const text = await response.text();
	fs.writeFileSync(inputPath, text);

	return text;
};
