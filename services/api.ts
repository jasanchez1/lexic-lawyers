import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
} from "~/utils/cookies";

export class ApiService {
  protected async request<T>(
    endpoint: string,
    method: string = "GET",
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<T> {
    // Get base URL from runtime config
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseUrl || "http://localhost:8000";

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Only add authorization header in client-side
    if (process.client) {
      const token = getAccessToken();
      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const url = `${BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      credentials: "include", // Include cookies in request (for cross-origin requests)
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    try {
      console.log(
        `API Request: ${method} ${endpoint}`,
        data ? "With data" : "No data"
      );
      const response = await fetch(url, options);

      // Check if the response is 401 Unauthorized
      if (response.status === 401 && process.client) {
        console.log("Received 401 unauthorized, attempting token refresh");
        // Try to refresh the token
        const refreshed = await this.refreshToken();

        if (refreshed) {
          console.log("Token refreshed, retrying original request");
          // Retry the request with the new token
          return this.request(endpoint, method, data, headers);
        } else {
          console.log("Token refresh failed, redirecting to login");
          // Redirect to login
          window.location.href = "/login";
          throw new Error("Sesión expirada");
        }
      }

      // Check for other error responses
      if (!response.ok) {
        console.error(
          "API Error response:",
          response.status,
          response.statusText
        );
        let errorData: any = {};

        try {
          errorData = await response.json();
          console.error("Error data:", errorData);
        } catch (e) {
          console.error("Failed to parse error response");
        }

        // Create a more meaningful error message
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (response.status === 401) {
          errorMessage = "Usuario o contraseña incorrectos";
        } else if (response.status === 403) {
          errorMessage = "No tienes permisos para realizar esta acción";
        } else if (response.status === 404) {
          errorMessage = "Recurso no encontrado";
        } else if (response.status === 500) {
          errorMessage = "Error interno del servidor";
        }

        throw new Error(errorMessage);
      }

      // Parse response as JSON or return empty object if no content
      if (response.status !== 204) {
        const jsonResponse = await response.json();
        return jsonResponse as T;
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Method specifically for handling FormData requests
   * Similar to request() but doesn't set Content-Type (browser sets it with boundary)
   */
  protected async requestFormData<T>(
    endpoint: string,
    method: string = "POST",
    formData: FormData,
    headers: Record<string, string> = {}
  ): Promise<T> {
    // Get base URL from runtime config
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseUrl || "http://localhost:8000";

    const defaultHeaders: Record<string, string> = {
      ...headers,
    };

    // Only add authorization header in client-side
    if (process.client) {
      const token = getAccessToken();
      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const url = `${BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      credentials: "include", // Include cookies in request
      body: formData,
    };

    try {
      console.log(`API FormData Request: ${method} ${endpoint}`);
      const response = await fetch(url, options);

      // Check if the response is 401 Unauthorized
      if (response.status === 401 && process.client) {
        console.log("Received 401 unauthorized during form upload, attempting token refresh");
        // Try to refresh the token
        const refreshed = await this.refreshToken();

        if (refreshed) {
          console.log("Token refreshed, retrying FormData request");
          // Retry the request with the new token
          return this.requestFormData(endpoint, method, formData, headers);
        } else {
          console.log("Token refresh failed, redirecting to login");
          // Redirect to login
          window.location.href = "/login";
          throw new Error("Sesión expirada");
        }
      }

      // Check for other error responses
      if (!response.ok) {
        console.error(
          "API Error response:",
          response.status,
          response.statusText
        );
        let errorData: any = {};

        try {
          const errorText = await response.text();
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { detail: errorText };
          }
          console.error("Error data:", errorData);
        } catch (e) {
          console.error("Failed to parse error response");
        }

        // Create a more meaningful error message
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        throw new Error(errorMessage);
      }

      // Parse response as JSON or return empty object if no content
      if (response.status !== 204) {
        const jsonResponse = await response.json();
        return jsonResponse as T;
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error(`API FormData Error: ${endpoint}`, error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    if (!process.client) return false;

    // Get config for base URL
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseUrl || "http://localhost:8000";

    // Get refresh token
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      console.log("No refresh token available for refresh attempt");
      return false;
    }

    try {
      console.log("Sending refresh token request");
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: "include", // Include cookies in request
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          "Refresh token response:",
          data ? "Success" : "Empty response"
        );

        if (data.access_token && data.refresh_token) {
          // Store tokens in the same format as main site
          storeTokens(data.access_token, data.refresh_token, data.expires_in);
          return true;
        } else {
          console.error("Refresh token response missing tokens");
          clearTokens();
          return false;
        }
      } else {
        console.error(
          "Refresh token request failed:",
          response.status,
          response.statusText
        );
        // If refresh fails, clear tokens
        clearTokens();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);

      // Clear tokens
      clearTokens();

      return false;
    }
  }
}