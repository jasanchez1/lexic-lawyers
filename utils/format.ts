/**
 * Format currency with CLP format
 * @param amount Amount to format
 * @returns Formatted amount string
 */
export function formatCurrency(amount: number): string {
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    });
  }
  
  /**
   * Format number with thousands separator
   * @param num Number to format
   * @returns Formatted number string
   */
  export function formatNumber(num: number): string {
    return num.toLocaleString('es-CL');
  }
  
  /**
   * Format percentage
   * @param value Percentage value (0-100)
   * @param decimals Number of decimal places
   * @returns Formatted percentage string
   */
  export function formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`;
  }
  
  /**
   * Format date in standard format (e.g., "12 de enero de 2023")
   * @param dateString Date string to format
   * @returns Formatted date string
   */
  export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
  
  /**
   * Format time (e.g., "14:30")
   * @param dateString Date string to format
   * @returns Formatted time string
   */
  export function formatTime(dateString: string): string {
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  /**
   * Format date and time (e.g., "12 de enero de 2023, 14:30")
   * @param dateString Date string to format
   * @returns Formatted date and time string
   */
  export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  /**
   * Format relative time (e.g., "hace 2 horas", "ayer", "hace 3 días")
   * @param dateString Date string to format
   * @returns Formatted relative time string
   */
  export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Justo ahora';
    } else if (diffMin < 60) {
      return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHour < 24) {
      return `Hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    } else if (diffDay < 7) {
      return `Hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`;
    } else {
      return formatDate(dateString);
    }
  }
  
  /**
   * Format a name to get initials (e.g., "John Doe" -> "JD")
   * @param name Full name
   * @param maxInitials Maximum number of initials to return
   * @returns Initials string
   */
  export function getInitials(name: string, maxInitials = 2): string {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .filter(Boolean)
      .slice(0, maxInitials)
      .join('');
  }
  
  /**
   * Truncate text to a maximum length and add ellipsis if needed
   * @param text Text to truncate
   * @param maxLength Maximum length
   * @returns Truncated text
   */
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  }