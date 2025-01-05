import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the nexile_digital directory path
const nexileDigitalDir = path.join(__dirname, 'uploads', 'nexile digital');

// Ensure the nexile_digital directory exists
if (!fs.existsSync(nexileDigitalDir)) {
    fs.mkdirSync(nexileDigitalDir, { recursive: true });
}

// Define the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, nexileDigitalDir); // Specify the destination directory as 'uploads/nexile_digital'
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Keep original file name with a timestamp
  }
});

// Export the multer upload instance
export const upload = multer({ storage: storage });
