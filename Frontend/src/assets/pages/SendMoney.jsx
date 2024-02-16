import { Heading } from "../Components/Heading"

export const SendMoney = () => {
    return <div className="flex bg-gray-300 h-screen justify-center">
        <div className="h-full flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-lg w-96 h-min text-card-foreground max-w-md p-4 sapce-y-8 ">
                <div className="flex flex-col space-y-1.5 p-6 text-center">
                    <Heading label={"Send Money"}/>
                </div>
                <div className="p-6">
                    <div>
                        <div>
                            <span>asdg</span>    
                        </div>
                        <h3>dfh</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
}