/**
 * Utility functions for managing auth tokens across domains
 */

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
    if (!process.client) return null;
    
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
   * Get the access token from any available source
   * This handles both storage formats across the sites
   */
  export const getAccessToken = () => {
    if (!process.client) return null;
    
    // Try cookie first
    const cookieToken = getCookie('accessToken');
    if (cookieToken) return cookieToken;
    
    // Try current site's localStorage format
    const directToken = localStorage.getItem('accessToken');
    if (directToken) return directToken;
    
    // Try parent site's localStorage format (JSON structure)
    const authTokensJson = localStorage.getItem('auth_tokens');
    if (authTokensJson) {
      try {
        const authTokens = JSON.parse(authTokensJson);
        return authTokens.access_token;
      } catch (e) {
        console.error('Error parsing auth_tokens from localStorage', e);
      }
    }
    
    return null;
  };
  
  /**
   * Get the refresh token from any available source
   * This handles both storage formats across the sites
   */
  export const getRefreshToken = () => {
    if (!process.client) return null;
    
    // Try cookie first
    const cookieToken = getCookie('refreshToken');
    if (cookieToken) return cookieToken;
    
    // Try current site's localStorage format
    const directToken = localStorage.getItem('refreshToken');
    if (directToken) return directToken;
    
    // Try parent site's localStorage format (JSON structure)
    const authTokensJson = localStorage.getItem('auth_tokens');
    if (authTokensJson) {
      try {
        const authTokens = JSON.parse(authTokensJson);
        return authTokens.refresh_token;
      } catch (e) {
        console.error('Error parsing auth_tokens from localStorage', e);
      }
    }
    
    return null;
  };
  
  /**
   * Store tokens in a way that both applications can understand
   */
  export const storeTokens = (accessToken: string, refreshToken: string) => {
    if (!process.client) return;
    
    const rootDomain = getRootDomain();
    
    // Set cookies at root domain level for sharing
    setCookie('accessToken', accessToken, 1, rootDomain);
    setCookie('refreshToken', refreshToken, 30, rootDomain);
    
    // Store in current site format (direct keys)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Also store in parent site format (JSON structure)
    const authTokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 1800, // Default to 30 min
      token_type: 'bearer',
      user_id: '', // This will be filled by the parent app if needed
      expires_at: new Date(Date.now() + 1800 * 1000).toISOString()
    };
    
    localStorage.setItem('auth_tokens', JSON.stringify(authTokens));
  };
  
  /**
   * Clear all tokens from all storage locations
   */
  export const clearTokens = () => {
    if (!process.client) return;
    
    const rootDomain = getRootDomain();
    
    // Clear cookies
    deleteCookie('accessToken', rootDomain);
    deleteCookie('refreshToken', rootDomain);
    
    // Clear current site format
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear parent site format
    localStorage.removeItem('auth_tokens');
  };