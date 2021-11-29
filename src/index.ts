import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import templateRender from './utils/template';

const CURR_DIR = process.cwd();

export interface TemplateConfig {
  files?: string[];
  postMessage?: string;
}

export interface CliOptions {
  userName: string;
  userEmail: string;
  projectName: string;
  projectCodeName: string;
  groupName: string;
  install: boolean;
  templatePath: string;
  tartgetPath: string;
  config: TemplateConfig;
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath: string, dirPath: string, options: CliOptions) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = path.resolve(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8');

      contents = templateRender(contents, _.pick(options, ['userName', 'userEmail', 'projectName', 'projectCodeName', 'groupName']));

      const writePath = path.resolve(CURR_DIR, dirPath, file);
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.resolve(CURR_DIR, dirPath, file));

      // recursive call
      createDirectoryContents(path.resolve(templatePath, file), path.resolve(dirPath, file), options);
    }
  });
}

export { createDirectoryContents };
