import { getAllSiteSettings } from "@/lib/data-admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAllSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Settings</h1>
        <p className="mt-1 text-sm text-bone-muted">Edit site content without touching code — changes are live immediately.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
