import type { Plateau } from '../types';

export const prettyPrintPlateau = (plateau: Plateau) => {
  const cellLength = 5;

  plateau.terrain.forEach((row, arrayY) => {
    const y = plateau.terrain.length - 1 - arrayY;
    console.log(
      row
        .map((cell, x) =>
          cell === '' ? `(${x},${y})` : printActiveCell(cell, cellLength),
        )
        .join(' | '),
    );
  });
};

function printActiveCell(str: string, length: number): string {
  const totalPadding = length - str.length;

  const paddingChar = ' ';

  const paddingStart = Math.floor(totalPadding / 2);

  return str
    .padStart(str.length + paddingStart, paddingChar)
    .padEnd(length, paddingChar);
}
