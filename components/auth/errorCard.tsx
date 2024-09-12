import { Header } from "./header";
import { BackButton } from "./backButton";
import {
    Card,
  
    CardFooter,
    CardHeader,

}from "../ui/card";



export const ErrorCard = () => { 

    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label="Oops! something went wrong" />
            </CardHeader>
            <CardFooter>
                <BackButton label="Back to Login" href="/auth/login" />
            </CardFooter>


        </Card>

    )
 }