import { Link } from "react-router-dom";

export function Button({label, onClick , to}){
    return <div className="pt-2 pb-">
        <Link to={to}><button onClick={onClick} className="w-full bg-gray-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 text-white hover:bg-gray-900 py-2.5 px-5 me-2 mb-2">{label}</button>
    </Link>
        </div>
}