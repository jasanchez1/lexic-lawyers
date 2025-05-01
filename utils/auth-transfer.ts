/**
 * Utility functions for authentication transfer between domains
 */

/**
 * Process auth transfer parameters from URL
 * This function checks if auth tokens were passed via URL parameter
 * and stores them in localStorage if found
 */
export function processAuthTransfer() {
    if (!process.client) return false;
    
    try {
      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const authTransfer = urlParams.get('auth_transfer');
      
      if (authTransfer) {
        // Decode the auth tokens
        const authTokensJson = decodeURIComponent(authTransfer);
        
        // Store in localStorage
        localStorage.setItem('auth_tokens', authTokensJson);
        
        // Remove the auth_transfer parameter from URL (for security)
        const newUrl = window.location.pathname + 
          window.location.search.replace(/[?&]auth_transfer=[^&]+/, '') + 
          window.location.hash;
        
        // Replace the URL without reloading the page
        window.history.replaceState({}, document.title, newUrl);
        
        console.log('Authentication transferred successfully');
        return true;
      }
    } catch (error) {
      console.error('Error processing auth transfer:', error);
    }
    
    return false;
  }
  
  /**
   * Create a link to the lawyer panel with auth tokens
   * This function should be used in the main site to create
   * links to the lawyer portal that include authentication
   */
  export function createLawyerPanelLink(baseUrl = 'https://lawyers.lexic.cl') {
    if (!process.client) return baseUrl;
    
    // Get the auth tokens from localStorage
    const authTokensJson = localStorage.getItem('auth_tokens');
    
    if (!authTokensJson) {
      // No tokens, just return the regular URL
      return baseUrl;
    }
    
    try {
      // Create a token parameter by encoding the tokens
      const tokenParam = encodeURIComponent(authTokensJson);
      
      // Return URL with the token parameter
      return `${baseUrl}?auth_transfer=${tokenParam}`;
    } catch (error) {
      console.error('Error creating lawyer panel link:', error);
      return baseUrl;
    }
  }