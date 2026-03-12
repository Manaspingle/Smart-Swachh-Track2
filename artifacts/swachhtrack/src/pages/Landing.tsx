import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Recycle, MapPin, Award, Trash2, Camera, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Landing() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Eco-friendly abstract background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
              <Leaf className="w-4 h-4" />
              <span>Smart City Initiative</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground tracking-tight leading-tight">
              Segregate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Smart.</span><br/>
              Recycle <span className="text-primary">Right.</span><br/>
              Build a Cleaner India.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of citizens earning rewards for proper waste segregation. Our AI makes it easy, and your city makes it rewarding.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-xl">
                  Start Recycling
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2 hover:bg-accent/50 rounded-xl hover-elevate">
                  Learn Segregation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The Problem is Real</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Improper waste segregation leads to landfill overflow, environmental degradation, and inefficient recycling across urban India.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { stat: "62M", label: "Tonnes/Year", desc: "Waste generated in India annually", icon: Trash2, color: "text-red-500", bg: "bg-red-50" },
              { stat: "22%", label: "Recycling Rate", desc: "Only a fraction gets properly recycled", icon: Recycle, color: "text-orange-500", bg: "bg-orange-50" },
              { stat: "3000+", label: "Dump Sites", desc: "Overflowing landfills across cities", icon: MapPin, color: "text-amber-500", bg: "bg-amber-50" },
              { stat: "26%", label: "GDP Loss", desc: "Economic impact due to pollution", icon: BarChart3, color: "text-rose-500", bg: "bg-rose-50" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.bg} ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-display font-bold text-foreground mb-1">{item.stat}</h3>
                <div className="font-semibold text-lg mb-2">{item.label}</div>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-b from-accent/30 to-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How SwachhTrack Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">A simple 3-step process to transform your daily waste into green rewards.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute top-8 left-1/2 w-full h-[2px] bg-primary/20 hidden md:block" />
              <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 text-center relative z-10 hover-elevate transition-all duration-300 hover:border-primary group-hover:shadow-xl shadow-primary/5">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-primary/30">1</div>
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Image</h3>
                <p className="text-muted-foreground">Snap a photo of your waste. Our AI instantly classifies it and tells you the right bin.</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute top-8 left-1/2 w-full h-[2px] bg-primary/20 hidden md:block" />
              <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 text-center relative z-10 hover-elevate transition-all duration-300 hover:border-primary group-hover:shadow-xl shadow-primary/5">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-primary/30">2</div>
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Recycle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Verify Disposal</h3>
                <p className="text-muted-foreground">Take a quick verification photo when dropping it in the correct municipality bin.</p>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 text-center relative z-10 hover-elevate transition-all duration-300 hover:border-primary group-hover:shadow-xl shadow-primary/5">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-primary/30">3</div>
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Earn Rewards</h3>
                <p className="text-muted-foreground">Collect Green Points, climb the leaderboard, and redeem for real-world civic benefits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to make an impact?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">Join the movement. Start segregating smart today and help your city breathe better.</p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
