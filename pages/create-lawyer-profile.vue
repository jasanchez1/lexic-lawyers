<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Complete su Perfil Profesional</h1>
        <p class="mt-2 text-gray-600">Complete esta información para comenzar a usar Lexic</p>
      </div>
      
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Progress Steps -->
        <div class="border-b border-gray-200">
          <div class="px-6 py-4">
            <nav class="flex">
              <ol role="list" class="flex items-center space-x-4">
                <li class="flex items-center">
                  <div :class="[
                    currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600',
                    'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center'
                  ]">
                    1
                  </div>
                  <div class="ml-2 text-sm font-medium text-gray-700">Información Personal</div>
                </li>
                <li class="flex items-center">
                  <div class="w-6 h-px bg-gray-300"></div>
                  <div :class="[
                    currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600',
                    'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ml-4'
                  ]">
                    2
                  </div>
                  <div class="ml-2 text-sm font-medium text-gray-700">Áreas de Práctica</div>
                </li>
                <li class="flex items-center">
                  <div class="w-6 h-px bg-gray-300"></div>
                  <div :class="[
                    currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600',
                    'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ml-4'
                  ]">
                    3
                  </div>
                  <div class="ml-2 text-sm font-medium text-gray-700">Experiencia</div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        
        <!-- Form Content -->
        <div class="p-6">
          <!-- Step 1: Personal Information -->
          <div v-if="currentStep === 1">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Información Personal</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    Título Profesional *
                  </label>
                  <input
                    id="title"
                    v-model="formData.title"
                    type="text"
                    class="form-input"
                    placeholder="Abogado Civil, Universidad de Chile"
                    required
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Profesional *
                  </label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    class="form-input"
                  />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    id="city"
                    v-model="formData.city"
                    type="text"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                  Biografía Profesional *
                </label>
                <textarea
                  id="bio"
                  v-model="formData.bio"
                  rows="5"
                  class="form-input"
                  placeholder="Describa su experiencia, enfoque profesional y especialidades"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Step 2: Practice Areas -->
          <div v-if="currentStep === 2">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Áreas de Práctica</h2>
            <p class="text-sm text-gray-600 mb-4">
              Seleccione las áreas en las que ejerce y ajuste su nivel de experiencia en cada una.
            </p>
            
            <div v-if="isLoading" class="py-4 text-center">
              <div class="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-2 text-gray-500">Cargando áreas de práctica...</p>
            </div>
            
            <div v-else class="space-y-4">
              <!-- Selected Areas -->
              <div v-if="formData.areas.length > 0" class="space-y-3 mb-6">
                <div 
                  v-for="(area, index) in formData.areas" 
                  :key="area.area_id"
                  class="bg-gray-50 p-3 rounded-lg"
                >
                  <div class="flex justify-between items-center mb-1">
                    <div class="font-medium">{{ area.name }}</div>
                    <button 
                      @click="removeArea(index)"
                      class="text-red-500 hover:text-red-700"
                      type="button"
                    >
                      <Trash class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="area.experience_score"
                      type="range"
                      min="1"
                      max="100"
                      class="flex-1"
                    />
                    <span class="text-sm text-gray-600 w-10 text-right">{{ area.experience_score }}%</span>
                  </div>
                </div>
              </div>
              
              <!-- Area Selector -->
              <div class="space-y-2">
                <label for="area-select" class="block text-sm font-medium text-gray-700">
                  Agregar Área de Práctica
                </label>
                <div class="flex gap-2">
                  <select 
                    id="area-select"
                    v-model="selectedAreaId"
                    class="form-input flex-1"
                  >
                    <option value="">Seleccionar área</option>
                    <option 
                      v-for="area in availablePracticeAreas" 
                      :key="area.id" 
                      :value="area.id"
                    >
                      {{ area.name }}
                    </option>
                  </select>
                  <button
                    @click="addArea"
                    :disabled="!selectedAreaId"
                    class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    Agregar
                  </button>
                </div>
              </div>
              
              <div v-if="formData.areas.length === 0" class="text-yellow-600 bg-yellow-50 px-4 py-3 rounded-md mt-4">
                Por favor, seleccione al menos un área de práctica.
              </div>
            </div>
          </div>
          
          <!-- Step 3: Experience -->
          <div v-if="currentStep === 3">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Experiencia Profesional</h2>
            
            <div class="space-y-6">
              <div>
                <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de inicio como abogado
                </label>
                <input
                  id="start-date"
                  v-model="formData.professionalStartDate"
                  type="date"
                  class="form-input"
                  :max="today"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Idiomas que domina
                </label>
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="(language, index) in formData.languages" 
                    :key="index"
                    class="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{{ language }}</span>
                    <button 
                      @click="removeLanguage(index)"
                      class="ml-1 text-gray-500 hover:text-gray-700"
                      type="button"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div class="flex items-center">
                    <input
                      v-model="newLanguage"
                      @keydown.enter.prevent="addLanguage"
                      type="text"
                      class="form-input h-8 py-1"
                      placeholder="Agregar idioma"
                    />
                    <button 
                      @click="addLanguage"
                      :disabled="!newLanguage"
                      class="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                      type="button"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label for="image-url" class="block text-sm font-medium text-gray-700 mb-1">
                  URL de Foto de Perfil
                </label>
                <input
                  id="image-url"
                  v-model="formData.image_url"
                  type="url"
                  class="form-input"
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Ingrese la URL de una foto profesional para su perfil.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Form Navigation -->
          <div class="mt-8 flex justify-between">
            <button
              v-if="currentStep > 1"
              @click="currentStep--"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
            <div v-else></div>
            
            <div>
              <button
                v-if="currentStep < 3"
                @click="goToNextStep"
                type="button"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                :disabled="!canProceed"
              >
                Siguiente
              </button>
              <button
                v-else
                @click="submitForm"
                type="button"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Creando Perfil...' : 'Completar Registro' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Trash, X } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';
