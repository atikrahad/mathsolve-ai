import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import clsx from 'clsx';
import Header from '@/components/layout/Header';
import { DOC_LANGUAGES, DOC_LANGUAGE_MAP, DocSection } from '@/data/devDocs';

interface DocsPageParams {
  language: string;
  topic: string;
}

export const dynamic = 'force-static';

export function generateStaticParams() {
  return DOC_LANGUAGES.flatMap((language) =>
    language.topics.map((topic) => ({
      language: language.id,
      topic: topic.slug,
    }))
  );
}

export function generateMetadata({ params }: { params: DocsPageParams }): Metadata {
  const language = DOC_LANGUAGE_MAP[params.language];
  const topic = language?.topics.find((t) => t.slug === params.topic);
  if (!language || !topic) {
    return {};
  }

  return {
    title: `${topic.title} | ${language.name} Docs`,
    description: topic.description,
  };
}

function renderSection(section: DocSection) {
  return (
    <div key={section.heading} className="space-y-4 rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
      <h3 className="text-xl font-semibold text-white">{section.heading}</h3>
      {section.body.map((paragraph, index) => (
        <p key={index} className="text-slate-300 leading-relaxed">
          {paragraph}
        </p>
      ))}
      {section.code && (
        <pre className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm overflow-x-auto text-emerald-200">
          <code>{section.code.content}</code>
        </pre>
      )}
      {section.tips && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/40 p-4">
          <h4 className="text-sm font-semibold text-emerald-300 mb-2">Quick Tips</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-100">
            {section.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function DocsTopicPage({ params }: { params: DocsPageParams }) {
  const language = DOC_LANGUAGE_MAP[params.language];
  const topic = language?.topics.find((t) => t.slug === params.topic);

  if (!language || !topic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-slate-400">Languages</p>
            </div>
            <div className="space-y-6">
              {DOC_LANGUAGES.map((lang) => (
                <div key={lang.id}>
                  <p className="text-sm font-semibold text-slate-300 mb-2">{lang.name}</p>
                  <div className="space-y-1">
                    {lang.topics.map((topicNav) => (
                      <Link
                        key={topicNav.slug}
                        href={`/resources/docs/${lang.id}/${topicNav.slug}`}
                        className={clsx(
                          'block rounded-lg px-3 py-2 text-sm transition-colors border border-transparent',
                          lang.id === language.id && topicNav.slug === topic.slug
                            ? 'bg-emerald-500/15 border-emerald-400/40 text-white'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                        )}
                      >
                        {topicNav.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="flex-1 space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest">
                <Link href="/resources" className="hover:text-white">
                  Resources
                </Link>
                <span>›</span>
                <Link href={`/resources/docs/${language.id}/${language.topics[0].slug}`} className="hover:text-white">
                  {language.name}
                </Link>
                <span>›</span>
                <span className="text-white">{topic.title}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">{topic.title}</h1>
              <p className="text-slate-400 mb-2">{topic.description}</p>
              <p className="text-sm text-slate-500">{topic.duration}</p>
            </div>

            <div className="space-y-6">{topic.sections.map((section) => renderSection(section))}</div>

            {topic.resources && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Continue Learning</h3>
                <ul className="space-y-2">
                  {topic.resources.map((resource) => (
                    <li key={resource.url}>
                      <Link
                        href={resource.url}
                        className="text-emerald-300 hover:text-emerald-100 text-sm flex items-center gap-2"
                        target={resource.url.startsWith('http') ? '_blank' : undefined}
                        rel={resource.url.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        <span>↗</span>
                        {resource.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
