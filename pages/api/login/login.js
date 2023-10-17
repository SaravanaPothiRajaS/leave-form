const fs = require('fs').promises;
var jwt = require('jsonwebtoken');
export default async (req, res) => {
  try {
    const data = await fs.readFile('empData.json', 'utf8');
    let jsonData = JSON.parse(data);
    const { email,password} = req.body;
    const jwtSecret = 'secretKey';
    let role='';
    let department='';
    let name='';

    function verifyLogin(email, password) {
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].email === email && jsonData[i].password === password) {
          role=jsonData[i].role;
          department=jsonData[i].department;
          name=jsonData[i].name;
            return true; 
        }
    }
    return false; 
}


if (verifyLogin(email,password)) {
    console.log("Login successful");
    const payLoad={email:email,role:role,department:department,name:name}
            const accessToken = jwt.sign(payLoad, jwtSecret);
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
};