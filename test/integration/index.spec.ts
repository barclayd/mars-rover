import { beforeEach, expect, mock, test } from 'bun:test';
import { simulateMission } from '../../src/mars';
import { readFile, removePreviousOutputFile } from '../utils';

beforeEach(async () => {
  console.error = mock(() => {});
  await removePreviousOutputFile();
});

test('should output the final positions of the rovers to the output file', async () => {
  const inputFile = './test/data/input.txt';
  const outputFile = './test/data/output.txt';

  await simulateMission(inputFile);

  const output = await readFile(outputFile);

  expect(output).toBe('1 3 N\n\n5 1 E');
});

test('should throw an error if the input file does not exist', async () => {
  const inputFile = './test/data/does-not-exist.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    'Error reading input file: No such file or directory',
  );
});

test('should throw an error if the input file is empty', async () => {
  const inputFile = './test/data/empty.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    'Error reading input file: Input file is empty',
  );
});

test('should throw an error if the upper bounds of the plateau are missing', async () => {
  const inputFile = './test/data/missing-upper-bounds.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    'Missing upper bounds of plateau',
  );
});

test('should throw an error if the upper bounds of the plateau are invalid', async () => {
  const inputFile = './test/data/invalid-upper-bounds.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    'Invalid upper bounds of plateau',
  );
});

test('should throw an error if the initial position of a rover is invalid', async () => {
  const inputFile = './test/data/invalid-initial-position.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    'Invalid initial coordinates: Expected number, received nan',
  );
});

test('should throw an error if the initial direction of a rover is invalid', async () => {
  const inputFile = './test/data/invalid-initial-direction.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    `Invalid initial coordinates: Invalid enum value. Expected 'N' | 'E' | 'S' | 'W', received 'X'`,
  );
});

test('should throw an error if the instructions of a rover are invalid', async () => {
  const inputFile = './test/data/invalid-instructions.txt';

  await expect(simulateMission(inputFile)).rejects.toThrowError(
    `Invalid instructions: Invalid enum value. Expected 'M' | 'L' | 'R', received 'X'`,
  );
});

test('should call console.warn if the rover moves out of bounds', async () => {
  const inputFile = './test/data/invalid-move.txt';

  const warnSpy = mock(() => {});

  console.warn = warnSpy;

  await simulateMission(inputFile);

  expect(warnSpy).toHaveBeenCalledWith('Invalid move. Rover stays in place.');
});

test('should call console.error if an error occurs while simulating the mission', async () => {
  const inputFile = './test/data/missing-upper-bounds.txt';

  const errorSpy = mock(() => {});

  console.error = errorSpy;

  await expect(simulateMission(inputFile)).rejects.toThrow();

  expect(errorSpy).toHaveBeenCalledWith(
    'An error occurred while exploring Mars',
  );
});

test('should print to the console using console.debug the final positions of the rovers in dev mode', async () => {
  const inputFile = './test/data/input.txt';

  const debugSpy = mock(() => {});

  console.debug = debugSpy;

  await simulateMission(inputFile, true);

  expect(debugSpy).toHaveBeenNthCalledWith(
    1,
    '(0,5) | (1,5) | (2,5) | (3,5) | (4,5) | (5,5)',
  );
  expect(debugSpy).toHaveBeenNthCalledWith(
    2,
    '(0,4) | (1,4) | (2,4) | (3,4) | (4,4) | (5,4)',
  );
  expect(debugSpy).toHaveBeenNthCalledWith(
    3,
    '(0,3) |   N   | (2,3) | (3,3) | (4,3) | (5,3)',
  );
  expect(debugSpy).toHaveBeenNthCalledWith(
    4,
    '(0,2) | (1,2) | (2,2) | (3,2) | (4,2) | (5,2)',
  );
  expect(debugSpy).toHaveBeenNthCalledWith(
    5,
    '(0,1) | (1,1) | (2,1) | (3,1) | (4,1) |   E  ',
  );
  expect(debugSpy).toHaveBeenNthCalledWith(
    6,
    '(0,0) | (1,0) | (2,0) | (3,0) | (4,0) | (5,0)',
  );
});

test('should error if no input file path is provided and no default input file path is set', async () => {
  await expect(simulateMission()).rejects.toThrowError(
    'Input file path is required',
  );
});

test('should not write to the output file if an error occurs', async () => {
  const inputFile = './test/data/invalid-upper-bounds.txt';

  await expect(simulateMission(inputFile)).rejects.toThrow();

  const outputFile = './test/data/output.txt';

  await expect(readFile(outputFile)).rejects.toThrowError(
    'Error reading file: No such file or directory',
  );
});
