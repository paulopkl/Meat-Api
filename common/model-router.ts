import { Router } from './router';
import { Model, Document, Types, DocumentQuery } from 'mongoose';
import { NotFoundError } from 'restify-errors';

abstract class ModelRouter<D extends Document> extends Router {

    basePath: string;
    pageSize: number = 2;

    constructor(protected model: Model<D>) {
        super();
        this.basePath = `/${model.collection.name}`
    }

    protected prepareOne = (query: DocumentQuery<D, D>): DocumentQuery<D, D> => query;

    envelope(document: any): any {
        let resource = Object.assign({ _links: {  } }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }

    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            _links: { self: `${options.url}` },
            items: documents,
        }

        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }

            const remaining = options.count - (options.page * options.pageSize);
            
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }

        }

        return resource;
    }

    validateId = (req, res, next) => {
        const _id = req.params._id;

        if (!Types.ObjectId.isValid(_id)) {
            next(new NotFoundError('Document Not Found!!'));
        } else {
            next();
        }
    }

    findAll = (req, res, next) => {
        // const { url } = req;
        let page = parseInt(req.query._page) || 1;
        page = page > 0 ? page : 1;

        const skip = (page - 1) * this.pageSize;

        this.model.count({})
            .exec()
            .then(count => {
                this.model.find()
                    .skip(skip) // Skip 4, 8, 12 registers
                    .limit(this.pageSize) // Limit is equals to 4
                    .then(this.renderAll(res, next, { 
                        page,
                        count,
                        pageSize: this.pageSize,
                        url: req.url
                    }))
                    .catch(next);
            })
            .catch(next);
    }

    findById = (req, res, next) => {
        const { _id } = req.params;
        
        this.prepareOne(this.model.findById(_id))
            .then(this.render(res, next))
            .catch(next);
    }

    save = (req, res, next) => {
        const body = req.body;

        let document = new this.model(body);

        document.save()
            .then(this.render(res, next))
            .catch(next);
    }

    replace = (req, res, next) => {
        const { _id } = req.params;
        const body = req.body;

        // const user = new this.model();
        (<any>this.model).update({ _id }, body, { overwrite: true, runValidators: true }).exec()
            .then(result => {
                if (result.n) { // Hit a document
                    return this.prepareOne(this.model.findById(_id))
                } else {
                    throw new NotFoundError('Document not found!');
                }
            })
            .then(this.render(res, next))
            .catch(next);
    }

    update = (req, res, next) => {
        const { _id } = req.params;
        const body = req.body;

        this.model.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
            .then(this.render(res, next))
            .catch(next);
    }


    remove = (req, res, next) => {
        const { _id } = req.params;

        this.model.remove({ _id }).exec()
            .then((cmdResult: any) => {
                if (cmdResult.result.n) {
                    res.send(204);
                } else {
                    throw new NotFoundError('Document not found!');
                }
                return next();
            })
            .catch(next);
    }
}

export { ModelRouter }