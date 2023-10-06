import transporter from "@/nodemail";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        
        await transporter.sendMail({
          from: 'vinodhkumaryin@gmail.com',
          to: 'edwinraj1462003@gmail.com',
          subject: 'Leave Request',
          text: 'Saravanan and Saravanan Apllied for two days leave.',
        });
  
        res.status(200).json({ message: 'Email sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }