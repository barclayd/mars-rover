import type { Direction, Plateau } from './types';

export const createPlateau = (rows: number, columns: number): Plateau => {
  const terrain = Array(rows + 1)
    .fill(null)
    .map(() => Array(columns + 1).fill(''))
    .reverse();

  const arrayY = (y: number) => terrain.length - 1 - y;

  return {
    terrain,
    roverPositions: [],
    setRoverPosition: (x: number, y: number, value: Direction | '') => {
      terrain[arrayY(y)][x] = value;
    },
    getRoverPosition: (x: number, y: number) => {
      return terrain[arrayY(y)][x];
    },
    isValidRoverPosition: (x: number, y: number) => {
      return x >= 0 && x < terrain[0].length && y >= 0 && y < terrain.length;
    },
  };
};
