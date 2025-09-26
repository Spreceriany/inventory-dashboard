import data from "../public/data.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { OrderData, StockData, KPIMetrics } from "./types/dashboard";
import DashboardTable from "./components/dashboard/DashBoardtable";
import DashBoardChart from "./components/dashboard/DashboardChart";

const DEMAND_PERCENTAGE_MINIMUM = -50;
const DEMAND_PERCENTAGE_MAXIMUM = 150;

function App() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [demandAdjustment, setDemandAdjustment] = useState(0); // percentage, e.g. 20 = +20%
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setStockData(data.stockData);
      })
      .catch((err) => console.error("Failed to load data.json", err));
  }, []);

  // Derive adjusted dataset
  const adjustedData = stockData.map((d) => ({
    ...d,
    demand: Math.round(d.demand * (1 + demandAdjustment / 100)),
  }));

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
      <div className="px-4 pt-4 bg-background min-h-full">
        <Card className="grid grid-cols-2 md:grid-cols-5 px-4 mb-4 max-h-[800px] h-full">
          <h1 className="text-3xl font-bold md:mb-4 col-span-full self-center">
            Chart
          </h1>

          {/* Chart */}

          <div className="flex flex-col col-span-full md:col-span-3 ">
            <Card>
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
          <div className="grid grid-cols-2 col-span-full md:col-span-2 gap-4 w-full">
            <Card className="p-2">
              <CardHeader>
                <CardTitle>Stock levels</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
            </Card>
            <Card className="p-2">
              <CardHeader>
                <CardTitle>Stock levels</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
            </Card>
            <Card className="p-2">
              <CardHeader>
                <CardTitle>Stock levels</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
            </Card>
          </div>
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
