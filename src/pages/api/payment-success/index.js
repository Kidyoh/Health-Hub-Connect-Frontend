// /pages/api/payment-success.js
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const { teleconsultationId } = req.body;

  if (!teleconsultationId) {
    return res.status(400).json({ error: 'Teleconsultation ID is required.' });
  }

  try {
    // Update teleconsultation status to Approved
    await prisma.teleconsultation.update({
      where: { id: parseInt(teleconsultationId) },
      data: { status: 'Approved' },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating teleconsultation status:', error);
    return res.status(500).json({ error: 'Failed to update teleconsultation status.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
