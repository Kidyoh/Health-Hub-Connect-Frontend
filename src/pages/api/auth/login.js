import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { withIronSession } from 'next-iron-session';
const prisma = new PrismaClient();

async function handler(req, res) {
  const { email, password, role } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });
  console.log("The user is >>>>>>>>>>", user);
  if (!user) {
    return res.status(400).json({ message: 'No such user found' });
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  if(user.role !== role){
    return res.status(403).json({message: 'Access denied'});
  }
  console.log(user);
  req.session.set('user', { id: user.id, role: user.role, email: user.email, first_name: user.first_name, last_name: user.last_name});
  console.log("The setted session is >>>>>>>>>>", req.session.get('user'));
  await req.session.save();
  res.json({ message: 'Logged in' });
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});