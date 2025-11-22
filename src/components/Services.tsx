import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  GraduationCap, 
  Briefcase, 
  Building, 
  Heart, 
  FileText,
  ArrowRight 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Plane,
      title: "Tourist Visa",
      description: "Explore the world with our expert tourist visa services. We handle all documentation and embassy procedures for your vacation or leisure travel.",
      features: ["Multiple entry options", "Fast processing", "Embassy liaison"],
    },
    {
      icon: GraduationCap,
      title: "Student Visa",
      description: "Pursue your education dreams abroad. We assist with student visas for universities and educational institutions worldwide.",
      features: ["University liaison", "Document verification", "Interview prep"],
    },
    {
      icon: Briefcase,
      title: "Work Visa",
      description: "Advance your career globally with our work visa expertise. We ensure all employment documentation meets requirements.",
      features: ["Employment verification", "Skill assessment", "Legal compliance"],
    },
    {
      icon: Building,
      title: "Business Visa",
      description: "Expand your business internationally. Our business visa services facilitate meetings, conferences, and commercial activities.",
      features: ["Business documentation", "Invitation letters", "Commercial support"],
    },
    {
      icon: Heart,
      title: "Family Visa",
      description: "Reunite with loved ones through our family visa services. We help with spouse, dependent, and family reunion visas.",
      features: ["Relationship verification", "Sponsorship guidance", "Family documentation"],
    },
    {
      icon: FileText,
      title: "Passport Services",
      description: "New passport, renewal, or replacement services. We handle all passport-related documentation and procedures.",
      features: ["Passport renewal", "Emergency travel docs", "Document authentication"],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-subtle">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Comprehensive Visa & Passport Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            From tourist visas to permanent residency, we provide expert guidance 
            for all your international travel and migration needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="group hover:shadow-professional transition-all duration-300 border-0 shadow-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;