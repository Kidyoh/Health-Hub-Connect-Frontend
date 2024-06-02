import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';

const prisma = new PrismaClient();

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const session = req.session.get('user');
            if (!session) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const userId = session.id;
            const appointments = await prisma.appointment.findMany({
                where: { userId: userId }
            });

            res.status(200).json({ success: true, appointments });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});