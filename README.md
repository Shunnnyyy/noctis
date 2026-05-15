# NOCTIS - noctis-lake

NOCTIS is an interactive black-and-white archive for mapping night light conditions across Toronto. Each photo point stores a location, time, light intensity, observation note, and short visual analysis.

## Live Site

- Production: https://noctis-lake.vercel.app
- Map: https://noctis-lake.vercel.app/map

## Features

- Generative night-map landing page with project status and entry points.
- Interactive Leaflet map using OpenStreetMap tiles.
- Filters for All, Commercial, Residential, and Favorites.
- Search across titles, times, conditions, observations, and analysis notes.
- Photo-point editor for area, condition, time, light intensity, observation, analysis, and image uploads.
- Favorite, delete, focus, and JSON export actions.
- Supabase-backed point storage for cross-device viewing and public submissions.
- localStorage fallback for offline cache and sync recovery.

## Running Locally

Open `index.html` directly in a browser, or run a small static server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Data Model

NOCTIS stores map points in the Supabase project `noctis-lake`, table `public.light_points`.

The current version uses an open contribution model. Any visitor can add, edit, or delete public map points. A future version can add authentication or edit tokens if the archive needs stronger moderation.

## Deployment

The site is deployed on Vercel as a static project. Pushing changes to the GitHub repository and running a production deploy updates:

```text
https://noctis-lake.vercel.app
```
