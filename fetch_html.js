const fs = require('fs');
const https = require('https');
const path = require('path');

const API_URL = 'https://api.github.com/repos/PASKUS791/Websitepaskus791/contents/codingan/webutama';
const SCRATCH_DIR = path.join(__dirname, 'website_utama', 'scratch', 'html_reference');

if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

const options = {
  headers: {
    'User-Agent': 'Node.js',
  }
};

https.get(API_URL, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const files = JSON.parse(data);
      if (!Array.isArray(files)) {
        console.error('Expected array, got:', files);
        return;
      }
      files.forEach(file => {
        if (file.type === 'file' && (file.name.endsWith('.html') || file.name.endsWith('.css'))) {
          downloadFile(file.download_url, file.name);
        }
      });
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  });
}).on('error', err => {
  console.error('Error fetching API:', err);
});

function downloadFile(url, filename) {
  https.get(url, options, (res) => {
    const filePath = path.join(SCRATCH_DIR, filename);
    const fileStream = fs.createWriteStream(filePath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log('Downloaded', filename);
    });
  }).on('error', err => {
    console.error('Error downloading file', filename, err);
  });
}
