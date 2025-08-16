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
                <li class="flex items-center">
                  <div class="w-6 h-px bg-gray-300"></div>
                  <div :class="[
                    currentStep >= 4 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600',
                    'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ml-4'
                  ]">
                    4
                  </div>
                  <div class="ml-2 text-sm font-medium text-gray-700">Documentos</div>
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
                  <input id="name" v-model="formData.name" type="text" class="form-input" required />
                  <p v-if="formValidationErrors.name" class="text-xs text-red-500 mt-1">
                    Este campo es obligatorio
                  </p>
                </div>
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    Título Profesional Público *
                  </label>
                  <input id="title" v-model="formData.title" type="text" class="form-input"
                    placeholder="Ej: Abogado Laboral y Comercial" required />
                  <p class="mt-1 text-xs text-gray-500">
                    Este será el título que verán los clientes en tu perfil. Puedes incluir tus áreas principales de
                    especialización.
                  </p>
                  <p v-if="formValidationErrors.title" class="text-xs text-red-500 mt-1">
                    Este campo es obligatorio
                  </p>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Profesional *
                  </label>
                  <input id="email" v-model="formData.email" type="email" class="form-input" required />
                  <p v-if="formValidationErrors.email" class="text-xs text-red-500 mt-1">
                    Este campo es obligatorio
                  </p>
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Contacto *
                  </label>
                  <input id="phone" v-model="formData.phone" type="tel" class="form-input" />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <UiCitySelect id="city" v-model="formData.city" placeholder="Selecciona tu ciudad" />
                </div>
              </div>

              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                  Biografía Profesional *
                </label>
                <textarea id="bio" v-model="formData.bio" rows="5" class="form-input"
                  placeholder="Describa su experiencia, enfoque profesional y especialidades" required></textarea>
                <p v-if="formValidationErrors.bio" class="text-xs text-red-500 mt-1">
                  Este campo es obligatorio
                </p>
              </div>

              <div v-if="showValidationError" class="bg-red-50 p-3 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <AlertCircle class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Por favor complete todos los campos obligatorios</h3>
                  </div>
                </div>
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
              <div
                class="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin">
              </div>
              <p class="mt-2 text-gray-500">Cargando áreas de práctica...</p>
            </div>

            <div v-else class="space-y-4">
              <!-- Selected Areas -->
              <div v-if="formData.areas.length > 0" class="space-y-3 mb-6">
                <div v-for="(area, index) in formData.areas" :key="area.area_id" class="bg-gray-50 p-3 rounded-lg">
                  <div class="flex justify-between items-center mb-2">
                    <div class="font-medium">{{ area.name }}</div>
                    <button @click="removeArea(index)" class="text-red-500 hover:text-red-700" type="button">
                      <Trash class="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">Nivel de experiencia</label>
                    <select v-model="area.experience_score" class="form-input w-full">
                      <option value="">Selecciona tu nivel</option>
                      <option v-for="level in experienceLevels" :key="level.value" :value="level.value">
                        {{ level.name }}
                      </option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ getExperienceLevelDescription(area.experience_score) }}
                    </p>
                  </div>
                </div>
              </div>


              <!-- Area Selector -->
              <div class="space-y-2">
                <label for="area-select" class="block text-sm font-medium text-gray-700">
                  Agregar Área de Práctica
                </label>
                <div class="flex gap-2">
                  <select id="area-select" v-model="selectedAreaId" class="form-input flex-1">
                    <option value="">Seleccionar área</option>
                    <option v-for="area in availablePracticeAreas" :key="area.id" :value="area.id">
                      {{ area.name }}
                    </option>
                  </select>
                  <button @click="addArea" :disabled="!selectedAreaId"
                    class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button">
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
                  Fecha de obtención del título de abogado
                </label>
                <input id="start-date" v-model="formData.professionalStartDate" type="date" class="form-input"
                  :max="today" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Idiomas que domina
                </label>
                <div class="flex flex-wrap gap-2">
                  <div v-for="(language, index) in formData.languages" :key="index"
                    class="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <span>{{ language }}</span>
                    <button @click="removeLanguage(index)" class="ml-1 text-gray-500 hover:text-gray-700" type="button">
                      <X class="w-4 h-4" />
                    </button>
                  </div>

                  <div class="flex items-center">
                    <input v-model="newLanguage" @keydown.enter.prevent="addLanguage" type="text"
                      class="form-input h-8 py-1" placeholder="Agregar idioma" />
                    <button @click="addLanguage" :disabled="!newLanguage"
                      class="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                      type="button">
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label for="image-url" class="block text-sm font-medium text-gray-700 mb-1">
                  URL de Foto de Perfil
                </label>
                <input id="image-url" v-model="formData.image_url" type="url" class="form-input"
                  placeholder="https://ejemplo.com/mi-foto.jpg" />
                <p class="mt-1 text-xs text-gray-500">
                  Ingrese la URL de una foto profesional para su perfil.
                </p>
              </div>
            </div>
          </div>

          <!-- Step 4: Document Upload -->
          <div v-if="currentStep === 4">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Documentos Legales</h2>
            <p class="text-sm text-gray-600 mb-6">
              Para verificar su identidad y titulación, por favor suba los siguientes documentos:
            </p>

            <div class="space-y-8">
              <!-- Supreme Court Certificate -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Certificado de Título de la Corte Suprema *
                </label>
                <UiFileUpload v-model="formData.supremeCourtCertificate"
                  label="Sube tu Certificado de Título de la Corte Suprema" acceptedFormats=".pdf,.jpg,.jpeg,.png"
                  :maxSizeInMB="5" />
                <p class="mt-1 text-xs text-gray-500">
                  Formato PDF, JPG o PNG. Máximo 5MB.
                </p>
              </div>

              <!-- University Degree -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Certificado de Título Universitario *
                </label>
                <UiFileUpload v-model="formData.universityDegree" label="Sube tu Certificado de Título Universitario"
                  acceptedFormats=".pdf,.jpg,.jpeg,.png" :maxSizeInMB="5" />
                <p class="mt-1 text-xs text-gray-500">
                  Formato PDF, JPG o PNG. Máximo 5MB.
                </p>
              </div>

              <!-- Legal Acceptance Section -->
              <div class="border-t pt-8">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Términos y Condiciones</h3>
                
                <!-- Terms and Conditions Checkbox -->
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input 
                        id="terms-checkbox" 
                        v-model="formData.acceptTermsAndConditions"
                        type="checkbox" 
                        class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="terms-checkbox" class="font-medium text-gray-700">
                        Acepto los 
                        <a href="#" @click.prevent="openTermsAndConditions" class="text-primary-600 hover:text-primary-700 underline">
                          términos y condiciones
                        </a> de Lexic *
                      </label>
                      <p class="text-gray-500 text-xs mt-1">
                        Al marcar esta casilla, confirmo que he leído y acepto los términos y condiciones de uso de la plataforma Lexic.
                      </p>
                    </div>
                  </div>

                  <!-- Data Processing Consent Checkbox -->
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input 
                        id="data-consent-checkbox" 
                        v-model="formData.acceptDataProcessingConsent"
                        type="checkbox" 
                        class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="data-consent-checkbox" class="font-medium text-gray-700">
                        Acepto el 
                        <a href="#" @click.prevent="openDataProcessingConsent" class="text-primary-600 hover:text-primary-700 underline">
                          consentimiento de tratamiento de datos
                        </a> *
                      </label>
                      <p class="text-gray-500 text-xs mt-1">
                        Al marcar esta casilla, autorizo el tratamiento de mis datos personales según lo establecido en el documento de consentimiento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!formData.supremeCourtCertificate || !formData.universityDegree || !formData.acceptTermsAndConditions || !formData.acceptDataProcessingConsent"
                class="bg-yellow-50 p-4 rounded-md mt-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <AlertCircle class="h-5 w-5 text-yellow-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">Requisitos para completar el registro</h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <ul class="list-disc pl-5 space-y-1">
                        <li v-if="!formData.supremeCourtCertificate">Subir Certificado de Título de la Corte Suprema</li>
                        <li v-if="!formData.universityDegree">Subir Certificado de Título Universitario</li>
                        <li v-if="!formData.acceptTermsAndConditions">Aceptar términos y condiciones</li>
                        <li v-if="!formData.acceptDataProcessingConsent">Aceptar consentimiento de tratamiento de datos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Navigation -->
          <div class="mt-8 flex justify-between">
            <button v-if="currentStep > 1" @click="currentStep--" type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Anterior
            </button>
            <div v-else></div>

            <div>
              <button v-if="currentStep < 4" @click="goToNextStep" type="button"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canProceed">
                Siguiente
              </button>
              <button v-else @click="submitForm" type="button"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                :disabled="isSubmitting || !canSubmitFinal">
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
import { Trash, X, AlertCircle } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';
import { usePracticeAreas } from '~/composables/usePracticeAreas';
import { useLawyerService } from '~/services/lawyer-service';
import { useNotifications } from '~/composables/useNotifications';
import { useExperienceLevels } from '~/composables/useExperienceLevels'
import UiFileUpload from '~/components/ui/FileUpload.vue';

