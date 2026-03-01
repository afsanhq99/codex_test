export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'user' | 'admin';
          created_at: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          location: string;
          event_date: string;
          total_seats: number;
          available_seats: number;
          price: number;
          created_by: string;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          quantity: number;
          total_price: number;
          booking_status: 'confirmed' | 'cancelled';
          created_at: string;
        };
      };
    };
  };
};

export type Event = Database['public']['Tables']['events']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
