import { exploreMars } from './mars';
import { getCommandLineArgs } from './utils/bun';

const { filePath, isDev } = getCommandLineArgs();

exploreMars(filePath ?? Bun.env.DEFAULT_INPUT_FILE_PATH, isDev);
