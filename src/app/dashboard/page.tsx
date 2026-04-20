import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"
import { redirect } from "next/navigation";
import LogoutButton from "../components/auth/LogoutButton";
import AddProductButton from "../components/AddProductButton";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col space-y-2">
                <h1>Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <p>Welcome {session?.user?.name || session?.user?.email}</p>
                    <img 
                        src={session?.user?.image ?? "images/avatar-placeholder.png"} 
                        alt="profile" 
                        className="w-12 h-12 rounded-full"
                    />
                </div>
                <AddProductButton />
                <LogoutButton/>
            </div>
        </div>
    );
}