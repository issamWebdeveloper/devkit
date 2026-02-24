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
    console.log(chalk.green('  uvx detecte.'));
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
  } catch (error) {
    spinner.fail('Echec de l\'installation de uv via pip');
    const stderr = error.stderr?.toString().trim();
    if (stderr) {
      console.log(chalk.dim(`  ${stderr}`));
    }
    console.log(
      chalk.dim(
        '  Essayez manuellement : pip install uv  ou  curl -LsSf https://astral.sh/uv/install.sh | sh'
      )
    );
    return false;
  }

  // Verify uvx is actually available after installation
  if (!checkUvx()) {
    console.log(
      chalk.yellow(
        '\n  uv a ete installe mais uvx n\'est pas dans le PATH.'
      )
    );
    // Try to find where pip installed it
    try {
      const pipShow = execSync('pip show uv', { stdio: 'pipe' }).toString();
      const locationMatch = pipShow.match(/Location:\s*(.+)/);
      if (locationMatch) {
        console.log(chalk.dim(`  uv installe dans : ${locationMatch[1]}`));
      }
    } catch {
      // ignore
    }
    console.log(chalk.dim('  Solutions possibles :'));
    console.log(chalk.dim('    1. Ajoutez ~/.local/bin a votre PATH :'));
    console.log(chalk.dim('       export PATH="$HOME/.local/bin:$PATH"'));
    console.log(chalk.dim('    2. Ou installez avec le script officiel :'));
    console.log(
      chalk.dim(
        '       curl -LsSf https://astral.sh/uv/install.sh | sh'
      )
    );
    console.log(
      chalk.dim('    3. Puis relancez : devkit init\n')
    );
    return false;
  }

  console.log(chalk.green('  uvx verifie et disponible dans le PATH.'));
  return true;
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

  args.push('--force');
  args.push('--ai', aiProvider);
  args.push('--script', scriptType);

  if (noGit) {
    args.push('--no-git');
  }

  if (aiSkills) {
    args.push('--ai-skills');
  }

  const command = args.join(' ');
  console.log(chalk.dim(`\n  Commande : ${command}`));
  console.log(chalk.dim(`  Dossier  : ${targetDir}\n`));
  const spinner = ora('Execution de spec-kit...').start();

  try {
    const output = execSync(command, {
      cwd: targetDir,
      stdio: 'pipe',
      timeout: 120000,
    });
    spinner.succeed('Spec-kit initialise avec succes');
    const stdout = output?.toString().trim();
    if (stdout) {
      console.log(chalk.dim(`  ${stdout}`));
    }
    return true;
  } catch (error) {
    spinner.fail('Echec de l\'execution de spec-kit');
    console.log(chalk.red(`\n  Commande : ${command}`));
    if (error.status != null) {
      console.log(chalk.red(`  Code de sortie : ${error.status}`));
    }
    const stderr = error.stderr?.toString().trim();
    const stdout = error.stdout?.toString().trim();
    if (stderr) {
      console.log(chalk.yellow('  [stderr]'));
      console.log(chalk.dim(`  ${stderr}`));
    }
    if (stdout) {
      console.log(chalk.yellow('  [stdout]'));
      console.log(chalk.dim(`  ${stdout}`));
    }
    if (!stderr && !stdout) {
      console.log(chalk.yellow(`  Erreur : ${error.message}`));
    }
    console.log(
      chalk.dim(
        '\n  Verifiez que uvx est dans votre PATH en executant : uvx --version'
      )
    );
    return false;
  }
}
