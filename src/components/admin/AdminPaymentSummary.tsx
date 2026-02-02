import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Users, TrendingUp, AlertCircle, Pencil } from 'lucide-react';

interface UserPaymentSummary {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  total_plan: number;
  total_paid: number;
  remaining: number;
  currency: string;
  payment_count: number;
  last_payment_date: string | null;
}

const AdminPaymentSummary = () => {
  const { toast } = useToast();
  const [summaries, setSummaries] = useState<UserPaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totals, setTotals] = useState({
    totalPlan: 0,
    totalPaid: 0,
    totalRemaining: 0,
    totalUsers: 0
  });

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPaymentSummary | null>(null);
  const [planAmount, setPlanAmount] = useState('');
  const [planCurrency, setPlanCurrency] = useState('USD');
  const [planDescription, setPlanDescription] = useState('');

  useEffect(() => {
    fetchPaymentSummaries();
  }, []);

  const fetchPaymentSummaries = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      if (profilesError) throw profilesError;

      // Fetch all payment plans
      const { data: plans, error: plansError } = await supabase
        .from('payment_plans')
        .select('*');

      if (plansError) throw plansError;

      // Fetch all payments
      const { data: payments, error: paymentsError } = await supabase
        .from('visa_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Build summary for each user who has either a plan or payments
      const userIds = new Set([
        ...(plans || []).map(p => p.user_id),
        ...(payments || []).map(p => p.user_id)
      ]);

      const summaryData: UserPaymentSummary[] = [];

      userIds.forEach(userId => {
        const profile = (profiles || []).find(p => p.user_id === userId);
        const plan = (plans || []).find(p => p.user_id === userId);
        const userPayments = (payments || []).filter(p => p.user_id === userId);
        
        const completedPayments = userPayments.filter(p => p.payment_status === 'completed');
        const totalPaid = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalPlan = plan ? Number(plan.total_amount) : 0;
        const remaining = Math.max(0, totalPlan - totalPaid);
        
        const lastPayment = completedPayments.length > 0 ? completedPayments[0] : null;

        summaryData.push({
          user_id: userId,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          total_plan: totalPlan,
          total_paid: totalPaid,
          remaining,
          currency: plan?.currency || 'USD',
          payment_count: completedPayments.length,
          last_payment_date: lastPayment?.payment_date || null
        });
      });

      // Sort by remaining balance (highest first)
      summaryData.sort((a, b) => b.remaining - a.remaining);

      setSummaries(summaryData);

      // Calculate totals
      setTotals({
        totalPlan: summaryData.reduce((sum, s) => sum + s.total_plan, 0),
        totalPaid: summaryData.reduce((sum, s) => sum + s.total_paid, 0),
        totalRemaining: summaryData.reduce((sum, s) => sum + s.remaining, 0),
        totalUsers: summaryData.length
      });

    } catch (error) {
      console.error('Error fetching payment summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserName = (summary: UserPaymentSummary) => {
    if (summary.first_name || summary.last_name) {
      return `${summary.first_name || ''} ${summary.last_name || ''}`.trim();
    }
    return summary.user_id.slice(0, 8) + '...';
  };

  const getPaymentProgress = (paid: number, total: number) => {
    if (total === 0) return 0;
    return Math.min(100, (paid / total) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const handleEditClick = async (summary: UserPaymentSummary) => {
    setSelectedUser(summary);
    
    // Fetch existing plan for this user
    try {
      const { data: plan } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('user_id', summary.user_id)
        .maybeSingle();

      if (plan) {
        setPlanAmount(plan.total_amount.toString());
        setPlanCurrency(plan.currency);
        setPlanDescription(plan.description || '');
      } else {
        setPlanAmount('');
        setPlanCurrency('USD');
        setPlanDescription('');
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
    
    setEditDialogOpen(true);
  };

  const handleSavePlan = async () => {
    if (!selectedUser || !planAmount) {
      toast({
        title: "Error",
        description: "Please enter a plan amount",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_plans')
        .upsert({
          user_id: selectedUser.user_id,
          total_amount: parseFloat(planAmount),
          currency: planCurrency,
          description: planDescription || null,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment plan saved successfully",
      });

      setEditDialogOpen(false);
      fetchPaymentSummaries();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save payment plan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{totals.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expected</p>
                <p className="text-2xl font-bold">{formatAmount(totals.totalPlan)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(totals.totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">{formatAmount(totals.totalRemaining)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Client Payment Summary
          </CardTitle>
          <CardDescription>
            Overview of payments per client showing total plan, amount paid, and remaining balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No payment data found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Total Plan</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead className="text-center">Payments</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((summary) => {
                  const progress = getPaymentProgress(summary.total_paid, summary.total_plan);
                  return (
                    <TableRow 
                      key={summary.user_id} 
                      className="cursor-pointer hover:bg-muted/70"
                      onClick={() => handleEditClick(summary)}
                    >
                      <TableCell className="font-medium">
                        {getUserName(summary)}
                      </TableCell>
                      <TableCell className="text-right">
                        {summary.total_plan > 0 ? formatAmount(summary.total_plan, summary.currency) : '-'}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatAmount(summary.total_paid, summary.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {summary.remaining > 0 ? (
                          <span className="text-orange-600 font-medium">
                            {formatAmount(summary.remaining, summary.currency)}
                          </span>
                        ) : summary.total_plan > 0 ? (
                          <Badge variant="default" className="bg-green-500">Paid</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {summary.total_plan > 0 ? (
                          <div className="w-full flex items-center gap-2">
                            <Progress 
                              value={progress} 
                              className="h-2 flex-1"
                            />
                            <span className="text-xs text-muted-foreground w-10">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No plan</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{summary.payment_count}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(summary.last_payment_date)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(summary);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.total_plan ? 'Edit' : 'Set'} Payment Plan
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  Configure the payment plan for{' '}
                  <span className="font-medium text-foreground">
                    {getUserName(selectedUser)}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={planAmount}
                  onChange={(e) => setPlanAmount(e.target.value)}
                  placeholder="0.00"
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
                placeholder="Payment plan notes..."
                rows={3}
              />
            </div>

            {selectedUser && selectedUser.total_paid > 0 && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Current payments: <span className="font-medium text-green-600">
                    {formatAmount(selectedUser.total_paid, selectedUser.currency)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} disabled={saving}>
              {saving ? 'Saving...' : 'Save Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentSummary;
