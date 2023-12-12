import authenticateToken from '../../app/middleware';
const AWS = require('aws-sdk');

export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {

        const { addValue } = req.body;

        // Configure AWS SDK
        AWS.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: process.env.REGION,
        });

        // Create an S3 object
        const s3 = new AWS.S3();

        // Specify the bucket and file key (path) of your JSON file
        const bucketName = process.env.BUCKET_NAME;
        const fileKey = 'holidayData.json';

        // Convert the updated JSON content to a string
        const updatedJsonContent = JSON.stringify(addValue, null, 2);

        // Upload the updated JSON content to S3
        const updateParams = {
          Bucket: bucketName,
          Key: fileKey,
          Body: updatedJsonContent,
          ContentType: 'application/json',
        };

        await s3.upload(updateParams).promise();


        res.json("imported");
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
  } catch (error) {
    console.error('Error updating holiday:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
