
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bot, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AIModel {
  id: string;
  name: string;
}

interface SettingsPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onInitialize: () => void;
  models: AIModel[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  apiKey,
  setApiKey,
  selectedModel,
  onModelChange,
  onInitialize,
  models
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2" />
          Initialize AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="api-key" className="text-sm font-medium mb-2 block">
              Together AI API Key
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Together AI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get your API key from <a href="https://api.together.xyz/settings/api-keys" target="_blank" rel="noopener noreferrer" className="underline">Together AI</a>
            </p>
          </div>
          <div>
            <label htmlFor="model-select" className="text-sm font-medium mb-2 block">
              AI Model
            </label>
            <Select 
              value={selectedModel} 
              onValueChange={onModelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onInitialize}>
            Connect to Together AI
          </Button>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored only in memory and is not saved between sessions.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
