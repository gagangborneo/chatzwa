# OpenRouter API Integration Setup

## Overview
This document explains how to set up and use OpenRouter API as the AI service provider for your chatbot application.

## Prerequisites
- OpenRouter account and API key
- Node.js development environment

## Setup Instructions

### 1. Get OpenRouter API Key
1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Navigate to the API Keys section
3. Generate a new API key
4. Copy the API key for configuration

### 2. Configure Environment Variables
Edit the `.env.local` file in your project root:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI Chatbot

# Database (existing)
DATABASE_URL="file:./dev.db"

# Optional: Ollama Configuration (if you want local AI instead)
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama2
```

### 3. Available Models
OpenRouter supports various models. Some popular options:

- `anthropic/claude-3.5-sonnet` (recommended)
- `anthropic/claude-3-haiku`
- `openai/gpt-4o`
- `openai/gpt-4o-mini`
- `google/gemini-pro-1.5`
- `meta-llama/llama-3.1-70b-instruct`

### 4. Running the Application
```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Usage
The application automatically detects and uses OpenRouter API when `OPENROUTER_API_KEY` is configured. If both OpenRouter and Ollama are configured, Ollama takes precedence.

## Error Handling
- If no API service is configured, the chat API will return an error
- Invalid API keys will result in authentication errors
- Rate limiting errors are handled gracefully

## Cost Management
OpenRouter charges per token. Monitor your usage in the OpenRouter dashboard.

## Troubleshooting

### Common Issues
1. **"No AI service configured"**: Ensure `OPENROUTER_API_KEY` is set in `.env.local`
2. **Authentication errors**: Verify your API key is correct
3. **Model not found**: Check if the model name is correct and available
4. **Rate limiting**: Wait and retry, or upgrade your plan

### Debug Mode
Set the following environment variables for debugging:
```bash
DEBUG=*
LOG_LEVEL=debug
```

## Security Notes
- Never commit your API key to version control
- Use environment variables for all sensitive configuration
- Consider using a secrets management system in production

## Migration from ZAI API
The application has been successfully migrated from ZAI API to OpenRouter API. Key changes:
- Removed `z-ai-web-dev-sdk` dependency
- Added OpenRouter HTTP client integration
- Updated API route to use OpenRouter endpoints
- Added proper error handling for OpenRouter responses