import { usePracticeAreas } from '~/composables/usePracticeAreas';
import { useLawyerService } from '~/services/lawyer-service';
import { useNotifications } from '~/composables/useNotifications';

definePageMeta({
  middleware: ['lawyer-auth'] // Only require basic authentication
});

// Services
const { user, fetchUserProfile } = useAuth();
const { practiceAreas, isLoading, fetchPracticeAreas } = usePracticeAreas();
const lawyerService = useLawyerService();
const { success, error: showError } = useNotifications();

// Form state
const currentStep = ref(1);
const isSubmitting = ref(false);
const selectedAreaId = ref('');
const newLanguage = ref('');

// Form data with defaults from user profile
const formData = ref({
  name: user.value?.first_name && user.value?.last_name 
    ? `${user.value.first_name} ${user.value.last_name}` 
    : '',
  title: '',
  email: user.value?.email || '',
  phone: '',
  city: '',
  bio: '',
  image_url: '', // Use API naming conventions
  coverImageUrl: '',
  professionalStartDate: '',
  languages: ['Español'],
  areas: []
});

// For languages input (comma-separated)
const languagesInput = ref(formData.value.languages.join(', '));

// Get today's date in ISO format for the date input max
const today = new Date().toISOString().split('T')[0];

// Computed properties
const availablePracticeAreas = computed(() => {
  return practiceAreas.value.filter(area => 
    !formData.value.areas.some(a => a.area_id === area.id)
  );
});

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    // Check required fields for step 1
    return formData.value.name && formData.value.title && 
           formData.value.email && formData.value.bio;
  } else if (currentStep.value === 2) {
    // Require at least one practice area
    return formData.value.areas.length > 0;
  }
  
  return true;
});

// Methods
const goToNextStep = () => {
  if (canProceed.value) {
    currentStep.value++;
  }
};

// Add a practice area
const addArea = () => {
  if (!selectedAreaId.value) return;
  
  const area = practiceAreas.value.find(a => a.id === selectedAreaId.value);
  if (area) {
    // Add the area with initial experience score that user can adjust
    formData.value.areas.push({
      area_id: area.id, // This is the real UUID from the API
      id: area.id, // Duplicate id for template compatibility
      name: area.name,
      experience_score: 50, // Default to 50%
      slug: area.slug
    });
    
    selectedAreaId.value = '';
  }
};

// Remove a practice area
const removeArea = (index: number) => {
  formData.value.areas.splice(index, 1);
};

// Add a language
const addLanguage = () => {
  if (!newLanguage.value) return;
  
  formData.value.languages.push(newLanguage.value);
  newLanguage.value = '';
  // Update the language input string
  languagesInput.value = formData.value.languages.join(', ');
};

// Remove a language
const removeLanguage = (index: number) => {
  formData.value.languages.splice(index, 1);
  // Update the language input string
  languagesInput.value = formData.value.languages.join(', ');
};

// Submit the form
const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    // Parse languages from comma-separated input
    const languages = languagesInput.value.split(',')
      .map(lang => lang.trim())
      .filter(lang => lang.length > 0);
    
    // Format the professional start date to include time component
    let formattedStartDate = null;
    if (formData.value.professionalStartDate) {
      // Convert YYYY-MM-DD to YYYY-MM-DDT00:00:00 format
      formattedStartDate = `${formData.value.professionalStartDate}T00:00:00`;
    }
    
    // Transform areas to match the API's expected format
    const transformedAreas = formData.value.areas.map(area => ({
      area_id: area.area_id, // Use the actual UUID from the API
      experience_score: area.experience_score
    }));
    
    // Prepare the data for the API
    const lawyerData = {
      name: formData.value.name,
      title: formData.value.title,
      email: formData.value.email,
      phone: formData.value.phone,
      city: formData.value.city,
      bio: formData.value.bio,
      image_url: formData.value.image_url,
      professional_start_date: formattedStartDate,
      languages,
      // Only send required fields for areas
      areas: transformedAreas,
      // Pass the user ID if available
      user_id: user.value?.id
    };
    
    console.log("Sending data to API:", lawyerData);
    
    // Create the lawyer profile using the LawyerService
    const response = await lawyerService.createLawyer(lawyerData);
    
    // Update the user's lawyer_id in the auth state
    if (response && response.id) {
      // Refresh user profile to get updated information including lawyer_id
      await fetchUserProfile();
    }
    
    // Show success message
    success('Perfil creado', 'Su perfil de abogado ha sido creado correctamente');
    
    // Redirect to dashboard
    navigateTo('/');
  } catch (err) {
    showError('Error', err instanceof Error ? err.message : 'Error al crear el perfil');
    console.error('Error creating lawyer profile:', err);
  } finally {
    isSubmitting.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  try {
    // Fetch practice areas from the API
    await fetchPracticeAreas();
    console.log("Fetched practice areas:", practiceAreas.value);
  } catch (error) {
    console.error("Error fetching practice areas:", error);
    showError('Error', 'No se pudieron cargar las áreas de práctica');
  }
});
</script>