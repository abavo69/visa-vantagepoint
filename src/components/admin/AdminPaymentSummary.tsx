import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';

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
  const [summaries, setSummaries] = useState<UserPaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalPlan: 0,
    totalPaid: 0,
    totalRemaining: 0,
    totalUsers: 0
  });

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((summary) => {
                  const progress = getPaymentProgress(summary.total_paid, summary.total_plan);
                  return (
                    <TableRow key={summary.user_id}>
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentSummary;
