import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const saltRounds = 10;

export default async function handle(req, res) {
  const { first_name, last_name, email, password, phone, location, role } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email: email } });
  if (existingUser) {
    return res.status(400).json({ error: 'A user with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = await prisma.user.create({
    data: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      phone: phone,
      location: location,
      role: role
    },
  });
  res.json(newUser);
}