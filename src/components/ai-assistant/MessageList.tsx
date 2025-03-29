
import React, { useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/components/ai-assistant/types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : message.role === 'system'
                ? 'bg-muted text-muted-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div className="text-xs mt-2 opacity-70">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-4 bg-secondary text-secondary-foreground">
            <Badge variant="outline" className="animate-pulse">
              Thinking...
            </Badge>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
