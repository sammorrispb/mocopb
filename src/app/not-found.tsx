import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24 px-4 text-center">
      <h1 className="font-heading font-bold text-4xl text-text-primary mb-4">
        Page Not Found
      </h1>
      <p className="text-text-muted mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="btn-primary inline-block px-6 py-3 rounded-xl font-semibold"
      >
        Back to Home
      </Link>
    </section>
  );
}
