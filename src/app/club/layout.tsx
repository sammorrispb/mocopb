import Link from "next/link";
import { getClubUser } from "@/lib/club/auth";

export const metadata = {
  title: "Club — mocopb",
  description: "Member-only pickleball groups, events, and attendance.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ClubLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getClubUser();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/club" className="font-heading font-bold text-lg text-text-primary">
            MoCo PB Club
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link href="/club" className="text-text-muted hover:text-text-primary">Dashboard</Link>
                <Link href="/club/profile" className="text-text-muted hover:text-text-primary">Profile</Link>
                <form action="/api/club/sign-out" method="post">
                  <button type="submit" className="text-text-muted hover:text-text-primary">Sign out</button>
                </form>
              </>
            ) : (
              <Link href="/club/sign-in" className="text-text-muted hover:text-text-primary">Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