definePageMeta({
  middleware: ['lawyer-auth'] // Only require basic authentication
});

// Services
const { user, fetchUserProfile } = useAuth();
const { practiceAreas, isLoading, fetchPracticeAreas } = usePracticeAreas();
const lawyerService = useLawyerService();
const { success, error: showError } = useNotifications();
const { experienceLevels, getExperienceLevelName, getExperienceLevelDescription } = useExperienceLevels()

// Form state
const currentStep = ref(1);
const isSubmitting = ref(false);
const selectedAreaId = ref('');
const newLanguage = ref('');
const showValidationError = ref(false);
const formValidationErrors = ref({
  name: false,
  title: false,
  email: false,
  bio: false,
  phone: false,
  city: false
});

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
  areas: [],
  // New document fields
  supremeCourtCertificate: null as File | null,
  universityDegree: null as File | null,
  // Legal acceptance fields
  acceptTermsAndConditions: false,
  acceptDataProcessingConsent: false
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
    const result = !!formData.value.name && !!formData.value.title &&
      !!formData.value.email && !!formData.value.bio;
    console.log("Step 1 validation result:", result);
    return result;
  } else if (currentStep.value === 2) {
    // Require at least one practice area
    return formData.value.areas.length > 0;
  }

  return true;
});

// Can submit final step
const canSubmitFinal = computed(() => {
  return formData.value.supremeCourtCertificate && 
         formData.value.universityDegree && 
         formData.value.acceptTermsAndConditions && 
         formData.value.acceptDataProcessingConsent;
});

