// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
  const { prompt } = req.body;

  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ error: 'Missing Replicate API key' });
  }

  try {
    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "8e6663822bbbc982648e3c34214cf42d29fe421b2620cc33d8bda767fc57fe5a", // FLUX 1.1 Pro
        input: {
          prompt,
          width: 768,
          height: 512,
          aspect_ratio: "custom",
          output_format: "png",
          safety_tolerance: 1,
          prompt_upsampling: false,
        },
      }),
    });

    const prediction = await startResponse.json();

    if (!prediction || !prediction.id) {
      return res.status(500).json({ error: 'Invalid response from Replicate' });
    }

    let output = null;
    while (!output) {
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${REPLICATE_API_KEY}` },
      });

      const pollData = await pollRes.json();

      if (pollData.status === 'succeeded') {
        output = pollData.output;
      } else if (pollData.status === 'failed') {
        return res.status(500).json({ error: 'Image generation failed' });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    return res.status(200).json({ image: output });
  } catch (err) {
    console.error('❌ API Error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
