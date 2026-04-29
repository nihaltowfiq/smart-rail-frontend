"use client";

import { SeatSelector } from "@/components/SeatSelector";
import { TrainSearchForm } from "@/components/TrainSearchForm";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Fragment, useState } from "react";

export type SearchTrainParams = {
  from: string;
  to: string;
  date: string;
  classType: string;
};

export default function Page() {
  const [searchParams, setSearchParams] = useState<SearchTrainParams>({
    from: "",
    to: "",
    date: "",
    classType: "",
  });
  const [trains, setTrains] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [selected, setSelected] = useState(null);

  const { data: seatsResponse, isFetching } = useQuery({
    queryKey: [
      "seats",
      scheduleId,
      searchParams?.date,
      searchParams?.classType,
    ],
    queryFn: async () => {
      const res = await api.get(`/trains/${scheduleId}/seats`, {
        params: { date: searchParams?.date, class: searchParams?.classType },
      });
      return res.data;
    },
    enabled: !!scheduleId,
  });

  console.log({ scheduleId, seatsResponse });

  const handleBookNow = (schedule_id) => {
    setScheduleId(schedule_id);
    setSelected(null);
  };

  const resetBookings = () => {
    setSelected(null);
    setScheduleId(null);
  };

  return (
    <div className="bg-linear-to-b from-green-50 to-white">
      <div className="mx-auto flex max-w-7xl gap-8 p-6">
        <div className="w-60">
          <TrainSearchForm
            setTrains={setTrains}
            resetBookings={resetBookings}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
        <div className="flex-1">
          <div className="rounded-lg border bg-card p-6 text-sm">
            <h1 className="mb-4 text-lg font-semibold">Search Results</h1>

            {trains?.length ? (
              trains.map((train, i) => (
                <Fragment key={i}>
                  <div className="mb-3 rounded border p-4">
                    <p className="font-medium">
                      {train.train_name} ({train.train_number})
                    </p>
                    <p>
                      {train.from_station} → {train.to_station}
                    </p>
                    <div className="my-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Fare</p>
                        <p className="font-semibold">৳{train.fare}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Seats</p>
                        <p className="font-semibold">
                          {train.total_seat_count}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available Seats</p>
                        <p className="font-semibold">
                          {train.total_available_seats_count}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleBookNow(train.schedule_id)}
                      disabled={isFetching || scheduleId == train.schedule_id}
                      className="mt-2 bg-green-600 text-white hover:bg-green-700"
                    >
                      {isFetching && <Loader2 className="animate-spin" />}
                      Book Now
                    </Button>
                  </div>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      {
                        "h-0": scheduleId != train.schedule_id,
                        "h-full": scheduleId == train.schedule_id,
                      }
                    )}
                  >
                    <SeatSelector
                      scheduleId={scheduleId}
                      date={searchParams?.date}
                      classType={searchParams?.classType}
                      fare={train.fare}
                      data={seatsResponse?.data}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </div>
                </Fragment>
              ))
            ) : Array.isArray(trains) ? (
              <p className="text-muted-foreground">No trains found</p>
            ) : (
              <p className="text-muted-foreground">
                Select your travel details and click &quot;Search Trains&quot;
                to see available trains.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
