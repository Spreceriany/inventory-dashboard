import { Card, CardContent } from "@/components/ui/card";

import { useEffect, useMemo, useState } from "react";
import { StockData, KPIMetrics, OrderData } from "./types/dashboard";
import DashboardTable from "@/components/dashboard/DashboardTable";
import DashBoardChart from "@/components/dashboard/DashboardChart";
import DashboardCardGrid from "@/components/dashboard/DashboardCardGrid";
import { kpiCalculations } from "@/utils/calculations";
const DEMAND_PERCENTAGE_MINIMUM = -50;
const DEMAND_PERCENTAGE_MAXIMUM = 150;

function App() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [kpiData, setKPIData] = useState<KPIMetrics>({} as KPIMetrics);
  const [demandAdjustment, setDemandAdjustment] = useState<number>(0); // percentage, e.g. 20 = +20%
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [hasdDemandChanged, setHasDemandChanged] = useState<boolean>(false);

  // Main data processing function
  const processLoadedData = (data: any) => {
    const totalOrdersValue = kpiCalculations.totalOrdersValue(data.orders);
    const currentStockLevel = kpiCalculations.currentStockLevel(data.orders);
    const projectedStockouts = kpiCalculations.projectedStockouts(
      data.stockData
    );

    // Update state
    setStockData(data.stockData);
    setOrderData(data.orders);
    setKPIData({
      totalOrdersValue,
      currentStockLevel,
      projectedStockouts,
      serviceLevel: data.kpiMetrics.serviceLevel,
      lastUpdated: data.kpiMetrics.lastUpdated,
    });
  };

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(processLoadedData)
      .catch((err) => console.error("Failed to load data.json", err));
  }, []);

  const adjustedStockData = stockData.map((d) => {
    const adjustedDemand = Math.round(d.demand * (1 + demandAdjustment / 100));
    return {
      ...d,
      demand: adjustedDemand,
      projected: d.stockLevel < adjustedDemand,
    };
  });

  const formatTimestamp = (): string => {
    if (hasdDemandChanged) {
      const now = new Date();

      const day = now.getDate();
      const month = now.toLocaleString("en-GB", { month: "short" });
      const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return `${day} ${month} ${time}`; // 👉 no comma/dash
    } else {
      return kpiData.lastUpdated;
    }
  };

  const adjustedProjectedStockouts = useMemo(() => {
    return adjustedStockData.reduce((acc: number, d: StockData) => {
      if (d.projected && d.stockLevel < d.demand) {
        return acc + (d.demand - d.stockLevel);
      }
      return acc;
    }, 0);
  }, [adjustedStockData]);

  const adjustedKPIDate: KPIMetrics = {
    ...kpiData,
    projectedStockouts: adjustedProjectedStockouts,
    serviceLevel: demandAdjustment,
    lastUpdated: formatTimestamp(),
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
      setHasDemandChanged(true);
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
                  adjustedData={adjustedStockData}
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
          <DashboardTable orders={orderData} />
        </Card>
      </div>
    </>
  );
}

export default App;
