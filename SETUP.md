# Setup Instructions

## System Requirements

### Node.js Version
This project requires **Node.js 20.0.0 or higher** for optimal performance and compatibility with Supabase.

#### Check your Node.js version:
```bash
node --version
```

#### Installing Node.js 20+ 

##### Option 1: Using NVM (Recommended)
```bash
# Install NVM if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20
nvm use 20

# Or use the .nvmrc file
nvm use
```

##### Option 2: Direct Download
Download and install Node.js 20+ from: https://nodejs.org/

##### Option 3: Using Package Manager
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS with Homebrew
brew install node@20
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gc-digital-net/social-media-scheduler.git
cd social-media-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run database migrations:
```bash
npx supabase db push
```

5. Start the development server:
```bash
npm run dev
```

## Why Node.js 20+?

- **Supabase Compatibility**: Supabase SDK v2+ requires Node.js 20 or later
- **Performance**: Native fetch API and improved performance
- **Security**: Latest security updates and patches
- **Modern Features**: Support for latest JavaScript features

## Troubleshooting

If you see the warning:
```
⚠️ Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js
```

Please upgrade to Node.js 20+ using the instructions above.