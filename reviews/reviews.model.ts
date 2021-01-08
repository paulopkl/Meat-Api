import { Document, Schema, model, Types } from 'mongoose';
import { User } from '../users/users.model';
import { Restaurant } from '../restaurants/restaurants.model';

interface Review extends Document {
    date: Date;
    rating: number;
    comments: string;
    restaurant: Types.ObjectId | Restaurant; // Represents a Type
    user: Types.ObjectId | User;
}

const reviewSchema = new Schema({
    date: {
        type: Date,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    comments: {
        type: String,
        required: true,
        maxlength: 500
    },

    restaurant: {
        type: Schema.Types.ObjectId, // Referers to ObjectID of Restaurant
        ref: 'Restaurant', // Used in the "populate" method
        required: true
    },

    user: {
        type: Schema.Types.ObjectId, // Referers to ObjectID of Restaurant
        ref: 'User', // Used in the "populate" method
        required: true
    }
});

const Review = model<Review>('Review', reviewSchema);

export { Review }