# devkit

CLI interactif pour creer des environnements devcontainer avec mappage intelligent des ports et integration de GitHub Spec-Kit pour le developpement assiste par IA.

## Installation

```bash
npm install -g git+https://github.com/issamWebdeveloper/devkit.git
```

## Utilisation

```bash
devkit init
```

Le CLI vous guide interactivement a travers :

1. Selection des technologies (Angular, React, Next.js, Vue, Svelte, Express, NestJS, Nuxt, Astro...)
2. Configuration des ports pour chaque technologie
3. Choix de l'emplacement du projet (dossier courant ou nouveau dossier)
4. Generation de `.devcontainer/` avec Dockerfile, script de pare-feu et devcontainer.json
5. Integration optionnelle de GitHub spec-kit avec le fournisseur d'IA de votre choix

## Prerequis

- Node.js >= 18
- (Optionnel) `uvx` pour l'integration spec-kit — le CLI proposera de l'installer s'il est absent
