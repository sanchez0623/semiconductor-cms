import { ContactFormsTable } from "./ContactFormsTable";
import { getTranslations } from "next-intl/server";

export default async function ContactFormsPage() {
  const t = await getTranslations('ContactForms');
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-sm text-slate-500 mt-1">
          {t('description')}
        </p>
      </div>
      
      <ContactFormsTable />
    </div>
  );
}
