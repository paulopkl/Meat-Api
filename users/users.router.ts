import * as restify from 'restify';
import { User } from './users.model';
import { ModelRouter } from '../common/model-router';
import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handler';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);
        this.on('beforeRender', document => {
            document.password = undefined;
            // Delete document.password;
        });
    }

    findByEmail = (req, res, next) => {
        const { email } = req.query;

        if (email) {
            User.findByEmail(email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(res, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next);
        } else {
            next();
        }
    }

    applyRoutes(app: restify.Server) {
        app.get(
            { path: `${this.basePath}`, version: '2.0.0' }, 
            [authorize('admin'), this.findByEmail, this.findAll]
        );
        app.get({ path: `${this.basePath}`, version: '1.0.0' }, [authorize('admin'), this.findAll]);
        app.get(`${this.basePath}/:_id`, [authorize('admin'), this.validateId, this.findById]);
        app.post(`${this.basePath}`, [authorize('admin'), this.save]);
        app.put(`${this.basePath}/:_id`, [authorize('admin', 'user'), this.validateId, this.replace]);
        app.patch(`${this.basePath}/:_id`, [authorize('admin', 'user'), this.validateId, this.update]);
        app.del(`${this.basePath}/:_id`, [authorize('admin'), this.validateId, this.remove]);
        
        app.post(`${this.basePath}/authenticate`, authenticate);
    }

}

const usersRouter = new UsersRouter();

export { usersRouter }
