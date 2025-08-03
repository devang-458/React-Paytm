import { Navigate, useNavigate } from "react-router-dom";
import { BottonWarning } from "../Components/BottonWarning";
import { Button } from "../Components/Button";
import { Heading } from "../Components/Heading";
import { InputBox } from "../Components/InputBox";
import { SubHeading } from "../Components/SubHeading";
import axios from "axios";
import { useState } from "react";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  return (
    <div className="flex justify-center h-screen bg-slate-300">
      <div className="flex flex-col justify-center">
        <div className="p-2 px-5 py-5 text-center bg-white rounded-lg w-80 h-max ">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="titans@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              label={"Sign in"}
              onClick={async () => {
                const response = await axios.post(
                  `${API_URL}/api/v1/user/signin`,
                  {
                    username,
                    password,
                  }
                );
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                Navigate("/dashboard");
              }}
            />
          </div>
          <BottonWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
