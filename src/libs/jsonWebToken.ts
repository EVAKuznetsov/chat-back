import jwt from 'jsonwebtoken'

interface IUserDataForToken {
  email: string;
  id: string;
}
class JWT{
    static create(user: IUserDataForToken){
        let token = jwt.sign(user, <string>process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_AGE,
            algorithm: 'HS256',
        })
        return token 
    }
    static verify(token: string){
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET || '', (err: any, decoded) => {
              if (err || !decoded) {
                return reject(err)
              }
              resolve(decoded)
            })
    })}
}

export default JWT