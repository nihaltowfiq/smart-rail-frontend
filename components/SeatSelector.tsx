import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

export function SeatSelector({
  data,
  selected,
  setSelected,
  date,
  classType,
  scheduleId,
  fare,
}) {
  const [selectedCoach, setSelectedCoach] = useState(
    data?.[0]?.coachId || null
  );

  const toggle = (seat) => {
    console.log({ seat });

    if (seat?.status === "BOOKED") {
      toast.error("Already Booked!");
      return;
    }

    console.log({ selected });

    if (selected?.length === 5 && !selected?.includes(seat.seatId)) {
      toast.error("Maximum seat selection limit is 5");
      return;
    }

    setSelected((p) => {
      const prev = p || [];
      if (prev?.includes(seat.seatId)) {
        const latest = prev?.filter((id) => id !== seat.seatId);
        return [...latest];
      }

      if (prev?.length >= 5) return prev;
      if (seat?.status === "BOOKED") return prev;

      console.log("SS", [...prev, seat.seatId]);

      return [...prev, seat.seatId];
    });
  };

  const currentCoach = data?.find((coach) => coach.coachId === selectedCoach);

  const { mutate: purchase, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/bookings", payload);
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Your seat has been booked!");
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <div className="mx-auto mb-7 space-y-4 px-2">
      <div className="flex items-end gap-2">
        <div className="max-w-1/6 space-y-2">
          <label className="text-sm font-medium">Select Coach</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between",
                  !selectedCoach && "text-muted-foreground"
                )}
              >
                {currentCoach?.coachLabel || "Select a coach"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
              {data?.map((coach, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => setSelectedCoach(coach.coachId)}
                >
                  {coach.coachLabel}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {selected && selected.length > 0 ? (
              <>
                <span className="inline-flex items-center text-sm font-medium">
                  Seats:
                </span>
                {selected.map((seatId) => {
                  let seat = null;
                  let coachLabel = null;

                  for (const coach of data) {
                    const foundSeat = coach.seats?.find(
                      (s) => s.seatId === seatId
                    );
                    if (foundSeat) {
                      seat = foundSeat;
                      coachLabel = coach.coachLabel;
                      break;
                    }
                  }

                  return (
                    <Badge
                      variant="outline"
                      key={seatId}
                      className="inline-flex h-8 items-center bg-blue-50 px-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      {coachLabel}-{seat?.number}
                    </Badge>
                  );
                })}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                No seats selected
              </span>
            )}
          </div>

          {selected && selected.length > 0 && (
            <div className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold whitespace-nowrap text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Total: ৳{(parseFloat(fare) * selected.length).toFixed(2)}
            </div>
          )}
        </div>

        <Button
          disabled={selected?.length === 0}
          onClick={() =>
            purchase({
              scheduleId,
              journeyDate: date,
              classType,
              seatIds: selected,
              totalAmount: Number(
                (parseFloat(fare) * selected.length).toFixed(2)
              ),
            })
          }
        >
          {isPending && <Loader2 className="animate-spin" />} Purchase
        </Button>
      </div>

      {currentCoach && (
        <Card>
          <CardHeader>Choose seats below:</CardHeader>
          <CardContent>
            <div className="grid grid-cols-16 gap-1 px-3">
              {currentCoach.seats.map((seat, i) => {
                const isSelected = selected?.includes(seat?.seatId);

                return (
                  <Button
                    key={i}
                    variant={
                      seat.status === "BOOKED"
                        ? "secondary"
                        : isSelected
                          ? "default"
                          : "outline"
                    }
                    disabled={seat.status === "BOOKED"}
                    onClick={() => toggle(seat)}
                  >
                    {seat.number}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
