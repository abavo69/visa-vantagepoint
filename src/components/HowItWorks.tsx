import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, FileCheck, Send } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: MessageCircle,
      title: "Free Consultation",
      description: "Start with a free consultation where our experts assess your needs, explain requirements, and create a personalized roadmap for your visa application.",
      details: [
        "Eligibility assessment",
        "Document checklist",
        "Timeline planning",
        "Fee structure explanation"
      ]
    },
    {
      number: "02", 
      icon: FileCheck,
      title: "Document Preparation",
      description: "Our team guides you through document collection and preparation, ensuring everything meets embassy standards and requirements.",
      details: [
        "Document verification",
        "Form completion assistance",
        "Translation services",
        "Quality assurance check"
      ]
    },
    {
      number: "03",
      icon: Send,
      title: "Application Submission",
      description: "We handle the submission process, schedule appointments, and provide ongoing support until your visa is approved.",
      details: [
        "Embassy submission",
        "Appointment scheduling",
        "Application tracking",
        "Regular status updates"
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We Make Visa Applications Simple
          </h2>
          <p className="text-xl text-muted-foreground">
            Our streamlined 3-step process ensures your visa application 
            is handled professionally from start to finish.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector Line - Hidden on mobile, visible on desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary/30 z-0 transform -translate-x-8"></div>
                  )}
                  
                  <Card className="relative z-10 hover:shadow-professional transition-all duration-300 border-0 shadow-card">
                    <CardHeader className="text-center pb-4">
                      {/* Step Number */}
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-hero">
                        <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                      
                      <ul className="text-left space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;