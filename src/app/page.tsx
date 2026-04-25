// Phase 1 root: send everyone to /login. Middleware then routes signed-in
// users to /admin or /sales based on role.
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
