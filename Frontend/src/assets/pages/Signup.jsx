import { useState } from "react";
import { BottonWarning } from "../Components/BottonWarning";
import { Button } from "../Components/Button";
import { Heading } from "../Components/Heading";
import { InputBox } from "../Components/InputBox";
import { SubHeading } from "../Components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInput from "../Components/Password";


export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  return (
    <div className="flex justify-center h-screen bg-slate-300 ">
      <div className="flex flex-col justify-center">
        <div className="p-2 px-5 py-5 text-center bg-white rounded-lg w-96 h-max ">
          <Heading label={"Sign up"} />
          <SubHeading label={" write your information here "} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            label={"FirstName:-"}
            placeholder={"Eren"}
          />

          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            label={"LastName:-"}
            placeholder={"Yeager"}
          />

          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            label={"Email:-"}
            placeholder={"titans@gmail.com"}
          />

          <PasswordInput setPassword={setPassword} />

          <Button
            onClick={async () => {
              const response = await axios.post(
                `${API_URL}/api/v1/user/signup`,
                {
                  username,
                  firstName,
                  lastName,
                  password,
                }
              );
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("userId", response.data.userId);
              Navigate("/dashboard");
            }}
            label={"Signup"}
          />
          <BottonWarning
            label={"Already have an account"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
