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

export const readFile = async (filePath: string) => {
  let input: string;

  try {
    const file = Bun.file(filePath);
    input = await file.text();
  } catch (error: unknown) {
    throw new Error(
      `Error reading input file: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return input;
};

export const writeOutputToFile = async (output: string) => {
  const path = Bun.env.DEFAULT_OUTPUT_FILE_PATH;

  if (!path) {
    throw new Error('Output file path is required');
  }

  await Bun.write(path, output);
};
