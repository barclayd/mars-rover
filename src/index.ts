import type { Plateau, Direction, Instruction } from './types';
import { createPlateau } from './plateau';
import { chunkArray, removeWhitespace } from './utils';
import { plateauBoundsInputSchema } from './schemas';
import { placeRover, moveRover } from './rover';

const readInput = async (filePath: string) => {
    let input;
    try {
        const file = Bun.file(filePath);
        input = await file.text();
    } catch (error: unknown) {
        console.error('Error reading input file:', error);
        return;
    }

    const lines: string[] = input.split(/\r?\n/);
    const formattedLines = lines.map(line => removeWhitespace(line.trim()));

    const upperRightCoordinatesOfPlateau = formattedLines.shift()?.split("");

    if (!upperRightCoordinatesOfPlateau) {
        console.error("Upper right coordinates of plateau are not provided");
        return;
    }

    const [upperXInput, upperYInput] = upperRightCoordinatesOfPlateau;

	const parsedUpperRightCoordinates = plateauBoundsInputSchema.safeParse([upperXInput, upperYInput]).data;

	if (!parsedUpperRightCoordinates) {
		throw new Error("Invalid upper right coordinates of plateau");
	}

	const [upperX, upperY] = parsedUpperRightCoordinates;

    const plateau = createPlateau(upperX, upperY);

    const roverInstructions = chunkArray(formattedLines, 2);

    roverInstructions.forEach(([initialCoordinatesWithDirection, instructions]) => {
        const { x, y, direction} =  placeRover(plateau, initialCoordinatesWithDirection);
        moveRover(plateau, instructions, { x, y }, direction); 
    });

    prettyPrintPlateau(plateau);
};


const prettyPrintPlateau = (plateau: Plateau) => {
  const maxLength = Math.max(...plateau.grid.flat().map(item => item.toString().length));
  
  plateau.grid.forEach((row, arrayY) => {
    const y = plateau.grid.length - 1 - arrayY;
    console.log(
      row.map((cell, x) => cell === '' ? `(${x},${y})` : cell.toString().padEnd(maxLength, " ")).join(" | ")
    );
  });
};

readInput("./test/manual/data.txt");






