<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Preguntas por Responder</h1>

            <div class="flex items-center space-x-4">
                <select v-model="filters.area" class="form-input text-sm py-2">
                    <option value="">Todas las áreas</option>
                    <option v-for="area in practiceAreas" :key="area.id" :value="area.id">
                        {{ area.name }}
                    </option>
                </select>

                <select v-model="filters.status" class="form-input text-sm py-2">
                    <option value="unanswered">Sin responder</option>
                    <option value="answered">Respondidas</option>
                    <option value="all">Todas</option>
                </select>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-8">
            <div
                class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4">
            </div>
            <p class="text-gray-500">Cargando preguntas...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
            {{ error }}
        </div>

        <div v-else-if="questions.length === 0" class="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p class="text-gray-500 mb-4">No hay preguntas para mostrar con los filtros actuales.</p>
            <button @click="resetFilters" class="text-primary-600 hover:text-primary-700 font-medium">
                Quitar filtros
            </button>
        </div>

        <div v-else class="space-y-6">
            <QuestionsQuestionCard v-for="question in questions" :key="question.id" :question="question"
                @answer="handleAnswerQuestion" />

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center mt-8">
                <div class="flex space-x-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-2 rounded border" :class="[
                            currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50'
                        ]">
                        Anterior
                    </button>

                    <button v-for="page in paginationPages" :key="page" @click="changePage(page)"
                        class="px-3 py-2 rounded" :class="[
                            page === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                        ]">
                        {{ page }}
                    </button>

                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-3 py-2 rounded border" :class="[
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50'
                        ]">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuestions } from '~/composables/useQuestions'
import { useProfile } from '~/composables/useProfile'
import { useRouter } from 'vue-router'

definePageMeta({
    middleware: ['lawyer-auth']
})

const router = useRouter()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const filters = ref({
    area: '',
    status: 'unanswered'
})

// Get questions data
const {
    questions,
    totalQuestions,
    totalPages,
    isLoading,
    error,
    fetchQuestions
} = useQuestions()

// Get lawyer profile to know their practice areas
const { profile, fetchProfile } = useProfile()

// Computed property for practice areas
const practiceAreas = computed(() => {
    if (!profile.value) return []
    return profile.value.areas || []
})

// Compute pages for pagination
const paginationPages = computed(() => {
    if (totalPages.value <= 7) {
        // If 7 pages or less, show all pages
        return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    }

    let pages = []

    // Always include first and last page
    pages.push(1)

    // Show current page and nearby
    const startPage = Math.max(2, currentPage.value - 1)
    const endPage = Math.min(totalPages.value - 1, currentPage.value + 1)

    // Add ellipsis before startPage if needed
    if (startPage > 2) {
        pages.push('...')
    }

    // Add pages between start and end
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    // Add ellipsis after endPage if needed
    if (endPage < totalPages.value - 1) {
        pages.push('...')
    }

    // Add last page
    pages.push(totalPages.value)

    return pages
})

// Change page
const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
    fetchQuestions(
        filters.value.status,
        filters.value.area,
        currentPage.value,
        itemsPerPage
    )
}

// Handle answer question button
const handleAnswerQuestion = (questionId: string) => {
    if (!questionId) {
        console.error('No question ID provided for navigation');
        return;
    }
    
    // Use router.push to navigate with a proper route
    router.push(`/questions/${questionId}`);
}

// Reset filters
const resetFilters = () => {
    filters.value = {
        area: '',
        status: 'unanswered'
    }
}

// Watch filters changes to reload questions
watch(filters, () => {
    currentPage.value = 1 // Reset to first page
    fetchQuestions(
        filters.value.status,
        filters.value.area,
        currentPage.value,
        itemsPerPage
    )
}, { deep: true })

// Load data on mount
onMounted(async () => {
    await fetchProfile()

    await fetchQuestions(
        filters.value.status,
        filters.value.area,
        currentPage.value,
        itemsPerPage
    )
})
</script>