import axios from "axios";

const base_url = "http://localhost:8000/api/user";
const axiosInstance = axios.create({
  baseURL: base_url,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const signupService = async (data) => {
  try {
    const response = await axiosInstance.post("/signup", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const loginService = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const addProduct = async(data)=>{
    try {
        const response = await axiosInstance.post("/product", data);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const fetchProducts = async(search)=>{
    try {
        const response = await axiosInstance.get(`/products?search=${encodeURI(search)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const editProduct = async(id,data)=>{
    try {
        const response = await axiosInstance.patch(`/product/${id}`,data);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const deleteProduct = async(id)=>{
    try {
        const response = await axiosInstance.delete(`/product/${id}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const fetchCustomer = async()=>{
    try {
        const response = await axiosInstance.get("/customer");
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const addCustomer = async(data)=>{
    try {
        const response = await axiosInstance.post("/customer", data);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const removeCustomer = async (id)=>{
  try {
    const response = await axiosInstance.delete(`/customer/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const recordSale = async(data)=>{
    try {
        const response = await axiosInstance.post("/sale", data);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const fetchSales = async()=>{
    try {
        const response = await axiosInstance.get("/sales");
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const removeSale = async(id)=>{
  try {
    const response = await axiosInstance.delete(`/sales/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const sendEmailService = async(data)=>{
  try {
    const response = await axiosInstance.post("/send-email", data);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const fetchCustomerLedger =async()=>{
  try {
    const response = await axiosInstance.get("/customer-ledger");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const fetchItemsReport = async ()=>{
  try {
    const response = await axiosInstance.get("/items-report");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}