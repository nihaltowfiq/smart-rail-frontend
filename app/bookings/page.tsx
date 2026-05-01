"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { BookingsListResponse } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Train,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type StatusFilter = "UPCOMING" | "ALL" | "PENDING";

export default function BookingsPage() {
  const [status, setStatus] = useState<StatusFilter>("UPCOMING");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", status, page],
    queryFn: async () => {
      const res = await api.get("/bookings/list", {
        params: {
          status,
          page,
          limit,
        },
      });
      return res.data?.data as BookingsListResponse;
    },
  });

  const bookings = response?.data || [];
  console.log({ bookings });

  const meta = response?.meta;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-linear-to-b from-purple-50 to-white">
        <div className="text-center">
          <Loader2
            size={50}
            className="mb-4 inline-block animate-spin text-purple-600"
          />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-linear-to-b from-red-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Card className="border-red-200 bg-red-50">
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
              <h2 className="mb-2 text-2xl font-bold text-red-900">
                Error Loading Bookings
              </h2>
              <p className="mb-6 text-red-700">
                {error instanceof Error
                  ? error.message
                  : "Failed to load bookings"}
              </p>
              <Link href="/">
                <Button>Go to Home</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-purple-50 to-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">
            Total Bookings:{" "}
            <span className="font-semibold">{meta?.total || 0}</span>
          </p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Status:
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(1);
              }}
              className="rounded-lg border border-purple-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">All Bookings</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="PENDING">Pending Payment</option>
            </select>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="border-0 shadow-md">
            <div className="p-12 text-center">
              <Train className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No Bookings Found
              </h3>
              <p className="mb-6 text-gray-600">
                You don't have any{" "}
                {status === "ALL" ? "bookings" : status.toLowerCase()} yet.
              </p>
              <Link href="/">
                <Button>Book a Ticket</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings?.map((booking) => {
              const isConfirmed =
                booking?.booking_status?.toUpperCase() === "CONFIRMED" ||
                booking?.booking_status?.toUpperCase() === "BOOKED";
              const isPaid =
                booking?.payment?.status?.toUpperCase() === "SUCCESS";
              const isPending =
                booking?.booking_status?.toUpperCase() === "PENDING";

              const cardContent = (
                <Card className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg">
                  <div className="grid gap-4 p-6 md:grid-cols-4">
                    <div className="md:col-span-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Train className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">
                          {booking?.train?.train_name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        #{booking?.train?.train_number}
                      </p>
                    </div>

                    <div className="md:col-span-1">
                      <div className="mb-2 flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {booking?.route?.from} →{" "}
                            <span className="font-semibold">
                              {booking?.route?.to}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(booking?.schedule?.journey_date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <div className="mb-2 flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatTime(booking?.schedule?.departure_time)} -{" "}
                            {formatTime(booking?.schedule?.arrival_time)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking?.class_type} • Seats:{" "}
                            {booking?.seats?.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Amount */}
                    <div className="flex flex-col items-end justify-between md:col-span-1">
                      <div className="flex flex-wrap justify-end gap-2">
                        {isConfirmed && (
                          <Badge className="bg-green-100 text-green-800">
                            {booking?.booking_status}
                          </Badge>
                        )}
                        {isPaid ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="mt-3 text-xl font-bold text-purple-600">
                        ৳{booking?.total_amount}
                      </p>
                    </div>
                  </div>
                </Card>
              );

              return isPending ? (
                <div key={booking.bookingId}>
                  <Link href={`/confirm/${booking.bookingId}`}>
                    {cardContent}
                  </Link>
                </div>
              ) : (
                <div key={booking.bookingId}>{cardContent}</div>
              );
            })}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={
                      pageNum === page
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-purple-200 text-gray-700 hover:bg-purple-50"
                    }
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {meta && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing page <span className="font-semibold">{meta.page}</span> of{" "}
            <span className="font-semibold">{meta.totalPages}</span> (
            <span className="font-semibold">{bookings.length}</span> of{" "}
            <span className="font-semibold">{meta.total}</span> bookings)
          </div>
        )}
      </div>
    </div>
  );
}
