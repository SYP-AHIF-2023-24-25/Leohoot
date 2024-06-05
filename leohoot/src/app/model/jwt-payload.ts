export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
    username: string;
    preferred_username: string;
}