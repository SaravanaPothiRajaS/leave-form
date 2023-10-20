import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // You'll need a JWT library
const jwtSecret = 'secretKey';

const authenticateToken = (req, res, callback) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        res.status(403).send('Forbidden: Invalid Token');
        callback(false); // Pass false to the callback on error
      } else {
        console.log("tets");
        callback(true); // Pass true to the callback on success
      }
    });
  } else {
    res.status(401).send('Unauthorized: Token missing');
    callback(false); // Pass false to the callback when no token is present
  }
};

export default authenticateToken;
