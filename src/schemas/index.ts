import { z } from 'zod';
import { Direction, Instruction } from '../types';

export const initialCoordinatesSchema = z.tuple([
	z.string().transform((val) => Number.parseInt(val, 10)),
	z.string().transform((val) => Number.parseInt(val, 10)),
	z.enum(Direction),
]);

export const instructionsSchema = z.array(z.enum(Instruction));

export const plateauBoundsInputSchema = z.tuple([
	z.string().transform((val) => Number.parseInt(val, 10)),
	z.string().transform((val) => Number.parseInt(val, 10)),
]);
