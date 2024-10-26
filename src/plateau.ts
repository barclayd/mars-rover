import type { factory } from 'typescript';
import { plateauBoundsInputSchema } from './schemas';
import type { Direction, Plateau } from './types';

export const createPlateau = (rows: number, columns: number): Plateau => {
	const grid = Array(rows + 1)
		.fill(null)
		.map(() => Array(columns + 1).fill(''))
		.reverse();

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
		},
	};
};

export const getPlateauBounds = (
	plateauBoundsInput: string,
): { upperX: number; upperY: number } => {
	if (!plateauBoundsInput) {
		throw new Error('Missing plateau coordinates');
	}

	const plateauBoundsInputData = plateauBoundsInputSchema.safeParse(
		plateauBoundsInput.split(''),
	)?.data;

	if (!plateauBoundsInputData) {
		throw new Error('Invalid upper right coordinates of plateau');
	}

	const [upperX, upperY] = plateauBoundsInputData;

	return { upperX, upperY };
};
