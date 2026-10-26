import { useEffect } from 'react';
import { usePortfolio } from '../lib/usePortfolio';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const { data, error, loading } = usePortfolio();

  useEffect(() => {
    if (data?.settings?.siteTitle) document.title = data.settings.siteTitle;
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="text-xl font-bold text-slate-900">Could not load the portfolio</h1>
        <p className="text-slate-600">Make sure the backend API is running, then refresh this page.</p>
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  const { profile, about, skills, experience, education, certifications, projects, settings } = data;

  return (
    <>
      <Navbar profile={profile} hasProjects={projects?.length > 0} />
      <main>
        <Hero profile={profile} />
        <About about={about} />
        <Skills skills={skills} />
        <Experience experience={experience} />
        <Education education={education} certifications={certifications} />
        {projects?.length > 0 && <Projects projects={projects} />}
        <Contact profile={profile} showForm={settings?.showMessagesForm !== false} />
      </main>
      <Footer profile={profile} settings={settings} />
    </>
  );
}
