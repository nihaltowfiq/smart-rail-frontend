"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { BookingResponse } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Armchair,
  CheckCircle,
  Clock,
  Download,
  IndianRupee,
  Loader2,
  MapPin,
  Share2,
  Train,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BookingConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const {
    data: booking,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await api.get(`/bookings/${bookingId}`);
      return res.data?.data as BookingResponse;
    },
    enabled: !!bookingId,
  });

  const { mutate: makePayment, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/bookings/payment/${bookingId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment completed successfully!");
      router.replace("/bookings");
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.message || "Payment failed. Please try again."
      );
    },
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2
            size={50}
            className="mb-4 inline-block animate-spin text-blue-600"
          />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-linear-to-b from-red-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Card className="border-red-200 bg-red-50">
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
              <h2 className="mb-2 text-2xl font-bold text-red-900">
                Error Loading Booking
              </h2>
              <p className="mb-6 text-red-700">
                {error instanceof Error ? error.message : "Booking not found"}
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

  const isConfirmed =
    booking?.booking_status?.toUpperCase() === "CONFIRMED" ||
    booking?.booking_status?.toUpperCase() === "BOOKED";
  const isPaid = booking?.payment?.status?.toUpperCase() === "COMPLETED";

  return (
    <div className="bg-linear-to-b from-blue-50 to-white px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                Booking Confirmation
              </h1>
              <div className="flex gap-2">
                {isConfirmed && (
                  <Badge className="flex items-center gap-2 bg-green-100 px-4 py-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    {booking?.booking_status}
                  </Badge>
                )}
                {isPaid && (
                  <Badge className="bg-blue-100 px-4 py-2 text-blue-800">
                    Payment {booking?.payment.status}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-gray-600">
              Booking ID:{" "}
              <span className="font-mono font-semibold">
                {booking?.bookingId}
              </span>
            </p>
          </div>

          <div className="mb-8 grid gap-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-linear-to-r from-blue-400 to-blue-500 px-6 py-4 text-white">
                <div className="mb-4 flex items-center gap-3">
                  <Train className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">
                    {booking?.train?.train_name}
                  </h2>
                </div>
                <p className="text-blue-100">
                  Train #{booking?.train?.train_number}
                </p>
              </div>

              <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-600">
                      From
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {booking?.route?.from}
                    </p>
                  </div>

                  <div className="mx-6 flex-1">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <div className="flex-1 border-t-2 border-gray-300"></div>
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div className="flex-1 border-t-2 border-gray-300"></div>
                    </div>
                    <p className="text-center text-xs text-gray-500">
                      {formatDate(booking?.schedule?.journey_date)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="mb-1 text-sm font-semibold text-gray-600">
                      To
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {booking?.route?.to}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="mb-1 text-sm text-gray-600">Departure</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatTime(booking?.schedule?.departure_time)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(booking?.schedule?.journey_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="mb-1 text-sm text-gray-600">Arrival</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatTime(booking?.schedule?.arrival_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Passenger
                    </h3>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="mb-1 text-sm text-gray-600">Name</p>
                    <p className="text-xl font-bold text-gray-900">
                      {booking?.user?.name}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Armchair className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Seat Assignment
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking?.seats?.map((seat) => (
                      <Badge
                        key={seat}
                        className="bg-blue-100 px-3 py-2 text-sm text-blue-900"
                      >
                        {seat}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Class:{" "}
                    <span className="font-semibold">{booking?.class_type}</span>
                  </p>
                </div>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <div className="border-b bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Fare Details
                </h3>
              </div>
              <div className="p-6">
                {/* <div className="mb-4 flex items-center justify-between border-b pb-4">
                  <span className="text-gray-700">Base Fare</span>
                  <span className="font-semibold text-gray-900">
                    ৳{booking?.total_amount}
                  </span>
                </div> */}

                <div className="flex items-center justify-between rounded-lg bg-linear-to-r from-blue-50 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-6 w-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Amount</span>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">
                    ৳{booking?.total_amount}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-md">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                    <span className="text-gray-700">Payment Status</span>
                    <Badge
                      className={`${
                        isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking?.payment?.status}
                    </Badge>
                  </div>
                  {booking?.payment?.transaction_id && (
                    <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                      <span className="text-gray-700">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-900">
                        {booking?.payment?.transaction_id}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="mx-auto mt-7 block h-12 px-12 text-2xl"
                  onClick={() => makePayment()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 inline-block animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Make Payment"
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window?.print()}
            >
              <Download className="h-4 w-4" />
              Download Ticket
            </Button>
            <Button className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Booking
            </Button>
            <Link href="/">
              <Button variant="secondary">Book Another Ticket</Button>
            </Link>
          </div>

          <div className="mt-12 text-center text-sm text-gray-600">
            <p>
              A confirmation email has been sent to your registered email
              address.
            </p>
            <p className="mt-2">
              For support, contact:{" "}
              <span className="font-semibold">support@smartrail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
