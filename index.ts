import { z } from 'zod';


type Plateau = {
  grid: (Direction | '')[][];
  set: (x: number, y: number, value: Direction | '') => void;
  get: (x: number, y: number) => Direction | '';
  isValidPosition: (x: number, y: number) => boolean;
};

const createPlateau = (rows: number, columns: number): Plateau => {
  const grid = Array(rows+1).fill(null).map(() => Array(columns+1).fill('')).reverse();
  
    const arrayY = (y: number) => grid.length - 1 - y;

  return {
    grid,
    set: (x: number, y: number, value: Direction | '') => {
      grid[arrayY(y)][x] = value;
    },
    get: (x: number, y: number) => {
      return grid[arrayY(y)][x];
    },
    isValidPosition: (x: number, y: number) => {
      return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
    }
  };
};

const Instructions = ["M", "L", "R"] as const;
type Instruction = typeof Instructions[number];


const Direction = ["N", "E", "S", "W"] as const;
type Direction = typeof Direction[number];

const readInput = async (filePath: string) => {
    let data;
    try {
        const file = Bun.file(filePath);
        data = await file.text();
    } catch (error: unknown) {
        console.error('Error reading input file:', error);
        return;
    }

    const lines: string[] = data.split(/\r?\n/);
    const formattedLines = lines.map(line => removeWhitespace(line.trim()));

    const upperRightCoordinatesOfPlateau = formattedLines.shift()?.split("");

    if (!upperRightCoordinatesOfPlateau) {
        console.error("Upper right coordinates of plateau are not provided");
        return;
    }

    const [upperX, upperY] = upperRightCoordinatesOfPlateau;

    const plateau = createPlateau(safeParseInt(upperX), safeParseInt(upperY));

    const roverInstructions = chunkArray(formattedLines, 2);

    roverInstructions.forEach(([initialCoordinatesWithDirection, instructions]) => {
        const { x, y, direction} =  placeRover(plateau, initialCoordinatesWithDirection);
        explorePlateau(plateau, instructions, { x, y }, direction); 
    });

    prettyPrintPlateau(plateau);
};

const initialCoordinatesSchema = z.tuple([
    z.string().transform((val) => parseInt(val, 10)),
    z.string().transform((val) => parseInt(val, 10)),
    z.enum(Direction)
]);

const instructionsSchema = z.array(z.enum(Instructions));

const placeRover = (plateau: Plateau, initialCoordinates: string) => {
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

const moveRover = (plateau: Plateau, currentDirection: Direction, currentCoordinates: { x: number, y: number }) => {
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

const explorePlateau = (plateau: Plateau, instructions: string, placedRoverCoordinates: { x: number, y: number }, currentDirection: Direction) => {
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
            currentCoordinates = moveRover(plateau, currentDirection, currentCoordinates);
        }
    });

    return { ...currentCoordinates, direction: currentDirection };
}


const safeParseInt = (value: string): number => {
    const parsed = Number.parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Invalid integer: ${value}`);
    }
    return parsed;
};

const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    return array.reduce<T[][]>((acc, _, index) => {
        if (index % chunkSize === 0) {
            acc.push(array.slice(index, index + chunkSize));
        }
        return acc;
    }, []);
};

const removeWhitespace = (str: string): string => {
    return str.replace(/\s/g, '');
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






