import { expect, test, beforeEach, mock } from 'bun:test';
import { exploreMars } from '../../src/mars';
import { readFile, removePreviousOutputFile } from '../utils';

beforeEach(async () => {
	console.error = mock(() => {});
	await removePreviousOutputFile();
});


test('should output the final positions of the rovers to the output file', async () => {
	const inputFile = './test/data/input.txt';
	const outputFile = './test/data/output.txt';

	await exploreMars(inputFile);

	const output = await readFile(outputFile);

	expect(output).toBe('1 3 N\n\n5 1 E');
});

test('should throw an error if the input file does not exist', async () => {
	const inputFile = './test/data/does-not-exist.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		'Error reading input file: No such file or directory',
	);
});

test('should throw an error if the input file is empty', async () => {
	const inputFile = './test/data/empty.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		'Error reading input file: Input file is empty',
	);
});

test('should throw an error if the upper bounds of the plateau are missing', async () => {
	const inputFile = './test/data/missing-upper-bounds.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		'Missing upper bounds of plateau',
	);
});

test('should throw an error if the upper bounds of the plateau are invalid', async () => {
	const inputFile = './test/data/invalid-upper-bounds.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		'Invalid upper bounds of plateau',
	);
});

test('should throw an error if the initial position of a rover is invalid', async () => {
	const inputFile = './test/data/invalid-initial-position.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		'Invalid initial coordinates: Expected number, received nan',
	);
});

test('should throw an error if the initial direction of a rover is invalid', async () => {
	const inputFile = './test/data/invalid-initial-direction.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		`Invalid initial coordinates: Invalid enum value. Expected 'N' | 'E' | 'S' | 'W', received 'X'`,
	);
});

test('should throw an error if the instructions of a rover are invalid', async () => {
	const inputFile = './test/data/invalid-instructions.txt';

	await expect(exploreMars(inputFile)).rejects.toThrowError(
		`Invalid instructions: Invalid enum value. Expected 'M' | 'L' | 'R', received 'X'`,
	);
});

test('should call console.warn if the rover moves out of bounds', async () => {
	const inputFile = './test/data/invalid-move.txt';

    const warnSpy = mock(() => {});

    console.warn = warnSpy;

    await exploreMars(inputFile);

    expect(warnSpy).toHaveBeenCalledWith('Invalid move. Rover stays in place.');
});
