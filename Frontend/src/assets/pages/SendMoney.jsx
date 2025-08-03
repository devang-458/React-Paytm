import { useEffect, useState } from "react";
import { Heading } from "../Components/Heading";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";


export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("User ID:", id);
    console.log("User Name:", name);
  }, []);

  const handleTransfer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/account/transfer`,
        {
          to: id,
          amount,
        },
        {
          headers: {
            Authorization: ` Bearer ${token}`,
          },
        }
      );

      console.log("Transfer successfully", response.data);

      setTimeout(() => {
        alert(amount + " Money Sent ");
        Navigate("/dashboard");
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-300">
      <div className="flex flex-col justify-center h-full">
        <div className="max-w-md p-4 bg-white rounded-lg shadow-lg w-96 h-min text-card-foreground sapce-y-8 ">
          <div className="flex flex-col space-y-1.5 p-6 text-center">
            <Heading label={"Send Money"} />
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                <span className="text-2xl text-white">
                  {name ? name[0].toUpperCase() : ""}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name || "unknown"}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-4">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter Amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  className="flex w-full h-10 px-3 py-2 text-sm border border-black rounded-md border-inherit"
                ></input>
                <button
                  onClick={handleTransfer}
                  className="justify-center w-full h-10 px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-md ring-offset-black "
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
