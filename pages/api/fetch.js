import authenticateToken from '@/app/middleware';

const fs = require('fs').promises;
export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {
        const data = await fs.readFile('statusData.json', 'utf8');

        const jsonData = JSON.parse(data);
        const totalLeave = jsonData.filter(item => item.status === "pending");
        let leaveLength = totalLeave.length;
        res.json({ jsonData: jsonData, leaveLength: leaveLength });
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });


  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};