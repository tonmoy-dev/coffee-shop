"use server";

import { signIn, signOut } from "@/utils/auth";

export async function doSocialLogin(formData: any) {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/" });
}

export async function doLogout() {
  await signOut();
}
