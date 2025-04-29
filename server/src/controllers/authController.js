import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const register = async(req, res) =>{
    try{
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, password: hashedPassword, role: "user"});
        await newUser.save();

        res.status(201)
        .json({message: `User registered with username ${username}`});
    }catch(err){
        res.status(500)
        .json({message: `Something went wrong ${err}`});
    }
    
}

const login = async(req, res) =>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(404)
            .json({message: `User with username${username} not found`});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400)
            .json({message: `Invalid credential`});
        }

        const today = new Date();
        const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
        const isSameDay = lastLoginDate &&
        today.getFullYear() === lastLoginDate.getFullYear() &&
        today.getMonth() === lastLoginDate.getMonth() &&
        today.getDate() === lastLoginDate.getDate();

        if (!isSameDay) {
        user.credits += 5; // 🎉 Award daily login credits
        user.lastLogin = today;
        await user.save();
        }

        const token = jwt.sign({id: user._id, role: user.role}, 
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        res.status(200).json({token});
    }catch(err){
        res.status(500)
        .json({message: `Something went wrong ${err}`});
    }
}

export {register, login};