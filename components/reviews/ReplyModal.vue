<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
                <h2 class="text-xl font-bold">Responder a la reseña</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Original review -->
            <div class="bg-gray-50 p-4 rounded-md mb-6">
                <div class="flex items-center mb-2">
                    <div class="flex">
                        <Star v-for="i in 5" :key="i" class="w-4 h-4"
                            :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'" />
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ formatDate(review.date) }}</span>
                </div>

                <h3 class="font-medium">{{ review.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ review.content }}</p>
                <p class="text-sm text-gray-500 mt-2">Por: {{ review.author }}</p>
            </div>

            <!-- Reply form -->
            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label for="reply" class="block text-sm font-medium text-gray-700 mb-2">
                        Tu respuesta
                    </label>
                    <textarea id="reply" v-model="replyContent" rows="6" class="form-input"
                        placeholder="Escribe tu respuesta aquí..." required></textarea>
                    <p class="mt-1 text-xs text-gray-500">
                        Tu respuesta será visible públicamente en tu perfil de abogado.
                    </p>
                </div>

                <div class="flex justify-end gap-3">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Cancelar
                    </button>

                    <button type="submit"
                        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                        :disabled="isSubmitting">
                        {{ isSubmitting ? 'Enviando...' : 'Publicar respuesta' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Star } from 'lucide-vue-next'

interface Review {
    id: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    author: string;
}

const props = defineProps<{
    show: boolean;
    review: Review;
}>()

const emit = defineEmits(['close', 'submit'])

const replyContent = ref('')
const isSubmitting = ref(false)

// Format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date)
}

// Handle form submission
const handleSubmit = async () => {
    if (!replyContent.value.trim()) return

    isSubmitting.value = true

    try {
        emit('submit', {
            reviewId: props.review.id,
            content: replyContent.value.trim()
        })

        // Reset form
        replyContent.value = ''
    } catch (error) {
        // Error handling is done at the parent component level
        console.error('Error submitting reply:', error)
    } finally {
        isSubmitting.value = false
    }
}
</script>