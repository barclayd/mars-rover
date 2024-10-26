export type Plateau = {
	grid: (Direction | '')[][];
	set: (x: number, y: number, value: Direction | '') => void;
	get: (x: number, y: number) => Direction | '';
	isValidPosition: (x: number, y: number) => boolean;
};

export const Instruction = ['M', 'L', 'R'] as const;
export type Instruction = (typeof Instruction)[number];

export const Direction = ['N', 'E', 'S', 'W'] as const;
export type Direction = (typeof Direction)[number];
