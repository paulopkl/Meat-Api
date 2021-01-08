import * as restify from 'restify';
import * as mongoose from 'mongoose';
import * as corsMiddleware from 'restify-cors-middleware';

import { environment } from '../common/environment';
import { Router } from '../common/router';

import { mergePatchBodyParser } from './merge-patch.parser';

import { handleError } from './error-handler';

import { tokenParser } from '../security/token.parser';

import { logger } from '../common/logger';

import * as fs from 'fs';

const { port } = environment.server;
const { url } = environment.db;

class Server {
    
    app: restify.Server;

    initializeDb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(url, {
            useMongoClient: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                const options: restify.ServerOptions = {
                    name: "meat-api",
                    version: "1.0.0",
                    log: logger
                }

                if (environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate);
                    options.key = fs.readFileSync(environment.security.key);
                }

                this.app = restify.createServer(options);

                const corsOptions: corsMiddleware.Options = {
                    preflightMaxAge: (60 * 60) * 24,
                    origins: ["*"],
                    allowHeaders: ["authorization"],
                    exposeHeaders: ["x-custom-header"]
                };

                const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions);

                this.app.pre(cors.preflight);
                
                this.app.pre(restify.plugins.requestLogger({ log: logger }));
                
                this.app.pre(cors.actual);
                
                this.app.use(restify.plugins.queryParser()); // Inserts Query Params
                this.app.use(restify.plugins.bodyParser()); // Allows application/json
                this.app.use(mergePatchBodyParser); // Allows application/json
                this.app.use(tokenParser);

                // Routes
                for (let router of routers) {
                    router.applyRoutes(this.app);
                }

                this.app.listen(port, () => {
                    resolve(this.app);
                    console.log(`API is running on http://localhost:${port}`);
                });

                this.app.on('restifyError', handleError);

            } catch (err) {
                reject(err);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> { 
        return this.initializeDb()
            .then(() => this.initRoutes(routers)
                .then(() => this)
            );
    }

    shutdown() {
        return mongoose.disconnect()
            .then(() => this.app.close());
    }

}



export { Server };