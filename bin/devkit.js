#!/usr/bin/env node

import { Command } from 'commander';
import { run } from '../src/index.js';

const program = new Command();

program
  .name('devkit')
  .description(
    'Generateur interactif de devcontainer avec mappage de ports et integration spec-kit'
  )
  .version('1.0.0');

program
  .command('init')
  .description(
    'Creer un devcontainer avec les ports mappes pour vos technologies'
  )
  .action(async () => {
    try {
      await run();
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log('\n  Abandon.\n');
        process.exit(0);
      }
      console.error('\n  Erreur :', error.message);
      process.exit(1);
    }
  });

// Default action: show help if no command
program.action(() => {
  program.help();
});

program.parse();
