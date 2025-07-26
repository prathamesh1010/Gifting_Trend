# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/331cae3c-c66a-4b8a-ba79-26c2870941d6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/331cae3c-c66a-4b8a-ba79-26c2870941d6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Google Trends API
- Recharts (for data visualization)

## Features

### Dynamic Trending Data Integration (India-Focused 2025)

The application now includes comprehensive real-time trending data integration focused on the Indian market for 2025 with the following features:

- **Real-Time Trending Words**: Live data from News APIs, Reddit, GitHub, and social media
- **Gifting-Related Queries**: Dynamic search queries related to Indian gifting culture and 2025 trends
- **Related Topics**: Topics trending in relation to Indian tech and innovation in 2025
- **Interest Over Time**: Charts showing search interest trends over time with 2025 predictions
- **Regional Interest**: Geographic distribution across Indian states
- **Interactive Analytics**: Advanced visualizations and filtering options for 2025 data
- **Multiple Data Sources**: News, Reddit, GitHub, and social media trends

#### Components Added:

1. **TrendingWords Component** (`src/components/TrendingWords.tsx`)
   - Displays trending search terms in a tabbed interface
   - Supports filtering by region and time range
   - Shows trending searches, gifting queries, and related topics

2. **TrendingAnalysis Component** (`src/components/TrendingAnalysis.tsx`)
   - Advanced analytics with charts and visualizations
   - Interest over time charts
   - Regional interest distribution
   - Category distribution pie charts
   - Custom keyword search functionality

3. **GoogleTrendsService** (`src/services/GoogleTrendsService.ts`)
   - Service layer for multiple API integrations (News, Reddit, GitHub, social media)
   - Methods for fetching trending data, interest over time, and regional data
   - Error handling and fallback data generation
   - Real-time data aggregation from multiple sources

4. **useGoogleTrends Hook** (`src/hooks/useGoogleTrends.ts`)
   - Custom React hook for managing Google Trends data
   - Provides loading states, error handling, and data fetching utilities

#### Usage:

The Google Trends features are automatically integrated into the main dashboard with India as the default region and 2025 focus. Users can:

- View trending search terms in real-time (India 2025-focused)
- Filter data by geographic region (India, US, UK, Canada, Australia, Germany)
- Adjust time ranges (past month, 3 months, year, or 2025-specific ranges)
- Search for specific keywords and see their trend data
- View interactive charts and visualizations
- Refresh data manually or let it update automatically
- Explore 2025 tech trends and Indian festival patterns
- Access 2025-specific time ranges (January 2025, Q1 2025, etc.)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/331cae3c-c66a-4b8a-ba79-26c2870941d6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
