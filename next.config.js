/** @type {import('next').NextConfig} */
const nextConfig = {

  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    PUBLISHABLE_API_KEY: process.env.PUBLISHABLE_API_KEY,
    SECRET_KEY:process.env.SECRET_KEY,


    CASUAL_LEAVE_LIMIT: process.env.CASUAL_LEAVE_LIMIT,
    MATERNITY_LEAVE_LIMIT: process.env.MATERNITY_LEAVE_LIMIT,
    PATERNITY_LEAVE_LIMIT: process.env.PATERNITY_LEAVE_LIMIT,
    LEAVE_ON_PROPATION: process.env.LEAVE_ON_PROPATION,

    BUCKET_NAME:process.env.BUCKET_NAME,
    REGION:process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,

  },


}

module.exports = nextConfig
