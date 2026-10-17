import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User, Headphones, Shield, Download, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string | null;
  created_at: string;
  sender?: string | null;
}

interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
}

interface ClientDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
}

interface ConversationSummary {
  user_id: string;
  name: string;
  lastMessage: string;
  lastDate: string;
  unansweredCount: number;
}

const AdminChatManager = () => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) fetchMessages(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data: allMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      const profileMap: Record<string, UserProfile> = {};
      profiles?.forEach(p => { profileMap[p.user_id] = p; });

      const userMap: Record<string, { messages: ChatMessage[] }> = {};
      profiles?.forEach(p => { userMap[p.user_id] = { messages: [] }; });
      allMessages?.forEach(msg => {
        if (!userMap[msg.user_id]) userMap[msg.user_id] = { messages: [] };
        userMap[msg.user_id].messages.push(msg);
      });

      const summaries: ConversationSummary[] = Object.entries(userMap).map(([userId, data]) => {
        const profile = profileMap[userId];
        const name = profile?.first_name
          ? `${profile.first_name} ${profile.last_name || ''}`.trim()
          : userId.slice(0, 8);
        const sorted = data.messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const unanswered = data.messages.filter(m => m.sender !== 'admin' && !m.response).length;
        return {
          user_id: userId,
          name,
          lastMessage: sorted[0]?.message || '',
          lastDate: sorted[0]?.created_at || '',
          unansweredCount: unanswered,
        };
      });

      summaries.sort((a, b) => b.unansweredCount - a.unansweredCount || new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());
      setConversations(summaries);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    setDocuments([]);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages(data || []);

    // Files the client sent from the support inbox live in client_documents.
    const { data: docs, error: docsError } = await supabase
      .from('client_documents')
      .select('id, user_id, file_name, file_path, file_size, file_type, upload_date')
      .eq('user_id', userId)
      .order('upload_date', { ascending: true });

    if (docsError) {
      console.error('Error fetching client files:', docsError);
      return;
    }
    setDocuments(docs || []);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const attachedDocForMessage = (msg: ChatMessage): ClientDocument | null => {
    if (!msg.message.startsWith('📎')) return null;
    const idx = msg.message.lastIndexOf(': ');
    if (idx < 0) return null;
    const fileName = msg.message.slice(idx + 2).trim();
    if (!fileName) return null;

    const candidates = documents.filter(d => d.file_name === fileName);
    if (candidates.length === 0) return null;

    // Same file name may have been sent more than once: pick the upload closest in time.
    const msgTime = new Date(msg.created_at).getTime();
    return candidates.reduce((best, d) => (
      Math.abs(new Date(d.upload_date).getTime() - msgTime) <
      Math.abs(new Date(best.upload_date).getTime() - msgTime) ? d : best
    ));
  };

  const handleDownload = async (doc: ClientDocument) => {
    setDownloadingId(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      toast({ title: 'File downloaded', description: doc.file_name });
    } catch (err) {
      console.error('Error downloading file:', err);
      toast({ title: 'Error', description: 'Failed to download the file.', variant: 'destructive' });
    } finally {
      setDownloadingId(null);
    }
  };

  const renderAttachment = (msg: ChatMessage) => {
    const doc = attachedDocForMessage(msg);
    if (!doc) return null;
    const isDownloading = downloadingId === doc.id;

    return (
      <div className="mt-2 flex items-center gap-3 rounded-md border border-border bg-background/70 px-3 py-2">
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">{doc.file_name}</p>
          <p className="text-[10px] text-muted-foreground">{formatFileSize(doc.file_size)}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 shrink-0"
          disabled={isDownloading}
          onClick={() => handleDownload(doc)}
        >
          {isDownloading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Download className="h-4 w-4" />}
          <span className="ml-1 text-xs">Download</span>
        </Button>
      </div>
    );
  };

  const [newMessage, setNewMessage] = useState('');
  const [sendingNew, setSendingNew] = useState(false);

  const sendNewMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    setSendingNew(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ user_id: selectedUserId, message: newMessage.trim(), sender: 'admin' })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');
      toast({ title: 'Message sent', description: 'The client will see it in their support box.' });
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
    } finally {
      setSendingNew(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyInput.trim()) return;
    setReplying(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ response: replyInput.trim() })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, response: replyInput.trim() } : m));
      setReplyInput('');
      setReplyingToId(null);
      toast({ title: 'Reply sent', description: 'Your response has been saved.' });
      fetchConversations();
    } catch (err) {
      console.error('Error replying:', err);
      toast({ title: 'Error', description: 'Failed to send reply.', variant: 'destructive' });
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversation list */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No conversations yet.</p>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.user_id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedUserId === conv.user_id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedUserId(conv.user_id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{conv.name}</span>
                    {conv.unansweredCount > 0 && (
                      <Badge variant="destructive" className="text-xs">{conv.unansweredCount}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(conv.lastDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat view */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {selectedUserId
              ? conversations.find(c => c.user_id === selectedUserId)?.name || 'Chat'
              : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {!selectedUserId ? (
            <div className="flex items-center justify-center h-[450px] text-muted-foreground">
              <p>Select a conversation from the list to view messages</p>
            </div>
          ) : (
            <div className="flex flex-col h-[450px]">
              <ScrollArea ref={scrollRef} className="flex-1 pr-2">
                <div className="space-y-4">
                  {messages.map(msg => (
                    msg.sender === 'admin' ? (
                      <div key={msg.id} className="flex items-start gap-2">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Headphones className="h-4 w-4" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-[75%]">
                          <p className="text-xs font-medium text-muted-foreground mb-1">You (support)</p>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                    <div key={msg.id} className="space-y-2">
                      {/* User message */}
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-secondary rounded-lg p-3 max-w-[75%]">
                          <p className="text-sm">{msg.message}</p>
                          {renderAttachment(msg)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                          <User className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Response */}
                      {msg.response ? (
                        <div className="flex items-start gap-2">
                          <div className="bg-primary text-primary-foreground rounded-full p-2">
                            <Headphones className="h-4 w-4" />
                          </div>
                          <div className="bg-muted rounded-lg p-3 max-w-[75%]">
                            <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="bg-orange-500 text-white rounded-full p-2">
                            <Shield className="h-4 w-4" />
                          </div>
                          {replyingToId === msg.id ? (
                            <div className="flex gap-2 flex-1 max-w-[75%]">
                              <Input
                                value={replyInput}
                                onChange={e => setReplyInput(e.target.value)}
                                placeholder="Type your reply..."
                                onKeyDown={e => e.key === 'Enter' && handleReply(msg.id)}
                                disabled={replying}
                                className="flex-1"
                              />
                              <Button size="sm" onClick={() => handleReply(msg.id)} disabled={replying || !replyInput.trim()}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-600 border-orange-300"
                              onClick={() => { setReplyingToId(msg.id); setReplyInput(''); }}
                            >
                              Reply to this message
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    )
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-3 border-t mt-3">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Send a new message to this client..."
                  onKeyDown={e => { if (e.key === 'Enter') sendNewMessage(); }}
                  disabled={sendingNew}
                  className="flex-1"
                />
                <Button onClick={sendNewMessage} disabled={sendingNew || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChatManager;
