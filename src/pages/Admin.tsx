import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import AdminDocumentUpload from '@/components/admin/AdminDocumentUpload';
import AdminDocumentList from '@/components/admin/AdminDocumentList';
import AdminPaymentManager from '@/components/admin/AdminPaymentManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Users } from 'lucide-react';

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-muted-foreground">Manage client documents, payments, and users</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/clients')}>
                <Users className="h-4 w-4 mr-2" />
                View Clients
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/portal')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Client Portal
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Admin Overview</h2>
              <p className="text-muted-foreground mb-6">View detailed client information and analytics</p>
              <Button onClick={() => navigate('/admin/clients')} size="lg">
                <Users className="h-5 w-5 mr-2" />
                View All Clients
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Client Management</h2>
              <p className="text-muted-foreground mb-6">Access the full client management dashboard with user data, digital footprints, and account overviews</p>
              <Button onClick={() => navigate('/admin/clients')} size="lg">
                <Users className="h-5 w-5 mr-2" />
                Go to Client Management
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <AdminDocumentUpload />
              <div className="lg:col-span-2">
                <AdminDocumentList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <AdminPaymentManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
