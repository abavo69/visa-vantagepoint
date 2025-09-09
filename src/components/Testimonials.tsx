import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah lucenti",
      role: "Student",
      country: "Mexico to Canada",
      rating: 4.5,
      content: "GlobalVisa Pro made my student visa application seamless. Their team was professional, responsive, and guided me through every step. I got my visa approved in record time!",
      avatar: "SJ"
    },
    {
      name: "Mohamed Al-Hassan",
      role: "Business Professional",
      country: "UAE to Germany",
      rating: 5,
      content: "Excellent service for my work visa application. The team's expertise saved me months of research and potential mistakes. Highly recommended for business visas!",
      avatar: "MA"
    },
    {
      name: "Maria Rodriguez",
      role: "Tourist",
      country: "Peru to USA",
      rating: 4.6,
      content: "Thanks to GlobalVisa Pro, our family vacation to USA became reality. They handled all the tourist visa paperwork efficiently and kept us informed throughout.",
      avatar: "MR"
    },
    {
      name: "James Wilson",
      role: "Spouse Visa Applicant",
      country: "UK to USA",
      rating: 5,
      content: "The family visa process seemed overwhelming until I found GlobalVisa Pro. Their compassionate team understood our situation and made reuniting with my family possible.",
      avatar: "JW"
    },
    {
      name: "Chen Wei",
      role: "Graduate Student",
      country: "China to Netherlands",
      rating: 5,
      content: "Professional service from start to finish. They helped me secure my student visa for graduate studies and even provided tips for arriving in the Netherlands.",
      avatar: "CW"
    },
    {
      name: "Priya Patel",
      role: "IT Professional",
      country: "India to Canada",
      rating: 5,
      content: "Outstanding support for my Express Entry application. The team's knowledge of immigration law and attention to detail made all the difference in my success.",
      avatar: "PP"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories From Our Clients
          </h2>
          <p className="text-xl text-muted-foreground">
            Read what our clients say about their visa journey with us. 
            Over 1,000,000 successful applications and counting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-professional transition-all duration-300 border-0 shadow-card">
              <CardContent className="p-6">
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Testimonial Content */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                {/* Author Info */}
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.country}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Successful Applications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">150+</div>
            <div className="text-sm text-muted-foreground">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;