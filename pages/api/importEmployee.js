import authenticateToken from '@/app/middleware';

const fs = require('fs').promises;


export default async (req, res) => {
  try {
    authenticateToken(req, res, async(isAuthenticated) => {
      if (isAuthenticated) {
    const data = await fs.readFile('empData.json', 'utf8');
    let jsonData = JSON.parse(data);
    const {addValue}=req.body;
    
    console.log(req.body);
        jsonData = addValue;

        await fs.writeFile('empData.json', JSON.stringify(jsonData, null, 2));
        res.json("imported");
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};