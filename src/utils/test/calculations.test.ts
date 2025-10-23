import { expect, test, describe } from 'vitest'
import { kpiCalculations } from '../calculations'

describe('kpiCalculations.totalOrdersValue', () => {
  test('computes the sum of quantity * unitCost across orders', () => {
    const orders = [
      { id: '1', orderDate: '2025-01-01', quantity: 10, unitCost: 5, totalCost: 50, status: 'planned' as const },
      { id: '2', orderDate: '2025-01-02', quantity: 3, unitCost: 20, totalCost: 60, status: 'delivered' as const },
    ]
    const result = kpiCalculations.totalOrdersValue(orders)
    expect(result).toBe(10 * 5 + 3 * 20)
  })

  test('returns 0 for empty list', () => {
    expect(kpiCalculations.totalOrdersValue([])).toBe(0)
  })
})

describe('kpiCalculations.currentStockLevel', () => {
  test('sums quantities only for confirmed and delivered orders', () => {
    const orders = [
      { id: '1', orderDate: '2025-01-01', quantity: 7, unitCost: 10, totalCost: 70, status: 'planned' as const },
      { id: '2', orderDate: '2025-01-02', quantity: 5, unitCost: 8, totalCost: 40, status: 'confirmed' as const },
      { id: '3', orderDate: '2025-01-03', quantity: 2, unitCost: 12, totalCost: 24, status: 'delivered' as const },
    ]
    const result = kpiCalculations.currentStockLevel(orders)
    expect(result).toBe(5 + 2)
  })

  test('returns 0 for empty list', () => {
    expect(kpiCalculations.currentStockLevel([])).toBe(0)
  })
})

describe('kpiCalculations.projectedStockouts', () => {
  test('sums deficits (demand - stockLevel) only when projected is true and stockLevel < demand', () => {
    const stockData = [
      { month: 'Jan', stockLevel: 100, demand: 120, projected: true },   // deficit 20
      { month: 'Feb', stockLevel: 80, demand: 60, projected: true },     // no deficit
      { month: 'Mar', stockLevel: 50, demand: 70, projected: false },    // ignored (not projected)
      { month: 'Apr', stockLevel: 30, demand: 45, projected: true },     // deficit 15
    ]
    const result = kpiCalculations.projectedStockouts(stockData)
    expect(result).toBe(20 + 15)
  })

  test('returns 0 for empty list', () => {
    expect(kpiCalculations.projectedStockouts([])).toBe(0)
  })
})
