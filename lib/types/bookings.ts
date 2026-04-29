export type BookingResponse = {
  bookingId: string;
  user: {
    user_id: number;
    name: string;
  };
  train: {
    train_name: string;
    train_number: string;
  };
  route: {
    from: string;
    to: string;
  };
  schedule: {
    departure_time: string;
    arrival_time: string;
    journey_date: string;
  };
  seats: string[];
  class_type: string;
  total_amount: number;
  booking_status: string;
  payment: {
    status: string;
    transaction_id: string | null;
  };
};
