import { simulateMission } from './mars';
import { getCommandLineArgs } from './utils/bun';
import { measurePerformance } from './utils';

const { filePath, isDev } = getCommandLineArgs();

measurePerformance(
  () => simulateMission(filePath ?? Bun.env.DEFAULT_INPUT_FILE_PATH, isDev),
  'Mission Simulation Complete 🚀',
);
