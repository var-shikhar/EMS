import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const {NODEMAILER_EMAIL, NODEMAILER_PASSWORD, FRONTEND_URL} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});


// Auth
function generatePasswordResetNotification(name, email, resetLink) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Password Reset Request</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We received a request to reset your password for your account (ID: ${email}) at <strong>Our Washing Center</strong>.</p>
        
        <p>To reset your password, please click the link below:</p>
        
        <p style="text-align: center;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        </p>
        
        <p>This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>

        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 40px;">Best Regards,</p>
        <p><strong>Washing Center</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} Washing Center. All rights reserved.
      </p>
    </div>
  `;
}
async function handleResetPassword(name, email, url){
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: generatePasswordResetNotification(name, email, url),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}

// Login OTP
function generateOTPLogin(email, otp) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4CAF50;">Your Login OTP</h2>
        
        <p>Hello,</p>
        
        <p>Your One-Time Password (OTP) for logging into your account (ID: ${email}) is:</p>
        <p style="text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50;">
          ${otp}
        </p>
        
        <p>This OTP is valid for the next 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best Regards,<br/>Washing Center Team</p>
      </div>
    </div>
  `;
}
async function handleLoginOTP(email, otp) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: email,
      subject: `${otp} Your One-Time Password (OTP) for Account Login`,
      html: generateOTPLogin(email, otp),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}

// Account Creation
function generateAccountCreatedNotification(name, email, otp) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Account Created Successfully</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We are excited to inform you that your account has been successfully created at <strong>Our Washing Center</strong>.</p>
        
        <p>Your username is:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Username:</strong> ${email}</li>
        </ul>

        <p>For security purposes, please verify your email address using the One-Time Password (OTP) provided below:</p>
        <p style="font-size: 18px; font-weight: bold; color: #4CAF50;">OTP: ${otp}</p>

        <p>We recommend changing your password after logging in for the first time for better security.</p>

        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 40px;">Best Regards,</p>
        <p><strong>Washing Center</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} Washing Center. All rights reserved.
      </p>
    </div>
  `;
}
async function handleAccountOTPValidation(name, userEmail, otp) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: userEmail,
      subject: `${otp} is your OTP for Account Verification at Washing Center`,
      html: generateAccountCreatedNotification(name, userEmail, otp),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}

// Center
function generateCenterCreatedNotification(userName, centerName, centerEmail) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Congratulations on Your New Washing Center!</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${userName}</strong>,</p>
        
        <p>We are thrilled to announce that your washing center, <strong>${centerName} <small>(${centerEmail})</small> </strong>, has been successfully created!</p>
        
        <p>Your center is now part of our network, and we look forward to supporting you in providing top-notch services to your customers.</p>

        <p>If you have any questions or require assistance, feel free to reach out to our support team.</p>
        
        <p style="margin-top: 40px;">Best Regards,</p>
        <p><strong>Washing Center Team</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} Washing Center. All rights reserved.
      </p>
    </div>
  `;
}
async function handleCenterCreationNotification(centerName, userName, centerEmail) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: centerEmail,
      subject: `Congratulations on Your New Washing Center: ${centerName}!`,
      html: generateCenterCreatedNotification(userName, centerName, centerEmail),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}


