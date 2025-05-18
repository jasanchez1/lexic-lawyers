<template>
    <div class="space-y-4">
      <!-- Drag & Drop Area -->
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
          hasFile ? 'bg-gray-50' : ''
        ]"
      >
        <div class="space-y-2">
          <div v-if="hasFile" class="flex items-center justify-center text-gray-500">
            <FileCheck class="w-10 h-10 text-primary-500 mb-2" />
          </div>
          <div v-else class="flex items-center justify-center text-gray-500">
            <Upload class="w-10 h-10 text-gray-400 mb-2" />
          </div>
          
          <p v-if="hasFile" class="text-sm font-medium">
            {{ fileName }}
          </p>
          <div v-else>
            <p class="text-sm font-medium">
              {{ label || 'Arrastra y suelta tu archivo aquí' }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              o <span class="text-primary-600 cursor-pointer" @click="openFileDialog">selecciona un archivo</span>
            </p>
            <p v-if="acceptedFormats" class="text-xs text-gray-500 mt-2">
              Formatos aceptados: {{ formatDescription }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="acceptedFormats"
        @change="handleFileSelect"
      />
      
      <!-- File info and actions -->
      <div v-if="hasFile" class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Document class="w-5 h-5 text-gray-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700 truncate">
              {{ fileName }}
            </p>
            <p class="text-xs text-gray-500">
              {{ fileSize }}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            @click="removeFile"
            class="text-sm text-red-600 hover:text-red-700"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Upload, FileCheck, FileText, Trash2 } from 'lucide-vue-next'
  
  const props = defineProps({
    label: {
      type: String,
      default: ''
    },
    acceptedFormats: {
      type: String,
      default: ''
    },
    maxSizeInMB: {
      type: Number,
      default: 10
    },
    modelValue: {
      type: [File, null],
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'error'])
  
  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragging = ref(false)
  const file = ref<File | null>(null)
  const errorMessage = ref('')
  
  // Sync with v-model
  const hasFile = computed(() => props.modelValue !== null)
  const fileName = computed(() => props.modelValue?.name || '')
  const fileSize = computed(() => {
    if (!props.modelValue) return ''
    
    const size = props.modelValue.size
    if (size < 1024) {
      return `${size} bytes`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`
    }
  })
  
  const formatDescription = computed(() => {
    if (!props.acceptedFormats) return ''
    
    return props.acceptedFormats
      .split(',')
      .map(format => format.trim().replace('.', '').toUpperCase())
      .join(', ')
  })
  
  // Methods
  const openFileDialog = () => {
    if (fileInput.value) {
      fileInput.value.click()
    }
  }
  
  const validateFile = (file: File): boolean => {
    // Clear previous error
    errorMessage.value = ''
    
    // Check file size
    const maxSizeInBytes = props.maxSizeInMB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      errorMessage.value = `El archivo es demasiado grande. El tamaño máximo es ${props.maxSizeInMB} MB.`
      emit('error', errorMessage.value)
      return false
    }
    
    // Check file format if specified
    if (props.acceptedFormats) {
      const extension = `.${file.name.split('.').pop() || ''}`
      const formats = props.acceptedFormats.split(',').map(format => format.trim())
      
      if (!formats.some(format => format === extension || format === file.type)) {
        errorMessage.value = `Formato de archivo no aceptado. Por favor, use: ${formatDescription.value}.`
        emit('error', errorMessage.value)
        return false
      }
    }
    
    return true
  }
  
  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0]
      
      if (validateFile(selectedFile)) {
        emit('update:modelValue', selectedFile)
      } else {
        // Reset the input if validation fails
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      }
    }
  }
  
  const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    
    if (event.dataTransfer?.files.length) {
      const droppedFile = event.dataTransfer.files[0]
      
      if (validateFile(droppedFile)) {
        emit('update:modelValue', droppedFile)
      }
    }
  }
  
  const removeFile = () => {
    emit('update:modelValue', null)
    
    // Clear the input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // Clear error message
    errorMessage.value = ''
  }
  </script>