import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"
import { redirect } from "next/navigation";
import LogoutButton from "../components/auth/LogoutButton";
import AddProductButton from "../components/AddProductButton";
import ListUserProducts from "../components/ListUserProducts";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen text-white flex flex-col bg-[#1f1f1f]">
            <div className="flex items-center space-x-2 justify-between p-4 border-b-2 border-[#4d4d4d]">
                <h1>Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <p>Welcome {session?.user?.name || session?.user?.email}</p>
                    <img 
                        src={session?.user?.image ?? "images/avatar-placeholder.png"} 
                        alt="profile" 
                        className="w-12 h-12 rounded-full"
                    />
                    <LogoutButton/>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <AddProductButton />
                <ListUserProducts />
                
            </div>
        </div>
    );
}