import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function handler(req, res) {
  const session = req.session.get('user');
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      // Find the consultation
      const consultation = await prisma.teleconsultation.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!consultation || consultation.userId !== session.id) {
        return res.status(404).json({ error: 'Consultation not found or you are not authorized.' });
      }

      // If consultation is already completed, return
      if (consultation.status === 'Completed') {
        return res.status(400).json({ error: 'Consultation already completed.' });
      }

      // Check if the room exists before deleting
      if (consultation.sessionUrl) {
        const roomName = consultation.sessionUrl.split('/').pop(); // Extract room name from URL

        // Delete the room from Daily.co
        await axios.delete(`https://api.daily.co/v1/rooms/${roomName}`, {
          headers: {
            Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          },
        });
      }

      // Update the consultation status to 'Completed'
      const updatedConsultation = await prisma.teleconsultation.update({
        where: { id: parseInt(id, 10) },
        data: { status: 'Completed', sessionUrl: null }, // Nullify sessionUrl once it's deleted
      });

      return res.status(200).json({ success: true, message: 'Consultation ended and room deleted.', updatedConsultation });
    } catch (error) {
      console.error('Error ending consultation session:', error);
      return res.status(500).json({ error: 'Failed to end consultation session.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
