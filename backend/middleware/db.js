import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import DEFAULT_DATA from '../constant/defaultData.js';
import User from '../modal/users.js';
import AcademicClass from '../modal/academicClass.js';
import AcademicSection from '../modal/academicSection.js';
import BookCategory from '../modal/bookCategory.js';
import BookGenre from '../modal/bookGenre.js';
import Gender from '../modal/gender.js';
import UserRole from '../modal/role.js';
import BookDetail from '../modal/bookDetail.js';
import Tag from '../modal/tags.js';
import SubscriptionType from '../modal/subscriptionType.js';
import UserSubscription from '../modal/usersSubscription.js';

dotenv.config();
const { MONGO_URI, SALT } = process.env;
const { ACADEMIC_CLASSES, ACADEMIC_SECTIONS, BOOK_CATEGORY, BOOK_GENRES, GENDER, USERS, USER_ROLE, DEF_BOOKS, BOOK_TAGS, SUBSCRIPTION_TYPES, USER_SUBSCRIPTIONS } = DEFAULT_DATA;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const userCount = await User.countDocuments();
        const academicClassCount = await AcademicClass.countDocuments();
        const academicSectionCount = await AcademicSection.countDocuments();
        const bookCategoryCount = await BookCategory.countDocuments();
        const bookGenresCount = await BookGenre.countDocuments();
        const genderCount = await Gender.countDocuments();
        const userRoleCount = await UserRole.countDocuments();
        const bookCount = await BookDetail.countDocuments();
        const tagCount = await Tag.countDocuments();
        const subscriptionTypeCount = await SubscriptionType.countDocuments();
        const userSubscriptionCount = await UserSubscription.countDocuments();

        if (academicClassCount === 0) {
            await AcademicClass.insertMany(ACADEMIC_CLASSES);
            console.log('Academic Classes data inserted');
        }

        if (subscriptionTypeCount === 0) {
            await SubscriptionType.insertMany(SUBSCRIPTION_TYPES);
            console.log('SUBSCRIPTION Types data inserted');
        }
        
        if (genderCount === 0) {
            await Gender.insertMany(GENDER);
            console.log('Genders data inserted');
        }
        
        if (userRoleCount === 0) {
            await UserRole.insertMany(USER_ROLE);
            console.log('User Role data inserted');
        }

        if (bookGenresCount === 0) {
            await BookGenre.insertMany(BOOK_GENRES);
            console.log('Book Genre data inserted');
        }

        if (bookCategoryCount === 0) {
            await BookCategory.insertMany(BOOK_CATEGORY);
            console.log('Book Category data inserted');
        }

        if (tagCount === 0) {
            await Tag.insertMany(BOOK_TAGS);
            console.log('Tag data inserted');
        }
        
        if (academicSectionCount === 0){
            if(ACADEMIC_SECTIONS?.length > 0){
                const academicClassList = await AcademicClass.find();

                for (const item of ACADEMIC_SECTIONS) {
                    const foundCategory = academicClassList.find(option => option.className === item.className)
                    if(foundCategory){
                        let newAcademicSection = new AcademicSection({
                            classID: foundCategory._id,
                            sectionName: item.sectionName,
                            sectionCode: item.sectionCode,
                        });
                        await newAcademicSection.save();
                    }
                }
            }
        }

        if(userCount === 0){
            if(USERS?.length > 0){
                const genderList = await Gender.find();
                const roleList = await UserRole.find();

                for (const item of USERS) {
                    const hashedPassword = await bcrypt.hash(item.password.toString(), Number(SALT));
                    const foundGender = genderList.find(option => option.genderName === item.gender)
                    const foundRole = roleList.find(option => option.roleName === item.userRole)

                    if(foundRole && foundGender){
                        let newUser = new User({
                            firstName: item.firstName,
                            lastName: item.lastName,
                            displayName: item.displayName,
                            userPhone: item.userPhone,
                            userEmail: item.userEmail,
                            gender: foundGender._id,
                            password: hashedPassword,
                            userRole: foundRole._id,
                            isActive: item.isActive,
                            isBlocked: item.isBlocked,
                            uniqueID: Number(item.uniqueID),
                        });
                        await newUser.save();
                    }
                }

                console.log('Default User Added!');
            }
        }     
        
        if(userSubscriptionCount === 0){
            if(USER_SUBSCRIPTIONS?.length > 0){
                const userList = await User.find();
                const subscriptionTypeList = await SubscriptionType.find();

                for (const item of USER_SUBSCRIPTIONS) {
                    const foundUser = userList.find(option => Number(option.uniqueID) === Number(item.userID))
                    const foundSubscription = subscriptionTypeList.find(option => option.name === item.subscriptionTypeName)

                    if(foundSubscription && foundUser){
                        let newUserSubscription = new UserSubscription({
                            userId: foundUser._id,
                            subscriptionTypeId: foundSubscription._id,
                            startDate: new Date(item.startDate),
                            endDate: new Date(item.endDate),
                            status: item.status
                        });
                        await newUserSubscription.save();
                    }
                }

                console.log('Default Subscriptions Added!');
            }
        }     

        if(bookCount === 0){
            if(DEF_BOOKS?.length > 0){
                const categoryList = await BookCategory.find();
                const genreList = await BookGenre.find();
                const userList = await User.find();

                for (const item of DEF_BOOKS) {
                    const foundCategory = categoryList.find(option => option.name === item.category)
                    const foundGenre = genreList.find(option => option.name === item.genre)
                    const foundUser = userList.find(option => option.firstName === item.addedBy)

                    if(foundCategory && foundGenre && foundUser){
                        let newBook = new BookDetail({
                            title: item.title,
                            category: foundCategory._id,
                            genre: foundGenre._id,
                            ISBN: item.ISBN,
                            author: item.author,
                            addedBy: foundUser._id,
                            totalQuantities: item.totalQuantities,
                            lostQuantities: item.lostQuantities,
                            availableQuantities: item.availableQuantities,
                            rentalPrice: item.rentalPrice,
                            fine: item.fine,
                            description: item.description,
                        });
                        await newBook.save();
                    }
                }

                console.log('Default Books Added!');
            }
        }

        
        console.log('MongoDB connected successfully');
        mongoose.connection.emit('connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
