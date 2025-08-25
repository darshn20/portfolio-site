const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

// For Vercel serverless functions, we need to handle each request individually
module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Check if it's a static file request
    const url = req.url || '/';
    const staticFileExtensions = ['.js', '.css', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.xml', '.txt', '.json'];
    const isStaticFile = staticFileExtensions.some(ext => url.endsWith(ext));

    if (isStaticFile) {
      // Try to serve static file from browser directory
      const filePath = path.join(__dirname, '../dist/portfolio/browser', url);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);

        // Set appropriate content type
        const ext = path.extname(url).toLowerCase();
        const contentTypes = {
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.pdf': 'application/pdf',
          '.xml': 'application/xml',
          '.txt': 'text/plain'
        };

        res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
        res.status(200).send(fileContent);
        return;
      }
    }

    // Dynamic import for ES module with proper file URL
    const serverPath = path.join(__dirname, '../dist/portfolio/server/server.mjs');
    const serverUrl = pathToFileURL(serverPath).href;
    const { app } = await import(serverUrl);

    // Create a new Express app instance for this request
    const expressApp = app();

    // Create a mock server to handle the request
    const mockServer = {
      listen: () => { },
      address: () => ({ port: 3000 })
    };

    // Override the listen method to prevent the server from actually starting
    expressApp.listen = () => mockServer;

    // Handle the request directly
    expressApp(req, res);

  } catch (error) {
    console.error('Server error:', error);
    console.error('Error stack:', error.stack);

    // Send a basic HTML response for the main page
    if (req.url === '/' || req.url === '/index.html') {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Darshan Bhuva Portfolio</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>Portfolio Loading...</h1>
          <p>The site is currently being set up. Please try again in a moment.</p>
          <script>
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          </script>
        </body>
        </html>
      `);
    } else {
      res.status(404).json({
        error: 'Not Found',
        details: 'The requested resource was not found',
        url: req.url
      });
    }
  }
};