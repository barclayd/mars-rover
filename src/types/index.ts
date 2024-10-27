export type Plateau = {
  terrain: (Direction | '')[][];
  roverPositions: { x: number; y: number; direction: Direction }[];
  setRoverPosition: (x: number, y: number, value: Direction | '') => void;
  getRoverPosition: (x: number, y: number) => Direction | '';
  isValidRoverPosition: (x: number, y: number) => boolean;
};

export const Instruction = ['M', 'L', 'R'] as const;
export type Instruction = (typeof Instruction)[number];

export const Direction = ['N', 'E', 'S', 'W'] as const;
export type Direction = (typeof Direction)[number];
