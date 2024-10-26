import { prettyPrintPlateau } from './helpers';
import { createPlateau } from './plateau';
import { moveRover, placeRover } from './rover';
import type { Plateau } from './types';
import { getInstructionsFromFile } from './utils';
import { getCommandLineArgs } from './utils/bun';

export const exploreMars = async (filePath: string) => {
	let plateau: Plateau;

	try {
		const { upperX, upperY, instructions } =
			await getInstructionsFromFile(filePath);
		plateau = createPlateau(upperX, upperY);

		instructions.forEach(([initialCoordinatesWithDirection, instructions]) => {
			const { x, y, direction } = placeRover(
				plateau,
				initialCoordinatesWithDirection,
			);
			moveRover(plateau, instructions, { x, y }, direction);
		});
	} catch (error) {
		console.error('An error occurred while exploring Mars:', error);
		throw error;
	}

	const { isDev } = getCommandLineArgs();

	if (isDev) {
		prettyPrintPlateau(plateau);
	}
};

const { filePath } = getCommandLineArgs();

exploreMars(filePath ?? './test/manual/data.txt');
