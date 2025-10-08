import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useLoginTracking = () => {
  const { user } = useAuth();

  useEffect(() => {
    const trackLogin = async () => {
      if (!user) return;

      try {
        // Get user's IP address (approximate - client-side only)
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        await supabase.from('login_history').insert({
          user_id: user.id,
          login_time: new Date().toISOString(),
          ip_address: ipData.ip,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        console.error('Error tracking login:', error);
      }
    };

    trackLogin();
  }, [user]);
};
