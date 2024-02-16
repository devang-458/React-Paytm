import { useState, useEffect } from "react"
import { Appbar } from "../Components/Appbar"
import { Balance } from "../Components/Balance"
import { Users } from "../Components/Users"
import axios from "axios"

export const DashBoard = () => {

    const [balance, setBalance] = useState(null)
    const userId = localStorage.getItem("userId");

    useEffect( () => {
        const fetchBalance = async () => {
            
            try{
                const token = localStorage.getItem("token")
                const response = await axios.get("http://localhost:3000/api/v1/account/balance",{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                const balanceValue = response.data.balance
                setBalance(balanceValue)
            }catch(err){
                console.log("Error fetching balance:", err )
            }
        }
        if(userId){
            fetchBalance()
        }
    },[userId])


    return <div>
        <Appbar />
        <div className="m-8">
            {balance !== null ? <Balance value={balance}/> : <p> Loading Balance....</p>}
            <Users />
        </div>
        
    </div>
}