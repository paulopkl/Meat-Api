import { Document, Schema, model } from 'mongoose';

interface MenuItem extends Document {
    name: string,
    price: number
}

interface Restaurant extends Document {
    name: string,
    menu: MenuItem[]
}

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

const restSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    }
});

const Restaurant = model<Restaurant>('Restaurant', restSchema);

export { Restaurant }