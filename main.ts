import { Server } from './server/server';
import { usersRouter } from './users/users.router';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { reviewsRouter } from './reviews/reviews.router';
import { mainRouter } from './main-router';

const server = new Server();

server.bootstrap([usersRouter, restaurantsRouter, reviewsRouter, mainRouter])
    .then(server => {
        console.log('Server is listening on: ', server.app.address());
    })
    .catch(err => {
        console.log('Server failed to starts');
        console.error(err);
        process.exit(1);
    });