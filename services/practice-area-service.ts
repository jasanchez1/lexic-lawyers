import { ApiService } from './api';

export class PracticeAreasService extends ApiService {
  async getPracticeAreas() {
    // In a real implementation, call the API
    // return this.request('/areas', 'GET');
    
    // Mock data for development
    return [
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
    ];
  }
}

// Create a singleton instance
let practiceAreasService: PracticeAreasService;

export function usePracticeAreasService() {
  if (!practiceAreasService) {
    practiceAreasService = new PracticeAreasService();
  }
  
  return practiceAreasService;
}