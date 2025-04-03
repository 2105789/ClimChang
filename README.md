# ClimChang - A Minimalist Blog with Nuxt, Tailwind, and Firebase

A minimalist, modern blog application built with Nuxt 3, Tailwind CSS, and Firebase.

## Features

- 🎨 Modern, minimalist design with Tailwind CSS
- 🌓 Dark/light mode support
- 📱 Fully responsive for all device sizes
- 🔍 Search functionality
- 🗂️ Category organization
- 📃 Related posts recommendations
- 🔥 Firebase integration (Firestore, Auth, Storage)

## Screenshots

(Add screenshots here once the application is deployed)

## Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore)
- **File Storage**: Firebase Storage

## Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd miniblog
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Enable Firestore, Authentication, and Storage
   - Update the Firebase configuration in `plugins/firebase.js`

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Mock Data

The application includes mock data for development purposes. The mock data is automatically used when the Firebase configuration is not provided or when in development mode.

To use the real Firebase backend, update the Firebase configuration in `plugins/firebase.js` with your actual Firebase project details.

### Structure

- `components/`: Reusable Vue components
- `composables/`: Vue composables for state and logic
- `layouts/`: Page layouts
- `pages/`: Application pages and routes
- `plugins/`: Nuxt plugins
- `public/`: Static assets
- `assets/`: CSS and other assets

## Deployment

To deploy the application:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   # or
   bun run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   # or
   yarn preview
   # or
   bun run preview
   ```

3. Deploy to your hosting provider of choice. For Firebase Hosting:
   ```bash
   firebase deploy
   ```

## License

[MIT](LICENSE)

## Acknowledgments

- [Nuxt.js](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Vue.js](https://vuejs.org/)
