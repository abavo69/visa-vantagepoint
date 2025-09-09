import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  message: string;
  response?: string;
  created_at: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const texts = {
    en: {
      placeholder: 'Type your message here...',
      send: 'Send',
      you: 'You',
      ai: 'AI Assistant',
      loading: 'AI is typing...',
      welcome: 'Hello! How can I help you today?',
      error: 'Sorry, there was an error processing your request.',
    },
    es: {
      placeholder: 'Escribe tu mensaje aquí...',
      send: 'Enviar',
      you: 'Tú',
      ai: 'Asistente IA',
      loading: 'IA está escribiendo...',
      welcome: '¡Hola! ¿Cómo puedo ayudarte hoy?',
      error: 'Lo siento, hubo un error procesando tu solicitud.',
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Save user message to database
      const { data: messageData, error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Add user message to UI immediately
      setMessages(prev => [...prev, messageData]);

      // Call AI chat function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: userMessage,
          language: language
        }
      });

      if (aiError) throw aiError;

      // Update message with AI response
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ response: aiResponse.response })
        .eq('id', messageData.id);

      if (updateError) throw updateError;

      // Update UI with AI response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageData.id
            ? { ...msg, response: aiResponse.response }
            : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: t.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">{t.welcome}</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* User message */}
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">{message.message}</p>
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                  <User className="h-4 w-4" />
                </div>
              </div>
              
              {/* AI response */}
              {message.response && (
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">{t.loading}</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex space-x-2 pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.placeholder}
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChat;