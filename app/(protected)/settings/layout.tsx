import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/forms/side-navbar"
import { CiSettings } from "react-icons/ci";



const sidebarNavItems = [
  {
    title: "Account",
    href: "/examples/forms/account",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="min-w-full min-h-full sm:mt-[-50px] space-y-3 p-10 pb-16 md:block ">
        <div className="space-y-0.5">
          <h2 className="text-2xl flex items-center  font-bold tracking-tight"> <CiSettings className="mx-1" />
            Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings.
          </p>
        </div>
        <Separator className="my-3 opacity-1" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
