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

## Lancer le devcontainer

Une fois les fichiers generes par `devkit init`, ouvrez le projet dans votre IDE pour lancer le container.

### VS Code

1. Installez l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Ouvrez le dossier du projet
3. `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur macOS) → **Dev Containers: Reopen in Container**

### JetBrains (IntelliJ, WebStorm, PyCharm...)

1. Ouvrez le dossier du projet
2. Allez dans **File → Remote Development → Dev Containers**
3. Selectionnez le fichier `.devcontainer/devcontainer.json`

### Neovim

Avec le plugin [devcontainer-cli](https://github.com/devcontainers/cli) :

```bash
npm install -g @devcontainers/cli
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . nvim .
```

### Ligne de commande (tout editeur)

Avec la [Dev Container CLI](https://github.com/devcontainers/cli) officielle :

```bash
npm install -g @devcontainers/cli
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . bash
```

Vous pouvez ensuite ouvrir votre editeur prefere depuis le shell du container.

## Prerequis

- Node.js >= 18
- Docker (pour lancer les devcontainers)
- (Optionnel) `uvx` pour l'integration spec-kit — le CLI proposera de l'installer s'il est absent
