import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Shield, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/auth');
  };

  const handleBookConsultation = () => {
    navigate('/consultation');
  };

  return (
    <section className="relative bg-gradient-hero text-primary-foreground py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 to-transparent"></div>
      </div>
      
      <div className="container relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs sm:text-sm">
            🌍 Trusted by 1,000,000+ Clients Worldwide
          </Badge>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-2">
            Your Trusted Partner for
            <br />
            <span className="text-accent">Global Visa Solutions</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto px-4">
            Expert guidance for Tourist, Student, Work, Business & Family Visas. 
            Fast processing, high success rates, and personalized support every step of the way.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-hero min-h-[48px] touch-manipulation"
              onClick={handleApplyNow}
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-primary-foreground/30 text-primary hover:bg-primary-foreground/10 min-h-[48px] touch-manipulation"
              onClick={handleBookConsultation}
            >
              Book Free Consultation
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-12 max-w-2xl mx-auto px-2">
            <div className="flex flex-col items-center space-y-2 p-2">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-center">98% Success Rate</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-2">
              <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-center">Fast Processing</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-2">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-center">Secure & Confidential</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-2">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-center">Expert Team</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;