'use client';

import Link from 'next/link';
import { BookOpen, Sparkles, BookMarked, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { DOC_LANGUAGES } from '@/data/devDocs';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="w-full max-w-[1200px] mx-auto px-6 py-12 space-y-10">
        <header className="text-center space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs tracking-widest text-emerald-200 uppercase">
            <Sparkles className="w-4 h-4" />
            Beginner → Advanced Tracks
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Learning Resources Library
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto">
            A curated, static documentation hub for JavaScript and Python learners. Explore guided
            tracks, annotated snippets, and next-step checklists without leaving MathSolve.
          </p>
        </header>

        <section className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between shadow-2xl">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-widest text-blue-200 font-semibold flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              Quick Jump
            </p>
            <h2 className="text-3xl font-bold text-white">Choose your language starter kit</h2>
            <p className="text-slate-200">
              Each track is designed for first-time coders; progress through friendly lessons and
              graduate into production-ready techniques.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/docs/javascript/getting-started">
              <Button className="bg-emerald-400 text-slate-900 hover:bg-emerald-300">
                JavaScript Track
              </Button>
            </Link>
            <Link href="/resources/docs/python/python-basics">
              <Button variant="outline" className="border-blue-200 text-blue-200 hover:bg-blue-500/20">
                Python Track
              </Button>
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          {DOC_LANGUAGES.map((language) => (
            <Card key={language.id} className="border border-slate-800 bg-slate-900/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">{language.name}</CardTitle>
                  <p className="text-sm text-emerald-300 font-semibold">{language.level}</p>
                  <p className="text-slate-400 mt-2 max-w-3xl">{language.summary}</p>
                </div>
                <Link href={`/resources/docs/${language.id}/${language.topics[0].slug}`}>
                  <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                    View Track
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {language.topics.map((topic) => (
                  <div
                    key={topic.slug}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                      <p className="text-slate-400 text-sm max-w-2xl">{topic.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{topic.duration}</p>
                    </div>
                    <Link href={`/resources/docs/${language.id}/${topic.slug}`}>
                      <Button size="sm" className="bg-emerald-400 text-slate-900 hover:bg-emerald-300">
                        Read Lesson
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        <footer className="text-center text-slate-500 text-sm">
          Built with static site generation – content loads instantly, no backend calls required.
        </footer>
      </div>
    </div>
  );
}
