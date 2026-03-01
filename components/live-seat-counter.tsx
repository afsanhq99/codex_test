'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

export function LiveSeatCounter({
  eventId,
  initialAvailable,
}: {
  eventId: string;
  initialAvailable: number;
}) {
  const [available, setAvailable] = useState(initialAvailable);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          const nextAvailable = Number(payload.new.available_seats);
          setAvailable(Number.isNaN(nextAvailable) ? 0 : nextAvailable);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return <p className="text-sm font-medium text-brand">Live seats remaining: {available}</p>;
}
