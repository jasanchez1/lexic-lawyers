<template>
    <ClientOnly>
      <Teleport to="body">
        <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="handleBackdropClick">
          <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
            <!-- Modal panel -->
            <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <!-- Modal header -->
              <div v-if="title || $slots.header" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="flex items-center justify-between">
                  <slot name="header">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
                  </slot>
                  <button
                    v-if="showCloseButton"
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    @click="close"
                  >
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
  
              <!-- Modal body -->
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <slot></slot>
              </div>
  
              <!-- Modal footer -->
              <div v-if="$slots.footer || showFooter" class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <slot name="footer">
                  <button
                    v-if="confirmText"
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="confirm"
                  >
                    {{ confirmText }}
                  </button>
                  <button
                    v-if="cancelText"
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    @click="close"
                  >
                    {{ cancelText }}
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      </Teleport>
    </ClientOnly>
  </template>
  
  <script setup lang="ts">
  import { watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    persistent: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);
  
  // Close the modal
  const close = () => {
    emit('update:modelValue', false);
    emit('cancel');
  };
  
  // Confirm action
  const confirm = () => {
    emit('confirm');
    if (!props.persistent) {
      emit('update:modelValue', false);
    }
  };
  
  // Handle backdrop click (close modal if not persistent)
  const handleBackdropClick = (event: MouseEvent) => {
    // Only close if clicking directly on the backdrop
    if (event.target === event.currentTarget && !props.persistent) {
      close();
    }
  };
  
  // Prevent scrolling of the body when modal is open
  watch(() => props.modelValue, (value) => {
    // Only run on client side
    if (process.client) {
      if (value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }, { immediate: true });
  </script>