
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { AIService } from '@/utils/aiService';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import our new components
import MessageList from '@/components/ai-assistant/MessageList';
import MessageInput from '@/components/ai-assistant/MessageInput';
import SettingsPanel from '@/components/ai-assistant/SettingsPanel';
import Header from '@/components/ai-assistant/Header';
import { Message, AIModel } from '@/components/ai-assistant/types';

const DEFAULT_MODEL = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
const AI_MODELS: AIModel[] = [
  { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B' },
  { id: 'meta-llama/Llama-2-70b-chat-hf', name: 'Llama 2 70B' },
  { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', name: 'Llama 3.3 70B Turbo' },
  { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B' },
];

const AIAssistant = () => {
  const [apiKey, setApiKey] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      role: 'system',
      content: 'Hello! I am your medical AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const initializeAI = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Together AI API key',
        variant: 'destructive',
      });
      return;
    }

    try {
      AIService.initialize('together', apiKey);
      AIService.setModel(selectedModel);
      setIsInitialized(true);
      setErrorMessage(null);
      toast({
        title: 'AI Service Initialized',
        description: `Connected to Together AI using ${getCurrentModelName()}`,
      });
    } catch (error) {
      toast({
        title: 'Initialization Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const changeModel = (modelId: string) => {
    setSelectedModel(modelId);
    if (isInitialized) {
      AIService.setModel(modelId);
      toast({
        title: 'Model Changed',
        description: `Now using ${AI_MODELS.find(m => m.id === modelId)?.name || modelId}`,
      });
    }
  };

  const getCurrentModelName = () => {
    return AI_MODELS.find(m => m.id === selectedModel)?.name || 'Custom Model';
  };

  const handleSendMessage = async (inputText: string) => {
    if (!isInitialized) {
      toast({
        title: 'AI Not Initialized',
        description: 'Please enter your Together AI API key first',
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const conversationMessages = messages
        .filter(msg => msg.role !== 'system' || msg.id === 'system-1')
        .slice(-6)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      conversationMessages.push({
        role: 'user',
        content: inputText,
      });

      conversationMessages.unshift({
        role: 'system',
        content: 'You are a helpful medical assistant AI. Provide accurate information and always include a disclaimer that you are not providing medical advice and users should consult healthcare professionals. Be concise and clear.',
      });

      const response = await AIService.getChatCompletion(conversationMessages);

      if (response.success && response.data) {
        let aiResponse = '';
        
        // Handle the response based on the structure received
        if (response.data.choices && response.data.choices[0]) {
          if (response.data.choices[0].message) {
            // Chat completion format
            aiResponse = response.data.choices[0].message.content;
          } else if (response.data.choices[0].text) {
            // Text completion format
            aiResponse = response.data.choices[0].text;
          } else {
            throw new Error('Unexpected response format from AI service');
          }
        } else {
          throw new Error('No choices returned from AI service');
        }
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Store the error message for display
      const errorMsg = error instanceof Error ? error.message : 'Failed to get response from AI';
      setErrorMessage(errorMsg);
      
      toast({
        title: 'AI Response Error',
        description: errorMsg,
        variant: 'destructive',
      });

      const errorMessage: Message = {
        id: `system-error-${Date.now()}`,
        role: 'system',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI Medical Assistant</h1>
      
      {!isInitialized && (
        <SettingsPanel 
          apiKey={apiKey}
          setApiKey={setApiKey}
          selectedModel={selectedModel}
          onModelChange={changeModel}
          onInitialize={initializeAI}
          models={AI_MODELS}
        />
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <Header 
            isInitialized={isInitialized}
            selectedModel={selectedModel}
            onModelChange={changeModel}
            onReset={() => setIsInitialized(false)}
            models={AI_MODELS}
            currentModelName={getCurrentModelName()}
          />
          
          <MessageList 
            messages={messages}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <MessageInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isDisabled={!isInitialized}
          />
        </CardFooter>
      </Card>

      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs break-all">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Alert className="bg-muted">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This AI assistant is for informational purposes only and does not provide medical advice.
          Always consult with qualified healthcare providers for diagnosis and treatment.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AIAssistant;
