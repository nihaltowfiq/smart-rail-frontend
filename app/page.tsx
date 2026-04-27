"use client";

import { TrainSearchForm } from "@/components/TrainSearchForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [trains, setTrains] = useState(null);

  console.log({ trains });

  return (
    <div className="flex gap-8 p-6">
      <div className="w-60">
        <TrainSearchForm setTrains={setTrains} />
      </div>
      <div className="flex-1">
        <div className="rounded-lg border bg-card p-6 text-sm">
          <h1 className="mb-4 text-lg font-semibold">Search Results</h1>

          {trains?.length ? (
            trains.map((train) => (
              <div key={train.id} className="mb-3 rounded border p-4">
                <p className="font-medium">
                  {train.train_name} ({train.train_number})
                </p>
                <p>
                  {train.from_station} → {train.to_station}
                </p>
                <Button
                  className="mt-2 bg-green-600 text-white hover:bg-green-700"
                  variant="secondary"
                  // onClick={() => handleSelectTrain(train.id)}
                >
                  Book Now
                </Button>
              </div>
            ))
          ) : Array.isArray(trains) ? (
            <p className="text-muted-foreground">No trains found</p>
          ) : (
            <p className="text-muted-foreground">
              Select your travel details and click &quot;Search Trains&quot; to
              see available trains.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
