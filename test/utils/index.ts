import { unlink } from 'node:fs/promises';

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

export const removePreviousOutputFile = async () => {
  const path = Bun.env.OUTPUT_FILE_PATH;

  if (!path) {
    throw new Error('File path is required');
  }

  const file = Bun.file(path);

  const fileExists = await file.exists();

  if (!fileExists) {
    return;
  }

  await unlink(path);
};
