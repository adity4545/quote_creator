import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from the React app
app.use(express.static(join(__dirname, 'dist')));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Parse JSON payloads
app.use(express.json());

// API endpoint to handle image uploads and quote generation
app.post('/api/generate', upload.array('images', 3), (req, res) => {
  try {
    const { quote, author, style, backgroundStyle } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // In a real implementation, you would use a library like Sharp or Jimp
    // to process the images and generate the quote image
    // For this demo, we'll just return the uploaded image paths

    const imagePaths = files.map(file => `/uploads/${file.filename}`);
    
    // Return the generated image paths and metadata
    res.json({
      success: true,
      message: 'Quote image generated successfully',
      data: {
        images: imagePaths,
        quote,
        author,
        style: JSON.parse(style),
        backgroundStyle
      }
    });
  } catch (error) {
    console.error('Error generating quote image:', error);
    res.status(500).json({ error: 'Failed to generate quote image' });
  }
});

// Handle all other GET requests by serving the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});