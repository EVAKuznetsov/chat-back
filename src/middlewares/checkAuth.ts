import express from 'express'
import JWT from '../libs/jsonWebToken'

const checkAuth = (req:any,res:express.Response,next:express.NextFunction)=>{
    if(req.path==='/user/signin'||req.path==='/user/signup'||req.path==='/user/veryfi'){
        return next()
    }
    const token:string = <string>req.headers.token
    JWT.verify(token).then(user=>{
        req.user = user
        next()
    }).catch(err=>{
        res.status(403).json({message:'неверный токен'})
    })
}

export default checkAuth
