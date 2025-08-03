import { useEffect, useState } from "react"
import { Button } from "./Button";
import axios from "axios"
import { Navigate, useNavigate } from "react-router-dom";

export const Users = () => {

    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("")
    const Navigate = useNavigate()


    useEffect (()=>{
        axios.get(`${API_URL}/api/v1/user/bulk?filter=` + filter)
        .then(response => {
            setUsers(response.data.user)
        })
    },[filter])

    return <div className="p-4 pt-6 m-4 rounded shadow-xl bg-slate-200">
        <div className="font-bold ">
            Users :
        </div>
        <div className="pt-2">
            <input onChange={e => {
                const value = e.target.value;
                setFilter(value)
            }} placeholder="Search users..." type="text" className="w-full px-2 py-2 rounded"></input>
        </div>
        <div>
            {users.map(user => <User key={user._id} user={user} />)}
        </div>
    </div>
}




const User = ({user}) => {
    const Navigate = useNavigate()
    
    const handleSendMoney = (e) => {
        e.preventDefault();
        e.stopPropagation();
        Navigate(`/sendmoney?id=${user._id}&name=${user.firstName}`)}

    return <div className="flex justify-between mt-3">
        <div className="flex">
            <div className="flex justify-center w-12 h-12 mt-1 mr-2 rounded-full bg-slate-300">
                <div className="flex flex-col justify-center h-full text-lg font-bold">
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
            <Button label={"Send Money"}  to={"/sendmoney"} onClick={handleSendMoney}/>
        </div>
    </div>
}