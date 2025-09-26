import DashboardCard from "@/components/dashboard/DashboardCard.tsx";
import { KPIMetrics } from "@/types/dashboard";
import {
  Warehouse,
  ShoppingBag,
  ChartSpline,
  Clock,
  Scale,
} from "lucide-react";

function DashboardCardGrid({ kpiMetrics }: { kpiMetrics: KPIMetrics }) {
  return (
    <div className="grid col-span-full md:col-span-2 grid-cols-2 sm:grid-cols-2 gap-4 ">
      <DashboardCard
        title="Total Orders Value"
        value={kpiMetrics.totalOrdersValue}
        color="bg-blue-50"
        icon={<ShoppingBag className="h-6 w-6 text-black" />}
      />
      <DashboardCard
        title="Current Stock Level"
        value={kpiMetrics.currentStockLevel}
        color="bg-green-50"
        icon={<Warehouse className="h-6 w-6 text-black" />}
      />
      <DashboardCard
        title="Projected Stockouts"
        value={kpiMetrics.projectedStockouts}
        color="bg-red-50"
        icon={<Scale className="h-6 w-6 text-black" />}
      />
      <DashboardCard
        title="Service Level"
        value={kpiMetrics.serviceLevel + "%"}
        color="bg-yellow-50"
        icon={<ChartSpline className="h-6 w-6 text-black" />}
      />
      <DashboardCard
        title="Last Updated"
        value={kpiMetrics.lastUpdated}
        color="bg-gray-50"
        icon={<Clock className="h-6 w-6 text-black" />}
      />
    </div>
  );
}

export default DashboardCardGrid;
