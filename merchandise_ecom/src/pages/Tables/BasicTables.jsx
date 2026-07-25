import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ProductListTable from "../../components/products/ProductListTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Merchandise Catalog & Products | MerchStudio"
        description="Manage custom apparel, caps, mugs, bottles, and print settings"
      />
      <PageBreadcrumb pageTitle="Merchandise Products Catalog" />
      <div className="space-y-6">
        <ProductListTable />
      </div>
    </>
  );
}
