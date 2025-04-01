<template>
    <div 
      class="bg-white rounded-lg shadow-sm border p-6"
      :class="{ 'border-primary-500': isOwnAnswer }"
    >
      <!-- Answer content -->
      <div class="prose max-w-none mb-4">
        <p>{{ answer.content }}</p>
      </div>
      
      <!-- Author info -->
      <div class="flex items-center justify-between border-t pt-4">
        <div class="flex items-center">
          <div
            v-if="answer.author.imageUrl"
            class="w-10 h-10 rounded-full overflow-hidden mr-3"
          >
            <img 
              :src="answer.author.imageUrl" 
              :alt="answer.author.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div 
            v-else
            class="w-10 h-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center mr-3"
          >
            {{ answer.author.name.charAt(0) }}
          </div>
          
          <div>
            <div class="flex items-center">
              <span class="font-medium">{{ answer.author.name }}</span>
              <span 
                v-if="isOwnAnswer" 
                class="ml-2 px-1.5 py-0.5 bg-primary-100 text-primary-800 text-xs rounded"
              >
                Tú
              </span>
              <span 
                v-else-if="answer.author.isVerified"
                class="ml-2 flex items-center text-sm text-green-600"
              >
                <CheckCircle class="w-4 h-4 mr-1" />
                Verificado
              </span>
            </div>
            <div class="text-sm text-gray-500">
              <span>{{ answer.author.title }}</span>
              <span v-if="answer.date"> • {{ formatDate(answer.date) }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center">
          <!-- Reply button for non-own answers -->
          <button 
            v-if="!isOwnAnswer && !showReplyForm"
            @click="$emit('reply', answer.id)"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Responder
          </button>
          
          <!-- Edit & Delete for own answers -->
          <div v-if="isOwnAnswer" class="flex items-center space-x-2">
            <button 
              @click="$emit('edit', answer.id)"
              class="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              title="Editar respuesta"
            >
              <Edit class="w-4 h-4 mr-1" />
              <span class="hidden sm:inline">Editar</span>
            </button>
            
            <button 
              @click="confirmDelete"
              class="text-red-600 hover:text-red-700 text-sm flex items-center"
              title="Eliminar respuesta"
            >
              <Trash2 class="w-4 h-4 mr-1" />
              <span class="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Reply form -->
      <div 
        v-if="showReplyForm"
        class="mt-4 pt-4 border-t"
      >
        <textarea
          v-model="replyContent"
          rows="3"
          placeholder="Escribe tu respuesta aquí..."
          class="form-input"
          required
        ></textarea>
        
        <div class="flex justify-end mt-2 space-x-2">
          <button
            @click="$emit('cancel-reply')"
            class="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmitReply"
            class="px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
            :disabled="!replyContent.trim() || isSubmitting"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </div>
      
      <!-- Replies -->
      <div v-if="answer.replies && answer.replies.length > 0" class="mt-4 pt-4 border-t">
        <div class="space-y-4">
          <div 
            v-for="reply in answer.replies" 
            :key="reply.id"
            class="bg-gray-50 rounded-md p-4"
          >
            <p class="text-sm mb-2">{{ reply.content }}</p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center">
                <span class="font-medium">{{ reply.author.name }}</span>
                <span v-if="reply.date" class="ml-1">• {{ formatDate(reply.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete confirmation modal -->
      <div 
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <h3 class="text-lg font-bold mb-3">¿Eliminar respuesta?</h3>
          <p class="text-gray-600 mb-6">Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar tu respuesta?</p>
          
          <div class="flex gap-3">
            <button 
              @click="showDeleteConfirm = false"
              class="flex-1 bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            
            <button 
              @click="handleDelete"
              class="flex-1 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
              :disabled="isDeleting"
            >
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { CheckCircle, Edit, Trash2 } from 'lucide-vue-next'
  
  interface AnswerAuthor {
    id: string;
    name: string;
    title?: string;
    imageUrl?: string;
    isVerified?: boolean;
  }
  
  interface Reply {
    id: string;
    content: string;
    date: string;
    author: AnswerAuthor;
  }
  
  interface Answer {
    id: string;
    questionId: string;
    content: string;
    date: string;
    lawyerId?: string;
    author: AnswerAuthor;
    isAccepted?: boolean;
    helpfulCount?: number;
    isHelpful?: boolean;
    replies?: Reply[];
  }
  
  const props = defineProps<{
    answer: Answer;
    isOwnAnswer?: boolean;
    showReplyForm?: boolean;
  }>()
  
  const emit = defineEmits(['reply', 'edit', 'delete', 'submit-reply', 'cancel-reply'])
  
  // Form state
  const replyContent = ref('')
  const isSubmitting = ref(false)
  
  // Delete confirmation state
  const showDeleteConfirm = ref(false)
  const isDeleting = ref(false)
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) {
      return 'Ahora mismo'
    } else if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
    } else {
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date)
    }
  }
  
  // Submit reply
  const handleSubmitReply = () => {
    if (!replyContent.value.trim()) return
    
    emit('submit-reply', {
      answerId: props.answer.id,
      content: replyContent.value.trim()
    })
    
    replyContent.value = ''
  }
  
  // Show delete confirmation
  const confirmDelete = () => {
    showDeleteConfirm.value = true
  }
  
  // Handle delete
  const handleDelete = () => {
    isDeleting.value = true
    emit('delete', props.answer.id)
    showDeleteConfirm.value = false
    isDeleting.value = false
  }
  </script>