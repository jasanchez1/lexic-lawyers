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
        <div class="h-48 bg-primary-100 relative">
          <img v-if="profile.coverImageUrl" :src="profile.coverImageUrl" alt="Cover photo"
            class="w-full h-full object-cover" />

          <div class="absolute left-6 -bottom-16">
            <div class="w-32 h-32 rounded-lg bg-white shadow-md overflow-hidden border-4 border-white">
              <img v-if="profile.image_url" :src="profile.image_url" :alt="profile.name"
                class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full bg-primary-100 flex items-center justify-center text-primary-800 text-4xl font-bold">
                {{ profile.name.charAt(0) }}
              </div>
            </div>
          </div>

          <div class="absolute top-4 right-4">
            <button
              class="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-md hover:bg-white transition-colors"
              @click="editMode = !editMode">
              {{ editMode ? 'Cancelar edición' : 'Editar perfil' }}
            </button>
          </div>
        </div>

        <div class="pt-20 pb-6 px-6">
          <div class="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 class="text-2xl font-bold">{{ profile.name }}</h2>
              <p class="text-gray-600">{{ profile.title }}</p>
            </div>

            <div class="mt-4 md:mt-0 flex items-center gap-4">
              <div class="flex">
                <Star v-for="i in 5" :key="i" class="w-5 h-5" :class="[
                  i <= Math.round(profile.review_score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                ]" />
              </div>
              <span class="text-gray-600">
                {{ profile.review_count }} {{ profile.review_count === 1 ? 'reseña' : 'reseñas' }}
              </span>
            </div>
          </div>
        </div>
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
                    <span class="text-sm text-gray-600">{{ getExperienceLevelName(area.experience_score) }}</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${area.experience_score}%` }"></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ getExperienceLevelDescription(area.experience_score) }}
                  </p>
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
            <div class="space-y-4">
              <div v-for="edu in education" :key="`${edu.institution}-${edu.year}`" class="flex items-start">
                <div class="mr-4">
                  <div class="w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center text-primary-700">
                    <GraduationCap class="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-medium">{{ edu.institution }}</h4>
                  <p class="text-gray-600">{{ edu.degree }}</p>
                  <p class="text-sm text-gray-500">{{ edu.year }}</p>
                  <p v-if="edu.honors" class="text-sm italic text-gray-600">{{ edu.honors }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Work Experience -->
          <div v-if="workExperience && workExperience.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Experiencia Laboral</h3>
            <div class="space-y-6">
              <div v-for="work in workExperience" :key="`${work.company}-${work.start_date}`" class="flex items-start">
                <div class="mr-4">
                  <div class="w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center text-primary-700">
                    <Briefcase class="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-medium">{{ work.role }}</h4>
                  <p class="text-gray-600">{{ work.company }}</p>
                  <p class="text-sm text-gray-500">
                    {{ work.start_date }} - {{ work.end_date || 'Presente' }}
                  </p>
                  <p v-if="work.description" class="text-gray-600 mt-2">{{ work.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Información de Contacto</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <Mail class="w-5 h-5 text-gray-400 mr-3" />
                <span>{{ profile.email }}</span>
              </div>
              <div class="flex items-center">
                <Phone class="w-5 h-5 text-gray-400 mr-3" />
                <span>{{ profile.phone || 'No especificado' }}</span>
              </div>
              <div class="flex items-center">
                <MapPin class="w-5 h-5 text-gray-400 mr-3" />
                <span>{{ profile.city || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <!-- Languages -->
          <div v-if="profile.languages && profile.languages.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Idiomas</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="lang in profile.languages" :key="lang"
                class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                {{ lang }}
              </span>
            </div>
          </div>

          <!-- Achievements -->
          <div v-if="achievements && achievements.length" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-bold mb-4">Logros y Reconocimientos</h3>
            <div class="space-y-4">
              <div v-for="achievement in achievements" :key="achievement.title" class="flex items-start">
                <Award class="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium">{{ achievement.title }}</p>
                  <p v-if="achievement.issuer" class="text-sm text-gray-600">{{ achievement.issuer }}</p>
                  <p v-if="achievement.year" class="text-xs text-gray-500">{{ achievement.year }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="bg-white rounded-lg shadow-sm border p-6">
        <form @submit.prevent="saveProfile">
          <div class="space-y-6">
            <!-- Personal Information -->
            <div>
              <h3 class="text-lg font-bold mb-4">Información Personal</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input id="name" v-model="editForm.name" type="text" class="form-input" required />
                </div>
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    Título Profesional Público
                  </label>
                  <input id="title" v-model="editForm.title" type="text" class="form-input"
                    placeholder="Ej: Abogado Civil, Abogada de Familia y Sucesiones" />
                  <p class="mt-1 text-xs text-gray-500">
                    Este título aparecerá en tu perfil público y ayudará a los clientes a entender tu especialización.
                  </p>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input id="email" v-model="editForm.email" type="email" class="form-input" required />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input id="phone" v-model="editForm.phone" type="tel" class="form-input" />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <UiCitySelect id="city" v-model="editForm.city" placeholder="Selecciona tu ciudad" />
                </div>
                <div>
                  <label for="languages" class="block text-sm font-medium text-gray-700 mb-1">
                    Idiomas (separados por coma)
                  </label>
                  <input id="languages" v-model="languagesInput" type="text" class="form-input"
                    placeholder="Español, Inglés, Francés" />
                </div>
              </div>
            </div>

            <!-- Bio -->
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea id="bio" v-model="editForm.bio" rows="6" class="form-input"></textarea>
            </div>

            <!-- Images -->
            <div>
              <h3 class="text-lg font-bold mb-4">Imágenes</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">
                    URL de Foto de Perfil
                  </label>
                  <input id="imageUrl" v-model="editForm.imageUrl" type="text" class="form-input"
                    placeholder="https://ejemplo.com/foto.jpg" />
                </div>
                <div>
                  <label for="coverImageUrl" class="block text-sm font-medium text-gray-700 mb-1">
                    URL de Foto de Portada
                  </label>
                  <input id="coverImageUrl" v-model="editForm.coverImageUrl" type="text" class="form-input"
                    placeholder="https://ejemplo.com/portada.jpg" />
                </div>
              </div>
            </div>

            <!-- Areas of Practice -->
            <div>
              <h3 class="text-lg font-bold mb-4">Áreas de Práctica</h3>
              <p class="text-sm text-gray-600 mb-4">
                Ajusta el nivel de experiencia para cada área o elimina áreas que ya no practicas.
              </p>

              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-bold mb-4">Áreas de Práctica</h3>
                <div v-if="profile.areas && profile.areas.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="area in profile.areas" :key="area.id"
                    class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-medium text-gray-900">{{ area.name }}</h4>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {{ getExperienceLevelName(area.experience_score) }}
                      </span>
                    </div>

                    <!-- Progress bar -->
                    <div class="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div class="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                        :style="{ width: `${area.experience_score}%` }"></div>
                    </div>

                    <p class="text-xs text-gray-600">
                      {{ getExperienceLevelDescription(area.experience_score) }}
                    </p>
                  </div>
                </div>
                <div v-else class="text-gray-500 text-center py-8">
                  <p>No hay áreas de práctica configuradas</p>
                </div>
              </div>

              <!-- Area selector -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <select v-model="newAreaId" class="form-input col-span-2">
                  <option value="">Seleccionar área de práctica</option>
                  <option v-for="area in availablePracticeAreas" :key="area.id" :value="area.id">
                    {{ area.name }}
                  </option>
                </select>
                <button type="button"
                  class="bg-primary-50 text-primary-700 px-4 py-2 rounded-md hover:bg-primary-100 transition-colors"
                  :disabled="!newAreaId" @click="addArea">
                  Agregar Área
                </button>
              </div>
            </div>

            <div class="border-t pt-6 flex justify-end space-x-3">
              <button type="button" @click="editMode = false"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button type="submit"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                :disabled="isSubmitting">
                {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </div>
        </form>
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
import { useExperienceLevels } from '~/composables/useExperienceLevels'

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
const { experienceLevels, getExperienceLevelName, getExperienceLevelDescription, mapToNearestLevel } = useExperienceLevels()

// Update the watch function that initializes editForm
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
      areas: [...(newProfile.areas || []).map(area => ({
        ...area,
        // Map existing scores to nearest valid level for editing
        experience_score: mapToNearestLevel(area.experience_score)
      }))]
    }

    // Update languages input
    languagesInput.value = (newProfile.languages || []).join(', ')
  }
})

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