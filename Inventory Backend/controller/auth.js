import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import CONSTANT from '../constant/constant.js';
import MAILER from '../helper/nodemailer.js';
import User from "../modal/users.js";

dotenv.config();
const { RouteCode } = CONSTANT;
const { JWT_SECRET_KEY, SALT, FRONTEND_URL } = process.env;


export async function generateOTP(userID) {
    let latestOTP = null;
    let isUnique = false;
    try {
        await OTP.deleteMany({ expiryTime: { $lt: Date.now() } });

        while (!isUnique) {
            latestOTP = Math.floor(100000 + Math.random() * 900000);
            const foundOTP = await OTP.findOne({ otp: latestOTP });

            if (!foundOTP) {
                const newOTP = new OTP({
                    userID: userID,
                    otp: latestOTP,
                    expiryTime: Date.now() + 15 * 60 * 1000, // 15 minutes expiry
                });

                await newOTP.save();
                isUnique = true; // Mark as unique
            }
        }
    } catch (error) {
        console.error("Error during OTP generation:", error);
        throw new Error("Could not generate OTP. Please try again.");
    }

    return latestOTP.toString();
}
export async function validateOTP(userID, userInputOTP) {
    const foundOTPs = await OTP.find({ userID: userID });
    
    if (Array.isArray(foundOTPs) && foundOTPs.length > 0) {
        for (const otpEntry of foundOTPs) {
            const { otp, expiryTime } = otpEntry;
            
            // Check if OTP is expired
            if (Date.now() > expiryTime) {
                await OTP.deleteOne({ userID: userID, otp: otp }); // Remove expired OTP
                return { isValid: false, statusCode: RouteCode.FORBIDDEN.statusCode, message: "OTP has expired." };
            }
            
            // Check if OTP is valid
            if (userInputOTP === otp) {
                await OTP.deleteOne({ userID: userID, otp: otp }); // Remove validated OTP
                return { isValid: true, statusCode: RouteCode.SUCCESS.statusCode, message: "OTP validated successfully." };
            }
        }
        
        // If no valid OTP found after checking all entries
        return { isValid: false, statusCode: RouteCode.CONFLICT.statusCode, message: "Invalid OTP." };
    } else {
        return { isValid: false, statusCode: RouteCode.NOT_FOUND.statusCode, message: "OTP not found. Try sending another one!" };
    }
}

const postRegister = async (req, res) => {
    const userID = req.user;
    const { firstName, lastName, displayName, userEmail, userPhone, gender, password, confirmPassword, userRole } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        if(userEmail !== null){
            let hasEmail = await User.findOne({ userEmail: userEmail });
            if (hasEmail) {
                res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists!' });
            }
        }

        if(userPhone !== null){
            let hasPhone = await User.findOne({ userPhone: userPhone });
            if (hasPhone) {
                res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone Number already exists!' });
            }
        }

        if(password !== confirmPassword){
            res.status(RouteCode.CONFLICT.statusCode).json({message: 'Password does not match!' });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), Number(SALT));
        
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            displayName: displayName,
            userEmail: userEmail,
            userPhone: userPhone,
            gender: gender,
            password: hashedPassword,
            userRole: userRole,
            isActive: true, 
            isBlocked: false
        })

        await newUser.save();
        const jwtToken = jwt.sign({ email: userEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'User has added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};


const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let foundUser = await User.findOne({ userEmail: email });
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Account not found, Try creating a new one!' });
        }

        // Check if password matches
        const isCorrectPassowrd = await bcrypt.compare(password.toString(), foundUser.password);
        if (!isCorrectPassowrd) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Password is incorrect' });
        }

        // Generating and Setting a JWT token in cookie with domain and path options
        const jwtToken = jwt.sign({ email: foundUser.userEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});
        const resData = {
            userID: foundUser._id,
            token: jwtToken
        }
        return res.status(RouteCode.SUCCESS.statusCode).json(resData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
const getLogout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const landingToken = authHeader && authHeader.split(' ')[1]; 
        const token = req.cookies.tkn || landingToken;
        if (!token) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: RouteCode.UNAUTHORIZED.message });
        }

        res.clearCookie('tkn', { secure: true, httpOnly: true });
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Logged-Out Successfully!' });
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postForgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(req.body)
    try {
      const foundUser = await User.findOne({ userEmail: email });
      if (!foundUser) {
        res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User with this email does not exist.'});
      }
  
      // Create a reset token (expires in 15 minutes)
      const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET_KEY, { expiresIn: '15m' });
      const tempURL = FRONTEND_URL;
      const resetPasswordURL = `${tempURL}/auth/reset-password?token=${token}`;
  
      await MAILER.handleResetPassword(foundUser.firstName, foundUser.userEmail, resetPasswordURL);
      res.status(RouteCode.SUCCESS.statusCode).json({message: 'Reset mail has shared to the registered email!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
};
const putResetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const foundUser = await User.findById(decoded.userId);
      if (!foundUser) res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try later!'});
      
      if (password !== confirmPassword) res.status(RouteCode.CONFLICT.statusCode).json({message: 'Password does not match!'});
  
      foundUser.password = await bcrypt.hash(password.toString(), Number(SALT));
      await foundUser.save();
      res.status(RouteCode.SUCCESS.statusCode).json({message: 'Password has updated successfully!'});
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Reset link has expired. Please request a new link.'});
      }
      res.status(RouteCode.SERVER_ERROR.statusCode).json({message: 'Invalid or expired token'});
    }
};

// Context Controller
const getUserContext = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID).populate('userRole').populate('gender');
        if (!foundUser) {
            res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try later!'});
        }

        const userContext = {
            userID: foundUser._id,
            userName: foundUser.firstName + foundUser.lastName,
            displayName: foundUser.displayName,
            userGender: foundUser.gender.genderName,
            userEmail: foundUser.userEmail,
            userPhone: foundUser.userPhone,
            userRole: foundUser.userRole.roleName,
            isActive: foundUser.isActive,
        }

        res.status(RouteCode.SUCCESS.statusCode).json(userContext);
    } catch (err) {
        console.log(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({message: 'Invalid or expired token'});
    }
};

export default {
    postRegister,
    postLogin, getLogout,
    postForgotPassword, putResetPassword,
    getUserContext
}