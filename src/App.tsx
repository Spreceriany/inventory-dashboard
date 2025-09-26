import data from "../public/data.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useMemo, useState } from "react";
import { StockData, KPIMetrics, OrderData } from "./types/dashboard";
import DashboardTable from "./components/dashboard/DashBoardtable";
import DashBoardChart from "./components/dashboard/DashboardChart";
import DashboardCardGrid from "./components/dashboard/DashboardCardGrid";

const DEMAND_PERCENTAGE_MINIMUM = -50;
const DEMAND_PERCENTAGE_MAXIMUM = 150;

function App() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [kpiData, setKPIData] = useState<KPIMetrics>({} as KPIMetrics);
  const [demandAdjustment, setDemandAdjustment] = useState<number>(0); // percentage, e.g. 20 = +20%
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const totalOrdersValue = data.orders.reduce(
          (sum: number, order: OrderData) =>
            sum + order.quantity * order.unitCost,
          0
        );
        const currentStockLevel = data.orders.reduce(
          (sum: number, order: OrderData) =>
            order.status === "delivered" || order.status === "confirmed"
              ? sum + order.quantity
              : sum,
          0
        );

        const totalDifference = data.stockData.reduce(
          (acc: number, d: StockData) => {
            if (d.projected && d.stockLevel < d.demand) {
              return acc + (d.demand - d.stockLevel);
            }
            return acc;
          },
          0
        );
        setStockData(data.stockData);

        setKPIData({
          totalOrdersValue,
          currentStockLevel,
          projectedStockouts: totalDifference,
          serviceLevel: demandAdjustment, // Placeholder, replace with real calculation if needed
          lastUpdated: new Date().toISOString(),
        });
      })
      .catch((err) => console.error("Failed to load data.json", err));
  }, []);

  // Derive adjusted dataset
  const adjustedData = stockData.map((d) => {
    const adjustedDemand = Math.round(d.demand * (1 + demandAdjustment / 100));
    return {
      ...d,
      demand: adjustedDemand,
      projected: d.stockLevel < adjustedDemand,
    };
  });

  const formatTimestamp = (): string => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const ps = useMemo(() => {
    return adjustedData.reduce((acc, d) => {
      if (d.projected && d.stockLevel < d.demand) {
        return acc + (d.demand - d.stockLevel);
      }
      return acc;
    }, 0);
  }, [adjustedData]);

  const newTime = formatTimestamp();
  const adjustedKPIDate: KPIMetrics = {
    ...kpiData,
    projectedStockouts: ps,
    serviceLevel: demandAdjustment,
    lastUpdated: newTime,
  };

  // Increment/decrement demand adjustment, clamped to [-50, 150]
  const changeAdjustment = (delta: number) => {
    setIsAdjusting(true);

    setTimeout(() => {
      setDemandAdjustment((prev) => {
        const newVal = prev + delta;
        return Math.min(
          DEMAND_PERCENTAGE_MAXIMUM,
          Math.max(DEMAND_PERCENTAGE_MINIMUM, newVal)
        );
      });

      setIsAdjusting(false); //
    }, 500); // delay in ms
  };

  return (
    <>
      <div className="px-4 pt-4 bg-background  ">
        <Card className="grid grid-cols-2 md:grid-cols-5 px-4 mb-4  h-full">
          <h1 className="text-3xl font-bold md:mb-4 col-span-full self-center">
            Chart
          </h1>

          {/* Chart */}

          <div className="flex flex-col col-span-full md:col-span-3 ">
            <Card className="min-h-fit">
              <CardContent className="pl-0 relative">
                <DashBoardChart
                  adjustedData={adjustedData}
                  demandAdjustment={demandAdjustment}
                  isAdjusting={isAdjusting}
                  onChangeAdjustment={changeAdjustment}
                />
              </CardContent>
            </Card>
          </div>

          {/* KPI Cards */}
          <DashboardCardGrid kpiMetrics={adjustedKPIDate} />
        </Card>
        {/* Orders Table */}
        <Card className="px-4">
          <DashboardTable
            orders={data.orders.map((order: any) => ({
              ...order,
              totalCost: order.quantity * order.unitCost,
            }))}
          />
        </Card>
      </div>
    </>
  );
}

export default App;
