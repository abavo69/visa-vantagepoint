import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Search, Eye, FileText, CreditCard, MessageSquare, 
  Clock, MapPin, Mail, Phone, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClientData {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  age?: number;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  documents_count: number;
  payments_count: number;
  messages_count: number;
  last_login?: string;
}

interface DigitalFootprint {
  login_history: Array<{
    login_time: string;
    ip_address?: string;
    user_agent?: string;
  }>;
  documents: Array<{
    file_name: string;
    upload_date: string;
    file_type: string;
  }>;
  payments: Array<{
    amount: number;
    currency: string;
    payment_date: string;
    payment_status: string;
  }>;
  messages: Array<{
    message: string;
    created_at: string;
  }>;
}

const AdminClients = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [footprint, setFootprint] = useState<DigitalFootprint | null>(null);

  const texts = {
    en: {
      title: 'Client Management',
      description: 'View and manage all client accounts',
      search: 'Search clients...',
      totalClients: 'Total Clients',
      viewPortal: 'View Portal',
      viewFootprint: 'Digital Footprint',
      clientDetails: 'Client Details',
      personalInfo: 'Personal Information',
      activity: 'Activity Overview',
      loginHistory: 'Login History',
      documents: 'Documents',
      payments: 'Payments',
      messages: 'Messages',
      noData: 'No data available',
      lastLogin: 'Last Login',
      totalDocs: 'Total Documents',
      totalPayments: 'Total Payments',
      totalMessages: 'Total Messages',
    },
    es: {
      title: 'Gestión de Clientes',
      description: 'Ver y gestionar todas las cuentas de clientes',
      search: 'Buscar clientes...',
      totalClients: 'Total de Clientes',
      viewPortal: 'Ver Portal',
      viewFootprint: 'Huella Digital',
      clientDetails: 'Detalles del Cliente',
      personalInfo: 'Información Personal',
      activity: 'Resumen de Actividad',
      loginHistory: 'Historial de Acceso',
      documents: 'Documentos',
      payments: 'Pagos',
      messages: 'Mensajes',
      noData: 'No hay datos disponibles',
      lastLogin: 'Último Acceso',
      totalDocs: 'Total de Documentos',
      totalPayments: 'Total de Pagos',
      totalMessages: 'Total de Mensajes',
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchClients();
    }
  }, [isAdmin]);

  const fetchClients = async () => {
    try {
      // Get all users from auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }

      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const clientsWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const authUser = users?.find((u: any) => u.id === profile.user_id);

          // Get document count
          const { count: docsCount } = await supabase
            .from('client_documents')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          // Get payment count
          const { count: paymentsCount } = await supabase
            .from('visa_payments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          // Get message count
          const { count: messagesCount } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          // Get last login
          const { data: lastLogin } = await supabase
            .from('login_history')
            .select('login_time')
            .eq('user_id', profile.user_id)
            .order('login_time', { ascending: false })
            .limit(1)
            .single();

          return {
            user_id: profile.user_id,
            email: authUser?.email || '',
            first_name: profile.first_name,
            last_name: profile.last_name,
            country: profile.country,
            age: profile.age,
            phone: profile.phone,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
            documents_count: docsCount || 0,
            payments_count: paymentsCount || 0,
            messages_count: messagesCount || 0,
            last_login: lastLogin?.login_time,
          };
        })
      );

      setClients(clientsWithStats);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDigitalFootprint = async (userId: string) => {
    try {
      const [loginHistory, documents, payments, messages] = await Promise.all([
        supabase
          .from('login_history')
          .select('*')
          .eq('user_id', userId)
          .order('login_time', { ascending: false })
          .limit(10),
        supabase
          .from('client_documents')
          .select('file_name, upload_date, file_type')
          .eq('user_id', userId)
          .order('upload_date', { ascending: false }),
        supabase
          .from('visa_payments')
          .select('amount, currency, payment_date, payment_status')
          .eq('user_id', userId)
          .order('payment_date', { ascending: false }),
        supabase
          .from('chat_messages')
          .select('message, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      setFootprint({
        login_history: loginHistory.data || [],
        documents: documents.data || [],
        payments: payments.data || [],
        messages: messages.data || [],
      });
    } catch (error) {
      console.error('Error fetching digital footprint:', error);
    }
  };

  const handleViewClient = (client: ClientData) => {
    setSelectedClient(client);
    fetchDigitalFootprint(client.user_id);
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.email?.toLowerCase().includes(searchLower) ||
      client.first_name?.toLowerCase().includes(searchLower) ||
      client.last_name?.toLowerCase().includes(searchLower) ||
      client.country?.toLowerCase().includes(searchLower)
    );
  });

  if (roleLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Users className="h-5 w-5 mr-2" />
          {t.totalClients}: {clients.length}
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredClients.map((client) => (
              <Card key={client.user_id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      {client.avatar_url ? (
                        <AvatarImage src={client.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {client.first_name?.[0] || client.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {client.first_name && client.last_name
                          ? `${client.first_name} ${client.last_name}`
                          : client.email}
                      </h4>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                      {client.country && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {client.country}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleViewClient(client)}
                    variant={selectedClient?.user_id === client.user_id ? 'default' : 'outline'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t.viewFootprint}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <FileText className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-sm font-semibold">{client.documents_count}</p>
                  </div>
                  <div className="text-center">
                    <CreditCard className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-sm font-semibold">{client.payments_count}</p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-sm font-semibold">{client.messages_count}</p>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Digital Footprint */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t.clientDetails}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedClient ? (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                  <TabsTrigger value="payments">Pay</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      {selectedClient.avatar_url ? (
                        <AvatarImage src={selectedClient.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {selectedClient.first_name?.[0] || selectedClient.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedClient.first_name && selectedClient.last_name
                          ? `${selectedClient.first_name} ${selectedClient.last_name}`
                          : selectedClient.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedClient.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.phone}</span>
                      </div>
                    )}
                    {selectedClient.country && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.country}</span>
                      </div>
                    )}
                    {selectedClient.age && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.age} years old</span>
                      </div>
                    )}
                    {selectedClient.last_login && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {t.lastLogin}: {new Date(selectedClient.last_login).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    onClick={() => {
                      // Store admin view context
                      sessionStorage.setItem('adminViewingClient', selectedClient.user_id);
                      navigate('/portal');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t.viewPortal}
                  </Button>
                </TabsContent>

                <TabsContent value="login" className="space-y-3 max-h-[400px] overflow-y-auto">
                  {footprint?.login_history.length ? (
                    footprint.login_history.map((login, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(login.login_time).toLocaleString()}
                          </span>
                        </div>
                        {login.ip_address && (
                          <p className="text-xs text-muted-foreground mt-1">IP: {login.ip_address}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">{t.noData}</p>
                  )}
                </TabsContent>

                <TabsContent value="docs" className="space-y-3 max-h-[400px] overflow-y-auto">
                  {footprint?.documents.length ? (
                    footprint.documents.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary">{doc.file_type}</Badge>
                        </div>
                        <p className="text-sm font-medium mt-2">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">{t.noData}</p>
                  )}
                </TabsContent>

                <TabsContent value="payments" className="space-y-3 max-h-[400px] overflow-y-auto">
                  {footprint?.payments.length ? (
                    footprint.payments.map((payment, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <Badge variant={payment.payment_status === 'completed' ? 'default' : 'secondary'}>
                            {payment.payment_status}
                          </Badge>
                        </div>
                        <p className="text-lg font-semibold mt-2">
                          {payment.amount} {payment.currency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">{t.noData}</p>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                Select a client to view their digital footprint
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClients;
