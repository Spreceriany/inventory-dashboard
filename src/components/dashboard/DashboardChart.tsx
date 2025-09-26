import { LoaderCircle } from "lucide-react";
import { CartesianGrid, XAxis, AreaChart, YAxis, Area } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { StockData } from "@/types/dashboard";
import { Button } from "../ui/button";
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

const DEMAND_PERCENTAGE_STEP = 10;

function DashBoardChart({
  adjustedData,
  demandAdjustment,
  isAdjusting,
  onChangeAdjustment,
}: {
  adjustedData: StockData[];
  demandAdjustment: number;
  isAdjusting: boolean;
  onChangeAdjustment: (delta: number) => void;
}) {
  const spinnerClass = ` absolute w-full h-full bg-black inset z-50 transition-all ${
    isAdjusting ? "opacity-20" : "opacity-0 pointer-events-none"
  }`;
  return (
    <>
      <CardContent className="pl-0 relative pr-0">
        <div className={spinnerClass}>
          <LoaderCircle className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white" />
        </div>
        <ChartContainer config={chartConfig} className="max-h-96 w-full">
          <AreaChart
            accessibilityLayer
            data={adjustedData}
            margin={{
              left: 12,
              right: 12,
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
            <YAxis dataKey={"stockLevel"} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="stockLevel"
              type="natural"
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="demand"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
        <div className=" justify-items-center self-center  mt-5 col-span-full justify-center flex flex-col text-center">
          <p className="mb-2">Change the demand</p>
          <div className="flex self-center  items-center justify-items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              className="size-10 cursor-pointer select-none"
              onClick={() => onChangeAdjustment(-DEMAND_PERCENTAGE_STEP)}
              disabled={demandAdjustment === -50 || isAdjusting}
            >
              -
            </Button>
            <div className=" font-bold col-auto  text-2xl">
              {demandAdjustment}%
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="size-10 cursor-pointer select-none"
              disabled={demandAdjustment === 150 || isAdjusting}
              onClick={() => onChangeAdjustment(DEMAND_PERCENTAGE_STEP)}
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}

export default DashBoardChart;
