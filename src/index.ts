import express, { Request, Response } from 'express';
import axios from 'axios';
import https from 'https';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SSL Agent to ignore certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Target API URL
const TARGET_API = process.env.TARGET_API || 'https://aceh.sigap.latih.id/bencana/korban';

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Sigap Bridging Service is running');
});

// Proxy endpoint
app.post('/bencana/korban', async (req: Request, res: Response) => {
  try {
    console.log('Received request for /bencana/korban');
    console.log('Payload:', JSON.stringify(req.body, null, 2));

    const response = await axios.post(TARGET_API, req.body, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {})
      }
    });

    console.log('Target API Response:', response.status, response.data);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error forwarding request:', error.message);
    if (error.response) {
      console.error('Target API Error Response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Forwarding requests to: ${TARGET_API}`);
});
