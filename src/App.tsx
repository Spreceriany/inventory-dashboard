import { ChartLine, ChartNoAxesColumn } from "lucide-react";

import data from "../public/data.json";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { OrderData, StockData, KPIMetrics } from "./types/dashboard";
import DashboardTable from "./components/dashboard/DashBoardtable";
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-5)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const DEMAND_PERCENTAGE_MINIMUM = -50;
const DEMAND_PERCENTAGE_MAXIMUM = 150;
const DEMAND_PERCENTAGE_STEP = 10;

function App() {
  const [activeChart, setActiveChart] = useState("stock");
  const [demandPercentage, setDemandPercentage] = useState<StockData>();

  return (
    <>
      <div className="px-4 pt-4 bg-background min-h-full">
        <Card className="grid grid-cols-2 md:grid-cols-5 px-4 mb-4 max-h-[800px] h-full">
          <h1 className="text-3xl font-bold md:mb-4 col-span-1 self-center">
            {activeChart === "stock" ? "Stock levels" : "Demand over time"}{" "}
          </h1>
          <div className="flex self-center md:col-span-2 justify-self-end gap-2">
            <Button
              variant={activeChart === "demand" ? "default" : "secondary"}
              onClick={() => setActiveChart("demand")}
              className="cursor-pointer"
            >
              <ChartLine />
              Demand
            </Button>
            <Button
              variant={activeChart !== "stock" ? "secondary" : "default"}
              onClick={() => setActiveChart("stock")}
              className="cursor-pointer"
            >
              <ChartNoAxesColumn />
              Stock
            </Button>
          </div>
          <div className="flex flex-col col-span-full md:col-span-3 ">
            <Card>
              <CardContent className="pl-0">
                <ChartContainer
                  config={chartConfig}
                  className="max-h-96 w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={data.stockData}
                    margin={{
                      left: 10,
                      right: 10,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />

                    <YAxis
                      dataKey={"stockLevel"}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="stockLevel"
                      type="natural"
                      stroke="var(--color-desktop)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-desktop)",
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <div className=" self-center justify-center flex flex-col">
                <p className="mb-2">Change the demand</p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" className="size-8">
                    -
                  </Button>
                  <div>10%</div>
                  <Button variant="secondary" size="icon" className="size-8">
                    +
                  </Button>
                </div>
              </div>
            </Card>
          </div>
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
