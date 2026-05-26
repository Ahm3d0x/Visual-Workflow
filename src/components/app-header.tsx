import { getSupabaseServerClient } from "@/lib/supabase-server";
import { type Locale } from "@/lib/i18n";
import { AppHeaderClient } from "./app-header-client";

export async function AppHeader({ locale }: { locale: Locale }) {
  let user = null;
  
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData?.user ?? null;
  } catch {
    // Keep user null if server client fails or is not yet configured in local environment
  }

  return <AppHeaderClient locale={locale} user={user} />;
}
