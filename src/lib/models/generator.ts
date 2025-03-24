import { WorkItem } from './types';

// Classe pour générer des couleurs aléatoires pour les cartes
export class Colors {
  private static colors = [
    '#ffcc00', // jaune
    '#ff66b3', // rose
    '#66ccff', // bleu clair
    '#99ff99', // vert clair
    '#ff9966', // orange
    '#cc99ff'  // violet
  ];

  static anyCardColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}

// Fonction pour générer des éléments de travail
export function generateWorkItems(
  generateStory: () => Record<string, number>, 
  amount: number
): WorkItem[] {
  const items: WorkItem[] = [];
  let counter = 1;
  
  for (let i = 0; i < amount; i++) {
    items.push({
      id: counter++,
      work: generateStory(),
      color: Colors.anyCardColor()
    });
  }
  
  return items;
}

// Fonction pour générer une distribution aléatoire
export function poissonDistribution(lambda: number): (value: number) => number {
  return (value: number) => {
    // Utilisation d'une approximation normale pour la distribution de Poisson
    // pour les grandes valeurs de lambda
    const stdDev = Math.sqrt(lambda);
    const normal = Math.random() * 2 - 1 + Math.random() * 2 - 1 + Math.random() * 2 - 1;
    return Math.max(0.1, value + normal * stdDev);
  };
}
