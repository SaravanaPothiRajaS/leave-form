const fs = require('fs').promises;
export default async (req, res) => {
    try {
        const data = await fs.readFile('empData.json', 'utf8');
        const jsonData = JSON.parse(data);
        const {email}=req.body;
        const avail = jsonData.filter(item => item.email === email);
        const avilableleave = (avail[0].availableLeave);
        const availableCompOffLeave = parseFloat(avail[0].compOffLeave);
        console.log("float",avail);
        res.json({ avilableleave: avilableleave, availableCompOffLeave: availableCompOffLeave });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};