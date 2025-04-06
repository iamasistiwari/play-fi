"use client";
import CustomButton from "@/components/ui/CustomButton";
import {
  Music2,
  Users,
  Vote,
  PlayCircle,
  Headphones,
  Crown,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex h-screen items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
            Host Your Music Room with PlayFi
          </h1>
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Create, share, and discover music together. Let your audience vote
            and shape the playlist in real-time.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <CustomButton isLoading={false} Icon={PlayCircle}>
              Create Room
              <PlayCircle className="ml-2 h-5 w-5" />
            </CustomButton >
            <CustomButton isLoading={false} Icon={PlayCircle}>
              Join Room
              <Headphones className="ml-2 h-5 w-5" />
            </CustomButton >
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
              icon={<Music2 className="h-8 w-8" />}
              title="Host Music Rooms"
              description="Create your own music room and share it with friends or the world. Full control over your musical experience."
            />
            <FeatureCard
              icon={<Vote className="h-8 w-8" />}
              title="Democratic Playlist"
              description="Let your audience vote on songs in the queue. The most popular tracks rise to the top."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Community Driven"
              description="Build a community around your music taste. Connect with others who share your vibe."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-accent/30 px-4 py-20">
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
          <CustomButton isLoading={false} Icon={null}>
            Get Started Now
            <Crown className="ml-2 h-5 w-5" />
          </CustomButton>
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
    <div className="p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
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
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
