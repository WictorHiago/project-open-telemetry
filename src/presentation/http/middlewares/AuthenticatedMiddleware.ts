import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        tenantId?: string;
        username?: string;
    }
}

export function AuthenticatedMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
): Response | void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: 'Token is required' });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return response.status(401).json({ message: 'Token invalid' });
    }

    try {
        const secretKey = process.env.SECRET_KEY!;
        const decoded = jwt.verify(token, secretKey) as {
            tenantId: string;
            username: string;
        };

        request.tenantId = decoded.tenantId;
        request.username = decoded.username;

        return next();
    } catch (error) {
        return response.status(401).json({ message: 'Token invalid' });
    }
}
