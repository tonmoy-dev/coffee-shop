import Sales from "@/components/Sales";
import { serverURL } from "@/utils/serverURL";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import axios from "axios";

async function checkEmail(email: any) {
  const res = await axios.get(`${serverURL}/api/check-email/${email}`);
  return res.data.exists;
}

export default async function SalesPage() {
  const session = await auth();
  const emailIsExisted = await checkEmail(session?.user?.email)

  if (!emailIsExisted) {
    redirect('/account-settings');
  }
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <Sales />
        </div>
      </main>
    </>
  );
}
