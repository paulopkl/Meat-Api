import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import { NotAuthorizedError } from 'restify-errors';
import { User } from '../users/users.model';
import { environment } from '../common/environment';

const tokenParser: restify.RequestHandler = (req, res, next) => {
    const token = extractToken(req);

    if (token) {
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));
    } else {
        next()
    }
}

function extractToken(req: restify.Request) {
    // Authorization: Bearer TOKEN
    let token = undefined;
    const authorization = req.header('authorization');

    if (authorization) {
        const parts: string[] = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    return token;
}

function applyBearer(req: restify.Request, next): (error, decoded) => void {
    return (error, decoded) => {
        if (decoded) {
            User.findByEmail(decoded.sub)
                .then(user => {
                    if (user) {
                        // associate the user in the request
                        req.authenticated = user; // 
                    }

                    next();
                })
                .catch(next);
        } else {
            next();
        }
    }
}

export { tokenParser }