import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Plus, Trash2, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  description: string | null;
  visa_type: string | null;
  profile?: Profile;
}

const AdminPaymentManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('pending');
  const [description, setDescription] = useState('');
  const [visaType, setVisaType] = useState('');
  const [paymentPlans, setPaymentPlans] = useState<any[]>([]);
  const [selectedPlanUserId, setSelectedPlanUserId] = useState('');
  const [planTotalAmount, setPlanTotalAmount] = useState('');
  const [planCurrency, setPlanCurrency] = useState('USD');
  const [planDescription, setPlanDescription] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPayments();
    fetchPaymentPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('visa_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Fetch profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      if (profilesError) throw profilesError;

      // Map profiles to payments
      const paymentsWithProfiles = (paymentsData || []).map(payment => {
        const profile = (profilesData || []).find(p => p.user_id === payment.user_id);
        return {
          ...payment,
          profile: profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name
          } : undefined
        };
      });

      setPayments(paymentsWithProfiles);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount) {
      toast({
        title: "Error",
        description: "Please select a user and enter an amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('visa_payments')
        .insert({
          user_id: selectedUserId,
          amount: parseFloat(amount),
          currency,
          payment_status: status,
          description: description || null,
          visa_type: visaType || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment record created successfully",
      });

      // Reset form
      setAmount('');
      setDescription('');
      setVisaType('');
      setStatus('pending');
      
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for user names
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      const plansWithProfiles = (data || []).map(plan => {
        const profile = (profilesData || []).find(p => p.user_id === plan.user_id);
        return {
          ...plan,
          profile: profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name
          } : undefined
        };
      });

      setPaymentPlans(plansWithProfiles);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
    }
  };

  const handleCreatePaymentPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanUserId || !planTotalAmount) {
      toast({
        title: "Error",
        description: "Please select a user and enter a total amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payment_plans')
        .upsert({
          user_id: selectedPlanUserId,
          total_amount: parseFloat(planTotalAmount),
          currency: planCurrency,
          description: planDescription || null,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment plan set successfully",
      });

      setPlanTotalAmount('');
      setPlanDescription('');
      setSelectedPlanUserId('');
      
      fetchPaymentPlans();
    } catch (error) {
      console.error('Error creating payment plan:', error);
      toast({
        title: "Error",
        description: "Failed to set payment plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentPlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment plan deleted successfully",
      });

      fetchPaymentPlans();
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment plan",
        variant: "destructive",
      });
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('visa_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment deleted successfully",
      });

      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
    }
  };

  const getUserName = (user: User) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.user_id.slice(0, 8);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Tabs defaultValue="plans" className="space-y-6">
      <TabsList>
        <TabsTrigger value="plans">Payment Plans</TabsTrigger>
        <TabsTrigger value="payments">Payment Records</TabsTrigger>
      </TabsList>

      <TabsContent value="plans" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set User Payment Plan
            </CardTitle>
            <CardDescription>
              Set the total amount a user needs to pay (this will show progress in their portal)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePaymentPlan} className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedPlanUserId} onValueChange={setSelectedPlanUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {getUserName(user)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={planTotalAmount}
                    onChange={(e) => setPlanTotalAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={planCurrency} onValueChange={setPlanCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Payment plan notes"
                  rows={2}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                {loading ? 'Setting...' : 'Set Payment Plan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Payment Plans
            </CardTitle>
            <CardDescription>View and manage user payment plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentPlans.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No payment plans set
                </p>
              ) : (
                paymentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold">
                          {plan.profile?.first_name || 'User'} {plan.profile?.last_name || plan.user_id.slice(0, 8)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatAmount(plan.total_amount, plan.currency)}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePaymentPlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments" className="space-y-6">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Set User Payment
          </CardTitle>
          <CardDescription>
            Create payment records for users (amount due, paid, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {getUserName(user)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visa Type (Optional)</Label>
              <Input
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                placeholder="e.g., Tourist, Student, Work"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment notes or details"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Payment Record'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            All Payment Records
          </CardTitle>
          <CardDescription>View and manage all user payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No payment records found
              </p>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">
                        {payment.profile?.first_name || 'User'} {payment.profile?.last_name || payment.user_id.slice(0, 8)}
                      </span>
                      <Badge variant={
                        payment.payment_status === 'completed' ? 'default' :
                        payment.payment_status === 'pending' ? 'secondary' :
                        payment.payment_status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {payment.payment_status}
                      </Badge>
                      {payment.visa_type && (
                        <Badge variant="outline" className="text-xs">
                          {payment.visa_type}
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {formatAmount(payment.amount, payment.currency)}
                    </div>
                    {payment.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {payment.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePayment(payment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminPaymentManager;