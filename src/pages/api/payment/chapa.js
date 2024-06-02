import Chapa from 'chapa';

// Initialize the Chapa instance
const myChapa = new Chapa(process.env.CHAPA_SECRET_KEY);

// Define the API route
export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    const customerInfo = req.body;

    try {
    
      const response = await myChapa.initialize(customerInfo, { autoRef: true });

      // Send the response back to the client
      res.status(200).json(response);
    } catch (error) {
      // Log the error and send a response back to the client
      console.error(error);
      res.status(500).json({ error: 'An error occurred while initializing the transaction.' });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}