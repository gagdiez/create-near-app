import path from 'path';
import {createProject, runDepsInstall} from './make';
import {promptAndGetConfig,} from './user-input';
import * as show from './messages';

(async function () {
  const promptResult = await promptAndGetConfig();
  if (promptResult === null) {
    return;
  }
  const {
    config: {
      projectName,
      example,
      contract,
      frontend,
      tests,
      install,
    },
    projectPath,
  } = promptResult;

  show.creatingApp();

  let createSuccess;
  try {
    createSuccess = await createProject({
      example,
      contract,
      frontend,
      tests,
      projectName,
      verbose: false,
      rootDir: path.resolve(__dirname, `../templates`),
      projectPath,
    });
  } catch (e) {
    console.error(e);
    createSuccess = false;
  }
  if (install) {
    await runDepsInstall(projectPath);
  }

  if (createSuccess) {
    show.setupSuccess(projectPath, contract, frontend, install);
  } else {
    show.setupFailed();
    return;
  }
})();