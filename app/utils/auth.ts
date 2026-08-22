import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export interface AuthPayload extends JWTPayload {
    username: string;
    role: string;
}

export async function createJWT(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h') // Token expires in 2 hours
        .sign(SECRET_KEY);
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as AuthPayload;
    } catch (error) {
        return null; // Token is invalid or expired
    }
}