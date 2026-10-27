const { default: axios } = require("axios");
const { oauth2client } = require("../utils/googleConfig");
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
require('dotenv').config()

const googleLogin = async (req,res)=>{
    try{
        const code = req.query.code;
        if (typeof code !== 'string' || !code.trim()) {
            return res.status(400).json({ message: 'Google authorization code is required' });
        }
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens)

        const userRes = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo',{headers:{Authorization:`Bearer ${googleRes.tokens.access_token}`}})
        const {email,name,picture} = userRes.data;
        let user = await UserModel.findOne({email})
        if(!user){
            user = await UserModel.create({
                name,
                email,
                image: picture
            })
        }
            const {_id} = user;
            const token = jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_TIMEOUT})
            return res.status(200).json({
                message: 'Success',
                token,
                user
            })
    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }
}
module.exports = {googleLogin}
