import type { Direction, Plateau, Instruction } from './types';
import { initialCoordinatesSchema, instructionsSchema } from './schemas';

export const placeRover = (plateau: Plateau, initialCoordinates: string) => {
    const parsedInitialCoordinates = initialCoordinatesSchema.safeParse(initialCoordinates.split(''));
    
    if (!parsedInitialCoordinates.success) {
        throw new Error("Invalid initial coordinates");
    }
    
    const [x, y, direction] = parsedInitialCoordinates.data;

    plateau.set(x, y, direction);

    return { x, y, direction };
};

const rotateRover = (currentDirection: Direction, instruction: Instruction): Direction => {
    const directionMap: Record<Direction, Record<Instruction, Direction>> = {
        "N": { "L": "W", "R": "E", "M": "N" },
        "E": { "L": "N", "R": "S", "M": "E" },
        "S": { "L": "E", "R": "W", "M": "S" },
        "W": { "L": "S", "R": "N", "M": "W" }
    };
    return directionMap[currentDirection][instruction];
}

const updateRoverCoordinates = (plateau: Plateau, currentDirection: Direction, currentCoordinates: { x: number, y: number }) => {
    const directionMap: Record<Direction, { x: number, y: number }> = {
        N: { x: 0, y: 1 },
        E: { x: 1, y: 0 },
        S: { x: 0, y: -1 },
        W: { x: -1, y: 0 }
    }

    const { x: dx, y: dy } = directionMap[currentDirection];

    const newX = currentCoordinates.x + dx;
    const newY = currentCoordinates.y + dy;

    if (plateau.isValidPosition(newX, newY)) {
        plateau.set(newX, newY, currentDirection);
        plateau.set(currentCoordinates.x, currentCoordinates.y, '');
        return { x: newX, y: newY };
    } else {
        console.log("Invalid move. Rover stays in place.");
        return currentCoordinates;
    }
}

export const moveRover = (plateau: Plateau, instructions: string, placedRoverCoordinates: { x: number, y: number }, currentDirection: Direction) => {
    const parsedInstructions = instructionsSchema.safeParse(instructions.split(''));

    if (!parsedInstructions.success) {
        throw new Error("Invalid instructions");
    }

    let currentCoordinates = placedRoverCoordinates;

    parsedInstructions.data.forEach((instruction) => {
        if (instruction === "L" || instruction === "R") {
            currentDirection = rotateRover(currentDirection, instruction);
            plateau.set(currentCoordinates.x, currentCoordinates.y, currentDirection);
        } else if (instruction === "M") {
            currentCoordinates = updateRoverCoordinates(plateau, currentDirection, currentCoordinates);
        }
    });
}