import { parseArgs } from 'node:util';

export const getCommandLineArgs = () => {
	const args = parseArgs({
		options: {
			file: {
				type: 'string',
				short: 'f',
			},
			dev: {
				type: 'boolean',
				short: 'd',
			},
		},
	});

	const filePath = args.values.file;
	const isDev = args.values.dev;

	return {
		filePath,
		isDev,
	};
};
