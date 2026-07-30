import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import LowStockAlertTable from "../../components/ecommerce/LowStockAlertTable";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Admin Operations & Merchandise Dashboard"
        description="Admin Operations Portal for total products, total orders, total revenue, pending/printing/delivered workflow orders, and low stock inventory alerts."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Top 7 Performance Metrics Cards */}
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        {/* Low Stock Inventory Alert Table */}
        <div className="col-span-12 xl:col-span-6">
          <LowStockAlertTable />
        </div>

        {/* Monthly Sales Performance */}
        <div className="col-span-12 xl:col-span-6">
          <MonthlySalesChart />
        </div>

        {/* Recent Orders Overview */}
        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
