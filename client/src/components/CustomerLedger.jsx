import { Input } from "./ui/input"; 
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useEffect, useState } from "react"
import { fetchCustomerLedger, sendEmailService } from "@/services/userService"
import * as XLSX from 'xlsx';
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "react-toastify"

const CustomerLedger = () => {
    const [recipientEmail,setRecipientEmail]=useState('');
    const [customerData,setCustomerData]=useState([]);
    const [isDialogOpen,setIsDialogOpen]=useState(false);

    useEffect(()=>{
        const getCustomerLedger = async()=>{
            const result = await fetchCustomerLedger();
            setCustomerData(result.customerData);
        }
        getCustomerLedger();
    },[]);

    const handlePrint=()=>{
      const printContents = document.getElementById("customer-ledger-table").innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }

    const exportToExcel = ()=>{
      const worksheet = XLSX.utils.json_to_sheet(
        customerData.map((data,index)=>(
          {
            SI_NO: index+1,
            Customer_Name: data.name,
            Phone: data.phone,
            Address: data.address,
            TotalSpent: data.totalSpent.toFixed(2),
          }
        ))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Report");
      XLSX.writeFile(workbook, "Customer Report.xlsx");
    }

    const exportToPDF = ()=>{
      const doc = new jsPDF();
      doc.text("Customer Report", 20, 10);
      autoTable(doc, {
        startY: 20,
        head: [["SI.No", "Name", "Phone", "Address", "Total Spent"]],
        body: customerData.map((customer, index) => [
          index + 1,
          customer.name,
          customer.phone,
          customer.address,
          customer.totalSpent.toFixed(2),
        ]),
      });
      doc.save("Customer_report.pdf");
    }

    const sendEmail = async()=>{
      if (!recipientEmail) {
        toast.error("Please enter the recipient's email.");
        return;
      }
  
      try {
          const data = {
              data: customerData.map((customer) => ({
                  name: customer.name,
                  phone: customer.phone,
                  quantity: customer.address,
                  totalSpent: customer.totalSpent.toFixed(2),
              })),
              recipientEmail,
              customer:true
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
    }
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
              <DialogTitle>Send Customer Report</DialogTitle>
              <DialogDescription>
                Please enter the recipient email address to send the customer report.
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

      <div id="customer-ledger-table">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b font-medium">
            <tr>
              <th className="px-6 py-4">SI.NO</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.address}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default CustomerLedger