import { title } from "@/components/primitives";
import { Document, Page } from "react-pdf";

export default function BlogPage() {
  return (
      <div>
          <h1 className={title()}>Reports Page</h1>

          {/*<Document file="http://localhost:1118/invoiceCommissionService/report/v1/viewpdf/salespersonCommReport/291?d1=2024-01-05&d2=2024-12-05">*/}
          {/*    <Page />*/}
          {/*</Document>*/}


      </div>
  );
}
