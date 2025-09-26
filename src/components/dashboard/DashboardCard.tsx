import data from "../../../public/data.json";
import { KPIMetrics } from "@/types/dashboard";
interface DashboardCardProps {
  metrics: KPIMetrics;
}

function DasboardCard({ metrics }: DashboardCardProps) {
  return <>{metrics.currentStockLevel}</>;
}

export default DasboardCard;
