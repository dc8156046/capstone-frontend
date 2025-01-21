# Next.js Web Application

This web application is built using **Next.js**, **React.js**, **TailwindCSS**, and **Shadcn/UI**. It offers a modern, scalable, and efficient foundation for web development, leveraging cutting-edge tools and frameworks.

---

## Features

- **Next.js**: Server-side rendering, static site generation, and API routes.
- **React.js**: Component-based architecture for building user interfaces.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn/UI**: Accessible and customizable UI components.

---

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v16 or later)
- npm, yarn, pnpm, or bun package manager
- Git (optional, for version control)

---

## Getting Started

### Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/dc8156046/capstone-frontend.git
cd capstone-frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

---

## Project Structure

The project follows a standard Next.js structure with additional configuration for TailwindCSS and Shadcn/UI:

```plaintext
.
├── app/             # Application layouts, pages
├── components/      # Reusable React components
├── lib/             # Utility functions
├── services/        # Backend api request and response services
├── public/          # Static assets (images, icons, etc.)
├── src/
├── tailwind.config.js   # TailwindCSS configuration
├── postcss.config.js    # PostCSS configuration
├── next.config.js       # Next.js configuration
└── package.json         # Project metadata and scripts
```

---

## Scripts

Here are some common scripts you can use:

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Run the production build.
- `npm run lint`: Run ESLint to analyze and fix code issues.

---

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory to store your environment variables:

```plaintext
NEXT_PUBLIC_API_BASE_URL=<your-api-url>
```

Refer to [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables) for more details.

---

## Deployment

You can deploy this application to platforms like **Vercel**, **Netlify**, or **AWS**. For example, to deploy on **Vercel**:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Run the deployment command:
   ```bash
   vercel
   ```

Refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment) for more options.

---

## Learn More

To learn more about the frameworks and libraries used in this project, check out the following resources:

- **Next.js**:
  - [Next.js Documentation](https://nextjs.org/docs): Learn about features and APIs.
  - [Learn Next.js](https://nextjs.org/learn): Interactive tutorial.
  - [Next.js GitHub Repository](https://github.com/vercel/next.js): Contribute or provide feedback.

- **TailwindCSS**:
  - [TailwindCSS Documentation](https://tailwindcss.com/docs): Explore the utility classes and features.

- **Shadcn/UI**:
  - [Shadcn/UI Documentation](https://ui.shadcn.com/docs): Learn about Shadcn features and API.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with descriptive messages.
4. Open a pull request to the main branch.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Happy coding! 🚀

