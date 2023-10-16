import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // You'll need a JWT library
const jwtSecret = 'secretKey';
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  // Extract the token without "Bearer "
  if (token && token.startsWith('Bearer ')) {
    console.log("tets");
    const tokenValue = token.substring(7); // Remove 'Bearer ' from the token
    jwt.verify(tokenValue, jwtSecret, (err, user) => {
      if (err) {
        res.status(403).send('Forbidden: Invalid Token');
      } else {
        next();
      }
    });
  } else {
    res.status(401).send('Unauthorized: Token missing');
  }
};

export default authenticateToken;