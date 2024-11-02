const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');



router.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({email})
    console.log(existingUser, password)
    if(existingUser){
        if (!bcrypt.compareSync(password, existingUser.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = jwt.sign({ id: existingUser.id }, 'your_secret_key', { expiresIn: '1h' });
    
        res.cookie('token', token, {
            httpOnly: true, // Secure cookie against JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only for HTTPS in production
            sameSite: 'lax',
        });
    
        res.json({ user: { id: existingUser.id, email: existingUser.email } });
    }else{
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
});

router.post('/api/user/register', async (req, res)=>{
    const { email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router