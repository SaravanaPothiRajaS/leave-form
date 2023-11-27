import authenticateToken from '../../app/middleware';

const fs = require('fs').promises;
export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {
        const data = await fs.readFile('compOffStatus.json', 'utf8');
        const jsonData = JSON.parse(data);

        const { department, role } = req.body;
        console.log(department);
        if (role === "approver") {
          const filteredData = jsonData.filter(item => item.role === role);
          const compPending = filteredData.filter(item => item.status === "pending");
          const compPendingCount = compPending.length;


          res.json({ filteredData: filteredData, compPendingCount: compPendingCount });
        } else if (role === "user") {
          const filteredData = jsonData.filter(item => (item.role === role) && (item.department === department));
          const compPending = filteredData.filter(item => item.status === "pending");
          const compPendingCount = compPending.length;
          console.log(compPendingCount);

          res.json({ filteredData: filteredData, compPendingCount: compPendingCount });
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