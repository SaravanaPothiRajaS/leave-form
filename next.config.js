/** @type {import('next').NextConfig} */
const nextConfig = {

  env: {

    NEXTAUTH_SECRET: "mysecretkey123456789",
    GMAIL_PASSWORD: "wdoc ssfe mwzy kdhe",
    PUBLISHABLE_API_KEY: "pk_live_13136C093A450D9A",
    SECRET_KEY: "sk_live_D9A555FEA52F1482",


    CASUAL_lEAVE_LIMIT:5,
    MATERNITY_LEAVE_LIMIT:60,
    PATERNITY_LEAVE_LIMIT:10,
    LEAVE_ON_PROPATION:1,


  },


}

module.exports = nextConfig
