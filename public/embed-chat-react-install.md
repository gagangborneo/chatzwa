# React Embed Chat Integration

## Cara Menggunakan Komponen React Chat Widget

### 1. Install Komponen

Copy file `embed-chat-react.jsx` ke direktori components Anda:

```bash
cp embed-chat-react.jsx src/components/EmbedChatWidget.jsx
```

### 2. Import dan Gunakan

```jsx
// App.jsx
import React from 'react';
import EmbedChatWidget from './components/EmbedChatWidget';

function App() {
  return (
    <div className="App">
      {/* Konten aplikasi Anda */}
      <header>
        <h1>My Application</h1>
      </header>

      <main>
        {/* Routes atau konten lainnya */}
      </main>

      {/* Chat Widget */}
      <EmbedChatWidget
        apiKey="embed_your_api_key_here"
        title="Customer Support"
        subtitle="Kami siap membantu Anda"
        primaryColor="#22c55e"
        position="bottom-right"
        autoOpen={false}
        welcomeMessage="Halo! Ada yang bisa saya bantu?"
        onChatOpened={() => console.log('Chat opened')}
        onChatClosed={() => console.log('Chat closed')}
      />
    </div>
  );
}

export default App;
```

### 3. Konfigurasi Props

Berikut adalah daftar lengkap props yang tersedia:

```jsx
<EmbedChatWidget
  // API Configuration
  apiUrl="https://your-api-domain.com"  // default: 'http://localhost:3000'
  apiKey="embed_your_api_key"           // required
  userId="optional_user_id"             // optional

  // Appearance
  position="bottom-right"               // bottom-right, bottom-left, top-right, top-left
  theme="light"                        // light, dark
  primaryColor="#22c55e"               // any valid hex color
  title="Customer Support"
  subtitle="Kami siap membantu Anda"
  welcomeMessage="Halo! Ada yang bisa saya bantu?"
  placeholder="Ketik pesan Anda..."

  // Behavior
  autoOpen={false}                     // boolean
  delay={2000}                         // milliseconds
  showOnLoad={false}                   // boolean
/>
```

### 4. Integration dengan React Hooks

#### Custom Hook untuk Chat Management

```jsx
// hooks/useChatWidget.js
import { useState, useCallback } from 'react';

export const useChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const incrementMessageCount = useCallback(() => {
    setMessageCount(prev => prev + 1);
  }, []);

  return {
    isOpen,
    messageCount,
    openChat,
    closeChat,
    incrementMessageCount
  };
};

// Penggunaan
import React from 'react';
import EmbedChatWidget from './components/EmbedChatWidget';
import { useChatWidget } from './hooks/useChatWidget';

function ChatWrapper() {
  const { isOpen, openChat, closeChat, incrementMessageCount } = useChatWidget();

  return (
    <div>
      <button onClick={openChat}>Open Chat</button>
      <EmbedChatWidget
        apiKey="embed_your_api_key"
        autoOpen={isOpen}
        onChatOpened={openChat}
        onChatClosed={closeChat}
        onMessageSent={incrementMessageCount}
      />
    </div>
  );
}
```

#### Context API untuk Global State

```jsx
// context/ChatContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isOpen: false,
    messages: [],
    unreadCount: 0
  });

  const openChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      isOpen: true,
      unreadCount: 0
    }));
  }, []);

  const closeChat = useCallback(() => {
    setChatState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const addMessage = useCallback((message, sender) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, { text: message, sender, timestamp: Date.now() }]
    }));
  }, []);

  const incrementUnreadCount = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      unreadCount: prev.unreadCount + 1
    }));
  }, []);

  return (
    <ChatContext.Provider value={{
      ...chatState,
      openChat,
      closeChat,
      addMessage,
      incrementUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Penggunaan di App.js
import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <ChatProvider>
      <div className="App">
        {/* Konten aplikasi */}
        <ChatWidget />
      </div>
    </ChatProvider>
  );
}

// components/ChatWidget.jsx
import React from 'react';
import EmbedChatWidget from './EmbedChatWidget';
import { useChat } from '../context/ChatContext';

function ChatWidget() {
  const { isOpen, openChat, closeChat, unreadCount } = useChat();

  return (
    <div>
      {unreadCount > 0 && !isOpen && (
        <div className="chat-notification">
          {unreadCount} pesan baru
        </div>
      )}
      <EmbedChatWidget
        apiKey="embed_your_api_key"
        autoOpen={isOpen}
        onChatOpened={openChat}
        onChatClosed={closeChat}
      />
    </div>
  );
}
```

