import { z } from 'zod';
import { Direction, Instruction } from '../types';

export const initialCoordinatesSchema = z.tuple([
  z.number({ coerce: true }),
  z.number({ coerce: true }),
  z.enum(Direction),
]);

export const instructionsSchema = z.array(z.enum(Instruction));

export const plateauBoundsInputSchema = z.tuple([
  z.number({ coerce: true }),
  z.number({ coerce: true }),
]);
