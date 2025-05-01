/**
 * Set a cookie with domain support for cross-subdomain sharing
 */
export const setCookie = (name: string, value: string, days: number, domain: string = '') => {
    if (!process.client) return;
    
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    // Set domain to root domain to allow sharing between subdomains
    const domainString = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=${value}${expires}${domainString}; path=/; SameSite=Lax`;
  };
  
  /**
   * Get a cookie by name
   */
  export const getCookie = (name: string) => {
    if (!process.client) return null;
    
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  
  /**
   * Delete a cookie
   */
  export const deleteCookie = (name: string, domain: string = '') => {
    if (!process.client) return;
    
    // Set to expired date in the past to delete
    const domainString = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${domainString}; path=/;`;
  };
  
  /**
   * Get the root domain for cookie sharing
   * This extracts the domain name to ensure cookies can be shared across subdomains
   * Example: foo.example.com => example.com
   */
  export const getRootDomain = () => {
    if (!process.client) return '';
    
    const hostname = window.location.hostname;
    
    // For localhost, just return localhost
    if (hostname === 'localhost') return hostname;
    
    // For IP addresses, don't modify
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return hostname;
    
    // Extract the root domain (e.g., example.com from foo.example.com)
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname; // Already root domain
    
    // Get the last two parts (e.g., example.com)
    return parts.slice(-2).join('.');
  };
  
  /**
   * Get the token from either cookie or localStorage
   * This provides compatibility with both auth methods
   */
  export const getToken = () => {
    if (!process.client) return null;
    
    // Try cookie first, then localStorage
    return getCookie('accessToken') || localStorage.getItem('accessToken');
  };
  
  /**
   * Get the refresh token from either cookie or localStorage
   */
  export const getRefreshToken = () => {
    if (!process.client) return null;
    
    // Try cookie first, then localStorage
    return getCookie('refreshToken') || localStorage.getItem('refreshToken');
  };
  
  /**
   * Store tokens in both cookie and localStorage
   */
  export const storeTokens = (accessToken: string, refreshToken: string) => {
    if (!process.client) return;
    
    // Store in cookies with root domain for cross-subdomain sharing
    const rootDomain = getRootDomain();
    setCookie('accessToken', accessToken, 1, rootDomain); // 1 day expiry for access token
    setCookie('refreshToken', refreshToken, 30, rootDomain); // 30 days for refresh token
    
    // Also store in localStorage for older browsers or fallback
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };
  
  /**
   * Clear all auth tokens
   */
  export const clearTokens = () => {
    if (!process.client) return;
    
    // Clear cookies
    const rootDomain = getRootDomain();
    deleteCookie('accessToken', rootDomain);
    deleteCookie('refreshToken', rootDomain);
    
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };