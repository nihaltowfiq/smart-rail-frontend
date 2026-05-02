export interface TrainIncomeData {
  trainId: number;
  trainName: string;
  trainNumber: string;
  totalIncome: number;
  totalBookings: number;
  successfulPayments: number;
  totalPassengers: number;
}

export interface TrainListResponse {
  trains: TrainIncomeData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface GetTrainsFilterDto extends PaginationDto {
  trainName?: string;
  trainNumber?: string;
  sortBy?: "name" | "number" | "income" | "bookings";
  sortOrder?: "ASC" | "DESC";
  incomeFilter?: "ALL_TIME" | "YEAR" | "MONTH";
  year?: number;
  month?: number;
}

export type IncomeFilter = "ALL_TIME" | "YEAR" | "MONTH";
