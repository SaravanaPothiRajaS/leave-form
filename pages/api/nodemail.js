import transporter from "@/nodemail";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const {name,status}=req.body;
        await transporter.sendMail({
          from: 'vinodhkumarjr28@gmail.com',
          to: 'bvk123456@protonmail.com',
          subject: 'Leave status',
          text: `Dear ${name},
          Your request for leave is ${status}`,
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