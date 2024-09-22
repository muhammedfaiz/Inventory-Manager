import { useEffect, useState } from "react";
import { fetchSales, sendEmailService } from "@/services/userService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-toastify";

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState(""); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);  

  useEffect(() => {
    const getSalesData = async () => {
      const result = await fetchSales();
      setSalesData(result.sales);
    };
    getSalesData();
  }, []);

  const handlePrint = async () => {
    const printContents = document.getElementById("sales-report-table").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      salesData.map((sale, index) => ({
        SI_NO: index + 1,
        Date: new Date(sale.date).toLocaleDateString("en-GB"),
        Product: sale.product.name,
        Quantity: sale.quantity,
        Customer: sale.customer.name,
        Cash: sale.cash.toFixed(2),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "Sales_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 20, 10);
    autoTable(doc, {
      startY: 20,
      head: [["SI.No", "Date", "Product", "Quantity", "Customer", "Cash"]],
      body: salesData.map((sale, index) => [
        index + 1,
        new Date(sale.date).toLocaleDateString("en-GB"),
        sale.product.name,
        sale.quantity,
        sale.customer.name,
        sale.cash.toFixed(2),
      ]),
    });
    doc.save("Sales_Report.pdf");
  };

  const sendEmail = async () => {
    if (!recipientEmail) {
      toast.error("Please enter the recipient's email.");
      return;
    }

    try {
        const data = {
            data: salesData.map((sale) => ({
                date: sale.date,
                product: sale.product.name,
                quantity: sale.quantity,
                customer: sale.customer.name,
                cash: sale.cash.toFixed(2),
            })),
            recipientEmail,
            sales:true
        }
        const result = await sendEmailService(data);
        if(result.status == 200){
            toast.success("Email sent successfully.");
            setRecipientEmail("");
        }
   
    } catch (error) {
      console.error("Error sending email:", error);
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex space-x-4 mb-4">
        <Button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded">
          Print
        </Button>
        <Button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">
          Export to Excel
        </Button>
        <Button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded">
          Export to PDF
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Send via Email
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Sales Report</DialogTitle>
              <DialogDescription>
                Please enter the recipient email address to send the sales report.
              </DialogDescription>
            </DialogHeader>

            <Input
              type="email"
              placeholder="Recipient's Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full mb-4"
            />

            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={sendEmail} className="bg-gray-900">
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div id="sales-report-table">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b font-medium">
            <tr>
              <th className="px-6 py-4">SI.NO</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Cash</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString("en-GB")}</td>
                <td className="px-6 py-4">{sale.product.name}</td>
                <td className="px-6 py-4">{sale.quantity}</td>
                <td className="px-6 py-4">{sale.customer.name}</td>
                <td className="px-6 py-4">${sale.cash.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
