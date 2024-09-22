import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FaBars,
  FaBox,
  FaUsers,
  FaChartLine,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa"; 
import { authContext } from "@/context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const {setToken}=useContext(authContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-24"
      } bg-gray-700 min-h-screen p-4 transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-16">
        {/* Sidebar Toggle Button */}
        <Button variant="ghost" className="text-white" onClick={toggleSidebar}>
          <FaBars />
        </Button>
        {isOpen && <h2 className="text-white text-xl">Inventory Manager</h2>}
      </div>

      {/* Sidebar Links */}
      <nav className="space-y-4">

        <Link
          to="/"
          className="flex items-center text-white p-3 hover:bg-gray-900 rounded-md transition-colors"
        >
          <FaBox className="mr-2" />
          {isOpen && <span>Inventory</span>}
        </Link>

        <Link
          to="/customers"
          className="flex items-center text-white p-3 hover:bg-gray-900 rounded-md transition-colors"
        >
          <FaUsers className="mr-2" />
          {isOpen && <span>Customers</span>}
        </Link>

        <Link
          to="/sales"
          className="flex items-center text-white p-3 hover:bg-gray-900 rounded-md transition-colors"
        >
          <FaChartLine className="mr-2" />
          {isOpen && <span>Sales</span>}
        </Link>

        <Link
          to="/reports"
          className="flex items-center text-white p-3 hover:bg-gray-900 rounded-md transition-colors"
        >
          <FaFileAlt className="mr-2" />
          {isOpen && <span>Reports</span>}
        </Link>

        <Button
          variant="ghost"
          className="flex items-center text-white p-3 hover:bg-gray-900 rounded-md transition-colors"
          onClick={() => logout()}
        >
          <FaSignOutAlt className="mr-2" />
          {isOpen && <span>Logout</span>}
        </Button>
      </nav>
    </div>
  );
};

export default Sidebar;
