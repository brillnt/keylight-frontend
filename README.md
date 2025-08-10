# Keylight Frontend

Angular frontend for the Keylight intake form system.

## Overview

This Angular application provides:
- Public intake form for Ritz-Craft buyer referrals
- Admin dashboard for managing submissions
- Responsive design for mobile and desktop
- Integration with Node.js backend API

## Tech Stack

- Angular 17+
- Angular Material
- Reactive Forms
- TypeScript

## Features

### Public Intake Form
- Contact details collection
- Buyer category selection (homebuyer/developer)
- Financing preferences
- Land status and location
- Build budget and timeline
- Project description
- Email confirmation upon submission

### Admin Dashboard
- View all submissions in data table
- Filter and sort submissions
- Update submission status
- Add admin notes
- View detailed submission information

## Routes

- `/intake` - Public intake form
- `/admin` - Admin dashboard (password protected)

## Environment Configuration

The app uses Angular environments for API configuration:
- Development: `http://localhost:3000`
- Production: Render.com backend URL

## Development

```bash
npm install
ng serve
```

## Build

```bash
ng build --configuration=production
```

## Deployment

Deployed on Render.com as a Static Site.

