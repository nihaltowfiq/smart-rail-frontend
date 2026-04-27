"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Cumilla",
  "Noakhali",
  "Rangpur",
  "Mymensingh",
];

const CLASSES = ["AC", "NON_AC"];

type Props = {
  setTrains: Dispatch<SetStateAction<any>>;
};

export function TrainSearchForm({ setTrains }: Props) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [classType, setClassType] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => api.post("/trains/search", data),
  });

  // Get next 7 days
  const getDateRange = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const availableDates = getDateRange();
  const minDate = availableDates[0];
  const maxDate = availableDates[availableDates.length - 1];

  const handleSearch = () => {
    if (from && to && date && classType) {
      console.log({ from, to, date, classType });
      mutate(
        { from, to, date, class: classType },
        {
          onSuccess: ({ data }) => {
            setTrains(data?.data);
          },
        }
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">Search Trains</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between",
                  !from && "text-muted-foreground"
                )}
              >
                {from || "Select departure city"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
              {CITIES.map((city) => (
                <DropdownMenuItem key={city} onClick={() => setFrom(city)}>
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between",
                  !to && "text-muted-foreground"
                )}
              >
                {to || "Select destination city"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
              {CITIES.map((city) => (
                <DropdownMenuItem key={city} onClick={() => setTo(city)}>
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date of Journey</Label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Choose Class</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between",
                  !classType && "text-muted-foreground"
                )}
              >
                {classType || "Select class"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
              {CLASSES.map((cls) => (
                <DropdownMenuItem key={cls} onClick={() => setClassType(cls)}>
                  {cls}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={handleSearch}
          disabled={!from || !to || !date || !classType}
          className="mt-6 w-full"
        >
          {isPending && <Loader2 className="animate-spin" />}
          Search Trains
        </Button>
      </div>
    </div>
  );
}
