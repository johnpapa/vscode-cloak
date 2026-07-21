import * as path from 'path';
import * as os from 'os';

import { runTests } from '@vscode/test-electron';

import { instrument } from './coverage';

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // The path to test runner
    // Passed to --extensionTestsPath
    let extensionTestsPath = path.resolve(__dirname, './suite/index');

    if (process.argv.indexOf('--coverage') >= 0) {
      // generate instrumented files at out-cov
      instrument();

      // load the instrumented files
      extensionTestsPath = path.resolve(__dirname, '../../out-cov/test/suite/index');

      // signal that the coverage data should be gathered
      process.env['GENERATE_COVERAGE'] = '1';
    }

    // Download VS Code, unzip it and run the integration test
    const testWorkspacePath = extensionDevelopmentPath;
    const testTempPath = path.join(os.tmpdir(), 'vscode-cloak-test');
    const userDataDir = path.join(testTempPath, 'user-data');
    const extensionsDir = path.join(testTempPath, 'extensions');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        testWorkspacePath,
        '--user-data-dir',
        userDataDir,
        '--extensions-dir',
        extensionsDir,
        '--install-extension',
        'mikestead.dotenv',
      ],
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
