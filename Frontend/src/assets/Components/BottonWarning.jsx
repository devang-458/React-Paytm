import {Link} from "react-router-dom"

export function BottonWarning({label, buttonText, to}){
    return <div>
        <div>
        {label}
        </div>
        <Link className=" border rounded-lg bg-slate-300 py-2 text-sm flex justify-center " to={to} >{buttonText}</Link>
    </div>
}