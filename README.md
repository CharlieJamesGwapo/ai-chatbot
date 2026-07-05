# AI Chatbot

A modern ChatGPT-style chat interface built with Next.js 14, TypeScript, React 18, and Tailwind CSS. Features real-time streaming responses from OpenAI API, persistent chat history, markdown rendering with syntax highlighting, and a beautiful dark mode UI.

## Features

- **AI Chat Interface** - Chat with OpenAI models (GPT-4, GPT-3.5-turbo)
- **Streaming Responses** - Real-time text generation using fetch + ReadableStream
- **Chat History** - Persistent conversations stored in localStorage
- **Conversation Management** - Create, rename, and delete conversations
- **Markdown Rendering** - Full markdown support including code blocks with syntax highlighting
- **Code Highlighting** - Syntax highlighting using highlight.js
- **Copy to Clipboard** - Easy one-click copying of messages
- **Regenerate Responses** - Re-generate the last assistant message
- **Token Counting** - Display message token usage (approximate)
- **Model Selection** - Choose between GPT-4 and GPT-3.5-turbo
- **System Prompt Customization** - Define AI behavior with custom prompts
- **Temperature Control** - Adjust creativity level (0-2 scale)
- **Dark Mode** - Full dark mode support with theme persistence
- **Responsive Design** - Works seamlessly on desktop and tablet

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Markdown**: react-markdown with custom components
- **Code Highlighting**: highlight.js
- **Storage**: Browser localStorage (client-side only)
- **API**: OpenAI Chat Completions API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CharlieJamesGwapo/ai-chatbot.git
cd ai-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. Navigate to Settings (`/settings`)
2. Enter your OpenAI API key
3. Choose your preferred model (GPT-4 or GPT-3.5-turbo)
4. Customize the system prompt if desired
5. Adjust temperature for desired creativity level
6. Save your settings

## Project Structure

```
ai-chatbot/
├── app/
│   ├── page.tsx              # Main chat interface
│   ├── layout.tsx            # Root layout with metadata
│   ├── layout-client.tsx     # Client-side theme management
│   ├── globals.css           # Global styles and animations
│   └── settings/
│       └── page.tsx          # Settings page
├── components/
│   ├── ChatWindow.tsx        # Main chat display area
│   ├── ConversationList.tsx  # Sidebar with conversations
│   ├── MessageBubble.tsx     # Individual message display
│   ├── InputBar.tsx          # Message input field
│   ├── MarkdownRenderer.tsx  # Markdown rendering with custom components
│   ├── CodeBlock.tsx         # Code block with syntax highlighting
│   ├── CopyButton.tsx        # Copy to clipboard button
│   ├── DarkModeToggle.tsx    # Theme switcher
│   ├── ModelSelector.tsx     # Model selection dropdown
│   └── TemperatureSlider.tsx # Temperature control slider
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── storage.ts            # localStorage utilities
│   └── openai.ts             # OpenAI API integration
├── package.json
└── tsconfig.json
```

## Data Storage

All data is stored in browser localStorage with the following structure:

### Conversations
```typescript
{
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
```

### Messages
```typescript
{
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
```

### Settings
```typescript
{
  apiKey: string;
  model: "gpt-4" | "gpt-3.5-turbo";
  systemPrompt: string;
  temperature: number;
  theme: "light" | "dark" | "system";
}
```

## Building for Production

Build the production-optimized version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Key Components

### ChatWindow
Main chat interface component that displays messages and handles input. Features:
- Auto-scrolling to latest messages
- Loading indicator during streaming
- Token count display
- Regenerate button for last response

### ConversationList
Sidebar component for managing conversations:
- Create new conversations
- Rename conversations (in-line editing)
- Delete conversations
- Sort by most recent
- Visual indication of current conversation

### MarkdownRenderer
Custom markdown rendering with full support for:
- Code blocks with language detection
- Inline code
- Headings, lists, blockquotes
- Links (open in new tab)
- Bold, italic, and other text formatting

### OpenAI Integration
Streaming API integration that:
- Sends messages to OpenAI Chat Completions API
- Streams responses in real-time
- Handles errors gracefully
- Validates API keys
- Approximates token usage

## Security & Privacy

- **No backend server** - All processing happens in the browser
- **API keys stored locally** - Keys are never sent to third parties
- **Open source** - Code is fully transparent and auditable

## Development

### Code Style
- TypeScript for type safety
- Functional React components with hooks
- Tailwind CSS for styling
- Consistent naming conventions

### Creating New Components
All components follow these patterns:
- Client components use `"use client"` directive
- Props are typed with interfaces
- Accessibility considerations (aria-labels, semantic HTML)
- Responsive design with Tailwind utilities

## Troubleshooting

### "Invalid API key" error
- Verify your OpenAI API key is correct
- Check that you have API credits available
- Ensure the key has appropriate permissions

### Conversations not saving
- Check browser localStorage is enabled
- Clear browser cache and try again
- Verify sufficient storage space is available

### Markdown not rendering correctly
- Ensure code block language is specified (e.g., ```javascript)
- Check for special characters that may need escaping

## Future Enhancements

- Conversation export (PDF, JSON)
- Voice input/output
- Multiple language support
- Custom model parameters
- Conversation search and filtering
- Message editing capabilities
- Image support in messages

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
