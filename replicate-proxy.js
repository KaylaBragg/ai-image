const express = require('express');
const cors = require('cors');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

// Replace with your actual Replicate API token
const REPLICATE_API_KEY = 'r8_VXVwHJfVjRnfCNnDfAaI5D9V4pS3f7y1R14Hy';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Replicate proxy is running');
});

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('📩 Received prompt:', prompt);

    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'f421a3325339ea944e320ef532d251dda16edd5bcf3207bf3385d81fdb6a635d', // FLUX 1.1 Pro version ID
        input: {
          prompt,
          aspect_ratio: 'custom',
          width: 768,
          height: 512,
          output_format: 'png',
          safety_tolerance: 2,
          prompt_upsampling: false,
        },
      }),
    });

    const prediction = await startResponse.json();
    console.log('🛰️ Replicate response:', prediction);

    if (!prediction || !prediction.id) {
      console.error('❌ Invalid prediction response:', prediction);
      return res.status(500).json({ error: 'Invalid response from Replicate.' });
    }

    let output = null;
    while (!output) {
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { Authorization: `Token ${REPLICATE_API_KEY}` },
        }
      );

      const pollData = await pollResponse.json();
      console.log('🔄 Polling status:', pollData.status);

      if (pollData.status === 'succeeded') {
        output = pollData.output;
      } else if (pollData.status === 'failed') {
        console.error('❌ Replicate failure details:\n', JSON.stringify(pollData, null, 2));
        return res
          .status(500)
          .json({ error: pollData.error || 'Image generation failed.' });
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    console.log('✅ Final image URL:', output);
    res.json({ image: output });

  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Replicate proxy running on http://localhost:${PORT}`);
});
