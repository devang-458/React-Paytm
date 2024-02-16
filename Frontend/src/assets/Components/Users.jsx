import { useEffect, useState } from "react"
import { Button } from "./Button";
import axios from "axios"

export const Users = () => {

    const [users, setUsers] = useState([]);

    useEffect(()=>{
        const fetchUsers = async () => {
            try{
                const token = localStorage.getItem("token")
                const response = await axios.get("http://localhost:3000/api/v1/user",{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log("Server response:", response)

                if(Array.isArray(response.data.users)){
                    setUsers(response.data.users)
                }else{
                    console.log("Invaild data")
                }

                
            }catch(err){
                console.log("Error fetching users", err)
            }
        };
        fetchUsers()
    },[])

    return <div className="pt-6 bg-slate-200 rounded m-4 p-4 shadow-xl">
        <div className="  font-bold ">
            Users :
        </div>
        <div className="pt-2">
            <input placeholder="Search users..." type="text" className="w-full rounded py-2 px-2"></input>
        </div>
        <div>
            {users.map(user => <User key={user._id} user={user}/> )}
        </div>
    </div>
}

function User({user}){
    return <div className="flex justify-between mt-3">
        <div className="flex">
            <div className="bg-slate-300 rounded-full h-12 w-12 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center text-lg h-full font-bold">
                    {user.firstName ? user.firstName[0] : ''}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
        <div>
            <Button label={"Send Money"}/>
        </div>
    </div>
}