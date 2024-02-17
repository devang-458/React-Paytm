import React, { useState } from "react";

const PasswordInput = () => {
    const [password , setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    return <div>
        <div className="flex justify-between pt-1 py-1">
        <label htmlFor="password" className="text-sm font-medium text-left py-2">Password:-</label>
        <button  className="border rounded p-1 bg-slate-500 text-white " onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
        </button>
        </div>
        <input 
        type={showPassword ? 'text' : 'password'}
        className="p-2 text-lg w-full border-slate-200 rounded border px-2"
        id="password"
        placeholder="***********"
        name="password"
        onChange={handlePasswordChange}
        ></input>
        
    </div>
}


export default PasswordInput;