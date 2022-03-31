import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if the username exist:
        const existingUser = await User.findOne({ email });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist." });
        
        // check if the password matches:
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials" });

        // generate token and return it in response
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", { expiresIn: "1h" })
        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: "Sorry, something went wrong, please try again." });
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmpassword, firstname, lastname } = req.body;

    try {
        // check if the username already exists:
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ message: "User already exists." });

        // check if password and confirm password matches:
        if (password === confirmpassword ) return res.status(400).json({ message: "Password and Confirm Password need to match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstname} ${lastname}`})
        
        const token = jwt.sign({ email: result.email, id: result._id }, "test", { expiresIn: "1h" })

        res.status(200).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: "Sorry, something went wrong, please try again." });
    }
}

