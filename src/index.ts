import { simulateMission } from './mars';
import { getCommandLineArgs } from './utils/bun';

const { filePath, isDev } = getCommandLineArgs();

simulateMission(filePath ?? Bun.env.DEFAULT_INPUT_FILE_PATH, isDev);
