import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Customer from "./pages/Customer";
import Sales from "./pages/Sales";

function App() {
  return (
    <div className="dark min-h-screen bg-gray-900 text-white"> {/* Apply dark mode */}
    
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Inventory/>}/>
          <Route path="/customers" element={<Customer/>}/>
          <Route path="/sales" element={<Sales/>}/>
        </Routes>
      </Router>
      <ToastContainer/>
    </div>
  );
}

export default App;
