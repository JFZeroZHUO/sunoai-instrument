const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 8091;

app.use(cors());
app.use(express.static(__dirname));

// Ensure audio directory exists
const uploadDir = path.join(__dirname, 'audio');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const metadataPath = path.join(__dirname, 'metadata.json');

// Helper to read metadata
function getMetadata() {
    if (!fs.existsSync(metadataPath)) {
        return {};
    }
    try {
        const data = fs.readFileSync(metadataPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading metadata:", e);
        return {};
    }
}

// Helper to save metadata
function saveMetadata(data) {
    try {
        fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing metadata:", e);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_\-]/g, '_');
        cb(null, `${name}_${Date.now()}${ext}`)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed!'), false);
        }
    }
});

// Get metadata endpoint
app.get('/api/metadata', (req, res) => {
    res.json(getMetadata());
});

app.post('/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }

    const contributor = req.body.contributor || 'Anonymous';
    const promptKey = req.body.promptKey;

    if (promptKey) {
        const metadata = getMetadata();
        metadata[promptKey] = {
            contributor: contributor,
            filePath: `audio/${req.file.filename}`,
            timestamp: Date.now()
        };
        saveMetadata(metadata);
    }

    // Return the relative path to the file
    res.json({ 
        message: 'File uploaded successfully', 
        filePath: `audio/${req.file.filename}`,
        contributor: contributor
    });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;
