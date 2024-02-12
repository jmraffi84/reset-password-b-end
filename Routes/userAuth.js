import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/User.js";
import { randomBytes } from 'crypto'
import { Router } from "express";
import sendResetEmail from "../Utils/nodeMail.js";
import { generateToken } from "../Utils/generateToken.js";
import { verifyToken } from "../Middleware/verifyToken.js";


const router = express.Router();

const randomToken = () => {
    return randomBytes(4).toString('hex')
};



router.post('/signup', async (req, res) => {
    try {
        console.log("Enter into sigup block");

        const userData = {
            email: req.body.email,
            password: req.body.password
        }
        console.log('Entered:', userData);
        let user = await User.find({ email: userData.email, password: userData.password });
        console.log("db user : ", { ...user });
        if (!user) {
            res.status(404).json({ error: ' user already exists' })

        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user = new User({
                email: userData.email,
                password: hashedPassword,
            });
            console.log("SAVING NEW USER:", user);
            await user.save();
            res.status(201).json({ message: 'User registered successfully', user });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }


})



router.get('/verify', verifyToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.email}! This is proctected data` })
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT Token
        const token = generateToken(user);

        // Respond with the token
        res.status(200).json({ user: { email: user.email }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/forget-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random token and store it in the database
        const token = randomToken();
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send password reset email
        await sendResetEmail(user, token, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.json({ message: 'Password reset email sent', ...result });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Reset Password 

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid token!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();
        console.log("Details:", user);
        return res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find user with the reset token and check token expiration
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired reset link' });
        }

        const token = randomToken();

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 360000; //1hour
        await user.save();

        //     const transporter = nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             user: process.env.EMAIL_SERVICE,
        //             pass: process.env.EMAIL_PASSWORD
        //         }
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL_SERVICE,
        //         to: user.email,
        //         subject: 'Password Reset',
        //         text: `Click the link to reset your password, it will expire in 5 min.\n\n please use the following token reset password:${sendResetEmail}\n\n. If you did not request a password reset.Please igore this email.  `
        //     };

        //     transporter.sendMail(mailOptions, (err, info) => {

        //         if (err) {
        //             res.status(404).json({ message: "Something went wrong, Try again !" })

        //         }
        //         res.status(201).json({ message: "Password reset email sent successfully" + info.response })
        //         console.log('Password reset email sent successfully');
        //     });


        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ message: 'Internal Server Error' });
        // }
        sendResetEmail(user, token, (err, response) => {
            if (err) {
                return res.status(404).json({ message: "Something went wrong, Try again !" });
            }
            res.status(201).json(response);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});

router.get('/', (req, res) => {
    res.status(201).json({ message: "Am working" });
})


export const userRouter = router;