import { checkbox, select, input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { TECHNOLOGIES, AI_PROVIDERS } from './constants.js';

export async function askTechnologies() {
  const choices = TECHNOLOGIES.map((tech) => ({
    name: tech.defaultPort
      ? `${tech.name}  ${chalk.dim(`(port par defaut : ${tech.defaultPort})`)}`
      : tech.name,
    value: tech.value,
  }));

  const selected = await checkbox({
    message: 'Quelles technologies allez-vous utiliser ?',
    choices,
    required: true,
  });

  return selected.map((value) => TECHNOLOGIES.find((t) => t.value === value));
}

export async function askPorts(technologies) {
  const portMap = [];
  const usedPorts = new Set();

  for (const tech of technologies) {
    let defaultPort = tech.defaultPort;
    let warning = '';

    if (defaultPort && usedPorts.has(defaultPort)) {
      warning = chalk.yellow(
        `  ⚠ Le port ${defaultPort} est deja utilise par une autre technologie.`
      );
      defaultPort = null;
    }

    if (warning) {
      console.log(warning);
    }

    const portStr = await input({
      message: defaultPort
        ? `Port pour ${tech.name} (defaut: ${defaultPort})`
        : `Port pour ${tech.name}`,
      default: defaultPort ? String(defaultPort) : undefined,
      validate: (value) => {
        const port = parseInt(value, 10);
        if (isNaN(port) || port < 1024 || port > 65535) {
          return 'Entrez un port valide entre 1024 et 65535';
        }
        if (usedPorts.has(port)) {
          return `Le port ${port} est deja utilise. Choisissez un autre port.`;
        }
        return true;
      },
    });

    const port = parseInt(portStr, 10);
    usedPorts.add(port);
    portMap.push({ tech, port });
  }

  return portMap;
}

export async function askLocation() {
  const location = await select({
    message: 'Ou creer le dossier .devcontainer ?',
    choices: [
      { name: 'Dans le dossier courant (.)', value: 'current' },
      { name: 'Dans un nouveau dossier projet', value: 'new' },
    ],
  });

  let projectName = null;
  if (location === 'new') {
    projectName = await input({
      message: 'Nom du projet :',
      validate: (value) => {
        if (!value.trim()) return 'Le nom du projet ne peut pas etre vide';
        if (/[^a-zA-Z0-9._-]/.test(value))
          return 'Le nom ne doit contenir que des lettres, chiffres, points, tirets et underscores';
        return true;
      },
    });
  }

  return { location, projectName };
}

export async function askSpecKit() {
  return confirm({
    message: 'Voulez-vous ajouter les fichiers spec-kit de GitHub ?',
    default: false,
  });
}

export async function askAiProvider() {
  const choices = AI_PROVIDERS.map((ai) => ({
    name: `${ai.name.padEnd(16)} ${chalk.dim(ai.description)}`,
    value: ai.name,
  }));

  return select({
    message: 'Quelle IA utiliser avec spec-kit ?',
    choices,
  });
}

export async function askSpecKitOptions() {
  const useGit = await confirm({
    message: 'Initialiser un depot Git ?',
    default: true,
  });

  const scriptType = await select({
    message: 'Type de script ?',
    choices: [
      { name: 'sh  (Bash / zsh)', value: 'sh' },
      { name: 'ps  (PowerShell)', value: 'ps' },
    ],
  });

  const useAiSkills = await confirm({
    message: 'Installer les AI skills (Prompt.MD templates) ?',
    default: true,
  });

  return {
    noGit: !useGit,
    scriptType,
    aiSkills: useAiSkills,
  };
}
