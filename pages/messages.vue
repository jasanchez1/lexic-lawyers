<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Mensajes</h1>
    
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500">Cargando conversaciones...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
      {{ error }}
    </div>
    
    <div v-else-if="conversations.length === 0" class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <p class="text-gray-500 mb-4">No hay mensajes para mostrar.</p>
      <p class="text-sm text-gray-400">Cuando tus clientes te contacten, encontrarás sus mensajes aquí.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Conversations List -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="font-medium">Conversaciones</h2>
        </div>
        
        <div class="divide-y max-h-[70vh] overflow-y-auto">
          <button
            v-for="conversation in conversations"
            :key="conversation.id"
            class="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50': selectedConversation?.id === conversation.id }"
            @click="selectConversation(conversation)"
          >
            <div class="flex items-center">
              <div v-if="conversation.client?.imageUrl" class="mr-3">
                <img
                  :src="conversation.client.imageUrl"
                  :alt="conversation.client.name"
                  class="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div v-else class="h-10 w-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-3">
                {{ getInitials(conversation.client?.name || 'Usuario') }}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline">
                  <p class="font-medium truncate">{{ conversation.client?.name || 'Usuario' }}</p>
                  <span class="text-xs text-gray-500">{{ formatDate(conversation.lastMessageDate || new Date().toISOString()) }}</span>
                </div>
                <p class="text-sm text-gray-500 truncate">
                  <span v-if="conversation.unreadCount" class="inline-block bg-primary-600 text-white text-xs rounded-full px-1.5 mr-1">
                    {{ conversation.unreadCount }}
                  </span>
                  {{ conversation.lastMessage || 'No hay mensajes' }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Conversation Detail -->
      <div class="lg:col-span-2">
        <div v-if="!selectedConversation" class="bg-white rounded-lg shadow-sm border p-8 text-center h-full flex flex-col items-center justify-center">
          <div class="text-gray-400 mb-4">
            <MessageCircle class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
          <p class="text-gray-600">Elige una conversación de la lista para ver los mensajes</p>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow-sm border h-full flex flex-col">
          <!-- Conversation Header -->
          <div class="p-4 border-b flex items-center justify-between">
            <div class="flex items-center">
              <div v-if="selectedConversation.client?.imageUrl" class="mr-3">
                <img
                  :src="selectedConversation.client.imageUrl"
                  :alt="selectedConversation.client.name"
                  class="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div v-else class="h-10 w-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-3">
                {{ getInitials(selectedConversation.client?.name || 'Usuario') }}
              </div>
              
              <div>
                <h3 class="font-medium">{{ selectedConversation.client?.name || 'Usuario' }}</h3>
                <p class="text-xs text-gray-500">{{ selectedConversation.client?.email || '' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Messages List -->
          <div 
            ref="messagesContainer"
            class="flex-1 p-4 overflow-y-auto flex flex-col gap-4"
            style="max-height: 60vh;"
          >
            <div v-if="isLoadingMessages" class="text-center py-4">
              <div class="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <template v-else-if="currentMessages.length > 0">
              <div v-for="(message, index) in currentMessages" :key="message.id" class="flex flex-col">
                <!-- Date separator -->
                <div 
                  v-if="index === 0 || shouldShowDateSeparator(message, currentMessages[index - 1])" 
                  class="text-center my-2"
                >
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {{ formatMessageDate(message.timestamp) }}
                  </span>
                </div>
                
                <!-- Message bubble -->
                <div 
                  class="max-w-[75%] rounded-lg p-3 mb-1"
                  :class="[
                    message.fromLawyer ? 
                      'bg-primary-100 text-primary-800 self-end' : 
                      'bg-white border border-gray-200 self-start'
                  ]"
                >
                  {{ message.content }}
                </div>
                
                <!-- Timestamp -->
                <div 
                  class="text-xs text-gray-500 mb-2"
                  :class="[message.fromLawyer ? 'self-end' : 'self-start']"
                >
                  {{ formatMessageTime(message.timestamp) }}
                </div>
              </div>
            </template>
            
            <div v-else class="text-center py-8 text-gray-500">
              <p>No hay mensajes en esta conversación.</p>
              <p class="text-sm mt-2">Envía un mensaje para comenzar la conversación.</p>
            </div>
          </div>
          
          <!-- Message Input -->
          <div class="p-4 border-t">
            <div class="flex gap-2">
              <textarea
                v-model="newMessage"
                placeholder="Escribe un mensaje..."
                class="flex-1 resize-none rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                rows="2"
                @keypress.enter.exact.prevent="sendMessage"
              ></textarea>
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import { useMessaging } from '~/composables/useMessaging'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  middleware: ['lawyer-auth']
})

// Messaging state
const { 
  conversations, 
  currentMessages,
  isLoading,
  isLoadingMessages,
  error,
  fetchConversations,
  fetchMessages,
  sendNewMessage,
  markConversationAsRead
} = useMessaging()

const { success, error: showError } = useNotifications()

const selectedConversation = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

// Select a conversation
const selectConversation = async (conversation) => {
  selectedConversation.value = conversation
  
  // Clear new message when changing conversations
  newMessage.value = ''
  
  // Fetch messages for the selected conversation
  if (conversation) {
    try {
      await fetchMessages(conversation.id)
      
      // Mark conversation as read
      if (conversation.unreadCount) {
        await markConversationAsRead(conversation.id)
      }
      
      // Scroll to bottom after messages load
      await nextTick()
      scrollToBottom()
    } catch (err) {
      showError('Error', 'No se pudieron cargar los mensajes')
    }
  }
}

// Send a new message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  try {
    await sendNewMessage(selectedConversation.value.id, newMessage.value)
    newMessage.value = ''
    
    // Scroll to bottom after sending
    await nextTick()
    scrollToBottom()
  } catch (err) {
    showError('Error', 'No se pudo enviar el mensaje')
  }
}

// Helper to scroll messages container to bottom
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Get initials from a name
const getInitials = (name) => {
  if (!name) return '?'
  
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substr(0, 2)
    .toUpperCase()
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' })
  } else {
    return date.toLocaleDateString()
  }
}

// Format message date for display
const formatMessageDate = (timestamp) => {
  if (!timestamp) return 'Fecha desconocida'
  
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer'
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }
}

// Format message time for display
const formatMessageTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

// Determine if we should show a date separator
const shouldShowDateSeparator = (currentMessage, previousMessage) => {
  if (!previousMessage || !currentMessage) return true
  
  const currentDate = new Date(currentMessage.timestamp).toDateString()
  const previousDate = new Date(previousMessage.timestamp).toDateString()
  return currentDate !== previousDate
}

// Watch for changes in messages container to scroll to bottom
watch(currentMessages, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

// Load data on mount
onMounted(async () => {
  try {
    await fetchConversations()
    
    // Select first conversation if there are any
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0])
    }
  } catch (err) {
    showError('Error', 'No se pudieron cargar las conversaciones')
  }
})
</script>