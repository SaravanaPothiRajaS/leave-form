
import fs from 'fs/promises';
import authenticateToken from '../../app/middleware';
const AWS = require('aws-sdk');




export default async (req, res) => {
  try {
    authenticateToken(req, res, (isAuthenticated) => {
      if (isAuthenticated) {
        const { department, role } = req.body;
       
    AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});
       
    // Create an S3 object
const s3 = new AWS.S3();

// Specify the bucket and file key (path) of your JSON file
const bucketName =  process.env.BUCKET_NAME;
const fileKey = 'statusData.json';

// Create parameters for the S3 getObject operation
const params = {
  Bucket: bucketName,
  Key: fileKey
};

// Fetch data from the JSON file in S3
s3.getObject(params, (err, data) => {
  if (err) {
    console.error('Error fetching data from S3:', err);
  } else {
    // Parse the JSON data
    const jsonData = JSON.parse(data.Body.toString('utf-8'));
    if (role === "approver") {
      const filteredData = jsonData.filter(item => item.role === role || (item.role === "user"));
      const pending = filteredData.filter(item => item.status === "pending");
      const pendingCount = pending.length;
      res.json({ filteredData: filteredData, pendingCount: pendingCount });

    } else if (role === "user") {
      const filteredData = jsonData.filter(item => (item.role === role) && (item.department === department));
      const pending = filteredData.filter(item => item.status === "pending");
      const pendingCount = pending.length;
      res.json({ filteredData: filteredData, pendingCount: pendingCount });

    }
    // Now, you can work with the jsonData object
  }
});
    } else {
        // Handle the case where authentication failed.
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
  } catch (error) {
    console.error('Error in middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};















// import authenticateToken from '../../app/middleware';

// const fs = require('fs').promises;

// export  async (req, res) => {
//   try {
//     authenticateToken(req, res, async (isAuthenticated) => {
//       if (isAuthenticated) {
//         const data = await fs.readFile('statusData.json', 'utf8');
//         const jsonData = JSON.parse(data);

//         const { department, role } = req.body;
//         console.log(department);
//         if (role === "approver") {
//           const filteredData = jsonData.filter(item => item.role === role || (item.role === "user"));
//           const pending = filteredData.filter(item => item.status === "pending");
//           const pendingCount = pending.length;
//           res.json({ filteredData: filteredData, pendingCount: pendingCount });

//         } else if (role === "user") {
//           const filteredData = jsonData.filter(item => (item.role === role) && (item.department === department));
//           const pending = filteredData.filter(item => item.status === "pending");
//           const pendingCount = pending.length;
//           console.log(pendingCount);
//           res.json({ filteredData: filteredData, pendingCount: pendingCount });

//         }

//       }
      
      
//       else {
//         res.status(403).send('Forbidden: Invalid Token');
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
