import { getUserById } from "@/actions/user.actions";
import ProfileForm from "@/components/forms/profile-form";
import { currentUser } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

import { MdManageAccounts } from "react-icons/md";

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) return null;

  const dbUser = await getUserById(user.id);

  return (
    <div className=" space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center my-">
          <MdManageAccounts className="mx-1 text-4xl" />
          Account
        </h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator className="w-full"/>
      <div className="mt-2">
        <ProfileForm user={dbUser} />
      </div>
    </div>
  );
}
