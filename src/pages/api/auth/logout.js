import { withIronSession } from 'next-iron-session';

async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            req.session.destroy();
            res.status(200).json({ success: true });
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