import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addProduct, deleteProduct, editProduct, fetchProducts } from "@/services/userService";
import { toast } from "react-toastify";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [change, setChange] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchProducts();
      if (response.products.length > 0) {
        setProducts(response.products);
      }
    };
    getProducts();
  }, [change]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [newDescription, setNewDescription] = useState("");

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddProduct = async () => {
    const newProduct = {
      name: newName,
      quantity: parseInt(newQuantity),
      price: parseFloat(newPrice),
      description: newDescription,
    };
    try {
      const result = await addProduct(newProduct);
      if (result.status == 200) {
        toast.success(result.data.message);
        setNewName("");
        setNewQuantity(0);
        setNewPrice(0);
        setNewDescription("");
        setChange(!change);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setNewName(product.name);
    setNewQuantity(product.quantity);
    setNewPrice(product.price);
    setNewDescription(product.description);
  };

  const handleSaveEdit = async () => {
    try {
      const result = await editProduct(editingProduct._id, {
        name: newName,
        description: newDescription,
        price: newPrice,
        quantity: newQuantity,
      });
      if (result.status == 200) {
        toast.success(result.data.message);
        setIsEditing(false);
        setEditingProduct(null);
        setNewName("");
        setNewQuantity(0);
        setNewPrice(0);
        setNewDescription("");
        setChange(!change);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async(productId) => {
    try {
        const result = await deleteProduct(productId);
        if (result.status == 200) {
            toast.success(result.data.message);
            setChange(!change);
        }
    } catch (error) {
        toast.error(error.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>

        {/* Search Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Product Table */}
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4">
                SI.NO
              </th>
              <th scope="col" className="px-6 py-4">
                Name
              </th>
              <th scope="col" className="px-6 py-4">
                Quantity
              </th>
              <th scope="col" className="px-6 py-4">
                Price
              </th>
              <th scope="col" className="px-6 py-4">
                Description
              </th>
              <th scope="col" className="px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product._id} className="border-b dark:border-gray-700">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 w-1/4">{product.description}</td>
                <td className="px-6 py-4 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Product Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Add Product</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="productName">Name</Label>
              <Input
                id="productName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="productQuantity">Quantity</Label>
              <Input
                id="productQuantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="productPrice">Price</Label>
              <Input
                id="productPrice"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddProduct}>
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
