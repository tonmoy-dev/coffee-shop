import Profile from "@/components/Profile";
import { serverURL } from "@/utils/serverURL";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import axios from "axios";

async function checkEmail(email: any) {
  const res = await axios.get(`${serverURL}/api/check-email/${email}`);
  return res.data.exists;
}


export default async function ProfilePage() {
  const session = await auth();
  const emailIsExisted = await checkEmail(session?.user?.email)

  if (!emailIsExisted) {
    redirect('/account-settings');
  }
  return (
    <>
      <Profile />
    </>
  );
}
