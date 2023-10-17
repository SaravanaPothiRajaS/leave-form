import authenticateToken from '@/app/middleware';

const fs = require('fs').promises;
export default async (req, res) => {
  try {
    authenticateToken(req, res, async(isAuthenticated) => {
      if (isAuthenticated) {
    const data = await fs.readFile('compOffStatus.json', 'utf8');
        const jsonData = JSON.parse(data);
      
        const { email } = req.body;
        console.log(email);

        if (email) {
          
          const filteredData = jsonData.filter(item => item.email === email);

          res.json(filteredData);
        } else {
          res.status(400).json({ error: 'Email not provided in the request body' });
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