import Sidebar from "@/components/Sidebar";
import { MainNav } from "../dashboard/main-nav";
import { getAllNotificationsByUserId } from "@/actions/notification.actions";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/actions/user.actions";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const wallet = await getUserById(sessionUser?.id).then((user) => user?.wallet);

  const notifications = await getAllNotificationsByUserId(sessionUser.id);
  
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <MainNav  notifications={notifications} wallet={wallet ? wallet : 0}/>
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
