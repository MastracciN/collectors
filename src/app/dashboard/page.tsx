import LogoutButton from "../components/auth/LogoutButton";

export default async function Dashboard() {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col space-y-2">
                <h1>Dashboard</h1>
                {/* <p>Welcome {session?.user?.name}</p> */}
                <p>Welcome</p>
                <LogoutButton/>
            </div>
        </div>
    );
}