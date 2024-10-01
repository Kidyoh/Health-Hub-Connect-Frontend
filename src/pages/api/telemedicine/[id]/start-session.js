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

      // Check if room URL already exists
      if (consultation.sessionUrl) {
        return res.status(200).json({ success: true, roomUrl: consultation.sessionUrl });
      }

      // If no room exists, create a new one
      const roomResponse = await axios.post(
        'https://api.daily.co/v1/rooms',
        {
          properties: {
            enable_chat: true,
            enable_screenshare: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          },
        }
      );

      const roomUrl = roomResponse.data.url;

      // Update consultation with the room URL
      const updatedConsultation = await prisma.teleconsultation.update({
        where: { id: parseInt(id, 10) },
        data: { sessionUrl: roomUrl, status: 'In Progress' },
      });

      return res.status(200).json({ success: true, roomUrl });
    } catch (error) {
      console.error('Error starting video session:', error);
      return res.status(500).json({ error: 'Failed to start consultation session.' });
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
