import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function UsersData() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}

export default function Users() {
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UsersData />
    </Suspense>
  );
}