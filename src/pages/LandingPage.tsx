import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Music, Headphones, Star } from "lucide-react";
import heroImage from "@/assets/hero-music.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold neon-text">SoundStream</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="gradient-primary text-primary-foreground smooth-hover">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Music streaming hero" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Your Music,{" "}
              <span className="neon-text">Everywhere</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Stream millions of songs, create custom playlists, and discover new music with our premium streaming service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground smooth-hover glow-effect">
                  <Play className="mr-2 h-5 w-5" />
                  Start Listening Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-border bg-card/50 backdrop-blur-sm smooth-hover">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SoundStream?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 gradient-card rounded-xl smooth-hover">
              <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Quality Audio</h3>
              <p className="text-muted-foreground">Experience crystal-clear sound with lossless audio streaming.</p>
            </div>
            <div className="text-center p-6 gradient-card rounded-xl smooth-hover">
              <Music className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Millions of Songs</h3>
              <p className="text-muted-foreground">Access a vast library of music across all genres and decades.</p>
            </div>
            <div className="text-center p-6 gradient-card rounded-xl smooth-hover">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-muted-foreground">Get recommendations tailored to your unique music taste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of music lovers and discover your next favorite song today.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-primary text-primary-foreground smooth-hover glow-effect animate-pulse-glow">
              <Play className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">SoundStream</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SoundStream. Your premium music streaming experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;