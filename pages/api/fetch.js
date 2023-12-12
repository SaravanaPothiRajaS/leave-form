import authenticateToken from '../../app/middleware';
const AWS = require('aws-sdk');

export default async (req, res) => {
  try {
    authenticateToken(req, res, (isAuthenticated) => {
      if (isAuthenticated) {
       
        const { email } = req.body;
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
    if (email) {

                const filteredData = jsonData.filter(item => item.email === email);
      
                res.json(filteredData);
              } else {
                res.status(400).json({ error: 'Email not provided in the request body' });
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
