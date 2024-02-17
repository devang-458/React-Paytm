import { useState } from "react";
import { BottonWarning } from "../Components/BottonWarning";
import { Button } from "../Components/Button";
import { Heading } from "../Components/Heading";
import { InputBox } from "../Components/InputBox";
import { SubHeading } from "../Components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import PasswordInput from "../Components/Password";

export const Signup = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [username,setUsername] = useState("")
    const Navigate = useNavigate();

    return <div className="flex justify-center  bg-slate-300 h-screen ">
        <div className="flex flex-col justify-center">
            <div className="bg-white rounded-lg  text-center w-96 p-2 h-max px-5 py-5 ">
            <Heading label={"Sign up"}/>
            <SubHeading label={" write your information here "}/>
            <InputBox onChange={e=>{
                setFirstName(e.target.value)
            }}  label={"FirstName:-"} placeholder={"Eren"}/>
            
            <InputBox onChange={e=>{
                setLastName(e.target.value)
            }}   label={"LastName:-"} placeholder={"Yeager"}/>
            
            <InputBox onChange={e=>{
                setUsername(e.target.value)
            }}   label={"Email:-"} placeholder={"titans@gmail.com"}/>
            
            <PasswordInput />
            
            <Button onClick={async () => {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                username,
                firstName,
                lastName,
                password
            });
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("userId",response.data.userId)
            Navigate("/dashboard")

          }} label={"Signup"}/>
            <BottonWarning label={"Already have an account"} buttonText={"Sign in"} to={"/signin"}/>
            
            </div>
        </div>
    </div>
}