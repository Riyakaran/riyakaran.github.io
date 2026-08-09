import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-neutral-900">Page not found.</h1>
      <p className="mt-4 max-w-prose text-base text-neutral-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
      >
        Back to home
        <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      </Link>
    </main>
  );
}
