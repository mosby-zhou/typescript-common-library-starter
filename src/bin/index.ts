import _ from 'lodash';
import inquirer, { QuestionCollection } from 'inquirer';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CliOptions, createDirectoryContents, TemplateConfig } from '../index';

const TEMPLATES_DIR = process.env.TEMPLATES_DIR || '../templates';

const argv = yargs(hideBin(process.argv)).argv as Record<string, string | number>;

const _userName = shell
  .exec('git config user.name', {
    silent: true,
  })
  .stdout.trim();
const _userEmail = shell
  .exec('git config user.email', {
    silent: true,
  })
  .stdout.trim();

const CHOICES = fs.readdirSync(path.resolve(__dirname, TEMPLATES_DIR));

const QUESTIONS: QuestionCollection = [
  {
    name: 'template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
    when: () => !argv['template'],
  },
  {
    name: 'userName',
    type: 'input',
    message: 'Your name:',
    when: () => !_userName && !argv['userName'],
    validate: (input: string) => {
      if (/^([A-Za-z0-9])+$/.test(input)) return true;
      else return 'name may only include letters and numbers.';
    },
  },
  {
    name: 'userEmail',
    type: 'input',
    message: 'Your email:',
    when: () => !_userEmail && !argv['userEmail'],
    validate: (input: string) => {
      if (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(input)) return true;
      else return 'Email format error.';
    },
  },
  {
    name: 'name',
    type: 'input',
    message: 'Project name:',
    when: () => !argv['name'],
    validate: (input: string) => {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    },
  },
  {
    name: 'group',
    type: 'input',
    message: 'Project group:',
    default: _userName || argv['userName'],
    when: () => !argv['group'],
    validate: (input: string) => {
      if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
      else return 'Group name may only include letters, numbers, underscores and hashes.';
    },
  },
  {
    name: 'install',
    type: 'confirm',
    message: 'Run npm i?',
    default: false,
    when: () => !argv['install'],
  },
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  answers = Object.assign({}, answers, argv);

  const userName = _userName || answers['userName'];
  const userEmail = _userEmail || answers['userEmail'];
  const projectChoice = answers['template'];
  const projectName = answers['name'];
  const projectCodeName = _.upperFirst(_.camelCase(projectName));
  const groupName = answers['group'];
  const install = answers['install'];
  const templatePath = path.resolve(__dirname, TEMPLATES_DIR, projectChoice);
  const tartgetPath = path.resolve(CURR_DIR, projectName);
  const templateConfig = getTemplateConfig(templatePath);

  const options: CliOptions = {
    userName,
    userEmail,
    projectName,
    projectCodeName,
    groupName,
    install,
    templatePath,
    tartgetPath,
    config: templateConfig,
  };

  if (!createProject(tartgetPath)) {
    return;
  }

  createDirectoryContents(templatePath, projectName, options);

  if (!postProcess(options)) {
    return;
  }

  showMessage(options);
});

function showMessage(options: CliOptions) {
  console.log('');
  console.log(chalk.green('Done.'));
  console.log(chalk.green(`Go into the project: cd ${options.projectName}${!options.install ? ' and run npm install' : ''}`));

  const message = options.config.postMessage;

  if (message) {
    console.log('');
    console.log(chalk.yellow(message));
    console.log('');
  }
}

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
    return false;
  }

  fs.mkdirSync(projectPath);
  return true;
}

function postProcess(options: CliOptions) {
  if (isNode(options) && options.install) {
    return postProcessNode(options);
  }
  return true;
}

function isNode(options: CliOptions) {
  return fs.existsSync(path.resolve(options.templatePath, 'package.json'));
}

function postProcessNode(options: CliOptions) {
  shell.cd(options.tartgetPath);

  let cmd = '';

  if (shell.which('yarn')) {
    cmd = 'yarn';
  } else if (shell.which('npm')) {
    cmd = 'npm install';
  }

  if (cmd) {
    const result = shell.exec(cmd);

    if (result.code !== 0) {
      return false;
    }
  } else {
    console.log(chalk.red('No yarn or npm found. Cannot run installation.'));
  }

  return true;
}

function getTemplateConfig(templatePath: string): TemplateConfig {
  const configPath = path.resolve(templatePath, '.template.json');

  if (!fs.existsSync(configPath)) return {};

  const templateConfigContent = fs.readFileSync(configPath);

  if (templateConfigContent) {
    return JSON.parse(templateConfigContent.toString());
  }

  return {};
}
