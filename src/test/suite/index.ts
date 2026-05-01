import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';
import { createReport } from '../coverage';

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    timeout: 7500,
    color: true,
    reporter: 'mocha-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'spec, xunit',
      xunitReporterOptions: {
        output: path.join(__dirname, '..', '..', 'test-results.xml'),
      },
    },
  });

  const testsRoot = path.resolve(__dirname, '..');
  const files = await glob('**/**.test.js', { cwd: testsRoot });

  files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

  return new Promise<void>((c, e) => {
    try {
      mocha.run((failures: number) => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      e(err);
    }
  }).then(async () => {
    if (process.env['GENERATE_COVERAGE']) {
      await createReport();
    }
  });
}
