import fs from 'fs';
import _ from 'lodash';
import pkg from '../package.json';

const changeLog = fs.readFileSync('CHANGELOG.md').toString('utf-8');

const changeLogLine = changeLog.split('\n');

const getVersionReg = () => /^##\s+\[([^\]]+)\]/gi;

const changeLogVersionLine = _.find(changeLogLine, (line) => getVersionReg().test(line));

if (!changeLogVersionLine) {
  throw new Error(`Not found version at CHANGELOG file`);
}

const changeLogVersion = getVersionReg().exec(changeLogVersionLine)?.[1];

if (changeLogVersion !== pkg.version) {
  throw new Error(`CHANGELOG file version: [${changeLogVersion}], not match package.json version: [${pkg.version}]`);
}

console.log(`Check version success, current version is ${pkg.version}`);
