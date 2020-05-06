import {Request,Response,NextFunction} from 'express'
import JWT from '../libs/jsonWebToken'

const checkAuth = (req:any,res:Response,next:NextFunction)=>{
    if(req.path==='/user/signin'||req.path==='/user/signup'||req.path==='/user/verify'){
        return next()
    }
    const token:string = <string>req.headers.token
    JWT.verify(token).then((user:any)=>{
        req.user = user
        next()
    }).catch(err=>{
        res.status(403).json({message:'неверный токен'})
    })
}

export default checkAuth
