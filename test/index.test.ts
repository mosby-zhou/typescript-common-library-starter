import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { createDirectoryContents } from '../src/index';

/**
 * Starter test
 */
describe('Starter test', () => {
  it('works if true is truthy', async () => {
    assert.ok(true);
  });

  it('create lib dir success', () => {
    const tempDir = path.resolve(process.cwd(), './templates/web-ts-lib');
    const distDir = path.resolve(process.cwd(), 'temp');
    if (fs.existsSync(distDir)) {
      fs.rmdirSync(distDir, { recursive: true });
    }
    fs.mkdirSync(distDir);
    createDirectoryContents(tempDir, distDir, {
      userName: 'unit-test',
      userEmail: 'unit-test',
      projectName: 'unit-test-project',
      projectCodeName: 'unitTestProject',
      groupName: 'unit-test',
      install: false,
      templatePath: tempDir,
      tartgetPath: distDir,
      config: {
        postMessage: 'unit-test success',
      },
    });
  });
});
