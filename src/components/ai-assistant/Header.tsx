
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIModel } from './types';

interface HeaderProps {
  isInitialized: boolean;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onReset: () => void;
  models: AIModel[];
  currentModelName: string;
}

const Header: React.FC<HeaderProps> = ({
  isInitialized,
  selectedModel,
  onModelChange,
  onReset,
  models,
  currentModelName
}) => {
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex items-center mb-4 justify-between">
      <div className="flex items-center">
        <Badge variant="outline" className="mr-2">
          Connected to Together AI
        </Badge>
        <Badge variant="secondary">
          {currentModelName}
        </Badge>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">AI Model Settings</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Change Model</label>
              <Select 
                value={selectedModel} 
                onValueChange={onModelChange}
              >
                <SelectTrigger>
                  <SelectValue />
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
            <Button variant="outline" size="sm" onClick={onReset}>
              Change API Key
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Header;
