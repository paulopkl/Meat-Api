import { Router } from './common/router';
import * as restify from 'restify';

class MainRouter extends Router {
    applyRoutes(app: restify.Server) {
        
        app.get('/', (req, res, next) => {
            res.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews',
                version: '1.0.0'
            });
        });

    }
}

const mainRouter = new MainRouter();

export { mainRouter }