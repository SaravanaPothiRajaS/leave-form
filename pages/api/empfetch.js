import authenticateToken from '../../app/middleware';
 
const fs = require('fs').promises;
 
 
export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {
        const data = await fs.readFile('empData.json', 'utf8');
        const { role, department } = req.body;
        const jsonFileData = JSON.parse(data);
        if (role === "admin") {
          const jsonData = jsonFileData.filter(item => item.role !== "admin");
          console.log("filter", jsonData);
 
          res.json(jsonData);
        }
        else{
          const jsonData = jsonFileData.filter(item => item.department === department && item.role === "user");
          console.log("filter", jsonData);
 
          res.json(jsonData);
        }
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};