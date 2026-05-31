import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

import User from '../models/User.js';
import Image from '../models/Image.js';
import Blocklist from '../models/Blocklist.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEED_ARTWORKS = [
  {
    prompt: 'A majestic cybernetic lion with glowing neon blue circuitry, sitting on a high ledge overlooking a futuristic Tokyo cyberpunk skyline, Unreal Engine 5 render, cinematic lighting',
    style: 'Cyberpunk',
    aspectRatio: '16:9',
    width: 896,
    height: 504,
    filename: 'seed-lion.png'
  },
  {
    prompt: 'Ethereal fantasy forest at midnight with giant glowing mushrooms, floating mystical fireflies, ancient magical stone archway, digital painting, atmospheric, high-fantasy concept art',
    style: 'Fantasy',
    aspectRatio: '16:9',
    width: 896,
    height: 504,
    filename: 'seed-forest.png'
  },
  {
    prompt: 'Hyper-detailed close-up portrait of a futuristic robotic cyborg warrior, sleek white plating, soft amber eyes, intricate metallic lines, studio photography, sharp focus, 8k resolution',
    style: 'Realistic',
    aspectRatio: '1:1',
    width: 512,
    height: 512,
    filename: 'seed-cyborg.png'
  },
  {
    prompt: 'Sleek sports concept car drifting on a glowing glass bridge, liquid reflections, vibrant retro synthesizer background, neon pink and cyan color palette, digital render',
    style: '3D Render',
    aspectRatio: '16:9',
    width: 896,
    height: 504,
    filename: 'seed-car.png'
  },
  {
    prompt: 'A cute wizard kitten casting a glowing spell from a tiny wooden wand, sparkling golden particles, detailed anime illustration, Studio Ghibli style, vibrant colors',
    style: 'Anime',
    aspectRatio: '1:1',
    width: 512,
    height: 512,
    filename: 'seed-kitten.png'
  },
  {
    prompt: 'Classic retro pixel art of a cozy wooden tavern interior, open brick fireplace, glowing lanterns, medieval bar counter, detailed 16-bit RPG aesthetic',
    style: 'Pixel Art',
    aspectRatio: '16:9',
    width: 896,
    height: 504,
    filename: 'seed-tavern.png'
  }
];

export const seedDatabaseInline = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Image.deleteMany({});
    await Blocklist.deleteMany({});

    // Create paths
    const publicDir = path.join(__dirname, '../public');
    const genDir = path.join(publicDir, 'generations');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(genDir)) fs.mkdirSync(genDir, { recursive: true });

    // Seed default users
    console.log('Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const adminUser = await User.create({
      name: 'Admin Aether',
      email: 'admin@aetherart.com',
      password: adminPassword,
      role: 'admin',
      plan: 'premium',
      credits: 9999,
      subscriptionStatus: 'active'
    });

    const standardUser = await User.create({
      name: 'John Art',
      email: 'john@aetherart.com',
      password: userPassword,
      role: 'user',
      plan: 'pro',
      credits: 150,
      subscriptionStatus: 'active'
    });

    console.log('Users seeded successfully.');

    // Seed word blocklist
    console.log('Seeding prompt blocklist...');
    await Blocklist.create([
      { phrase: 'nsfw', createdBy: adminUser._id },
      { phrase: 'nudity', createdBy: adminUser._id },
      { phrase: 'violence', createdBy: adminUser._id },
      { phrase: 'gore', createdBy: adminUser._id },
      { phrase: 'toxic', createdBy: adminUser._id }
    ]);
    console.log('Blocklist seeded.');

    // Seed community images
    console.log('Downloading seed artworks from Pollinations AI (may take a few seconds)...');
    
    for (const art of SEED_ARTWORKS) {
      try {
        console.log(`Generating: ${art.prompt.substring(0, 40)}...`);
        const randomSeed = Math.floor(Math.random() * 999999);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(art.prompt)}?width=${art.width}&height=${art.height}&seed=${randomSeed}&nologo=true&enhance=false`;

        const response = await axios.get(url, { 
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 12000 
        });
        const localPath = path.join(genDir, art.filename);
        await fs.promises.writeFile(localPath, Buffer.from(response.data));

        const relativeUrl = `/generations/${art.filename}`;

        // Random likes
        const likes = [];
        if (Math.random() > 0.3) likes.push(standardUser._id);
        if (Math.random() > 0.5) likes.push(adminUser._id);

        // Add some mock comments
        const comments = [];
        if (Math.random() > 0.4) {
          comments.push({
            user: standardUser._id,
            userName: standardUser.name,
            text: 'This is absolutely gorgeous! Love the visual flow.',
            createdAt: new Date()
          });
        }
        if (Math.random() > 0.6) {
          comments.push({
            user: adminUser._id,
            userName: adminUser.name,
            text: 'Excellent composition and color harmony.',
            createdAt: new Date()
          });
        }

        await Image.create({
          url: relativeUrl,
          prompt: art.prompt,
          enhancedPrompt: art.prompt,
          style: art.style,
          aspectRatio: art.aspectRatio,
          user: Math.random() > 0.5 ? adminUser._id : standardUser._id,
          isPublic: true,
          likes,
          comments
        });

        console.log(`Successfully seeded image: ${art.filename}`);
      } catch (err) {
        console.error(`Failed to seed artwork "${art.prompt.substring(0, 20)}":`, err.message);
      }
    }

    console.log('Seeding process complete! Memory database is now ready.');
  } catch (error) {
    console.error('Seeding critical failure:', error);
  }
};
