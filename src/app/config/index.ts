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
    google_client_id : process.env.GOOGLE_CLIENT_ID,
    google_client_secret : process.env.GOOGLE_CLIENT_SECRET,
    google_redirect_uri : process.env.GOOGLE_REDIRECT_URI,
    google_access_token : process.env.GOOGLE_OAUTH2_ACCESS_TOKEN,
    google_refresh_token : process.env.GOOGLE_REFRESH_TOKEN,
    senders_email : process.env.SENDERS_EMAIL,
}

