import * as restify from 'restify';
import { DocumentQuery } from 'mongoose';
import { ModelRouter } from '../common/model-router';
import { Review } from './reviews.model';

class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.restaurants._id ? document.restaurants._id : document.restaurant
        resource._links.menu = `${this.basePath}/${restId}`;
        return resource;
    }

    protected prepareOne = (query: DocumentQuery<Review, Review>): DocumentQuery<Review, Review> => {
        return query
            .populate('user', 'name') // Populate the user field with 
            .populate('restaurant', 'name')
    }

    // findById = (req, res, next) => {
    //     const { _id } = req.params;
        
    //     this.model.findById(_id)
    //         .populate('user', 'name') // Populate the user field with 
    //         .populate('restaurant', 'name')
    //         .then(this.render(res, next))
    //         .catch(next);
    // }

    applyRoutes(app: restify.Server) {
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:_id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, this.save);
    }

}



const reviewsRouter = new ReviewsRouter();

export { reviewsRouter }