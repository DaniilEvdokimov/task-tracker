import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buba-i-lupa';
const JWT_EXPIRES_IN = '7d';

export function generateToken(payload: { userId: number }) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
	return jwt.verify(token, JWT_SECRET) as { userId: number };
}