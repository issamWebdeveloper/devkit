export const TECHNOLOGIES = [
  { name: 'Angular', value: 'angular', defaultPort: 4200 },
  { name: 'React', value: 'react', defaultPort: 5173 },
  { name: 'Next.js', value: 'nextjs', defaultPort: 3000 },
  { name: 'Vue.js', value: 'vuejs', defaultPort: 5173 },
  { name: 'Svelte', value: 'svelte', defaultPort: 5173 },
  { name: 'Express / Node', value: 'express', defaultPort: 3000 },
  { name: 'NestJS', value: 'nestjs', defaultPort: 3000 },
  { name: 'Nuxt.js', value: 'nuxtjs', defaultPort: 3000 },
  { name: 'Astro', value: 'astro', defaultPort: 4321 },
  { name: 'Autre (port personnalise)', value: 'custom', defaultPort: null },
];

export const AI_PROVIDERS = [
  { name: 'claude', description: 'Claude Code' },
  { name: 'copilot', description: 'GitHub Copilot' },
  { name: 'gemini', description: 'Gemini CLI' },
  { name: 'cursor-agent', description: 'Cursor' },
  { name: 'windsurf', description: 'Windsurf' },
  { name: 'amazonq', description: 'Amazon Q Developer CLI' },
  { name: 'amp', description: 'Amp' },
  { name: 'auggie', description: 'Auggie CLI' },
  { name: 'codebuddy', description: 'CodeBuddy CLI' },
  { name: 'codex', description: 'Codex CLI' },
  { name: 'ibm-bob', description: 'IBM Bob' },
  { name: 'jules', description: 'Jules' },
  { name: 'kilo', description: 'Kilo Code' },
  { name: 'opencode', description: 'opencode' },
  { name: 'qodercli', description: 'Qoder CLI' },
  { name: 'qwen', description: 'Qwen Code' },
  { name: 'roo', description: 'Roo Code' },
  { name: 'shai', description: 'SHAI (OVHcloud)' },
  { name: 'agy', description: 'Antigravity' },
  { name: 'generic', description: 'Custom (generic)' },
];

export const DEVCONTAINER_BASE = {
  name: 'Claude Code Sandbox',
  build: {
    dockerfile: 'Dockerfile',
    args: {
      TZ: '${localEnv:TZ:America/Los_Angeles}',
      CLAUDE_CODE_VERSION: 'latest',
      GIT_DELTA_VERSION: '0.18.2',
      ZSH_IN_DOCKER_VERSION: '1.2.0',
    },
  },
  runArgs: ['--cap-add=NET_ADMIN', '--cap-add=NET_RAW'],
  customizations: {
    vscode: {
      extensions: [
        'anthropic.claude-code',
        'dbaeumer.vscode-eslint',
        'esbenp.prettier-vscode',
        'eamodio.gitlens',
      ],
      settings: {
        'editor.formatOnSave': true,
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
        'editor.codeActionsOnSave': {
          'source.fixAll.eslint': 'explicit',
        },
        'terminal.integrated.defaultProfile.linux': 'zsh',
        'terminal.integrated.profiles.linux': {
          bash: { path: 'bash', icon: 'terminal-bash' },
          zsh: { path: 'zsh' },
        },
      },
    },
  },
  remoteUser: 'node',
  mounts: [
    'source=claude-code-bashhistory-${devcontainerId},target=/commandhistory,type=volume',
    'source=claude-code-config-${devcontainerId},target=/home/node/.claude,type=volume',
  ],
  containerEnv: {
    NODE_OPTIONS: '--max-old-space-size=4096',
    CLAUDE_CONFIG_DIR: '/home/node/.claude',
    POWERLEVEL9K_DISABLE_GITSTATUS: 'true',
  },
  workspaceMount:
    'source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=delegated',
  workspaceFolder: '/workspace',
  postStartCommand: 'sudo /usr/local/bin/init-firewall.sh',
  waitFor: 'postStartCommand',
};
