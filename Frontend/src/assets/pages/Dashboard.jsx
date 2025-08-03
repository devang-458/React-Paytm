import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Send, History, User, LogOut, Loader2 } from "lucide-react";
import api from "../../utils/api";
import useAuthStore from "../../hooks/useAuth";

export const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchBalance();
    fetchUsers();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        fetchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchBalance = async () => {
    try {
      const response = await api.get("/account/balance");
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      toast.error("Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (filter = "") => {
    setSearchLoading(true);
    try {
      const response = await api.get(`/user/bulk?filter=${filter}`);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  const handleSendMoney = (userId, userName) => {
    navigate(`/send-money?id=${userId}&name=${userName}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                PayTM Clone
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/transactions")}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <History className="w-5 h-5" />
                <span className="hidden sm:inline">Transactions</span>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.username}</p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-600 rounded-full">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 text-gray-500 transition-colors hover:text-gray-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Balance Card */}
        <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Available Balance
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                ₹{balance !== null ? balance.toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="p-6 bg-white shadow-md rounded-xl">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Send Money
            </h2>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email..."
                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                {searchTerm ? "No users found" : "No users available"}
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 font-semibold text-gray-700 bg-gray-300 rounded-full">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleSendMoney(
                        user._id,
                        `${user.firstName} ${user.lastName}`
                      )
                    }
                    className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Money</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
