export interface AuthResponse {
    isAuthSuccessful: boolean;
    errorMessage: string;
    token: string;
}