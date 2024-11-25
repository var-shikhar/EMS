import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import DEFAULT_DATA from '../constant/defaultData.js';
import Gender from '../modal/gender.js';
import UserRole from '../modal/role.js';
import User from '../modal/users.js';

dotenv.config();
const { MONGO_URI, SALT } = process.env;
const { GENDER, USER_ROLE, USERS } = DEFAULT_DATA;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const userCount = await User.countDocuments();
        const genderCount = await Gender.countDocuments();
        const userRoleCount = await UserRole.countDocuments();

        if (genderCount === 0) {
            await Gender.insertMany(GENDER);
            console.log('Genders data inserted');
        }
        
        if (userRoleCount === 0) {
            await UserRole.insertMany(USER_ROLE);
            console.log('User Role data inserted');
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
         
        console.log('MongoDB connected successfully');
        mongoose.connection.emit('connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
