import {  useEffect, useState } from "react";
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
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchProducts,
} from "@/services/userService";
import { toast } from "react-toastify";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [change, setChange] = useState(false);
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchProducts(searchTerm);
      if (response.products) {
        setProducts(response.products);
      }
    };
    getProducts();
  }, [change,searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [newDescription, setNewDescription] = useState("");

 

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const validate = () => {
    const newErrors = {};
    if (!newName.trim()) newErrors.name = "Name is required";
    if (newQuantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (newPrice <= 0) newErrors.price = "Price must be greater than 0";
    if (!newDescription.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validate()) return;

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
        resetForm();
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
    if (!validate()) return;

    try {
      const result = await editProduct(editingProduct._id, {
        name: newName,
        description: newDescription,
        price: newPrice,
        quantity: newQuantity,
      });
      if (result.status == 200) {
        toast.success(result.data.message);
        resetForm();
        setIsEditing(false);
        setEditingProduct(null);
        setChange(!change);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
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

  const resetForm = () => {
    setNewName("");
    setNewQuantity(0);
    setNewPrice(0);
    setNewDescription("");
    setErrors({});
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>

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
        {currentProducts.length > 0 ? (
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
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        )}

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
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
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
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="productQuantity">Quantity</Label>
              <Input
                id="productQuantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="productPrice">Price</Label>
              <Input
                id="productPrice"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
            <div className="col-span-3">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
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
