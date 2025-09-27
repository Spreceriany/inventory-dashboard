import { OrderData, StockData } from "@/types/dashboard";

export const kpiCalculations = {
  totalOrdersValue: (orders: OrderData[]): number => {
    return orders.reduce(
      (sum, order) => sum + order.quantity * order.unitCost,
      0
    );
  },

  currentStockLevel: (orders: OrderData[]): number => {
    return orders.reduce(
      (sum, order) =>
        order.status === "delivered" || order.status === "confirmed"
          ? sum + order.quantity
          : sum,
      0
    );
  },

  projectedStockouts: (stockData: StockData[]): number => {
    return stockData.reduce((acc, d) => {
      if (d.projected && d.stockLevel < d.demand) {
        return acc + (d.demand - d.stockLevel);
      }
      return acc;
    }, 0);
  }
};