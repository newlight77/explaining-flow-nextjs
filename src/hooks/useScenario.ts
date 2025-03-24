import { ScenarioConfig, ScenarioInput } from '@/lib/models/types';
import { useCallback, useState } from 'react';
import { parseInput } from '@/lib/models/scenario';

export function useScenario() {
  const [scenario, setScenario] = useState<ScenarioConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const createScenario = useCallback((input: ScenarioInput) => {
    try {
      setError(null);
      const newScenario = parseInput(input);
      setScenario(newScenario);
      return newScenario;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création du scénario');
      return null;
    }
  }, []);
  
  return {
    scenario,
    error,
    createScenario
  };
}
