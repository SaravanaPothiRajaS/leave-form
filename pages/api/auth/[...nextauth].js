import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
const fs = require('fs');

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
        async authorize(credentials, req) {
          const { email, password } = credentials;
      const userData = JSON.parse(fs.readFileSync('login.json', 'utf8'));
      const user = userData.find((user) => user.email === email);
      
          if (!user) {
            throw new Error("Invalid Email or Password");
          }
      
          if (user.password !== password) {
            throw new Error("Invalid Email or Password");
          }
      
        //   return user;
        console.log(user);
        },
      })
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
