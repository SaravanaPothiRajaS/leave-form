import { Magic } from "@magic-sdk/admin";
const fs = require('fs').promises;
import * as jwt from 'jsonwebtoken';
const AWS = require('aws-sdk');

export default async function login(req, res) {
  const magic = new Magic(process.env.SECRET_KEY)
  const didToken = req.headers.authorization.substr(7);
  const metadata = await magic.users.getMetadataByToken(didToken)
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });

  // Create an S3 object
  const s3 = new AWS.S3();

  // Specify the bucket and file key (path) of your JSON file
  const bucketName = process.env.BUCKET_NAME;
  const fileKey = 'empData.json';

  // Fetch data from the JSON file in S3
  const data = await s3.getObject({ Bucket: bucketName, Key: fileKey }).promise();
  const jsonData = JSON.parse(data.Body.toString('utf-8'));
  if (metadata.email) {
    try {
     
      const { email } = req.body;
      const jwtSecret = 'secretKey';
      let role = '';
      let department = '';
      let name = '';

      function verifyLogin(email) {
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i].email === email) {
            role = jsonData[i].role;
            department = jsonData[i].department;
            name = jsonData[i].name;
            return true;
          }
        }
        return false;
      }


      if (verifyLogin(email)) {
        const payLoad = { email: email, role: role, department: department, name: name }
        const accessToken = jwt.sign(payLoad, jwtSecret);
        res.json({ accessToken: accessToken })
      } else {
        res.json('invalid')
      }


      // res.json(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
    
}