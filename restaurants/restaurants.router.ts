import { Server } from 'restify';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../common/model-router';
import { Restaurant } from './restaurants.model';
import { authorize } from '../security/authz.handler';

class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant);
    }

    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

    findMenu = (req, res, next) => {
        const { _id } = req.params;

        Restaurant.findById(_id, "+menu")
            .then(rest => {
                if (!rest) {
                    throw new NotFoundError('Restaurant not Found!!');
                } else {
                    res.json(rest.menu);
                    return next();
                }
            })
    }

    replaceMenu = (req, res, next) => {
        const { _id } = req.params;

        Restaurant.findById(_id)
            .then(rest => {
                if (!rest) {
                    throw new NotFoundError('Restaurant not Found!!');
                } else {
                    rest.menu = req.body;
                    return rest.save();
                }
            })
            .then(rest => {
                res.json(rest.menu)
            })
            .catch(next);
    }

    applyRoutes(app: Server) {
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:_id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [authorize('user'), this.save]);
        app.put(`${this.basePath}/:_id`, [this.validateId, this.replace]);
        app.patch(`${this.basePath}/:_id`, [this.validateId, this.update]);
        app.del(`${this.basePath}/:_id`, [this.validateId, this.remove]);

        // Restaurants
        app.get(`${this.basePath}/:_id/menu`, [this.validateId, this.findMenu]);
        app.put(`${this.basePath}/:_id/menu`, [this.validateId, this.replaceMenu]);
    }
}

const restaurantsRouter = new RestaurantsRouter();

export { restaurantsRouter }