import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ProductListTable from "../../components/products/ProductListTable";

export default function ProductList() {
  return (
    <>
      <PageMeta
        title="Merchandise Products | MerchStudio"
        description="View, manage, edit, and delete custom merchandise products catalog."
      />
      <PageBreadcrumb pageTitle="Merchandise Products List" />
      <div className="space-y-6">
        <ProductListTable />
      </div>
    </>
  );
}
