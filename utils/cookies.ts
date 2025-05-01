/**
 * Utility functions for managing auth tokens compatible with main site
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
   * Get auth tokens from localStorage in the same format as the main site
   */
  export const getAuthTokens = () => {
    if (!process.client) return null;
    
    const authTokensJson = localStorage.getItem('auth_tokens');
    if (!authTokensJson) return null;
    
    try {
      return JSON.parse(authTokensJson);
    } catch (e) {
      console.error('Error parsing auth_tokens from localStorage', e);
      return null;
    }
  };
  
  /**
   * Get the access token compatible with main site
   */
  export const getAccessToken = () => {
    const tokens = getAuthTokens();
    return tokens?.access_token || null;
  };
  
  /**
   * Get the refresh token compatible with main site
   */
  export const getRefreshToken = () => {
    const tokens = getAuthTokens();
    return tokens?.refresh_token || null;
  };
  
  /**
   * Store tokens in the same format as main site
   */
  export const storeTokens = (accessToken: string, refreshToken: string, expiresIn = 1800) => {
    if (!process.client) return;
    
    // Calculate expiration time
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    
    // Create auth tokens object in the same format as main site
    const authTokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      token_type: 'bearer',
      user_id: '',
      expires_at: expiresAt
    };
    
    // Store in localStorage
    localStorage.setItem('auth_tokens', JSON.stringify(authTokens));
  };
  
  /**
   * Clear auth tokens
   */
  export const clearTokens = () => {
    if (!process.client) return;
    
    localStorage.removeItem('auth_tokens');
  };