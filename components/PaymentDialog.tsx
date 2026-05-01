import { api } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type PaymentMethod = "BKASH" | "NAGAD" | null;

const paymentMethodMapper = {
  BKASH: "/icons/bkash.svg",
  NAGAD: "/icons/nagad.svg",
};

export function PaymentDialog({
  booking,
  isPaymentDialogOpen,
  setIsPaymentDialogOpen,
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(null);

  const router = useRouter();

  const { mutate: makePayment, isPending } = useMutation({
    mutationFn: async (paymentMethod: PaymentMethod) => {
      const res = await api.post(`/bookings/payment/${booking?.bookingId}`, {
        payment_method: paymentMethod,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment completed successfully!");
      setIsPaymentDialogOpen(false);
      setSelectedPaymentMethod(null);
      router.replace("/bookings");
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.message || "Payment failed. Please try again."
      );
    },
  });

  return (
    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3 rounded-lg bg-blue-50 p-4">
            <h3 className="font-semibold text-gray-900">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Train</p>
                <p className="font-semibold">{booking?.train?.train_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Route</p>
                <p className="font-semibold">
                  {booking?.route?.from} → {booking?.route?.to}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Passenger</p>
                <p className="font-semibold">{booking?.user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Seats</p>
                <p className="font-semibold">{booking?.seats?.join(", ")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">Payment Details</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">
                ৳{booking?.total_amount}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Payment Method</h3>
            <div className="grid gap-3">
              {["BKASH", "NAGAD"].map((method) => (
                <button
                  key={method}
                  onClick={() =>
                    setSelectedPaymentMethod(method as PaymentMethod)
                  }
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedPaymentMethod === method
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selectedPaymentMethod === method
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === method && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>

                    <img
                      src={paymentMethodMapper[method]}
                      alt="icon"
                      width={64}
                    />
                    <span className="font-semibold text-gray-900">
                      {method}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsPaymentDialogOpen(false);
              setSelectedPaymentMethod(null);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedPaymentMethod) {
                makePayment(selectedPaymentMethod);
              } else {
                toast.error("Please select a payment method");
              }
            }}
            disabled={isPending || !selectedPaymentMethod}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 inline-block animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
