import { ref, onMounted } from 'vue';

export function usePracticeAreas() {
  const practiceAreas = ref([
    { id: '1', name: 'Derecho Civil', slug: 'derecho-civil' },
    { id: '2', name: 'Contratos', slug: 'contratos' },
    { id: '3', name: 'Propiedad', slug: 'propiedad' },
    { id: '4', name: 'Derecho de Familia', slug: 'derecho-familia' },
    { id: '5', name: 'Derecho Laboral', slug: 'derecho-laboral' },
    { id: '6', name: 'Derecho Comercial', slug: 'derecho-comercial' },
    { id: '7', name: 'Derecho Penal', slug: 'derecho-penal' },
    { id: '8', name: 'Derecho Tributario', slug: 'derecho-tributario' },
    { id: '9', name: 'Propiedad Intelectual', slug: 'propiedad-intelectual' },
    { id: '10', name: 'Inmobiliario', slug: 'inmobiliario' }
  ]);
  
  const isLoading = ref(false);
  const error = ref(null);
  
  const fetchPracticeAreas = async () => {
    // In a real app, this would call an API
    // For now we'll just use the hardcoded list
    return practiceAreas.value;
  };
  
  onMounted(() => {
    fetchPracticeAreas();
  });
  
  return {
    practiceAreas,
    isLoading,
    error,
    fetchPracticeAreas
  };
}