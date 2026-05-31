import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import User from '../models/User.js';
import Image from '../models/Image.js';
import Blocklist from '../models/Blocklist.js';
import { protect } from '../middleware/auth.js';
import { checkCredits, generateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Style modifiers mapping
const STYLE_MODIFIERS = {
  'Realistic': 'photorealistic, highly detailed, professional photography, 8k resolution, cinematic lighting, natural shadows, sharp focus, award-winning composition',
  'Anime': 'modern anime key visual style, vibrant colors, detailed lineart, dramatic lighting, beautiful anime eyes, digital painting, atmospheric, Studio Ghibli or CoMix Wave style',
  'Cyberpunk': 'cyberpunk aesthetic, hyper-detailed neon-drenched city, glowing street lights, hologram advertisements, retro-futuristic, rain slicked pavement, volumetric fog, Unreal Engine 5 render',
  'Fantasy': 'enchanted high-fantasy theme, magical glowing flora, ethereal lighting, legendary sword or creatures, digital concept art, epic scale, hyper-detailed, trending on ArtStation',
  '3D Render': 'octane render, stylized 3D model style, smooth clay textures, perfect ambient occlusion, cute Pixar aesthetic, raytraced reflections, clean isometric layout, vibrant pastel palette',
  'Pixel Art': 'retro 16-bit pixel art style, crisp pixels, limited color palette, clean grid, classic SNES RPG aesthetic, highly detailed pixelated environment, nostalgiac'
};

// Aspect ratio mapping to width and height
const ASPECT_RATIOS = {
  '1:1': { width: 512, height: 512 },
  '16:9': { width: 896, height: 504 },
  '9:16': { width: 504, height: 896 }
};

// @desc    Generate AI Image
// @route   POST /api/generate
// @access  Private (Rate limited, Credit checked)
router.post('/', protect, checkCredits, generateLimiter, async (req, res, next) => {
  try {
    const { prompt, style = 'None', aspectRatio = '1:1', isPublic = true } = req.body;

    if (!prompt) {
      res.status(400);
      throw new Error('Please enter a text prompt');
    }

    // 1. Check prompt blocklist
    const activeBlocklist = await Blocklist.find();
    const cleanPrompt = prompt.toLowerCase();
    
    for (const item of activeBlocklist) {
      if (cleanPrompt.includes(item.phrase)) {
        res.status(400);
        throw new Error(`Your prompt contains flagged content "${item.phrase}" and cannot be processed.`);
      }
    }

    // 2. Prepare visual prompt from style
    let modifier = STYLE_MODIFIERS[style] || '';
    let finalPrompt = prompt;
    if (modifier) {
      finalPrompt = `${prompt}, ${modifier}`;
    }

    // 3. Prepare dimensions
    const dims = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['1:1'];

    // 4. Generate the image!
    let imageBuffer;
    let generatorUsed = 'Fallback (Pollinations AI)';

    // Stability AI configuration
    const stabilityKey = process.env.STABILITY_KEY;
    const openaiKey = process.env.OPENAI_KEY;

    if (stabilityKey) {
      try {
        console.log('Using Stability AI API...');
        generatorUsed = 'Stability AI';
        const response = await axios.post(
          'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
          {
            text_prompts: [{ text: finalPrompt, weight: 1 }],
            cfg_scale: 7,
            height: dims.height,
            width: dims.width,
            samples: 1,
            steps: 30,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${stabilityKey}`,
            },
          }
        );
        
        const base64Data = response.data.artifacts[0].base64;
        imageBuffer = Buffer.from(base64Data, 'base64');
      } catch (err) {
        console.error('Stability AI failed, trying OpenAI or falling back...', err.message);
      }
    }

    if (!imageBuffer && openaiKey) {
      try {
        console.log('Using OpenAI DALL-E 3 API...');
        generatorUsed = 'OpenAI DALL-E';
        const response = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            model: 'dall-e-3',
            prompt: finalPrompt,
            n: 1,
            size: aspectRatio === '1:1' ? '1024x1024' : (aspectRatio === '16:9' ? '1792x1024' : '1024x1792'),
            response_format: 'b64_json'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiKey}`,
            }
          }
        );

        const base64Data = response.data.data[0].b64_json;
        imageBuffer = Buffer.from(base64Data, 'base64');
      } catch (err) {
        console.error('OpenAI DALL-E failed, falling back to Pollinations...', err.message);
      }
    }

    // Fallback: Pollinations AI (Beautiful high quality Stable Diffusion wrapper)
    if (!imageBuffer) {
      try {
        console.log('Using Pollinations AI fallback...');
        const randomSeed = Math.floor(Math.random() * 99999999);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${dims.width}&height=${dims.height}&seed=${randomSeed}&nologo=true&enhance=false`;
        
        const response = await axios.get(imageUrl, { 
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 15000
        });
        imageBuffer = Buffer.from(response.data);
      } catch (err) {
        res.status(500);
        throw new Error(`Generation services are temporarily offline. Details: ${err.message}`);
      }
    }

    // 5. Save the generated image file locally
    const publicDir = path.join(__dirname, '../public');
    const genDir = path.join(publicDir, 'generations');
    
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(genDir)) fs.mkdirSync(genDir, { recursive: true });

    const filename = `art-${uuidv4()}.png`;
    const localPath = path.join(genDir, filename);
    await fs.promises.writeFile(localPath, imageBuffer);

    // Relative public URL
    const relativeUrl = `/generations/${filename}`;

    // 6. Deduct credit (Bypassed since AetherArt is free and unlimited)
    const user = await User.findById(req.user.id);

    // 7. Save Image object to MongoDB database
    const newImage = await Image.create({
      url: relativeUrl,
      prompt,
      enhancedPrompt: finalPrompt,
      style,
      aspectRatio,
      user: req.user.id,
      isPublic: isPublic
    });

    res.status(201).json({
      success: true,
      image: newImage,
      creditsRemaining: user.credits,
      generatorUsed
    });

  } catch (error) {
    next(error);
  }
});

export default router;