### 5. Integration dengan React Router

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmbedChatWidget from './components/EmbedChatWidget';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <BrowserRouter>
      <div className="App">
        {/* Navigasi */}
        <nav>
          {/* ... */}
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        {/* Chat Widget - tidak tampil di halaman admin */}
        {currentPath !== '/admin' && (
          <EmbedChatWidget
            apiKey="embed_your_api_key"
            position="bottom-right"
          />
        )}
      </div>
    </BrowserRouter>
  );
}
```

### 6. State Management dengan Redux Toolkit

```jsx
// store/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    messages: [],
    isOnline: true,
    unreadCount: 0
  },
  reducers: {
    openChat: (state) => {
      state.isOpen = true;
      state.unreadCount = 0;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    }
  }
});

export const { openChat, closeChat, addMessage, setOnlineStatus, incrementUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;

// components/ConnectedChatWidget.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EmbedChatWidget from './EmbedChatWidget';
import { openChat, closeChat, addMessage } from '../store/chatSlice';

function ConnectedChatWidget() {
  const dispatch = useDispatch();
  const { isOpen, isOnline } = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.user);

  return (
    <EmbedChatWidget
      apiKey="embed_your_api_key"
      userId={user?.id}
      autoOpen={isOpen}
      onChatOpened={() => dispatch(openChat())}
      onChatClosed={() => dispatch(closeChat())}
      onMessageReceived={(message) => dispatch(addMessage(message))}
      disabled={!isOnline}
    />
  );
}
```

### 7. Styling dengan Styled-Components

```jsx
// components/StyledChatWidget.jsx
import React from 'react';
import styled from 'styled-components';
import EmbedChatWidget from './EmbedChatWidget';

const StyledChatContainer = styled.div`
  .embed-chat-button {
    border-radius: ${props => props.rounded ? '50%' : '15px'};
    transform: scale(${props => props.scale || 1});
  }

  .embed-chat-window {
    border-radius: ${props => props.windowRadius || '16px'};
    box-shadow: ${props => props.shadow || '0 20px 60px rgba(0, 0, 0, 0.15)'};
  }

  .embed-chat-header {
    background: linear-gradient(135deg, ${props => props.primaryColor}, ${props => props.primaryColorDark});
  }
`;

function StyledChatWidget({
  primaryColor = '#22c55e',
  rounded = true,
  scale = 1,
  windowRadius = '16px',
  shadow = '0 20px 60px rgba(0, 0, 0, 0.15)',
  ...props
}) {
  const primaryColorDark = adjustColor(primaryColor, -20);

  return (
    <StyledChatContainer
      primaryColor={primaryColor}
      primaryColorDark={primaryColorDark}
      rounded={rounded}
      scale={scale}
      windowRadius={windowRadius}
      shadow={shadow}
    >
      <EmbedChatWidget
        primaryColor={primaryColor}
        {...props}
      />
    </StyledChatContainer>
  );
}
```

### 8. TypeScript Support

```tsx
// components/EmbedChatWidget.tsx
import React from 'react';

interface EmbedChatWidgetProps {
  // API Configuration
  apiUrl?: string;
  apiKey: string;
  userId?: string;

  // Appearance
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
  placeholder?: string;

  // Behavior
  autoOpen?: boolean;
  delay?: number;
  showOnLoad?: boolean;

  // Events
  onChatOpened?: () => void;
  onChatClosed?: () => void;
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: { text: string; sender: 'user' | 'bot' }) => void;
  onError?: (error: Error) => void;
}

declare const EmbedChatWidget: React.FC<EmbedChatWidgetProps>;
export default EmbedChatWidget;

// Penggunaan dengan TypeScript
import React from 'react';
import EmbedChatWidget from './components/EmbedChatWidget';

const App: React.FC = () => {
  const handleChatOpened = (): void => {
    console.log('Chat opened');
  };

  const handleError = (error: Error): void => {
    console.error('Chat error:', error);
  };

  return (
    <div>
      <EmbedChatWidget
        apiKey="embed_your_api_key"
        position="bottom-right"
        primaryColor="#22c55e"
        onChatOpened={handleChatOpened}
        onError={handleError}
      />
    </div>
  );
};
```

### 9. Testing dengan Jest & React Testing Library

```jsx
// components/__tests__/EmbedChatWidget.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmbedChatWidget from '../EmbedChatWidget';

// Mock fetch
global.fetch = jest.fn();

describe('EmbedChatWidget', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders chat button', () => {
    render(<EmbedChatWidget apiKey="test-key" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('opens chat window when button clicked', () => {
    render(<EmbedChatWidget apiKey="test-key" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByText('Customer Support')).toBeInTheDocument();
    expect(screen.getByText('Kami siap membantu Anda')).toBeInTheDocument();
  });

  test('sends message when input submitted', async () => {
    const mockResponse = { message: 'Test response' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<EmbedChatWidget apiKey="test-key" />);

    // Open chat
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Type and send message
    const input = screen.getByPlaceholderText('Ketik pesan Anda...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/embed-chat',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Hello'),
        })
      );
    });
  });
});
```

### 10. Performance Optimization

#### Memoization

```jsx
import React, { memo, useMemo, useCallback } from 'react';

