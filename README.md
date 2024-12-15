# S3 CDN Manager

A modern file management application for AWS S3, built with Next.js 13+ and Shadcn UI.

## Features

-   📁 File and folder management
-   📤 File upload (drag & drop, multi-file support)
-   📋 Copy, move, and rename files
-   🗑️ Delete files (single or bulk)
-   🔍 File search
-   📊 Storage and file/folder statistics
-   🎨 Modern UI with Shadcn UI
-   🌙 Dark mode support

## System Requirements

-   Node.js 18.0.0 or later
-   pnpm 8.0.0 or later
-   AWS account with S3 access

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd s3-cdn-manager
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_CDN_URL=your_cdn_url
```

5. Run in development mode:

```bash
pnpm dev
```

6. Build and run in production:

```bash
pnpm build
pnpm start
```

## Project Structure

```
s3-cdn-manager/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and shared logic
│   ├── types/           # TypeScript type definitions
│   └── constants/       # Constants and configuration
├── public/              # Static files
└── package.json         # Project dependencies
```

## Tech Stack

-   [Next.js](https://nextjs.org/) - React framework
-   [Shadcn UI](https://ui.shadcn.com/) - UI components
-   [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching
-   [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) - AWS S3 integration
-   [Framer Motion](https://www.framer.com/motion/) - Animations
-   [Tailwind CSS](https://tailwindcss.com/) - Styling

## Environment

The application can run in:

-   Development: `pnpm dev`
-   Production: `pnpm build && pnpm start`

## S3 Configuration

1. Create an S3 bucket with public access
2. Configure CORS for the bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT
