"use client";

import { TrainIncomeTable } from "@/components/TrainIncomeTable";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const user = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to signin if not authenticated
  //   if (user === null) {
  //     router.push("/signin");
  //     return;
  //   }

  //   // Redirect to home if not admin
  //   if (user && user.role !== "admin") {
  //     router.push("/");
  //   }
  // }, [user, router]);

  // if (!user || user.role !== "admin") {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Reports
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor train income and booking statistics
          </p>
        </div>

        <TrainIncomeTable />
      </div>
    </div>
  );
}
