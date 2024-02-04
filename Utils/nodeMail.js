import nodemailer from 'nodemailer'

const sendResetEmail = async (User, resetToken) => {
    // const resetLink = `${process.env.CLIENT_URL}/RESET-PASSWORD/${resetToken}`
    const resetLink = `http://localhost:3000/RESET-PASSWORD/${resetToken}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SERVICE,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'konnect.trl@gmail.com',
        to: User.email,
        subject: 'Password Reset',
        text: `click the link to reset your password:${resetLink}, it will expire in 5 min`

    };
    try {
        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.status(400).json({ message: "something went wrong, try again" })

            }
            res.status(200).json({ message: "password Email sent" + info.response })
            console.log('Password reset successfully');
        });


    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export default sendResetEmail;