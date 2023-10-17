import authenticateToken from '@/app/middleware';
import fs from 'fs/promises';

export default async (req, res) => {
  try {
    authenticateToken(req, res, (isAuthenticated) => {
      if (isAuthenticated) {
        console.log("true");
        // Now you can proceed with the request because authentication was successful.
        fs.readFile('holidayData.json', 'utf8')
          .then((data) => {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      } else {
        console.log("false");
        // Handle the case where authentication failed.
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
  } catch (error) {
    console.error('Error in middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
