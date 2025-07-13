export function useExperienceLevels() {
  const experienceLevels = [
    {
      value: 20,
      name: 'Básico / Introductorio',
      description: 'Tiene conocimientos generales. Ha estudiado la materia pero no la ejerce profesionalmente.'
    },
    {
      value: 40,
      name: 'Intermedio',
      description: 'Ha trabajado algunos casos o asuntos en esta área. Tiene experiencia limitada pero concreta.'
    },
    {
      value: 60,
      name: 'Avanzado',
      description: 'Ha manejado diversos casos o proyectos. Tiene experiencia profesional frecuente.'
    },
    {
      value: 80,
      name: 'Especialista',
      description: 'Es su área principal de ejercicio. Posee vasta experiencia, estudios complementarios o publicaciones.'
    },
    {
      value: 100,
      name: 'Experto / Referente',
      description: 'Reconocido por sus pares. Participa como expositor, docente o consultor. Tiene trayectoria destacada.'
    }
  ];

  // Map any percentage to the nearest experience level
  const mapToNearestLevel = (score: number): number => {
    if (!score || score < 1) return 20; // Default to basic if no score
    
    // Map ranges to our levels
    if (score <= 25) return 20;      // 1-25 -> Básico
    if (score <= 45) return 40;      // 26-45 -> Intermedio  
    if (score <= 65) return 60;      // 46-65 -> Avanzado
    if (score <= 85) return 80;      // 66-85 -> Especialista
    return 100;                       // 86-100 -> Experto
  };

  const getExperienceLevelName = (score: number): string => {
    if (!score) return '';
    
    const mappedScore = mapToNearestLevel(score);
    const level = experienceLevels.find(level => level.value === mappedScore);
    return level?.name || '';
  };

  const getExperienceLevelDescription = (score: number): string => {
    if (!score) return 'Selecciona un nivel de experiencia para esta área';
    
    const mappedScore = mapToNearestLevel(score);
    const level = experienceLevels.find(level => level.value === mappedScore);
    return level?.description || 'Selecciona un nivel de experiencia para esta área';
  };

  const getExperienceLevelByValue = (score: number) => {
    const mappedScore = mapToNearestLevel(score);
    return experienceLevels.find(level => level.value === mappedScore);
  };

  // Get the exact level without mapping (for dropdowns)
  const getExactExperienceLevelName = (score: number): string => {
    const level = experienceLevels.find(level => level.value === score);
    return level?.name || '';
  };

  const getExactExperienceLevelDescription = (score: number): string => {
    const level = experienceLevels.find(level => level.value === score);
    return level?.description || 'Selecciona un nivel de experiencia para esta área';
  };

  return {
    experienceLevels,
    getExperienceLevelName,
    getExperienceLevelDescription,
    getExperienceLevelByValue,
    getExactExperienceLevelName,
    getExactExperienceLevelDescription,
    mapToNearestLevel
  };
}