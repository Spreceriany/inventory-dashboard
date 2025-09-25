// src/components/OrdersTable.tsx

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { OrderData } from "@/types/dashboard";
// Types based on the PDF requirements

interface OrdersTableProps {
  orders: OrderData[];
}

type SortField = "orderDate" | "quantity";
type SortDirection = "asc" | "desc" | null;

function DashBoardtable({ orders }: OrdersTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction or reset
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      // New field
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort the orders
  const sortedOrders = useMemo(() => {
    if (!sortField || !sortDirection) return orders;

    return [...orders].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === "orderDate") {
        aValue = new Date(a.orderDate);
        bValue = new Date(b.orderDate);
      } else if (sortField === "quantity") {
        aValue = a.quantity;
        bValue = b.quantity;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [orders, sortField, sortDirection]);

  // Status badge styling
  const getStatusVariant = (status: OrderData["status"]) => {
    switch (status) {
      case "planned":
        return "secondary"; // Yellow/orange styling
      case "confirmed":
        return "default"; // Blue styling
      case "delivered":
        return "outline"; // Green styling
      default:
        return "secondary";
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Order ID</TableHead>
            <TableHead className="font-semibold w-fit">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort("orderDate")}
              >
                Order Date
                <SortIcon field="orderDate" />
              </Button>
            </TableHead>
            <TableHead className="text-right font-semibold">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort("quantity")}
              >
                Quantity
                <SortIcon field="quantity" />
              </Button>
            </TableHead>
            <TableHead className="text-right font-semibold">
              Unit Cost
            </TableHead>
            <TableHead className="text-right font-semibold">
              Total Cost
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => {
            const totalCost = order.quantity * order.unitCost;

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell className="text-right">
                  {order.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {order.unitCost.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {totalCost.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className={`
                      ${
                        order.status === "planned"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : ""
                      }
                      ${
                        order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : ""
                      }
                      ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }
                    `}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default DashBoardtable;
