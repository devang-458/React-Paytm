import { useState } from "react"

export const Appbar = () => {
    const [users, setUsers] = useState([
        {firstName: "Devang"}
    ]);



    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <div className=" flex flex-col justify-center h-full mr-4">
                Hello
            </div>
            <div className="bg-slate-200 rounded-full h-12 w-12 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {users.map((user,index) => <User key={index} user={user}/>)}
                </div>
            </div>
        </div>
    </div>
}

function User({user}){
    return <div className="font-bold">
        {user.firstName ? user.firstName[0]: ""}
    </div>
}