import mongoose from 'mongoose';

const bookCategorySchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const BookCategory = mongoose.model('BookCategory', bookCategorySchema);

export default BookCategory