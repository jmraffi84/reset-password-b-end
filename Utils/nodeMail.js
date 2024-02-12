import nodemailer from 'nodemailer'

const sendResetEmail = async (User, resetToken, callback) => {
    // const resetLink = `${process.env.CLIENT_URL}/RESET-PASSWORD/${resetToken}`
    const resetLink = `https://rad-gnome-237bf5.netlify.app/password-reset/${resetToken}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SERVICE,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_SERVICE,
        to: User.email,
        subject: 'Password Reset',
        text: `click the link to reset your password:${resetLink}, it will expire in 4 min`

    };

    try {
        const info = await transporter.sendMail(mailOptions);
        // console.log('Password reset email sent successfully:', info.response);
        callback(null, { success: true, message: 'Password reset email sent successfully' });
    } catch (error) {
        // console.error('Error sending password reset email:', error);
        callback(error, { success: false, message: 'Something went wrong, try again.' });
    }

}

export default sendResetEmail;