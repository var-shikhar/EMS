import mongoose from 'mongoose';

const bookDetailSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BookCategory', 
        required: true 
    },
    genre: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BookGenre', 
        required: true 
    },
    ISBN: { 
        type: String, 
        unique: true, 
        required: true 
    },
    coverImage: { 
        type: String 
    },
    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tag' 
    }],
    author: { 
        type: String, 
        required: true 
    },
    addedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    totalQuantities: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    lostQuantities: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    availableQuantities: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    rentalPrice: { 
        type: Number, 
        required: true 
    },
    fine: { 
        type: Number 
    },
    description: {
        type: String,
    }
}, { timestamps: true });
  
const BookDetail = mongoose.model('BookDetail', bookDetailSchema);
  
export default BookDetail