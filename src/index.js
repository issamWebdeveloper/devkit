import { resolve, join } from 'node:path';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import chalk from 'chalk';
import {
  askTechnologies,
  askPorts,
  askLocation,
  askSpecKit,
  askAiProvider,
  askSpecKitOptions,
} from './prompts.js';
import { createDevcontainerFiles } from './templates.js';
import { ensureUvx, runSpecKit } from './speckit.js';
import { generateSpecKitDoc } from './markdown.js';
import { generateGitignore } from './gitignore.js';

export async function run() {
  console.log(
    chalk.bold.cyan('\n  devkit') +
      chalk.dim(' — Generateur interactif de devcontainer\n')
  );

  // Step 1: Choose technologies
  console.log(chalk.bold('  Etape 1/5 : Technologies\n'));
  const technologies = await askTechnologies();

  if (technologies.length === 0) {
    console.log(chalk.red('\n  Aucune technologie selectionnee. Abandon.\n'));
    process.exit(1);
  }

  // Step 2: Configure ports
  console.log(chalk.bold('\n  Etape 2/5 : Configuration des ports\n'));
  const portMap = await askPorts(technologies);

  // Step 3: Choose location
  console.log(chalk.bold('\n  Etape 3/5 : Emplacement du projet\n'));
  const { location, projectName } = await askLocation();

  const cwd = process.cwd();
  let targetDir;

  if (location === 'current') {
    targetDir = cwd;
  } else {
    targetDir = resolve(cwd, projectName);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
  }

  // Step 4: Create devcontainer files
  console.log(chalk.bold('\n  Etape 4/5 : Generation du devcontainer\n'));
  const devcontainerDir = createDevcontainerFiles(targetDir, portMap);

  console.log(chalk.green('  Fichiers crees :'));
  console.log(chalk.dim(`    ${devcontainerDir}/Dockerfile`));
  console.log(chalk.dim(`    ${devcontainerDir}/init-firewall.sh`));
  console.log(chalk.dim(`    ${devcontainerDir}/devcontainer.json`));

  console.log(chalk.green('\n  Ports mappes :'));
  for (const entry of portMap) {
    console.log(
      chalk.dim(`    ${entry.tech.name.padEnd(20)} → port ${entry.port}`)
    );
  }

  // Step 5: Spec-kit integration
  console.log(chalk.bold('\n  Etape 5/5 : Integration spec-kit\n'));
  const wantSpecKit = await askSpecKit();
  let aiProvider = null;

  if (wantSpecKit) {
    const uvxReady = await ensureUvx();

    if (uvxReady) {
      aiProvider = await askAiProvider();
      const speckitOptions = await askSpecKitOptions();

      runSpecKit(targetDir, {
        aiProvider,
        noGit: speckitOptions.noGit,
        scriptType: speckitOptions.scriptType,
        aiSkills: speckitOptions.aiSkills,
        isCurrentDir: location === 'current',
      });

      // Generate doc regardless of spec-kit command success
      const docPath = generateSpecKitDoc(targetDir, aiProvider);
      console.log(chalk.green(`\n  Documentation generee : ${docPath}`));
    }
  }

  // Generate .gitignore
  const gitignoreContent = generateGitignore(technologies, aiProvider, wantSpecKit);
  const gitignorePath = join(targetDir, '.gitignore');
  writeFileSync(gitignorePath, gitignoreContent);
  console.log(chalk.green(`\n  .gitignore genere : ${gitignorePath}`));

  // Summary
  console.log(chalk.bold.green('\n  Terminé !\n'));
  console.log(
    chalk.dim(
      `  Dossier : ${targetDir}\n` +
        '  Pour utiliser ce devcontainer :\n' +
        '    1. Ouvrez le dossier dans VS Code\n' +
        '    2. Ctrl+Shift+P → "Dev Containers: Reopen in Container"\n'
    )
  );
}
