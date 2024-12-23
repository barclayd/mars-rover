import { initialCoordinatesSchema, instructionsSchema } from './schemas';
import type { Direction, Instruction, Plateau } from './types';

export const placeRover = (plateau: Plateau, initialCoordinates: string) => {
  const parsedInitialCoordinates = initialCoordinatesSchema.safeParse(
    initialCoordinates.split(''),
  );

  if (!parsedInitialCoordinates.success) {
    throw new Error(
      `Invalid initial coordinates: ${parsedInitialCoordinates.error.errors.map((error) => error.message).join(', ')}`,
    );
  }

  const [x, y, direction] = parsedInitialCoordinates.data;

  plateau.setRoverPosition(x, y, direction);

  return { x, y, direction };
};

const rotateRover = (
  currentDirection: Direction,
  instruction: Instruction,
): Direction => {
  const directionMap: Record<Direction, Record<Instruction, Direction>> = {
    N: { L: 'W', R: 'E', M: 'N' },
    E: { L: 'N', R: 'S', M: 'E' },
    S: { L: 'E', R: 'W', M: 'S' },
    W: { L: 'S', R: 'N', M: 'W' },
  };
  return directionMap[currentDirection][instruction];
};

const updateRoverCoordinates = (
  plateau: Plateau,
  currentDirection: Direction,
  currentCoordinates: { x: number; y: number },
) => {
  const directionMap: Record<Direction, { x: number; y: number }> = {
    N: { x: 0, y: 1 },
    E: { x: 1, y: 0 },
    S: { x: 0, y: -1 },
    W: { x: -1, y: 0 },
  };

  const { x: dx, y: dy } = directionMap[currentDirection];

  const newX = currentCoordinates.x + dx;
  const newY = currentCoordinates.y + dy;

  if (!plateau.isValidRoverPosition(newX, newY)) {
    console.warn('Invalid move. Rover stays in place.');
    return currentCoordinates;
  }

  plateau.setRoverPosition(newX, newY, currentDirection);
  plateau.setRoverPosition(currentCoordinates.x, currentCoordinates.y, '');
  return { x: newX, y: newY };
};

export const moveRover = (
  plateau: Plateau,
  instructions: string,
  placedRoverCoordinates: { x: number; y: number },
  direction: Direction,
) => {
  const parsedInstructions = instructionsSchema.safeParse(
    instructions.split(''),
  );

  if (!parsedInstructions.success) {
    throw new Error(
      `Invalid instructions: ${parsedInstructions.error.errors.map((error) => error.message).join(', ')}`,
    );
  }

  let currentCoordinates = placedRoverCoordinates;
  let currentDirection = direction;

  parsedInstructions.data.forEach((instruction) => {
    const instructionMap: Record<Instruction, () => void> = {
      L: () => {
        currentDirection = rotateRover(currentDirection, 'L');
        plateau.setRoverPosition(
          currentCoordinates.x,
          currentCoordinates.y,
          currentDirection,
        );
      },
      R: () => {
        currentDirection = rotateRover(currentDirection, 'R');
        plateau.setRoverPosition(
          currentCoordinates.x,
          currentCoordinates.y,
          currentDirection,
        );
      },
      M: () => {
        currentCoordinates = updateRoverCoordinates(
          plateau,
          currentDirection,
          currentCoordinates,
        );
      },
    };

    instructionMap[instruction]();
  });

  return {
    x: currentCoordinates.x,
    y: currentCoordinates.y,
    direction: currentDirection,
  };
};
