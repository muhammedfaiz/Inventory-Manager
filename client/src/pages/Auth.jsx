import { authContext } from "@/context/AuthContext"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
    const {token}=useContext(authContext);
    return token?(<Outlet/>):<Navigate to='/login'/>;
}
export default Auth