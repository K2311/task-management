const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');


const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

let register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).send('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });


    // Save user
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

let login = async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send('User does not exist');

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id ,role:user.role }, process.env.TOKEN_SECRET);
    res.header('Authorization', `Bearer ${token}`).status(200).json({
        message: 'Logged in successfully',
        token
    });;
    
}

const logout = async (req, res) => {
    try {
        // Clear the auth-token cookie
        res.clearCookie('auth-token');

        // Send a structured response
        res.status(200).json({
            message: 'Logged out successfully',
            success: true,
        });
    } catch (error) {
        // Handle errors
        console.error('Logout error:', error);
        res.status(500).send({
            message: 'An error occurred while logging out',
            success: false,
        });
    }
};


module.exports = {
    register,
    login,
    logout
};