const fs = require('fs').promises;

export default async (req, res) => {
  try {
    const data = await fs.readFile('empData.json', 'utf8');
    let jsonData = JSON.parse(data);
    const { email,day } = req.body;
console.log(jsonData );
    const updatedData = jsonData.map(item => {
        if (item.email === email) {
            // console.log(item.compOffLeave);
          return { ...item, compOffLeave: item.compOffLeave + day };
        }
        return item; 
      });

jsonData = updatedData;
        await fs.writeFile('empData.json', JSON.stringify(jsonData, null, 2));
        res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};