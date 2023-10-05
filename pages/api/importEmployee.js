const fs = require('fs').promises;


export default async (req, res) => {
  try {
    const data = await fs.readFile('empData.json', 'utf8');
    let jsonData = JSON.parse(data);
    const {addValue}=req.body;
    
    console.log(req.body);
        jsonData = addValue;

        await fs.writeFile('empData.json', JSON.stringify(jsonData, null, 2));
        res.json("imported");
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};