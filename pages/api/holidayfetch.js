
import authenticateToken from '@/app/middleware';
import fs from 'fs/promises';

export default authenticateToken(async (req, res) => {
  try {
    const data = await fs.readFile('holidayData.json', 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
