import { redirect } from 'next/navigation';
import { DOC_LANGUAGES } from '@/data/devDocs';

export const dynamic = 'force-static';

export default function ResourcesDocsIndex() {
  const fallbackLanguage = DOC_LANGUAGES[0];
  const fallbackTopic = fallbackLanguage.topics[0];

  redirect(`/resources/docs/${fallbackLanguage.id}/${fallbackTopic.slug}`);
}

