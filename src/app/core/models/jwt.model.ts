export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; 
}

export interface JwtPayload {
  sub: string;
  email: string;
  phone: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginResponsePayload {
  success: boolean;
  message?: string;
  tokens?: JwtTokens;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    userInitial: string;
  };
}
