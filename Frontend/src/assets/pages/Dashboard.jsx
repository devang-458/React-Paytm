import { useState, useEffect } from "react"
import { Appbar } from "../Components/Appbar"
import { Balance } from "../Components/Balance"
import { Users } from "../Components/Users"
import axios from "axios"

export const DashBoard = () => {

    const [balance, setBalance] = useState(null)
    const userId = localStorage.getItem("userId");
    const [users, setUsers] = useState([])
    const [filter, setFilter] =useState("")

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
        };

        const fetchUser = async () => {
            try{
                const response = await axios.get("http://localhost:3000/api/v1/user/bulk");
                const userData = response.data.user
                const filteredUser = userData.filter(user => user.id !== userId)
                setUsers(filteredUser)

            }catch(err){
                console.log("Error fetching users:" , err)
            }
        }

        if(userId){
            fetchBalance();
            fetchUser();
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