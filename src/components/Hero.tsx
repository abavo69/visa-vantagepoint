import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Shield, Clock, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 to-transparent"></div>
      </div>
      
      <div className="container relative px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            🌍 Trusted by 50,000+ Clients Worldwide
          </Badge>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your Trusted Partner for
            <br />
            <span className="text-accent">Global Visa Solutions</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Expert guidance for Tourist, Student, Work, Business & Family Visas. 
            Fast processing, high success rates, and personalized support every step of the way.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-hero">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Book Free Consultation
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium">98% Success Rate</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Clock className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium">Fast Processing</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium">Secure & Confidential</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium">Expert Team</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;