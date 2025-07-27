import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';


export function createAccessToken(payload: object) {
  const config = useRuntimeConfig();
  const secret = config.jwtAccessSecret;
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}


export function createRefreshToken(payload: object) {
  const config = useRuntimeConfig();
  const secret = config.jwtRefreshSecret;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

// Валидирует access token
export function verifyAccessToken(token: string): JwtPayload | string {
  const config = useRuntimeConfig();
  const secret = config.jwtAccessSecret;
  return jwt.verify(token, secret);
}

// Валидирует refresh token
export function verifyRefreshToken(token: string): JwtPayload | string {
  const config = useRuntimeConfig();
  const secret = config.jwtRefreshSecret;
  return jwt.verify(token, secret);
}