// Methods
const goToNextStep = () => {
  console.log("Current step:", currentStep.value);

  // Reset validation errors
  showValidationError.value = false;
  Object.keys(formValidationErrors.value).forEach(key => {
    formValidationErrors.value[key] = false;
  });

  if (currentStep.value === 1) {
    // Validate required fields for step 1
    let hasError = false;

    if (!formData.value.name) {
      formValidationErrors.value.name = true;
      hasError = true;
    }

    if (!formData.value.title) {
      formValidationErrors.value.title = true;
      hasError = true;
    }

    if (!formData.value.email) {
      formValidationErrors.value.email = true;
      hasError = true;
    }

    if (!formData.value.bio) {
      formValidationErrors.value.bio = true;
      hasError = true;
    }

    if (!formData.value.phone) {
      formValidationErrors.value.phone = true;
      hasError = true;
    }

    if (!formData.value.city) {
      formValidationErrors.value.city = true;
      hasError = true;
    }

    if (hasError) {
      showValidationError.value = true;
      return;
    }
  }

  // Proceed to next step
  currentStep.value += 1;
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

    // Create the lawyer profile using the LawyerService
    const response = await lawyerService.createLawyer(lawyerData);
    // If lawyer creation was successful, upload documents
    if (response && response.id) {
      // Upload documents
      const docsUploaded = await uploadLawyerDocuments(response.id);

      if (!docsUploaded) {
        showError('Error', 'Tu perfil se creó pero hubo un problema al subir los documentos. Por favor, intenta subirlos más tarde desde tu perfil.');
      }

      // Refresh user profile to get updated information including lawyer_id
      await fetchUserProfile();

      // Show success message
      success('Perfil creado', 'Su perfil de abogado ha sido creado correctamente y está en proceso de verificación');

      // Redirect to dashboard
      navigateTo('/');
    } else {
      throw new Error("No se recibió ID de abogado en la respuesta");
    }
  } catch (err) {
    console.error('Error creating lawyer profile:', err);
    showError('Error', err instanceof Error ? err.message : 'Error al crear el perfil');
  } finally {
    isSubmitting.value = false;
  }
};

// Upload lawyer documents to the server
const uploadLawyerDocuments = async (lawyerId: string) => {
  console.log("Starting document upload for lawyer ID:", lawyerId);

  if (!formData.value.supremeCourtCertificate || !formData.value.universityDegree) {
    showError('Error', 'Faltan documentos requeridos');
    return false;
  }

  try {

    // Create FormData object for Supreme Court Certificate
    const formDataSupremeCourt = new FormData();
    formDataSupremeCourt.append('supreme_court_certificate', formData.value.supremeCourtCertificate);
    formDataSupremeCourt.append('document_types', 'supreme_court_certificate');

    // Upload Supreme Court Certificate
    const supremeCourtResult = await lawyerService.uploadLawyerDocument(lawyerId, formDataSupremeCourt);

    // Create FormData for University Degree
    const formDataUniversity = new FormData();
    formDataUniversity.append('university_degree', formData.value.universityDegree);
    formDataUniversity.append('document_types', 'university_degree');

    // Upload University Degree
    const universityResult = await lawyerService.uploadLawyerDocument(lawyerId, formDataUniversity);

    success('Documentos subidos', 'Sus documentos han sido cargados y serán verificados por nuestro equipo.');
    return true;
  } catch (err) {
    console.error('Error uploading documents:', err);
    showError('Error', err instanceof Error ? err.message : 'Hubo un problema al subir sus documentos. Por favor, inténtelo más tarde.');
    return false;
  }
};

// Handle terms and conditions modal/page
const openTermsAndConditions = () => {
  // Open the existing TyC document
  const tycUrl = '/documents/Lexic_TyC_24.06.2025.pdf';
  window.open(tycUrl, '_blank');
};

// Handle data processing consent download
const openDataProcessingConsent = () => {
  // Download the existing data processing consent document
  const consentUrl = '/documents/Consentimiento_Tratamiento_Datos.pdf';
  window.open(consentUrl, '_blank');
};

// Load data on mount
onMounted(async () => {
  try {
    // Fetch practice areas from the API
    await fetchPracticeAreas();
  } catch (error) {
    showError('Error', 'No se pudieron cargar las áreas de práctica');
  }
});
</script>