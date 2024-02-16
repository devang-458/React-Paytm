export function InputBox({label, placeholder, onChange}){
    return <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
        <input onChange={onChange} placeholder={placeholder} className="p-2 text-lg w-full border-slate-200 rounded border px-2"/>
    </div>
}

