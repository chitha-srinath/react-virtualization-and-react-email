// Token verification interfaces
export interface TokenVerificationResponse {
  error: boolean;
  message?: string;
  data?: {
    user?: User;
    token?: string;
  };
}

export interface TokenVerificationRequest {
  token: string;
}

// User interface for authentication
export interface User {
  id: string;
  userId: string;
  name: string;
  username?: string;
  email: string;
  role: "admin" | "user";
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: boolean;
  message?: string;
}

// Authentication API responses
export interface LoginResponse extends ApiResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface RefreshTokenResponse extends ApiResponse {
  token: string;
}

// Hook return types
export interface AuthQueryResult<T = unknown> {
  data?: T;
  isLoading: boolean;
  error?: Error | null;
  isError: boolean;
}
