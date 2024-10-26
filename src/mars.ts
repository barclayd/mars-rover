import { prettyPrintPlateau } from './helpers';
import { createPlateau } from './plateau';
import { moveRover, placeRover } from './rover';
import type { Direction, Plateau } from './types';
import { formatRoverPositions, getInstructionsFromFile } from './utils';
import { removeFile, writeOutputToFile } from './utils/bun';

export const exploreMars = async (filePath?: string, isDev?: boolean) => {
	let plateau: Plateau;
	const roverPositions: { x: number; y: number; direction: Direction }[] = [];

	try {
		await removeFile();
		const { upperX, upperY, instructions } =
			await getInstructionsFromFile(filePath);
		plateau = createPlateau(upperX, upperY);

		instructions.forEach(([initialCoordinatesWithDirection, instructions]) => {
			const initialPosition = placeRover(
				plateau,
				initialCoordinatesWithDirection,
			);
			const finalPosition = moveRover(
				plateau,
				instructions,
				{ x: initialPosition.x, y: initialPosition.y },
				initialPosition.direction,
			);

			roverPositions.push(finalPosition);
		});
	} catch (error) {
		console.error('An error occurred while exploring Mars:', error);
		throw error;
	}

	if (isDev) {
		prettyPrintPlateau(plateau);
		return;
	}

	const formattedRoverPositions = formatRoverPositions(roverPositions);

	await writeOutputToFile(formattedRoverPositions);
};
