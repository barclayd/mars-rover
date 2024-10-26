import { plateauBoundsInputSchema } from '../schemas';

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

export const getInstructionsFromFile = async (filePath: string) => {
	let input: string;
	try {
		const file = Bun.file(filePath);
		input = await file.text();
	} catch (error: unknown) {
		throw new Error(
			`Error reading input file: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

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
