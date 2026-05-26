import type { Locale } from "@/lib/i18n";

export default async function ProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-semibold">Profile</h1>
      <form className="panel grid gap-4 p-5">
        <input className="input" placeholder="Full name" />
        <select className="input" defaultValue="system">
          <option value="system">System theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <select className="input" defaultValue="ar">
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
        <button className="button primary" type="button">Save preferences</button>
      </form>
    </div>
  );
}
