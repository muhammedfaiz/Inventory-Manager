import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SalesReport from "@/components/SalesReport";
import ItemReport from "@/components/ItemReport";
import CustomerLedger from "@/components/CustomerLedger";

const Report = () => {
  const [activeReport, setActiveReport] = useState("Sales");

  const handleViewReport = (reportType) => {
    setActiveReport(reportType);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        {/* Report Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sales Report */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Sales Report</h2>
            </CardHeader>
            <CardContent>
              <p>View detailed sales data and analytics.</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => handleViewReport("Sales")}
              >
                View Sales Report
              </Button>
            </CardContent>
          </Card>

          {/* Items Report */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Items Report</h2>
            </CardHeader>
            <CardContent>
              <p>Get inventory details and item analytics.</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => handleViewReport("Items")}
              >
                View Items Report
              </Button>
            </CardContent>
          </Card>

          {/* Customer Ledger */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Customer Ledger</h2>
            </CardHeader>
            <CardContent>
              <p>All transactions related to the customer.</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => handleViewReport("CustomerLedger")}
              >
                View Customer Ledger
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Display Selected Report */}
        <div className="mt-8">
          {activeReport === "Sales" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
              {/* Populate with sales data */}
              <p>Sales report details go here.</p>
              <SalesReport/>
            </div>
          )}
          {activeReport === "Items" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Items Report</h2>
              {/* Populate with items data */}
              <p>Items report details go here.</p>
              <ItemReport/>
            </div>
          )}
          {activeReport === "CustomerLedger" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Customer Ledger</h2>
              {/* Populate with customer ledger data */}
              <p>Customer ledger details go here.</p>
              <CustomerLedger/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
