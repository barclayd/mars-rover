import { simulateMission } from './mars';
import { measurePerformance } from './utils';
import { getCommandLineArgs, readFile } from './utils/bun';

const { filePath, isDev } = getCommandLineArgs();

Bun.serve({
   async fetch() {
    await measurePerformance(
      async () => await simulateMission(filePath ?? Bun.env.DEFAULT_INPUT_FILE_PATH, isDev),
      'Mission Simulation Complete 🚀',
    );
    return new Response(await readFile(Bun.env.DEFAULT_OUTPUT_FILE_PATH ?? './output.txt'), {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
});


