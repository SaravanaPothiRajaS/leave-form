import { Magic } from "@magic-sdk/admin";
const fs = require('fs').promises;
import * as jwt from 'jsonwebtoken';

export default async function login(req, res) {
  const magic = new Magic(process.env.SECRET_KEY)
  const didToken = req.headers.authorization.substr(7);
  const metadata = await magic.users.getMetadataByToken(didToken)
  // console.log(metadata);
  // res.send({ metadata });
  if (metadata.email) {
    try {
      const data = await fs.readFile('empData.json', 'utf8');
      let jsonData = JSON.parse(data);
      const { email } = req.body;
      console.log(req.body);
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
        console.log("Login successful");
        const payLoad = { email: email, role: role, department: department, name: name }
        const accessToken = jwt.sign(payLoad, jwtSecret);
        console.log(accessToken);
        res.json({ accessToken: accessToken })
      } else {
        console.log("Login failed. Please check your email and password.");
        res.json('invalid')
      }


      // res.json(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  else
    console.log("Invalid");
}