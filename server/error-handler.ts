import { Request, Response } from 'restify';

const handleError = (req: Request, res: Response, err, done) => {
    
    err.toJSON = () => ({ message: err.message });

    switch (err.name) {
        case 'MongoError': {
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        }
        case 'ValidationError': {
            err.statusCode = 400;
            const messages: any[] = [];

            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }

            err.toJSON = () => ({ 
                messages: "Validation error while processing your requesting!",
                errors: messages 
            });

            break;
        }
    }

    done();
}

export { handleError };