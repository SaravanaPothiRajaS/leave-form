import authenticateToken from '@/app/middleware';

const fs = require('fs').promises;
export default async (req, res) => {
  try {
    authenticateToken(req, res, async(isAuthenticated) => {
      if (isAuthenticated) {
    const data = await fs.readFile('compOffStatus.json', 'utf8');
        const jsonData = JSON.parse(data);
      
        const { department ,role} = req.body;
        console.log(department);
if(role === "admin"){

  const filteredData = jsonData.filter(item => item.department === "Leadership");

  if (filteredData.length > 0) {
  
    res.json(filteredData);
  } 

}else if(role === "approver"){
  const filteredData = jsonData.filter(item => item.department === department && item.role === "user");

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