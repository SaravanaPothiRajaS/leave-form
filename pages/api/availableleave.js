import authenticateToken from '@/app/middleware';

const fs = require('fs').promises;

export default async (req, res) => {
  try {
    authenticateToken(req, res, async(isAuthenticated) => {
      if (isAuthenticated) {
    const data = await fs.readFile('empData.json', 'utf8');
    let jsonData = JSON.parse(data);
    const { email, availableLeave,totalDays ,takenLeave} = req.body;

    const updatedData = jsonData.map(item => {
        if (item.email === email) {
          return { ...item, availableLeave: availableLeave - totalDays,takenLeave: takenLeave + Number(totalDays) };
        }
        return item; 
      });

jsonData = updatedData;
        await fs.writeFile('empData.json', JSON.stringify(jsonData, null, 2));
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