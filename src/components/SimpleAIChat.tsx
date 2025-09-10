import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

const SimpleAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { toast } = useToast();

  const texts = {
    en: {
      placeholder: 'Type your message here...',
      send: 'Send',
      you: 'You',
      ai: 'AI Assistant',
      loading: 'AI is typing...',
      welcome: 'Hello! How can I help you with your visa questions?',
      error: 'Sorry, there was an error processing your request.',
      whatsappMessage: "I'd be happy to connect you with our expert team for personalized assistance! Click the link below to chat with us on WhatsApp:\n\nhttps://wa.me/1234567890\n\nOur team is available to help you with your specific visa needs and guide you through the entire process.",
    },
    es: {
      placeholder: 'Escribe tu mensaje aquí...',
      send: 'Enviar',
      you: 'Tú',
      ai: 'Asistente IA',
      loading: 'IA está escribiendo...',
      welcome: '¡Hola! ¿Cómo puedo ayudarte con tus preguntas de visa?',
      error: 'Lo siento, hubo un error procesando tu solicitud.',
      whatsappMessage: "¡Me encantaría conectarte con nuestro equipo de expertos para asistencia personalizada! Haz clic en el enlace de abajo para chatear con nosotros en WhatsApp:\n\nhttps://wa.me/1234567890\n\nNuestro equipo está disponible para ayudarte con tus necesidades específicas de visa y guiarte durante todo el proceso.",
    }
  };

  const t = texts[language];

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      type: 'ai',
      content: t.welcome
    }]);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const messageId = Date.now().toString();
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    // Increment question count
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);

    try {
      // Call AI chat function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: userMessage,
          language: language
        }
      });

      if (aiError) throw aiError;

      // Add AI response
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.response
      };

      setMessages(prev => [...prev, newAIMessage]);

      // Send WhatsApp link after 3rd question
      if (newQuestionCount === 3 && !whatsappSent) {
        setWhatsappSent(true);
        setTimeout(() => {
          const whatsappMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'ai',
            content: t.whatsappMessage
          };
          setMessages(prev => [...prev, whatsappMessage]);
        }, 1000); // Small delay to make it feel natural
      }

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

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
        <div className="space-y-4">          
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

export default SimpleAIChat;