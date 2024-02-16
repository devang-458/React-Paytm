export const Balance = ({value}) => {
    const formettedBalance = value.toFixed(2)

    return <div className="flex shadow-lg rounded bg-slate-200 m-4 p-4">
        <div className="flex ">
        <div className="font-bold text-lg">
            Your Balance :
        </div>
        <div className="rounded font-semibold ml-1 text-lg"> 
        {formettedBalance} / Rs.
        </div>
        </div>
    </div>
}