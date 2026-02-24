import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function generateSpecKitDoc(targetDir, aiProvider) {
  const content = `# Guide d'utilisation de Spec-Kit

## Qu'est-ce que Spec-Kit ?

[Spec-Kit](https://github.com/github/spec-kit) est un toolkit de GitHub pour le **Spec-Driven Development** (developpement pilote par specifications). Il permet de definir les exigences et specifications d'un projet avant de commencer l'implementation, en s'appuyant sur un assistant IA.

L'IA configuree pour ce projet : **${aiProvider}**

## Comment utiliser Spec-Kit

Le workflow recommande suit ces etapes :

1. **Definir la constitution** du projet (principes directeurs)
2. **Specifier** les exigences et user stories
3. **Planifier** la strategie d'implementation
4. **Generer les taches** actionnables
5. **Implementer** les fonctionnalites

## Slash Commands disponibles

### Commandes principales (workflow)

| Commande | Description |
|----------|-------------|
| \`/speckit.constitution\` | Creer les principes directeurs du projet. Definit les regles fondamentales, les contraintes architecturales et les valeurs qui guident toutes les decisions du projet. |
| \`/speckit.specify\` | Definir les exigences et user stories. Transforme les idees en specifications detaillees avec des criteres d'acceptation clairs. |
| \`/speckit.plan\` | Creer la strategie d'implementation technique. Genere un plan technique detaille base sur les specifications, incluant l'architecture, les dependances et les etapes. |
| \`/speckit.tasks\` | Generer les listes de taches actionnables. Decompose le plan en taches individuelles, ordonnees et assignables, pretes a etre implementees. |
| \`/speckit.implement\` | Executer toutes les taches et construire les fonctionnalites. Lance l'implementation automatique de chaque tache en suivant le plan et les specifications. |

### Commandes optionnelles (qualite)

| Commande | Description |
|----------|-------------|
| \`/speckit.clarify\` | Resoudre les exigences sous-specifiees. Identifie les ambiguites et les lacunes dans les specifications, puis pose les questions necessaires pour les resoudre. |
| \`/speckit.analyze\` | Verifier la coherence entre les artefacts. Analyse les specifications, le plan et les taches pour detecter les contradictions ou les elements manquants. |
| \`/speckit.checklist\` | Generer des checklists de validation qualite. Cree des listes de verification pour s'assurer que l'implementation respecte toutes les specifications et les standards. |

## Phases de developpement supportees

- **Greenfield** (zero-to-one) : Creer un projet a partir de zero
- **Exploration creative** : Implementer plusieurs approches en parallele
- **Brownfield** (iteratif) : Ameliorer un projet existant de maniere incrementale

## Variable d'environnement utile

- \`SPECIFY_FEATURE\` : Permet de remplacer la detection automatique de feature pour les depots non-Git. Definir avec le nom du repertoire de feature (ex: \`001-photo-albums\`).

## Ressources

- [Documentation officielle](https://github.com/github/spec-kit)
- [Spec-Driven Development](https://github.com/github/spec-kit#spec-driven-development)
`;

  const filePath = join(targetDir, 'User_of_spec_kit.md');
  writeFileSync(filePath, content);
  return filePath;
}
