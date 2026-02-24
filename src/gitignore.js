const COMMON = `# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
`;

const TECH_IGNORES = {
  angular: `# Angular
dist/
.angular/
node_modules/
npm-debug.log*
`,
  react: `# React
dist/
build/
node_modules/
npm-debug.log*
`,
  nextjs: `# Next.js
.next/
out/
node_modules/
npm-debug.log*
`,
  vuejs: `# Vue.js
dist/
node_modules/
npm-debug.log*
`,
  svelte: `# Svelte
.svelte-kit/
build/
node_modules/
npm-debug.log*
`,
  express: `# Express / Node
dist/
node_modules/
npm-debug.log*
`,
  nestjs: `# NestJS
dist/
node_modules/
npm-debug.log*
`,
  nuxtjs: `# Nuxt.js
.nuxt/
.output/
dist/
node_modules/
npm-debug.log*
`,
  astro: `# Astro
dist/
node_modules/
npm-debug.log*
`,
  custom: `# Node
dist/
node_modules/
npm-debug.log*
`,
};

const AI_IGNORES = {
  claude: `# Claude Code
.claude/
CLAUDE.md
`,
  copilot: `# GitHub Copilot
.github/copilot*
copilot-instructions.md
`,
  gemini: `# Gemini CLI
.gemini/
GEMINI.md
`,
  'cursor-agent': `# Cursor
.cursor/
.cursorignore
.cursorrules
`,
  windsurf: `# Windsurf
.windsurf/
.windsurfrules
`,
  amazonq: `# Amazon Q Developer
.amazonq/
`,
  amp: `# Amp
.amp/
`,
  auggie: `# Auggie CLI
.auggie/
`,
  codebuddy: `# CodeBuddy CLI
.codebuddy/
`,
  codex: `# Codex CLI
.codex/
AGENTS.md
`,
  'ibm-bob': `# IBM Bob
.bob/
`,
  jules: `# Jules
.jules/
`,
  kilo: `# Kilo Code
.kilo/
`,
  opencode: `# opencode
.opencode/
`,
  qodercli: `# Qoder CLI
.qoder/
`,
  qwen: `# Qwen Code
.qwen/
`,
  roo: `# Roo Code
.roo/
.roorules*
`,
  shai: `# SHAI (OVHcloud)
.shai/
`,
  agy: `# Antigravity
.agy/
`,
  generic: `# AI agent config
.ai/
`,
};

const SPECKIT = `# Spec-kit
.specify/
specs/
User_of_spec_kit.md
`;

const PYTHON = `# Python (uv / pip)
__pycache__/
*.pyc
.venv/
venv/
`;

export function generateGitignore(technologies, aiProvider, hasSpecKit) {
  const sections = [COMMON];

  // Deduplicate tech entries (multiple Node techs share similar ignores)
  const seen = new Set();
  for (const tech of technologies) {
    const block = TECH_IGNORES[tech.value] || TECH_IGNORES.custom;
    if (!seen.has(block)) {
      seen.add(block);
      sections.push(block);
    }
  }

  // AI provider
  const aiBlock = AI_IGNORES[aiProvider];
  if (aiBlock) {
    sections.push(aiBlock);
  }

  // Spec-kit + Python (uvx needs Python)
  if (hasSpecKit) {
    sections.push(SPECKIT);
    sections.push(PYTHON);
  }

  return sections.join('\n');
}
