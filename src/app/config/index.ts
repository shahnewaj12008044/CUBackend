import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join((process.cwd(),".env"))})

export default {
    NODE_ENV : process.env.NODE_ENV,
    port : process.env.PORT,
    db_url : process.env.DB_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret : process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET,
    jwt_access_expires : process.env.JWT_ACCESS_EXPIRES,
    jwt_refresh_expires : process.env.JWT_REFRESH_EXPIRES,

}

