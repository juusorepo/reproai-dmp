# ReproAI Static Frontend

This is a simple static frontend for the ReproAI project. It allows users to view and download manuscript analyses by interacting with the ReproAI FastAPI backend.

## Features
- Fetches a list of manuscripts from the backend API
- Allows exporting manuscript analyses as PDF files
- Uses an API key for secure backend access

## Project Structure
```
frontend/
├── index.html      # Main HTML file
├── app.js          # JavaScript logic for API interaction
├── style.css       # Optional: CSS styles
```

## Deployment
You can deploy this static site to any static hosting provider, such as GitHub Pages, Netlify, Vercel, or Windsurf.

### GitHub Pages
1. Push the contents of this folder to your GitHub repository (e.g., `reproai-frontend`).
2. Enable GitHub Pages in the repository settings, using the `main` branch and `/ (root)` folder.
3. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

### Other Platforms
- Upload the contents of this folder to your provider's dashboard, or link your repository for automatic deployment.

## Configuration
- The frontend expects the following environment variables (can be injected at build time or via `window`):
  - `REACT_APP_API_URL` — The base URL of your backend API (default: Azure deployment URL)
  - `REACT_APP_API_KEY` — The API key for backend access
- You can set these variables in your hosting platform's environment settings, or modify `app.js` for defaults.

## Usage
- Open `index.html` in your browser (served via a static server or deployed online).
- The manuscript list will load automatically.
- Click "Export PDF" to download the analysis for a manuscript.

## License
This project is part of the ReproAI suite. See the main repository for licensing details.

---

For backend/API configuration and deployment, see the main ReproAI project documentation.
