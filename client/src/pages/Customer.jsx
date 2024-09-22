import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchCustomer, addCustomer, removeCustomer } from "@/services/userService";
import { toast } from "react-toastify";

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [change,setChange]=useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetchCustomer();
      if (response.customers.length > 0) {
        setUsers(response.customers);
      }
    };
    getUsers();
  }, [change]);

  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;

    if (!newName.trim()) {
      tempErrors["name"] = "Name is required.";
      isValid = false;
    }

    if (!newAddress.trim()) {
      tempErrors["address"] = "Address is required.";
      isValid = false;
    }

    if (!newMobile.trim()) {
      tempErrors["mobile"] = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d+$/.test(newMobile)) {
      tempErrors["mobile"] = "Please enter a valid mobile number.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleAddUser = async () => {
    if (handleValidation()) {
      const newUser = {
        name: newName,
        address: newAddress,
        phone: parseInt(newMobile),
      };
      try {
        const result = await addCustomer(newUser);
        if (result.status === 200) {
          toast.success(result.data.message);
          setNewName("");
          setNewAddress("");
          setNewMobile("");
          setErrors({});
          setChange(!change)
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleDeleteUser = async(id)=>{
    try {
      const result = await removeCustomer(id);
      if (result.status === 200) {
        toast.success(result.data.message);
        setChange(!change);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Customer Management</h2>

        <div className="mb-8">
          {currentUsers.length > 0 ? (
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4">SI.NO</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Address</th>
                  <th scope="col" className="px-6 py-4">Mobile Number</th>
                  <th scope="col" className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-6 py-4">{indexOfFirstUser + index + 1}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.address}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-8">No data available</div>
          )}

          {users.length > 0 && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Add New Customer</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              {errors.name && <span className="text-red-500">{errors.name}</span>}
            </div>
            <div>
              <Label htmlFor="userMobile">Mobile Number</Label>
              <Input
                id="userMobile"
                value={newMobile}
                onChange={(e) => setNewMobile(e.target.value)}
              />
              {errors.mobile && <span className="text-red-500">{errors.mobile}</span>}
            </div>
            <div className="col-span-2">
              <Label htmlFor="userAddress">Address</Label>
              <Textarea
                id="userAddress"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              {errors.address && <span className="text-red-500">{errors.address}</span>}
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddUser}>
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
