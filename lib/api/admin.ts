import { BR } from "../types";
import { GetTrainsFilterDto, TrainListResponse } from "../types/admin";
import { api } from "./client";

export const adminApi = {
  getTrains: async (
    filters?: GetTrainsFilterDto
  ): Promise<BR<TrainListResponse>> => {
    const response = await api.get("/admin/trains", {
      params: filters,
    });
    return response.data;
  },

  getTrainStats: async (trainId?: number) => {
    if (!trainId) throw new Error("Train ID is required");
    const response = await api.get(`/admin/trains/${trainId}`);
    return response.data;
  },

  getIncomeByPaymentMethod: async (
    trainId?: number,
    incomeFilter?: "ALL_TIME" | "YEAR" | "MONTH",
    year?: number,
    month?: number
  ) => {
    const response = await api.get("/admin/income-by-payment-method", {
      params: {
        ...(trainId && { trainId }),
        ...(incomeFilter && { incomeFilter }),
        ...(year && { year }),
        ...(month && { month }),
      },
    });
    return response.data;
  },
};
