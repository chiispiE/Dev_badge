# Active Developer Badge Bot

A Discord bot with a clean project structure.

## Project Structure

```
Dev_badge/
├── index.js           # Entry point, loads src/index.js
├── package.json       # Project metadata and scripts
├── .env.example       # Example environment file
├── src/
│   ├── index.js       # Starts the bot
│   └── bot.js         # Bot logic
```

## Setup

1. Copy `.env.example` to `.env` and add your Discord bot token.
2. Install dependencies:

    ```powershell
    npm install
    ```

3. Start the bot:

    ```powershell
    npm start
    ```

## Development

For hot-reloading during development:

```powershell
npm run dev
```

## License

ISC
