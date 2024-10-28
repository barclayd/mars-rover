import { simulateMission } from './mars';
import { measurePerformance } from './utils';
import { getCommandLineArgs } from './utils/bun';

const { filePath, isDev } = getCommandLineArgs();

measurePerformance(
  () => simulateMission(filePath ?? Bun.env.DEFAULT_INPUT_FILE_PATH, isDev),
  'Mission Simulation Complete 🚀',
);
