import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Customer from "./pages/Customer";
import Sales from "./pages/Sales";
import Report from "./pages/Report";
import Auth from "./pages/Auth";

function App() {
  return (
    <div className="dark min-h-screen bg-gray-900 text-white"> {/* Apply dark mode */}
    
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>}/>
          <Route element={<Auth/>}>
          <Route path="/" element={<Inventory/>}/>
          <Route path="/customers" element={<Customer/>}/>
          <Route path="/sales" element={<Sales/>}/>
          <Route path="/reports" element={<Report/>}/>
          </Route>
        </Routes>
      </Router>
      <ToastContainer/>
    </div>
  );
}

export default App;
