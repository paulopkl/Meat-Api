import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';


const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, res, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            req.log.debug('User %s is authorize with profiles %j on route %s. Required profiles %j',
                req.authenticated._id, req.authenticated.profiles, req.path, profiles);

            next();
        } else {
            if (req.authenticated) {
                req.log.debug('Permition Dinied for %s, Required profiles: %j. User profiles: %j',
                    req.authenticated._id, profiles, req.authenticated.profiles);
            }
            next(new ForbiddenError('Permition Denied!!'));
        }
    }
}

export { authorize }