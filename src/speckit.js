import { execSync } from 'node:child_process';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';

export function checkUvx() {
  try {
    execSync('which uvx', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export async function ensureUvx() {
  if (checkUvx()) {
    return true;
  }

  console.log(
    chalk.yellow('\n  uvx n\'est pas installe sur cette machine.')
  );
  console.log(
    chalk.dim('  uvx fait partie du package "uv" (gestionnaire Python).\n')
  );

  const install = await confirm({
    message: 'Voulez-vous installer uv (inclut uvx) via pip ?',
    default: true,
  });

  if (!install) {
    console.log(
      chalk.red('  Spec-kit necessite uvx. L\'etape spec-kit est annulee.\n')
    );
    return false;
  }

  const spinner = ora('Installation de uv...').start();
  try {
    execSync('pip install uv', { stdio: 'pipe' });
    spinner.succeed('uv installe avec succes');
    return true;
  } catch {
    spinner.fail('Echec de l\'installation de uv via pip');
    console.log(
      chalk.dim(
        '  Essayez manuellement : pip install uv  ou  curl -LsSf https://astral.sh/uv/install.sh | sh'
      )
    );
    return false;
  }
}

export function runSpecKit(targetDir, options) {
  const {
    aiProvider,
    noGit,
    scriptType,
    aiSkills,
    isCurrentDir,
  } = options;

  const args = [
    'uvx',
    '--from',
    'git+https://github.com/github/spec-kit.git',
    'specify',
    'init',
  ];

  if (isCurrentDir) {
    args.push('--here');
  } else {
    args.push('.', '--here');
  }

  args.push('--ai', aiProvider);
  args.push('--script', scriptType);

  if (noGit) {
    args.push('--no-git');
  }

  if (aiSkills) {
    args.push('--ai-skills');
  }

  const command = args.join(' ');
  const spinner = ora('Execution de spec-kit...').start();

  try {
    execSync(command, {
      cwd: targetDir,
      stdio: 'pipe',
      timeout: 120000,
    });
    spinner.succeed('Spec-kit initialise avec succes');
    return true;
  } catch (error) {
    spinner.fail('Echec de l\'execution de spec-kit');
    console.log(chalk.red(`  Commande : ${command}`));
    if (error.stderr) {
      console.log(chalk.dim(`  ${error.stderr.toString().trim()}`));
    }
    return false;
  }
}
