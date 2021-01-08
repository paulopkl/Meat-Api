import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

abstract class Router extends EventEmitter {
    abstract applyRoutes(app: restify.Server);

    envelope(document: any): any {
        return document;
    }

    envelopeAll(documents: any[], options: any = {}): any {
        return documents;
    }

    render(res: restify.Response, next: restify.Next) {
        return document => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(this.envelope(document));
            } else {
                throw new NotFoundError('Document not found!');
            }
            return next(false);
        }
    }

    renderAll(res: restify.Response, next: restify.Next, options: any = {}) {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });

                res.json(this.envelopeAll(documents, options));
            } else {
                res.json(this.envelopeAll([]));
            }

            return next();
        }
    }
}

export { Router }