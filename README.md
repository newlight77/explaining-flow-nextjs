# Explaining Flow - Next.js & TypeScript

Une refonte moderne de l'application [explaining-flow](https://michelgrootjans.github.io/explaining-flow/) utilisant Next.js et TypeScript.

## Description

Cette application permet de simuler des flux de travail d'équipe et de visualiser l'impact de différentes configurations sur l'efficacité et l'efficience. Elle mesure le débit (throughput), le temps de cycle (lead time) et le travail en cours (WIP).

## Fonctionnalités

- Simulation de flux de travail avec différentes configurations d'équipe
- Visualisation du tableau kanban avec colonnes et post-its
- Affichage des statistiques en temps réel
- Graphiques de métriques de flux et diagramme de flux cumulatif
- Interface utilisateur moderne avec Tailwind CSS
- Code robuste grâce à TypeScript

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React avec App Router
- [TypeScript](https://www.typescriptlang.org/) - Typage statique pour JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
- [Chart.js](https://www.chartjs.org/) - Bibliothèque de graphiques
- [RxJS](https://rxjs.dev/) - Bibliothèque pour la programmation réactive

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/newlight77/explaining-flow-nextjs.git
cd explaining-flow-nextjs

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Utilisation

1. Remplissez le formulaire avec les paramètres de simulation souhaités :
   - **Travail par histoire** : Quantité de travail pour chaque type de travailleur (ex: "dev: 1" ou "ux: 1, dev: 3, qa: 2")
   - **Travailleurs** : Types de travailleurs disponibles (ex: "dev" ou "ux, dev, qa")
   - **Limite WIP** : Limite optionnelle du travail en cours
   - **Nombre d'histoires** : Nombre total d'histoires à traiter
   - **Travail variable** : Activer pour simuler une variabilité dans le temps de travail

2. Cliquez sur "Exécuter" pour lancer la simulation

3. Observez le tableau kanban, les statistiques et les graphiques qui se mettent à jour en temps réel

## Déploiement

Cette application est déployée sur Vercel. Vous pouvez la voir en action [ici](https://explaining-flow-nextjs.vercel.app/).

## Crédits

Cette application est une refonte de [explaining-flow](https://github.com/michelgrootjans/explaining-flow) créée par Michel Grootjans.

## Licence

Ce projet est sous licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), conformément à la licence du projet original.