const OptimizedChatWidget = memo(function OptimizedChatWidget({
  apiKey,
  title,
  primaryColor,
  ...props
}) {
  const config = useMemo(() => ({
    apiKey,
    title,
    primaryColor,
    ...props
  }), [apiKey, title, primaryColor, props]);

  const handleChatOpened = useCallback(() => {
    console.log('Chat opened');
  }, []);

  return (
    <EmbedChatWidget
      {...config}
      onChatOpened={handleChatOpened}
    />
  );
});
```

#### Lazy Loading

```jsx
import React, { lazy, Suspense } from 'react';

const LazyChatWidget = lazy(() => import('./components/EmbedChatWidget'));

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChat(true)}>
        Enable Chat
      </button>

      {showChat && (
        <Suspense fallback={<div>Loading chat...</div>}>
          <LazyChatWidget apiKey="embed_your_api_key" />
        </Suspense>
      )}
    </div>
  );
}
```

### 11. Error Boundaries

```jsx
// components/ChatErrorBoundary.jsx
import React from 'react';

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chat Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="chat-error-fallback">
          <p>Chat temporarily unavailable</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Penggunaan
import ChatErrorBoundary from './components/ChatErrorBoundary';
import EmbedChatWidget from './components/EmbedChatWidget';

function App() {
  return (
    <div>
      <ChatErrorBoundary>
        <EmbedChatWidget apiKey="embed_your_api_key" />
      </ChatErrorBoundary>
    </div>
  );
}
```

### 12. Environment Configuration

```jsx
// config/chat.js
const chatConfig = {
  apiUrl: process.env.REACT_APP_CHAT_API_URL || 'http://localhost:3000',
  apiKey: process.env.REACT_APP_CHAT_API_KEY,
  primaryColor: process.env.REACT_APP_CHAT_PRIMARY_COLOR || '#22c55e',
  position: process.env.REACT_APP_CHAT_POSITION || 'bottom-right',
  autoOpen: process.env.REACT_APP_CHAT_AUTO_OPEN === 'true',
  theme: process.env.REACT_APP_CHAT_THEME || 'light'
};

export default chatConfig;

// Penggunaan
import chatConfig from './config/chat';
import EmbedChatWidget from './components/EmbedChatWidget';

function App() {
  return (
    <EmbedChatWidget {...chatConfig} />
  );
}
```

### 13. Custom Hooks untuk Analytics

```jsx
// hooks/useChatAnalytics.js
import { useEffect, useState } from 'react';

export const useChatAnalytics = (apiKey) => {
  const [analytics, setAnalytics] = useState({
    totalMessages: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/chat-analytics?apiKey=${apiKey}`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [apiKey]);

  return analytics;
};
```

### 14. Deploy dan Production Considerations

```jsx
// production/ProductionChatWidget.jsx
import React from 'react';
import EmbedChatWidget from '../components/EmbedChatWidget';

function ProductionChatWidget() {
  const config = {
    apiUrl: process.env.REACT_APP_API_URL,
    apiKey: process.env.REACT_APP_CHAT_API_KEY,
    primaryColor: process.env.REACT_APP_PRIMARY_COLOR,
    position: process.env.REACT_APP_CHAT_POSITION,
    autoOpen: process.env.REACT_APP_AUTO_OPEN === 'true',
    theme: process.env.REACT_APP_CHAT_THEME
  };

  // Validate required config
  if (!config.apiKey) {
    console.error('Chat API key is required');
    return null;
  }

  return <EmbedChatWidget {...config} />;
}
```

### 15. Troubleshooting

#### Common Issues:

1. **Widget tidak muncul**
   ```jsx
   // Debug mode
   <EmbedChatWidget
     apiKey="your_api_key"
     debug={true}  // enable console logging
   />
   ```

2. **Performance issues**
   ```jsx
   // Use React.memo for optimization
   const MemoizedChatWidget = React.memo(EmbedChatWidget);
   ```

3. **Style conflicts**
   ```jsx
   // Use custom class names
   <EmbedChatWidget
     className="my-custom-chat"
     containerClassName="chat-container"
   />
   ```

### 16. Support

Untuk bantuan lebih lanjut:
- Documentation: https://docs.7connect.com/embed-chat-react
- GitHub Issues: https://github.com/7connect/embed-chat-react/issues
- Email: support@7connect.com
- Discord: https://discord.gg/7connect