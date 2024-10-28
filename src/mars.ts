import { prettyPrintPlateau } from './helpers';
import { createPlateau } from './plateau';
import { moveRover, placeRover } from './rover';
import type { Plateau } from './types';
import { formatRoverPositions, getInstructionsFromFile } from './utils';
import { writeOutputToFile } from './utils/bun';

export const simulateMission = async (filePath?: string, isDev?: boolean) => {
  let plateau: Plateau;

  try {
    const { upperX, upperY, instructions } =
      await getInstructionsFromFile(filePath);

    plateau = createPlateau(upperX, upperY);

    instructions.forEach(([initialCoordinatesWithDirection, instructions]) => {
      const initialRoverPosition = placeRover(
        plateau,
        initialCoordinatesWithDirection,
      );
      const finalRoverPosition = moveRover(
        plateau,
        instructions,
        { x: initialRoverPosition.x, y: initialRoverPosition.y },
        initialRoverPosition.direction,
      );

      plateau.roverPositions.push(finalRoverPosition);
    });
  } catch (error) {
    console.error('An error occurred while exploring Mars');
    throw error;
  }

  if (isDev) {
    prettyPrintPlateau(plateau);
    return;
  }

  const formattedRoverPositions = formatRoverPositions(plateau.roverPositions);

  await writeOutputToFile(formattedRoverPositions);
};
