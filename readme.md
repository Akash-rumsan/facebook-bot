# Facebook Messenger Bot

A TypeScript-based Facebook Messenger bot that integrates with an external API to provide intelligent responses to user queries. The bot can handle text messages, postback events, and includes a feedback system with interactive buttons.

## Features

- 🤖 **AI-Powered Responses**: Integrates with MEF API for intelligent query responses
- 💬 **Interactive Messages**: Supports button templates and postback handling
- 📝 **Feedback System**: Built-in feedback collection with yes/no buttons
- 🔧 **TypeScript**: Fully typed for better development experience
- ⚡ **Express.js**: Fast and minimal web framework
- 🔒 **Webhook Verification**: Secure webhook verification for Facebook Messenger

## Project Structure

```
messenger-bot/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── index.ts                  # Server entry point
│   ├── config/
│   │   └── config.ts            # Environment configuration
│   ├── controllers/
│   │   └── webhook.controller.ts # Webhook handlers
│   ├── routes/
│   │   └── webhook.routes.ts    # Webhook routes
│   ├── services/
│   │   ├── messenger.service.ts # Messenger API integration
│   │   └── query.service.ts     # External API query service
│   ├── types/
│   │   └── webhook.ts           # TypeScript type definitions
│   └── utils/
│       └── extractPlainText.ts  # Text processing utilities
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Facebook Developer Account
- Facebook Page and App configured for Messenger

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd messenger-bot
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   PAGE_ACCESS_TOKEN=your_facebook_page_access_token
   VERIFY_TOKEN=your_webhook_verify_token
   ```

## Environment Variables

| Variable            | Description                 | Required |
| ------------------- | --------------------------- | -------- |
| `PORT`              | Server port (default: 3000) | No       |
| `PAGE_ACCESS_TOKEN` | Facebook Page Access Token  | Yes      |
| `VERIFY_TOKEN`      | Webhook verification token  | Yes      |

## Usage

### Development Mode

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Type Checking

```bash
pnpm type-check
```

## API Endpoints

### Webhook Verification

- **GET** `/webhook`
- Verifies webhook with Facebook Messenger Platform
- Validates `hub.verify_token` against configured `VERIFY_TOKEN`

### Message Reception

- **POST** `/webhook`
- Receives messages and postback events from Facebook Messenger
- Processes user messages and sends appropriate responses

### Health Check

- **GET** `/`
- Returns bot status message

## Bot Functionality

### Message Handling

1. **Text Messages**:

   - Regular text messages are sent to the MEF API for intelligent responses
   - The bot extracts plain text from API responses and sends back to users

2. **Special Commands**:

   - `feedback`: Triggers an interactive button template asking for user feedback

3. **Postback Events**:
   - `yes`: Responds with "Thanks!"
   - `no`: Responds with "Oops, sorry!"

### External API Integration

The bot integrates with the MEF API (`https://api.mefqna.dev.rumsan.net`) to provide intelligent responses:

```typescript
POST /query/query_collection
{
  "query": "user_message",
  "top_k": 3,
  "temperature": 0.3
}
```

## Facebook Messenger Setup

1. **Create a Facebook App**

   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app with Messenger product

2. **Configure Webhook**

   - Set webhook URL: `https://your-domain.com/webhook`
   - Set verify token (same as `VERIFY_TOKEN` in .env)
   - Subscribe to `messages` and `messaging_postbacks` events

3. **Get Page Access Token**
   - Generate a page access token for your Facebook page
   - Add it to your `.env` file as `PAGE_ACCESS_TOKEN`

## Deployment

### Using Railway/Heroku

1. Connect your repository
2. Set environment variables in the platform dashboard
3. Deploy the application

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Development

### Adding New Features

1. **New Message Types**: Extend `MessageEvent` interface in `types/webhook.ts`
2. **New Postback Actions**: Add cases in `handlePostback` function
3. **New API Integrations**: Create new services in `services/` directory

### TypeScript Types

The project uses comprehensive TypeScript types for:

- Webhook events and payloads
- Messenger API requests and responses
- Configuration objects

## Error Handling

- API errors are caught and logged
- Fallback responses are provided when external services fail
- Webhook verification failures return appropriate HTTP status codes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions:

- Create an issue in the repository
- Check Facebook Messenger Platform documentation
- Review MEF API documentation

---

**Built with ❤️ using TypeScript and Express.js**
