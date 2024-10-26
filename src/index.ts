import { prettyPrintPlateau } from './helpers';
import { createPlateau } from './plateau';
import { moveRover, placeRover } from './rover';
import { getInstructionsFromFile } from './utils';

const exploreTerrain = async (filePath: string) => {
	const { upperX, upperY, instructions } =
		await getInstructionsFromFile(filePath);
	const plateau = createPlateau(upperX, upperY);

	instructions.forEach(([initialCoordinatesWithDirection, instructions]) => {
		const { x, y, direction } = placeRover(
			plateau,
			initialCoordinatesWithDirection,
		);
		moveRover(plateau, instructions, { x, y }, direction);
	});

	prettyPrintPlateau(plateau);
};

exploreTerrain('./test/manual/data.txt');
