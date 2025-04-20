import CustomButton from "@/components/ui/CustomButton";
import { Music2, Users, Vote, Crown, Github, Radio } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav>
        <div className="flex h-[72px] items-center justify-between border-b border-neutral-800 px-32 py-2">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
            Play-Fi
          </span>
          <div>
            <Link
              href={`api/auth/signin`}
              className="border-neutral-300 bg-blue-800 px-10 py-2 text-neutral-200 transition-colors duration-200 hover:bg-blue-900"
            >
              Signin
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative bottom-10 flex h-screen items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-10 text-6xl font-bold md:text-7xl">
            Host Your Music Room with
            <span className="text ml-4 bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-transparent">
              Play-Fi
            </span>
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            Create, share, and discover music together. Let your audience vote
            and shape the playlist in real-time.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={`https://github.com/iamasistiwari/play-fi`}
              target="_blank"
              className="group relative flex items-center justify-center border border-neutral-600 bg-transparent px-8 py-2 transition-opacity duration-200 hover:cursor-pointer hover:opacity-75"
            >
              <Github className="mr-1 size-5" />
              <span className="absolute right-2 top-2 h-2 w-2 bg-neutral-300 transition-all group-hover:rotate-45"></span>
              Open Source
            </Link>
            <Link

              href={`/signup`}
              target="_blank"
              className="group relative flex items-center justify-center bg-green-800 px-8 py-1 transition-opacity duration-200 hover:cursor-pointer hover:opacity-75"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Why Choose PlayFi?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-11 w-11 text-yellow-400" />}
              title="Fan Interaction"
              description="Engage your audience with real-time song voting. Let the crowd decide what plays next."
            />
            <FeatureCard
              icon={<Radio className="h-11 w-11 text-green-600" />}
              title="Live Streaming"
              description="Broadcast your sessions live and connect with listeners instantly, wherever they are."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="High Quality Audio"
              description="Experience studio-grade sound that captures every beat and nuance."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-neutral-800 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Create a Room"
              description="Set up your music room in seconds. Choose a name and customize your settings."
            />
            <StepCard
              number="2"
              title="Share & Invite"
              description="Invite friends or make it public. Share your room link with anyone."
            />
            <StepCard
              number="3"
              title="Start the Party"
              description="Add songs to the queue and let your audience vote on what plays next."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Start Your Music Room?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join thousands of music lovers who are already hosting their own
            rooms.
          </p>
          <div className="flex justify-center">
            <Link
              href={`/signup`}
              target="_blank"
              className="group max-w-60 relative flex items-center justify-center bg-green-800 px-10 py-3 hover:cursor-pointer transition-opacity duration-200 hover:cursor-pointer hover:opacity-75"
            >
              <Crown className="h-5 w-5 mr-2" />
              <span>Get Started</span>
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 transition-all duration-100 hover:shadow-2xl">
      <div className="mb-4 flex w-full justify-center">{icon}</div>
      <h3 className="mb-2 flex justify-center text-xl font-semibold">
        {title}
      </h3>
      <p className="flex justify-center text-center text-neutral-400">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center ">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
