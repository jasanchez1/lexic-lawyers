export interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
    lawyerId?: string | null;
    isLawyer: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface SignUpCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface UserUpdate {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  }
  
  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    userId: string;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }