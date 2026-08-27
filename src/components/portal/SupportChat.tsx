import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Headphones, User, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  message: string;
  response?: string | null;
  created_at: string;
}

const SupportChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const texts = {
    en: {
      placeholder: 'Describe your issue or question...',
      you: 'You',
      team: 'Support Team',
      loading: 'Loading conversation...',
      welcome: 'Hi! Send us a message and our support team will reply here.',
      pending: 'Waiting for a reply from our support team',
      error: 'Sorry, your message could not be sent. Please try again.',
      sent: 'Message sent to support',
    },
    es: {
      placeholder: 'Describe tu problema o pregunta...',
      you: 'Tú',
      team: 'Equipo de Soporte',
      loading: 'Cargando conversación...',
      welcome: '¡Hola! Envíanos un mensaje y nuestro equipo de soporte responderá aquí.',
      pending: 'Esperando respuesta de nuestro equipo de soporte',
      error: 'Lo sentimos, no se pudo enviar tu mensaje. Inténtalo de nuevo.',
      sent: 'Mensaje enviado a soporte',
    }
  };

  const t = texts[language];

  const loadChatHistory = useCallback(async (silent = false) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading support history:', error);
    } finally {
      if (!silent) setLoadingHistory(false);
    }
  }, [user]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Poll for admin replies
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => loadChatHistory(true), 10000);
    return () => clearInterval(interval);
  }, [user, loadChatHistory]);

  // Realtime updates (if enabled on the table)
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`support-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages', filter: `user_id=eq.${user.id}` },
        () => loadChatHistory(true)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadChatHistory]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ user_id: user.id, message: userMessage })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      toast({ title: t.sent });
    } catch (error) {
      console.error('Error sending support message:', error);
      setInput(userMessage);
      toast({ title: 'Error', description: t.error, variant: 'destructive' });
    } finally {
      setSending(false);
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
    <div className="flex flex-col h-full p-4">
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex items-start space-x-3">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Headphones className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">{t.welcome}</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                  <User className="h-4 w-4" />
                </div>
              </div>

              {message.response ? (
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{t.team}</p>
                    <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{t.pending}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex space-x-2 pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.placeholder}
          disabled={sending}
          className="flex-1 h-11"
        />
        <Button onClick={sendMessage} disabled={sending || !input.trim()} className="h-11">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SupportChat;
