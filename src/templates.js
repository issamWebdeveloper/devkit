import { readFileSync } from 'node:fs';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEVCONTAINER_BASE } from './constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates');

export function generateDevcontainerJson(portMap) {
  const config = structuredClone(DEVCONTAINER_BASE);

  const forwardPorts = portMap.map((entry) => entry.port);

  const portsAttributes = {};
  for (const entry of portMap) {
    portsAttributes[String(entry.port)] = {
      label: entry.tech.name,
      onAutoForward: 'notify',
    };
  }

  config.forwardPorts = forwardPorts;
  config.portsAttributes = portsAttributes;

  return JSON.stringify(config, null, 2);
}

export function createDevcontainerFiles(targetDir, portMap) {
  const devcontainerDir = join(targetDir, '.devcontainer');
  mkdirSync(devcontainerDir, { recursive: true });

  // Copy Dockerfile
  copyFileSync(
    join(TEMPLATES_DIR, 'Dockerfile'),
    join(devcontainerDir, 'Dockerfile')
  );

  // Copy init-firewall.sh
  copyFileSync(
    join(TEMPLATES_DIR, 'init-firewall.sh'),
    join(devcontainerDir, 'init-firewall.sh')
  );

  // Generate devcontainer.json with ports
  const devcontainerJson = generateDevcontainerJson(portMap);
  writeFileSync(join(devcontainerDir, 'devcontainer.json'), devcontainerJson);

  return devcontainerDir;
}
