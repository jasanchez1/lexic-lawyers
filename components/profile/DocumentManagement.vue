<template>
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-bold mb-4">Documentos Legales</h3>
      
      <div v-if="isLoading" class="py-4 text-center">
        <div class="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-sm text-gray-500">Cargando documentos...</p>
      </div>
      
      <div v-else-if="error" class="bg-red-50 p-3 rounded-md text-red-700 text-sm">
        {{ error }}
      </div>
      
      <div v-else class="space-y-6">
        <!-- Supreme Court Certificate -->
        <div class="border border-gray-200 rounded-md p-4">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-medium">Certificado de Título de la Corte Suprema</h4>
              <div v-if="supremeCourtCertificate" class="mt-2">
                <div class="flex items-center text-sm text-gray-600">
                  <FileCheck class="w-4 h-4 mr-1 text-green-500" />
                  <span>Documento subido el {{ formatDate(supremeCourtCertificate.uploaded_date) }}</span>
                </div>
                <div v-if="supremeCourtCertificate.status === 'verified'" class="flex items-center mt-1 text-sm text-green-600">
                  <CheckCircle class="w-4 h-4 mr-1" />
                  <span>Verificado</span>
                </div>
                <div v-else-if="supremeCourtCertificate.status === 'pending'" class="flex items-center mt-1 text-sm text-yellow-600">
                  <Clock class="w-4 h-4 mr-1" />
                  <span>Pendiente de verificación</span>
                </div>
                <div v-else-if="supremeCourtCertificate.status === 'rejected'" class="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle class="w-4 h-4 mr-1" />
                  <span>Documento rechazado: {{ supremeCourtCertificate.notes || 'Por favor, suba un nuevo documento' }}</span>
                </div>
              </div>
              <div v-else class="mt-2 text-sm text-yellow-600 flex items-center">
                <AlertTriangle class="w-4 h-4 mr-1" />
                <span>Documento no subido</span>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button 
                v-if="supremeCourtCertificate"
                @click="downloadDocument(supremeCourtCertificate.id, 'Certificado_Corte_Suprema')"
                class="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              >
                <Download class="w-4 h-4 mr-1" />
                <span>Descargar</span>
              </button>
              
              <button 
                @click="toggleUploadForm('supreme_court')"
                class="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              >
                <Upload class="w-4 h-4 mr-1" />
                <span>{{ supremeCourtCertificate ? 'Actualizar' : 'Subir' }}</span>
              </button>
            </div>
          </div>
          
          <!-- Upload Form -->
          <div v-if="showUploadForms.supreme_court" class="mt-4 border-t pt-4">
            <UiFileUpload
              v-model="uploadFiles.supreme_court_certificate"
              label="Selecciona tu Certificado de Título de la Corte Suprema"
              acceptedFormats=".pdf,.jpg,.jpeg,.png"
              :maxSizeInMB="5"
            />
            
            <div class="flex justify-end mt-2 space-x-2">
              <button
                @click="toggleUploadForm('supreme_court')"
                class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="uploadDocument('supreme_court_certificate')"
                :disabled="!uploadFiles.supreme_court_certificate || isUploading"
                class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {{ isUploading ? 'Subiendo...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- University Degree Certificate -->
        <div class="border border-gray-200 rounded-md p-4">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-medium">Certificado de Título Universitario</h4>
              <div v-if="universityDegree" class="mt-2">
                <div class="flex items-center text-sm text-gray-600">
                  <FileCheck class="w-4 h-4 mr-1 text-green-500" />
                  <span>Documento subido el {{ formatDate(universityDegree.uploaded_date) }}</span>
                </div>
                <div v-if="universityDegree.status === 'verified'" class="flex items-center mt-1 text-sm text-green-600">
                  <CheckCircle class="w-4 h-4 mr-1" />
                  <span>Verificado</span>
                </div>
                <div v-else-if="universityDegree.status === 'pending'" class="flex items-center mt-1 text-sm text-yellow-600">
                  <Clock class="w-4 h-4 mr-1" />
                  <span>Pendiente de verificación</span>
                </div>
                <div v-else-if="universityDegree.status === 'rejected'" class="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle class="w-4 h-4 mr-1" />
                  <span>Documento rechazado: {{ universityDegree.notes || 'Por favor, suba un nuevo documento' }}</span>
                </div>
              </div>
              <div v-else class="mt-2 text-sm text-yellow-600 flex items-center">
                <AlertTriangle class="w-4 h-4 mr-1" />
                <span>Documento no subido</span>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button 
                v-if="universityDegree"
                @click="downloadDocument(universityDegree.id, 'Titulo_Universitario')"
                class="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              >
                <Download class="w-4 h-4 mr-1" />
                <span>Descargar</span>
              </button>
              
              <button 
                @click="toggleUploadForm('university')"
                class="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              >
                <Upload class="w-4 h-4 mr-1" />
                <span>{{ universityDegree ? 'Actualizar' : 'Subir' }}</span>
              </button>
            </div>
          </div>
          
          <!-- Upload Form -->
          <div v-if="showUploadForms.university" class="mt-4 border-t pt-4">
            <UiFileUpload
              v-model="uploadFiles.university_degree"
              label="Selecciona tu Certificado de Título Universitario"
              acceptedFormats=".pdf,.jpg,.jpeg,.png"
              :maxSizeInMB="5"
            />
            
            <div class="flex justify-end mt-2 space-x-2">
              <button
                @click="toggleUploadForm('university')"
                class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="uploadDocument('university_degree')"
                :disabled="!uploadFiles.university_degree || isUploading"
                class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {{ isUploading ? 'Subiendo...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Document Status Information -->
        <div v-if="!universityDegree || !supremeCourtCertificate" class="bg-yellow-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <AlertCircle class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Certificación de abogado</h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>
                  Para obtener la verificación de su cuenta, es necesario cargar tanto el Certificado de Título Universitario como el Certificado de Título de la Corte Suprema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { 
    FileCheck, CheckCircle, Clock, AlertCircle, AlertTriangle, 
    Download, Upload 
  } from 'lucide-vue-next';
  import { useLawyerService } from '~/services/lawyer-service';
  import { useAuth } from '~/composables/useAuth';
  import { useNotifications } from '~/composables/useNotifications';
  import type { LawyerDocument } from '~/types/lawyer';
  
  const props = defineProps({
    lawyerId: {
      type: String,
      required: true
    }
  });
  
  // Services
  const lawyerService = useLawyerService();
  const { success, error: showError } = useNotifications();
  
  // State
  const isLoading = ref(false);
  const isUploading = ref(false);
  const error = ref('');
  const documents = ref<LawyerDocument[]>([]);
  
  // Derived document state
  const supremeCourtCertificate = computed(() => {
    return documents.value.find(doc => doc.document_type === 'supreme_court_certificate');
  });
  
  const universityDegree = computed(() => {
    return documents.value.find(doc => doc.document_type === 'university_degree');
  });
  
  // Upload state
  const showUploadForms = ref({
    supreme_court: false,
    university: false
  });
  
  const uploadFiles = ref({
    supreme_court_certificate: null as File | null,
    university_degree: null as File | null
  });
  
  // Methods
  const fetchDocuments = async () => {
    isLoading.value = true;
    error.value = '';
    
    try {
      const response = await lawyerService.getLawyerDocuments(props.lawyerId);
      documents.value = response || [];
    } catch (err) {
      console.error('Error fetching documents:', err);
      error.value = err instanceof Error ? err.message : 'Error al cargar documentos';
    } finally {
      isLoading.value = false;
    }
  };
  
  const toggleUploadForm = (formType: 'supreme_court' | 'university') => {
    showUploadForms.value[formType] = !showUploadForms.value[formType];
    
    // Reset file if closing
    if (!showUploadForms.value[formType]) {
      if (formType === 'supreme_court') {
        uploadFiles.value.supreme_court_certificate = null;
      } else {
        uploadFiles.value.university_degree = null;
      }
    }
  };
  
  const uploadDocument = async (documentType: 'supreme_court_certificate' | 'university_degree') => {
    if (!uploadFiles.value[documentType]) {
      showError('Error', 'No se ha seleccionado ningún archivo');
      return;
    }
    
    isUploading.value = true;
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append(documentType, uploadFiles.value[documentType] as File);
      formData.append('document_types', documentType);
      
      // Upload document
      await lawyerService.uploadLawyerDocument(props.lawyerId, formData);
      
      // Success message
      success('Documento subido', 'El documento se ha subido correctamente y está pendiente de verificación');
      
      // Reload documents
      await fetchDocuments();
      
      // Close upload form
      if (documentType === 'supreme_court_certificate') {
        showUploadForms.value.supreme_court = false;
      } else {
        showUploadForms.value.university = false;
      }
      
      // Reset file
      uploadFiles.value[documentType] = null;
    } catch (err) {
      console.error('Error uploading document:', err);
      showError('Error', err instanceof Error ? err.message : 'Error al subir documento');
    } finally {
      isUploading.value = false;
    }
  };
  
  const downloadDocument = async (documentId: string, fileName: string) => {
    try {
      // Get authentication token
      const { getAccessToken } = useAuth();
      const token = getAccessToken();
      
      if (!token) {
        showError('Error', 'No se pudo autenticar para descargar el documento');
        return;
      }
      
      // Get config for base URL
      const config = useRuntimeConfig();
      const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000';
      
      // Create download URL
      const url = `${BASE_URL}/api/lawyers/${props.lawyerId}/documents/${documentId}/download`;
      
      // Use fetch with proper headers to get the document
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Get the content type
      const contentType = response.headers.get('content-type') || '';
      let extension = '.pdf';
      
      // Determine file extension from content type
      if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        extension = '.jpg';
      } else if (contentType.includes('png')) {
        extension = '.png';
      }
      
      // Create object URL
      const objectURL = URL.createObjectURL(blob);
      
      // Create link element
      const link = document.createElement('a');
      link.href = objectURL;
      link.download = `${fileName}${extension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(objectURL);
    } catch (err) {
      console.error('Error downloading document:', err);
      showError('Error', err instanceof Error ? err.message : 'Error al descargar documento');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Load documents on mount
  onMounted(async () => {
    await fetchDocuments();
  });
  </script>