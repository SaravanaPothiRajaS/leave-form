import authenticateToken from '@/app/middleware';
const fs = require('fs').promises;

export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {
        const data = await fs.readFile('statusData.json', 'utf8');
        const jsonData = JSON.parse(data);

        const { department, role } = req.body;
        console.log(department);
        if (role === "approver") {
          const filteredData = jsonData.filter(item => item.role === role);
          const pending = filteredData.filter(item => item.status === "pending");
          const pendingCount = pending.length;
          res.json({ filteredData: filteredData, pendingCount: pendingCount });

        } else if (role === "user") {
          const filteredData = jsonData.filter(item => (item.role === role) && (item.department === department));
          const pending = filteredData.filter(item => item.status === "pending");
          const pendingCount = pending.length;
          console.log(pendingCount);
          res.json({ filteredData: filteredData, pendingCount: pendingCount });
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
