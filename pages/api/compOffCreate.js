import authenticateToken from '@/app/middleware';

const fs = require('fs').promises;


export default async (req, res) => {
  try {
    authenticateToken(req, res, async(isAuthenticated) => {
      if (isAuthenticated) {
      
    const data = await fs.readFile('compOffStatus.json', 'utf8');
    const jsonData = JSON.parse(data);
    const {addValue}=req.body;
    
    console.log(addValue);
        jsonData.push(addValue);

        await fs.writeFile('compOffStatus.json', JSON.stringify(jsonData, null, 2));
        res.json(jsonData);
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};