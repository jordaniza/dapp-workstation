import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
export async function executeBashScript(script: string): Promise<void> {
  try {
      const { stdout, stderr } = await exec(script);
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
  } catch (err) {
     console.error(err);
  };
};
