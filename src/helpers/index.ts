import type { Plateau } from "../types";

export const prettyPrintPlateau = (plateau: Plateau) => {
	const maxLength = Math.max(
		...plateau.grid.flat().map((item) => item.toString().length),
	);

	plateau.grid.forEach((row, arrayY) => {
		const y = plateau.grid.length - 1 - arrayY;
		console.log(
			row
				.map((cell, x) =>
					cell === "" ? `(${x},${y})` : cell.toString().padEnd(maxLength, " "),
				)
				.join(" | "),
		);
	});
};
