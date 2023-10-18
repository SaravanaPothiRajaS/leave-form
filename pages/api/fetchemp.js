import authenticateToken from '@/app/middleware';
const fs = require('fs').promises;

export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {
        const data = await fs.readFile('statusData.json', 'utf8');
        const jsonData = JSON.parse(data);

        const { department ,role} = req.body;
        console.log(department);
        if(role==="approver"){
          const filteredData = jsonData.filter(item => item.role === role);

          if (filteredData.length > 0) {
          
            res.json(filteredData);
          } 
        }else if(role==="user"){
          const filteredData = jsonData.filter(item => (item.role === role)&&(item.department===department));

          if (filteredData.length > 0) {
          
            res.json(filteredData);
          } 
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
