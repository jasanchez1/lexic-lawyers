<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

    <div v-if="isLoading && !profile" class="text-center py-8">
      <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4">
      </div>
      <p class="text-gray-500">Cargando perfil...</p>
    </div>

    <div v-else-if="error && !profile" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
      {{ error }}
    </div>

    <template v-else-if="profile">
      <!-- Profile Header with Cover Photo and Avatar -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
        <!-- ...existing profile header code... -->
      </div>

      <!-- View Mode -->
      <div v-if="!editMode" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- About -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Acerca de mí</h3>
            <div class="prose max-w-none">
              <p>{{ profile.bio || 'No hay información disponible' }}</p>
            </div>
          </div>

          <!-- Practice Areas -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Áreas de Práctica</h3>
            <div v-if="profile.areas && profile.areas.length > 0" class="space-y-4">
              <div v-for="area in profile.areas" :key="area.id" class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-700 font-medium">{{ area.name }}</span>
                    <span class="text-gray-500">{{ area.experience_score }}%</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${area.experience_score}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500">
              No hay áreas de práctica configuradas
            </div>
          </div>

          <!-- Document Management (NEW) -->
          <ProfileDocumentManagement v-if="profile.id" :lawyer-id="profile.id" />

          <!-- Education -->
          <div v-if="education && education.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Educación</h3>
            <!-- ...existing education code... -->
          </div>

          <!-- Work Experience -->
          <div v-if="workExperience && workExperience.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Experiencia Laboral</h3>
            <!-- ...existing work experience code... -->
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Información de Contacto</h3>
            <!-- ...existing contact info code... -->
          </div>

          <!-- Languages -->
          <div v-if="profile.languages && profile.languages.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Idiomas</h3>
            <!-- ...existing languages code... -->
          </div>

          <!-- Achievements -->
          <div v-if="achievements && achievements.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Logros y Reconocimientos</h3>
            <!-- ...existing achievements code... -->
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="bg-white rounded-lg shadow-sm border p-6">
        <!-- ...existing edit mode code... -->
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  Star, Mail, Phone, MapPin, Briefcase,
  GraduationCap, Award, Trash2
} from 'lucide-vue-next'
import { useProfile } from '~/composables/useProfile'
import { useNotifications } from '~/composables/useNotifications'
import { usePracticeAreas } from '~/composables/usePracticeAreas'
import { useAuth } from '~/composables/useAuth'
import ProfileDocumentManagement from '~/components/profile/DocumentManagement.vue'

definePageMeta({
  middleware: ['lawyer-auth']
})

// State
const editMode = ref(false)
const isSubmitting = ref(false)
const { user } = useAuth()
const { profile, education, workExperience, achievements, isLoading, error, fetchProfile, updateProfile, fetchExperience } = useProfile()
const { success, error: showError } = useNotifications()
const { practiceAreas } = usePracticeAreas()

// Edit form model
const editForm = ref({
  name: '',
  title: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  imageUrl: '',
  coverImageUrl: '',
  languages: [],
  areas: []
})

// For languages input (comma-separated)
const languagesInput = ref('')

// For adding new areas
const newAreaId = ref('')

// Available practice areas (filtered to exclude already selected)
const availablePracticeAreas = computed(() => {
  return practiceAreas.value.filter(area =>
    !editForm.value.areas.some(a => a.id === area.id)
  )
})

// Initialize edit form when profile loaded
watch(profile, newProfile => {
  if (newProfile) {
    editForm.value = {
      name: newProfile.name || '',
      title: newProfile.title || '',
      email: newProfile.email || '',
      phone: newProfile.phone || '',
      city: newProfile.city || '',
      bio: newProfile.bio || '',
      imageUrl: newProfile.image_url || '',
      coverImageUrl: newProfile.coverImageUrl || '',
      languages: [...(newProfile.languages || [])],
      areas: [...(newProfile.areas || []).map(area => ({ ...area }))]
    }

    // Update languages input
    languagesInput.value = (newProfile.languages || []).join(', ')
  }
})

// Add a new practice area
const addArea = () => {
  if (!newAreaId.value) return

  const area = practiceAreas.value.find(a => a.id === newAreaId.value)
  if (area) {
    editForm.value.areas.push({
      id: area.id,
      name: area.name,
      slug: area.slug,
      experience_score: 50 // Default to 50%
    })

    // Reset selection
    newAreaId.value = ''
  }
}

// Remove a practice area
const removeArea = (index: number) => {
  editForm.value.areas.splice(index, 1)
}

// Save profile changes
const saveProfile = async () => {
  isSubmitting.value = true

  try {
    // Parse languages from comma-separated input
    const languages = languagesInput.value.split(',')
      .map(lang => lang.trim())
      .filter(lang => lang.length > 0)

    // Transform areas to match the API's expected format
    const transformedAreas = editForm.value.areas.map(area => ({
      area_id: area.id, // API expects area_id, not id
      experience_score: area.experience_score
    }))

    // Prepare update data
    const updateData = {
      name: editForm.value.name,
      title: editForm.value.title,
      email: editForm.value.email,
      phone: editForm.value.phone,
      city: editForm.value.city,
      bio: editForm.value.bio,
      image_url: editForm.value.imageUrl,
      languages,
      areas: transformedAreas // Use the transformed areas
    }


    // Update profile
    await updateProfile(updateData)

    // Exit edit mode
    editMode.value = false

    // Show success message
    success('Perfil actualizado', 'Tu perfil ha sido actualizado correctamente')
  } catch (err) {
    showError('Error al actualizar perfil', err instanceof Error ? err.message : 'Ocurrió un error')
  } finally {
    isSubmitting.value = false
  }
}

// Load profile data on mount
onMounted(async () => {
  if (user.value?.lawyer_id) {
    await fetchProfile()
    await fetchExperience()
  } else {
    showError('Error', 'No se pudo encontrar información de abogado asociada a tu cuenta')
  }
})
</script>