// Booking
function generateBookingCreationEmail(centerName, name, email, phone, services, bookingID, bookingDate, bookingTime, note) {
  const serviceListHTML = services.map(service => `<li>${service}</li>`).join('');
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Booking Request Received</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We are pleased to inform you that we have received your booking request at <strong>${centerName}</strong>. Below are the services you've requested:</p>

        <p><strong>Requested Services:</strong></p>
        <ul style="list-style-type: none; padding-left: 0;">
          ${serviceListHTML}
        </ul>

        ${note ? `<p><strong>Additional Note:</strong> ${note}</p>` : ''}

        <p>We are currently reviewing your request and will confirm the availability of the requested time slot shortly.</p>

        <p>Here are the details of your booking request:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Booking ID:</strong> ${bookingID}</li>
          <li><strong>Full Name:</strong> ${name}</li>
          <li><strong>Email Address:</strong> ${email}</li>
          <li><strong>Phone Number:</strong> ${phone}</li>
          <li><strong>Requested Booking Date:</strong> ${bookingDate}</li>
          <li><strong>Requested Booking Time:</strong> ${bookingTime}</li>
        </ul>

        <p style="text-align: center; margin-top: 20px;">
          <a href='${FRONTEND_URL}/track/${bookingID}' 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Track Booking Status
          </a>
        </p>

        <p>If you have any questions or need further assistance, feel free to contact us. We appreciate your patience!</p>
        
        <p style="margin-top: 40px;">Kind Regards,</p>
        <p><strong>${centerName} Team</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} ${centerName}. All rights reserved.
      </p>
    </div>
  `;
}
async function handleBookingCreation(centerName, name, userEmail, phone, services, bookingID, bookingDate, bookingTime, note) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: userEmail,
      subject: `Booking Request for Car/Bike Washing Service at ${centerName}`,
      html: generateBookingCreationEmail(centerName, name, userEmail, phone, services, bookingID, bookingDate, bookingTime, note),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}
// Rescheduling Email
function generateBookingRescheduleEmail(centerName, name, newBookingDate, newBookingTime, bookingID) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Booking Rescheduled</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We wanted to inform you that your booking at <strong>${centerName}</strong> has been successfully rescheduled by our team. Please find the updated booking details below:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>New Booking Date:</strong> ${newBookingDate}</li>
          <li><strong>New Booking Time:</strong> ${newBookingTime}</li>
        </ul>

        <p style="text-align: center; margin-top: 20px;">
          <a href='${FRONTEND_URL}/track/${bookingID}' 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Track Booking Status
          </a>
        </p>

        <p>If you have any questions or require further assistance, please don't hesitate to contact us. Thank you for your understanding and continued support.</p>
        
        <p style="margin-top: 40px;">Kind Regards,</p>
        <p><strong>${centerName} Team</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} ${centerName}. All rights reserved.
      </p>
    </div>
  `;
}
async function handleBookingReschedule(centerName, name, userEmail, newBookingDate, newBookingTime, bookingID) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: userEmail,
      subject: `Your Booking at ${centerName} has been rescheduled`,
      html: generateBookingRescheduleEmail(centerName, name, newBookingDate, newBookingTime, bookingID),
    }, (error, info) => {
      error ? console.log('Error sending email:', error) : console.log('Email sent:', info.response);
    }
  );
}
// Booking Status Update
function generateBookingStatusUpdateEmail(centerName, name, status, bookingID) {
  const statusMessage = {
    pending: 'Your booking is currently pending.',
    confirmed: 'Your booking has been confirmed.',
    rescheduled: 'Your booking has been rescheduled.',
    cancelled: 'Your booking has been cancelled.',
    completed: 'Your booking has been completed. We would love to hear your feedback!',
  }[status.toLowerCase()] || 'Your booking status has been updated.';

  const reviewRequestHTML = status.toLowerCase() === 'completed' ? `
    <p>We hope you had a great experience with us. Your feedback is very important to us and helps us to improve our services.</p>
    <p>Please take a moment to <a href="#" style="color: #4CAF50;">leave a review</a> and let us know how we did.</p>
  ` : '';

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Booking Status Update</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>${statusMessage} Here are the details of your booking:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Booking Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</li>
        </ul>

        ${reviewRequestHTML}

        <p style="text-align: center; margin-top: 20px;">
          <a href='${FRONTEND_URL}/track/${bookingID}' 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Track Booking Status
          </a>
        </p>

        <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
        
        <p style="margin-top: 40px;">Kind Regards,</p>
        <p><strong>${centerName} Team</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} ${centerName}. All rights reserved.
      </p>
    </div>
  `;
}
async function handleBookingStatusUpdate(centerName, name, userEmail, status, bookingID) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: userEmail,
      subject: `Booking Status Update: ${status.charAt(0).toUpperCase() + status.slice(1)} at ${centerName}`,
      html: generateBookingStatusUpdateEmail(centerName, name, status, bookingID),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}




export default {
  handleAccountOTPValidation,
  handleLoginOTP,
  handleResetPassword,
  handleCenterCreationNotification,
  handleBookingCreation,
  handleBookingReschedule,
  handleBookingStatusUpdate,
}