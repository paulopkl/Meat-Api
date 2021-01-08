import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';

const mpContentType = "application/merge-patch+json";

const mergePatchBodyParser = (req: restify.Request, res: restify.Response, next) => {
    if (req.getContentType() === mpContentType && req.method === "PATCH") {
        let { body } = req;
        (<any>req).rawBody = body;
        try {
            req.body = JSON.parse(body);
        } catch(err) {
            return next(new BadRequestError(`Invalid Content: ${err.message}`));
        }
    }
    return next();
}

export { mergePatchBodyParser }