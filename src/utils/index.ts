import { plateauBoundsInputSchema as plateauBoundsInputSchmema } from "../schemas";
import type { Plateau } from "../types";
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
	return array.reduce<T[][]>((acc, _, index) => {
		if (index % chunkSize === 0) {
			acc.push(array.slice(index, index + chunkSize));
		}
		return acc;
	}, []);
};

export const removeWhitespace = (str: string): string => {
	return str.replace(/\s/g, "");
};

export const formatInput = (data: string) => {
	const lines: string[] = data.split(/\r?\n/);
	return lines.map((line) => removeWhitespace(line.trim()));
}



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

export const getPlateauBounds = (plateauBoundsInput: string): { upperX: number, upperY: number } => {
	if (!plateauBoundsInput) {
		throw new Error("Missing plateau coordinates");
	}

	const plateauBoundsInputData = plateauBoundsInputSchmema.safeParse(
		plateauBoundsInput.split(""),
	)?.data;

	if (!plateauBoundsInputData) {
		throw new Error("Invalid upper right coordinates of plateau");
	}

	const [upperX, upperY] = plateauBoundsInputData;

	return { upperX, upperY };
}