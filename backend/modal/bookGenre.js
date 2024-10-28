import mongoose from 'mongoose';

const bookGenreSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const BookGenre = mongoose.model('BookGenre', bookGenreSchema);

export default BookGenre