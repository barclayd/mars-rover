import { plateauBoundsInputSchema } from '../schemas';
import type { Direction } from '../types';
import { readFile } from './bun';

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
	return array.reduce<T[][]>((acc, _, index) => {
		if (index % chunkSize === 0) {
			acc.push(array.slice(index, index + chunkSize));
		}
		return acc;
	}, []);
};

export const removeWhitespace = (str: string): string => {
	return str.replace(/\s/g, '');
};

export const formatInput = (data: string) => {
	const lines: string[] = data.split(/\r?\n/);
	return lines.map((line) => removeWhitespace(line.trim()));
};

export const getInstructionsFromFile = async (filePath?: string) => {
	if (!filePath) {
		throw new Error('File path is required');
	}

	const input = await readFile(filePath);

	const lines: string[] = input.split(/\r?\n/);
	const formattedLines = lines.map((line) => removeWhitespace(line.trim()));

	const [upperRightCoordinatesOfPlateau, ...instructionsInput] = formattedLines;

	const [upperXInput, upperYInput] = upperRightCoordinatesOfPlateau.split('');

	const parsedUpperRightCoordinates = plateauBoundsInputSchema.safeParse([
		upperXInput,
		upperYInput,
	]).data;

	if (!parsedUpperRightCoordinates) {
		throw new Error('Invalid upper right coordinates of plateau');
	}

	const [upperX, upperY] = parsedUpperRightCoordinates;

	return {
		upperX,
		upperY,
		instructions: chunkArray(instructionsInput, 2),
	};
};

export const formatRoverPositions = (
	roverPositions: { x: number; y: number; direction: Direction }[],
) => {
	return roverPositions
		.map((rover) => `${rover.x} ${rover.y} ${rover.direction}`)
		.join('\n\n');
};
