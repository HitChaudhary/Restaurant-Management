import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

// Set base URL for all requests
axios.defaults.baseURL = `http://localhost:7000`;

const HotalContext = createContext();

export const Provider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [activeTables, setActiveTables] = useState([]);
    const [loading, setLoading] = useState(false); // <--- New Loading State

    const navigate = useNavigate(); // 2. Initialize navigate

    // 1. FETCH ACTIVE TABLES
    const fetchActivetables = async () => {
        try {
            const { data } = await axios.get('/api/order/active');
            if (data.success) {
                setActiveTables(data.activeTables || []);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    // 2. SAVE ORDER
    const saveOrder = async (tableId, cartItems, subtotal) => {
        try {
            const orderData = {
                tableNumber: tableId,
                items: cartItems,
                subtotal: subtotal
            };
            const { data } = await axios.post('/api/order/save', orderData);
            if (data.success) {
                toast.success(data.message);
                await fetchActivetables();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save");
            return false;
        }
    };

    // 3. FINALIZE ORDER
    const finalizeOrder = async (tableId, finalData) => {
        try {
            const payload = {
                tableNumber: tableId,
                ...finalData
            };

            const { data } = await axios.put('/api/order/finalize', payload);

            if (data.success) {
                toast.success("Bill Paid & Table Cleared!");
                await fetchActivetables();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Finalize Error:", error);
            toast.error(error.response?.data?.message || "Failed to finalize bill");
            return false;
        }
    };

    // 4. ADD NEW DISH (New Function)
   // 4. ADD NEW DISH (Bulletproof Version)
    const addNewDish = async (dishData) => {
        setLoading(true);
        try {
            // 1. Send data to Backend
            const { data } = await axios.post('/api/menu/adddish', dishData);

            // 2. Handle Success
            if (data.success) {
                toast.success(data.message);
                return { success: true, message: data.message };
            } 
            // 3. Handle "Soft" Failures (Backend said No)
            else {
                // FAILSAFE: If data.message is undefined, use a default text
                const failMessage = data.message || "Failed to add dish (No reason given)";
                toast.error(failMessage);
                return { success: false, message: failMessage };
            }

        } catch (error) {
            console.error("Full Error:", error);

            // 4. Handle "Hard" Failures (Crashes/Network)
            let errorMsg = "Server Error";

            if (error.response) {
                // Server responded with an error code (400, 401, 500)
                errorMsg = error.response.data.message || "Server Error (Check Network Tab)";
            } else {
                // Server is offline
                errorMsg = "Network Error: Is the backend running?";
            }

            toast.error(errorMsg);
            return { success: false, message: errorMsg };
        } finally {
            setLoading(false);
        }
    };



// 5. LOGIN FUNCTION
const login = async (userId, password, role) => {
    setLoading(true);
    try {
        const { data } = await axios.post('/api/admin/login', { userId, password, role });
        
        if (data.success) {
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            
            // Set the Authorization header for all future axios calls
            axios.defaults.headers.common['Authorization'] = data.token;
            
            toast.success(`Welcome back, ${data.name}!`);
            return { success: true, role: data.role };
        } else {
            toast.error(data.message);
            return { success: false };
        }
    } catch (error) {
        toast.error("Login failed. Check connection.");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

// 6. LOGOUT FUNCTION
const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    toast.success("Logged out successfully");
    window.location.href = "/"; // Redirect to login
};


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = storedToken;
        }
        fetchActivetables();
    }, []);

    const value = {
    token,
    setToken,
    activeTables,
    saveOrder,
    finalizeOrder,
    addNewDish,
    loading,
    login,   // Added
    logout ,
    navigate  // Added
};
    return (
        <HotalContext.Provider value={value}>
            {children}
        </HotalContext.Provider>
    );
}

export const useHotelcontext = () => {
    return useContext(HotalContext);
}