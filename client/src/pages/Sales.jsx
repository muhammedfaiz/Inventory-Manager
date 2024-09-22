import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import {
  fetchCustomer,
  fetchProducts,
  fetchSales,
  recordSale,
  removeSale,
} from "@/services/userService";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customer, setCustomer] = useState("");
  const [cash, setCash] = useState("");
  const [product, setProduct] = useState("");
  const [sales, setSales] = useState([]);
  const [change, setChange] = useState(false);

  // Validation error states
  const [errors, setErrors] = useState({});
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProducts();
      const customers = await fetchCustomer();
      setProducts(products.products);
      setCustomers(customers.customers);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchSales();
      setSales(result.sales);
    };
    fetchData();
  }, [change]);

  const handleRecordSale = async () => {
    const errors = {};

    if (!date) {
      errors.date = "Date is required.";
    } else {
      const today = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(date).setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        errors.date = "Date cannot be in the future.";
      }
    }

    if (!quantity) {
      errors.quantity = "Quantity is required.";
    }

    if (!customer) {
      errors.customer = "Customer is required.";
    }

    if (!cash) {
      errors.cash = "Cash is required.";
    }

    if (!product) {
      errors.product = "Product is required.";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const newSale = {
      date,
      quantity: parseInt(quantity),
      customerId: customer,
      cash: parseFloat(cash),
      productId: product,
    };

    try {
      const result = await recordSale(newSale);
      if (result.status === 200) {
        toast.success(result.data.message);
        setDate("");
        setQuantity("");
        setCustomer("");
        setCash("");
        setProduct("");
        setChange(!change);
        setErrors({});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async(id)=>{
    const result = await  removeSale(id);
    if(result.status == 200){
      toast.success(result.data.message);
      setChange(!change);
    }
  }

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);

  const totalPages = Math.ceil(sales.length / salesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Record Sales</h2>

        {/* Sales Form */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <Label htmlFor="saleDate">Date</Label>
            <Input
              id="saleDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div>
            <Label htmlFor="product">Product</Label>
            <Select onValueChange={setProduct}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product, index) => (
                  <SelectItem key={index} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product && (
              <p className="text-red-500 text-sm">{errors.product}</p>
            )}
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-2"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Select onValueChange={setCustomer}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer, index) => (
                  <SelectItem key={index} value={customer._id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer && (
              <p className="text-red-500 text-sm">{errors.customer}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cash">Cash</Label>
            <Input
              id="cash"
              type="number"
              step="0.01"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="mt-2"
            />
            {errors.cash && <p className="text-red-500 text-sm">{errors.cash}</p>}
          </div>
        </div>
        <Button className="mt-4" onClick={handleRecordSale}>
          Record Sale
        </Button>

        {/* Sales List */}
        <h3 className="text-xl font-bold mt-8 mb-4">Sales List</h3>
        {sales.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b font-medium">
              <tr>
                <th scope="col" className="px-6 py-4">SI.NO</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Product</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Customer Name</th>
                <th scope="col" className="px-6 py-4">Cash</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{indexOfFirstSale + index + 1}</td>
                  <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4">{sale.product?.name}</td>
                  <td className="px-6 py-4">{sale.quantity}</td>
                  <td className="px-6 py-4">{sale.customer?.name}</td>
                  <td className="px-6 py-4">${sale.cash.toFixed(2)}</td>
                  <td className="px-6 py-4">
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDelete(sale._id)}
                      >
                        Delete
                      </Button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
