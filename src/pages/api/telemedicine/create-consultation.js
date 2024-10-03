import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import axios from 'axios';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

async function handler(req, res) {
  // Check session
  if (!req.session) {
    return res.status(500).json({ error: 'Session is not initialized.' });
  }

  // Check if user is authenticated
  const session = req.session.get('user');
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized, user not logged in.' });
  }

  const { gateway, teleconsultorId, date } = req.body;

  if (!teleconsultorId || !date || !gateway) {
    return res.status(400).json({ error: 'Teleconsultor, date, and payment gateway are required.' });
  }

  try {
    // Fetch teleconsultor details
    const teleconsultor = await prisma.user.findUnique({
      where: { id: parseInt(teleconsultorId, 10) },
      select: { firstName: true, lastName: true, rate: true },
    });

    if (!teleconsultor) {
      return res.status(404).json({ error: 'Teleconsultor not found.' });
    }

    // Create a consultation record
    const teleconsultation = await prisma.teleconsultation.create({
      data: {
        userId: session.id, // Using session ID
        doctor: `${teleconsultor.firstName} ${teleconsultor.lastName}`,
        date: new Date(date),
        status: 'Pending Payment',
      },
    });

    let paymentUrl;

    if (gateway === 'stripe') {
      // Create Stripe payment session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: `Teleconsultation with Dr. ${teleconsultor.firstName} ${teleconsultor.lastName}` },
            unit_amount: teleconsultor.rate * 100,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?teleconsultationId=${teleconsultation.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment-cancel`,
      });
      paymentUrl = session.url;
    } else if (gateway === 'chapa') {
      // Create Chapa payment session
      const chapaResponse = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
        amount: teleconsultor.rate,
        currency: 'ETB',
        email: session.email, // Assuming user email in session
        tx_ref: `tx-${teleconsultation.id}`,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?teleconsultationId=${teleconsultation.id}`,
        return_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?teleconsultationId=${teleconsultation.id}`,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      });
      paymentUrl = chapaResponse.data.data.checkout_url;
    }

    return res.status(201).json({ success: true, paymentUrl });
  } catch (error) {
    console.error('Error creating consultation or initiating payment:', error);
    return res.status(500).json({ error: 'Failed to create consultation or initiate payment.' });
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'next-iron-session/login',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
