import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const domain = process.env.NEXT_PUBLIC_APP_URL;

// Send a verification email to the user.
export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Confirm Your Email Address",
        text: `Please confirm your email address by clicking the following link: ${confirmLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
                <h2 style="color: #4CAF50;">Welcome!</h2>
                <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
                <p>
                    <a style="display: inline-block; padding: 10px 20px; margin: 20px auto; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;" href="${confirmLink}">
                        Confirm Email
                    </a>
                </p>
                <p>If you did not request this email, please ignore it.</p>
                <br/>
                <p>Best regards,<br/>L'entrepot</p>
            </div>`
    };

    await transporter.sendMail(mailOptions);
}

// Send password reset email.
export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Your Password",
        text: `You can reset your password by clicking the following link: ${resetLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
                <h2 style="color: #FF5733;">Reset Your Password</h2>
                <p>We received a request to reset your password. You can do so by clicking the button below:</p>
                <p>
                    <a style="display: inline-block; padding: 10px 20px; margin: 20px auto; background-color: #FF5733; color: white; text-decoration: none; border-radius: 5px;" href="${resetLink}">
                        Reset Password
                    </a>
                </p>
                <p>If you did not request this email, please ignore it.</p>
                <br/>
                <p>Best regards,<br/>L'entrepot</p>
            </div>`
    };

    await transporter.sendMail(mailOptions);
}

// Send two factor authentication token email.
export async function sendTwoFactorTokenEmail(email: string, token: string) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your Two-Factor Authentication Token",
        text: `Your two-factor authentication token is: ${token}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
                <h2 style="color: #3498DB;">Two-Factor Authentication</h2>
                <p>Your authentication token is:</p>
                <p style="font-size: 18px; font-weight: bold; color: #3498DB;">${token}</p>
                <p>Please use this token to complete your login process.</p>
                <br/>
                <p>Best regards,<br/>L'entrepot</p>
            </div>`
    };

    await transporter.sendMail(mailOptions);
}
