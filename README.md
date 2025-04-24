# Ideaverse Frontend

This is the frontend application for Ideaverse, built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ideaverse-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   - Copy the `.env.local` file and configure it with your environment variables
   - Make sure the API endpoints are correctly configured

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   - The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Project Structure

- `/app` - Next.js app directory with pages and layouts
- `/components` - Reusable UI components
- `/context` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/services` - API service functions
- `/styles` - Global styles and Tailwind configuration
- `/types` - TypeScript type definitions

## Deployment

### Local Production Build

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

The application will be available at `http://localhost:3000` in production mode.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Troubleshooting

If you encounter any issues:

1. Clear the `.next` directory and node_modules:
   ```bash
   rm -rf .next node_modules
   pnpm install
   ```

2. Check the console for any error messages
3. Ensure all environment variables are properly set
4. Verify that the backend services are running

## Support

For any questions or issues, please open an issue in the repository. 