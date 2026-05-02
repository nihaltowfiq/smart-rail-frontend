"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/lib/api/admin";
import { GetTrainsFilterDto, IncomeFilter } from "@/lib/types/admin";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export function TrainIncomeTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [incomeFilter, setIncomeFilter] = useState<IncomeFilter>("ALL_TIME");
  const [sortBy, setSortBy] = useState<GetTrainsFilterDto["sortBy"]>("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  // Build query parameters with optional fields
  const queryFilters: GetTrainsFilterDto = {
    page,
    limit,
    sortBy,
    sortOrder,
    incomeFilter,
    ...(searchTerm && { trainName: searchTerm }),
    ...(incomeFilter === "YEAR" && { year }),
    ...(incomeFilter === "MONTH" && { year, month }),
  };

  // Use React Query
  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ["trains", queryFilters],
    queryFn: () => adminApi.getTrains(queryFilters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  console.log(data);

  const trains = data?.data?.trains ?? [];
  const pagination = data?.data?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  };

  console.log({ trains });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleIncomeFilterChange = (value: IncomeFilter) => {
    setIncomeFilter(value);
    setPage(1);
  };

  const handleSortChange = (newSortBy: GetTrainsFilterDto["sortBy"]) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleSortOrderChange = (newSortOrder: "ASC" | "DESC") => {
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    setPage(1);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2024, i, 1).toLocaleDateString("en-US", {
      month: "long",
    }),
  }));

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const errorMessage = error
    ? "Failed to fetch train data. Please try again."
    : null;

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Train Income Reports</CardTitle>
          <CardDescription>
            View and analyze train income data with dynamic filtering options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Search by Train Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Train</label>
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-9"
                />
              </div>

              {/* Income Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select
                  value={incomeFilter || "ALL_TIME"}
                  onValueChange={(value) =>
                    handleIncomeFilterChange(value as IncomeFilter)
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_TIME">All Time</SelectItem>
                    <SelectItem value="YEAR">This Year</SelectItem>
                    <SelectItem value="MONTH">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              {(incomeFilter === "YEAR" || incomeFilter === "MONTH") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select
                    value={year.toString()}
                    onValueChange={(value) => handleYearChange(parseInt(value))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Month Filter */}
              {incomeFilter === "MONTH" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Month</label>
                  <Select
                    value={month.toString()}
                    onValueChange={(value) =>
                      handleMonthChange(parseInt(value))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={sortBy || "name"}
                  onValueChange={(value) =>
                    handleSortChange(value as GetTrainsFilterDto["sortBy"])
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="bookings">Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <div className="flex gap-2">
                  <Button
                    variant={sortOrder === "ASC" ? "default" : "outline"}
                    size="sm"
                    className="h-9 flex-1"
                    onClick={() => handleSortOrderChange("ASC")}
                  >
                    Asc
                  </Button>
                  <Button
                    variant={sortOrder === "DESC" ? "default" : "outline"}
                    size="sm"
                    className="h-9 flex-1"
                    onClick={() => handleSortOrderChange("DESC")}
                  >
                    Desc
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardContent className="pt-6">
          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-900">
              {errorMessage}
            </div>
          )}

          {isPending || isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : trains?.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No trains found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Train Number</TableHead>
                      <TableHead>Train Name</TableHead>
                      <TableHead className="text-right">Total Income</TableHead>
                      <TableHead className="text-right">
                        Total Bookings
                      </TableHead>
                      <TableHead className="text-right">
                        Successful Payments
                      </TableHead>
                      <TableHead className="text-right">
                        Total Passengers
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trains?.map((train) => (
                      <TableRow key={train?.trainId}>
                        <TableCell className="font-mono font-medium">
                          {train?.trainNumber}
                        </TableCell>
                        <TableCell>{train?.trainName}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {formatCurrency(train?.totalIncome ?? 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {train?.totalBookings}
                        </TableCell>
                        <TableCell className="text-right">
                          {train?.successfulPayments}
                        </TableCell>
                        <TableCell className="text-right">
                          {train?.totalPassengers}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {(pagination?.pages ?? 0) > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(
                              Math.max(1, (pagination?.page ?? 1) - 1)
                            )
                          }
                          className={
                            (pagination?.page ?? 1) === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: pagination?.pages ?? 0 },
                        (_, i) => i + 1
                      ).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={pageNum === (pagination?.page ?? 1)}
                            onClick={() => handlePageChange(pageNum)}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(
                                pagination?.pages ?? 1,
                                (pagination?.page ?? 1) + 1
                              )
                            )
                          }
                          className={
                            (pagination?.page ?? 1) === (pagination?.pages ?? 1)
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {trains?.length ?? 0} of {pagination?.total ?? 0} trains
                (Page {pagination?.page ?? 1} of {pagination?.pages ?? 1})
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
