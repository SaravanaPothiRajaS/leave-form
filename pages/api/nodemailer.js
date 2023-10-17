import authenticateToken from "@/app/middleware";
import transporter from "@/nodemail";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        authenticateToken(req, res, async(isAuthenticated) => {
          if (isAuthenticated) {
        await transporter.sendMail({
          from: 'vinodhkumaryin@gmail.com',
          to: 'bvk123456@protonmail.com',
          subject: 'Leave Request',
          text: 'Saravanan and Saravanan Apllied for two days leave.',
        });
  
        res.status(200).json({ message: 'Email sent successfully' });
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }