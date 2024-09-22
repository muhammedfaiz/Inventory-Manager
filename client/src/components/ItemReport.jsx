import { fetchProducts, sendEmailService } from "@/services/userService";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-toastify";

const ItemReport = () => {
  const [itemsData, setItemsData] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getItems = async () => {
      const result = await fetchProducts();
      setItemsData(result.products);
    };
    getItems();
  }, []);

  const handlePrint = () => {
    const printContents =
      document.getElementById("items-report-table").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      itemsData.map((item, index) => ({
        SI_NO: index + 1,
        ItemName: item.name,
        Description: item.description,
        Price: item.price.toFixed(2),
        Quantity: item.quantity,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items Report");
    XLSX.writeFile(workbook, "Items_report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Items Report", 20, 10);
    autoTable(doc, {
      startY: 20,
      head: [["SI.No", "Item Name", "Description", "Quantity", "Price"]],
      body: itemsData.map((item, index) => [
        index + 1,
        item.name,
        item.description,
        item.quantity,
        item.price,
      ]),
    });
    doc.save("Items_report.pdf");
  };

  const sendEmail = async() => {
    if (!recipientEmail) {
        toast.error("Please enter the recipient's email.");
        return;
      }
  
      try {
          const data = {
              data: itemsData.map((item) => ({
                  name: item.name,
                  description: item.description,
                  quantity: item.quantity,
                  price: item.price.toFixed(2),
              })),
              recipientEmail,
              items:true
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
        <Button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Print
        </Button>
        <Button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to Excel
        </Button>
        <Button
          onClick={exportToPDF}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
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
                Please enter the recipient email address to send the items
                report.
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

      <div id="items-report-table">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b font-medium">
            <tr>
              <th className="px-6 py-4">SI.NO</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            {itemsData?.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ItemReport;
