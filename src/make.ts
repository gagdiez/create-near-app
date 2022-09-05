import {CreateProjectParams} from './types';
import * as show from './messages';
import spawn from 'cross-spawn';
import fs, { mkdirSync } from 'fs';
import {ncp} from 'ncp';
import path from 'path';
import {buildPackageJson} from './package-json';
let nunjucks = require('nunjucks')

export async function createProject({example, contract, frontend, tests, projectPath, projectName, verbose, rootDir}: CreateProjectParams): Promise<boolean> {
  // Create files in the project folder
  await createFiles({example, contract, frontend, projectName, tests, projectPath, verbose, rootDir});

  // Create package.json
  const packageJson = buildPackageJson({contract, frontend, tests, projectName});
  fs.writeFileSync(path.resolve(projectPath, 'package.json'), Buffer.from(JSON.stringify(packageJson, null, 2)));

  return true;
}

export async function createFiles({example, contract, frontend, tests, projectPath, verbose, rootDir}: CreateProjectParams) {
  // skip build artifacts and symlinks
  const skip = ['.cache', 'dist', 'out', 'node_modules'];

  // make project folder
  mkdirSync(projectPath);

  // make frontend (if any)
  if (frontend !== 'none') {
    mkdirSync(`${projectPath}/frontend`)

    const srcSharedFrontend = `${rootDir}/shared/frontend/${frontend}`;
    await copyDir(srcSharedFrontend, `${projectPath}/frontend`, {verbose, skip: skip.map(f => path.join(srcSharedFrontend, f))});

    const srcExampleFrontend = `${rootDir}/${example}/frontend/${frontend}`;
    await copyDir(srcExampleFrontend, `${projectPath}/frontend`, {verbose, skip: skip.map(f => path.join(srcExampleFrontend, f))});
  
    await copyDir(`${rootDir}/shared/frontend/shared`, `${projectPath}/frontend/`, {verbose, skip: []})
  }

  // copy contract files
  const srcSharedContract = `${rootDir}/shared/contracts/${contract}`;
  await copyDir(srcSharedContract, `${projectPath}/contract`, {verbose, skip: skip.map(f => path.join(srcSharedContract, f))});

  const srcExampleContract = `${rootDir}/${example}/contracts/${contract}`;
  await copyDir(srcExampleContract, `${projectPath}/contract/src`, {verbose, skip: skip.map(f => path.join(srcExampleContract, f))});

  await renameFile(`${projectPath}/contract/src/README.md`, `${projectPath}/contract/README.md`);

  // tests dir
  const targetTestDir = path.resolve(projectPath, 'integration-tests');
  fs.mkdirSync(targetTestDir, { recursive: true });

  // copy tests - shared files
  const srcSharedTest = path.resolve(`${rootDir}/shared/integration-tests/${tests}-tests`);
  await copyDir(srcSharedTest, `${projectPath}/integration-tests/`, {verbose, skip: skip.map(f => path.join(srcSharedTest, f))});

  const srcExampleTest = path.resolve(`${rootDir}/${example}/integration-tests/${tests}-tests`);
  await copyDir(srcExampleTest, `${projectPath}/integration-tests/src`, {verbose, skip: skip.map(f => path.join(srcSharedTest, f))});

  // shared files
  const srcSharedFiles = `${rootDir}/shared/shared`;
  await copyDir(srcSharedFiles, projectPath, {verbose, skip: skip.map(f => path.join(srcSharedFiles, f))});
  
  await renameFile(`${projectPath}/template.gitignore`, `${projectPath}/.gitignore`);

  // copy readme
  const color = contract == "rust"? "red":"yellow";
  const gitUrl = `https://github.com/near-examples/${example.replaceAll('_', '-')}-${contract}`
  nunjucks.configure(`${rootDir}/${example}/`, { autoescape: false });
  const readme = nunjucks.render("README.md", { color: color, language: contract, example , github: gitUrl});
  await fs.writeFileSync(`${projectPath}/README.md`, readme)
}

export const renameFile = async function (oldPath: string, newPath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};

// Wrap `ncp` tool to wait for the copy to finish when using `await`
// Allow passing `skip` variable to skip copying an array of filenames
export function copyDir(source: string, dest: string, {skip, verbose}: {skip: string[], verbose: boolean}) {
  return new Promise<void>((resolve, reject) => {
    const copied: string[] = [];
    const skipped: string[] = [];
    const filter = skip && function(filename: string) {
      const shouldCopy = !skip.find(f => filename.includes(f));
      shouldCopy ? copied.push(filename) : skipped.push(filename);
      return !skip.find(f => filename.includes(f));
    };

    ncp(source, dest, {filter}, err => {
      if (err) {
        reject(err);
        return;
      }

      if (verbose) {
        console.log('Copied:');
        copied.forEach(f => console.log('  ' + f));
        console.log('Skipped:');
        skipped.forEach(f => console.log('  ' + f));
      }

      resolve();
    });
  });
}

export async function runDepsInstall(projectPath: string) {
  show.depsInstall();
  const npmCommandArgs = ['install'];
  await new Promise<void>((resolve, reject) => spawn('npm', npmCommandArgs, {
    cwd: projectPath,
    stdio: 'inherit',
  }).on('close', (code: number) => {
    if (code !== 0) {
      show.depsInstallError();
      reject(code);
    } else {
      resolve();
    }
  }));
}
