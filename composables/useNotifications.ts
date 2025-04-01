import { ref, readonly } from 'vue'

interface Notification {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Shared state across components
const notification = ref<Notification>({
  show: false,
  type: 'info',
  message: '',
  duration: 5000
})

const unreadCount = ref(0)

// Timer for auto-dismissing notifications
let notificationTimer: NodeJS.Timeout | null = null

export function useNotifications() {
  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000
  ) => {
    // Clear any existing timer
    if (notificationTimer) {
      clearTimeout(notificationTimer)
    }
    
    // Show the notification
    notification.value = {
      show: true,
      type,
      message,
      duration
    }
    
    // Auto-dismiss after duration
    if (duration > 0) {
      notificationTimer = setTimeout(() => {
        closeNotification()
      }, duration)
    }
  }
  
  const closeNotification = () => {
    notification.value.show = false
  }
  
  // Helper functions for common notification types
  const success = (title: string, message?: string) => {
    showNotification('success', message || title)
  }
  
  const error = (title: string, message?: string) => {
    showNotification('error', message || title)
  }
  
  const warning = (title: string, message?: string) => {
    showNotification('warning', message || title)
  }
  
  const info = (title: string, message?: string) => {
    showNotification('info', message || title)
  }
  
  // Set the number of unread notifications
  const setUnreadCount = (count: number) => {
    unreadCount.value = count
  }
  
  return {
    notification: readonly(notification),
    unreadCount: readonly(unreadCount),
    showNotification,
    closeNotification,
    success,
    error,
    warning,
    info,
    setUnreadCount
  }
}