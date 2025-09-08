import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Award, 
  Users, 
  Globe,
  CheckCircle,
  Target,
  Heart
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero text-primary-foreground py-20">
          <div className="container px-4 text-center">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-6">
              Established 2015
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About GlobalVisa Pro
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              We are a global visa consultancy dedicated to making international travel 
              and immigration accessible to everyone through expert guidance and personalized support.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To simplify the visa application process and help individuals 
                    and families achieve their dreams of international travel, study, work, and migration.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Integrity, transparency, and client-first approach guide everything we do. 
                    We believe in honest communication and delivering on our promises.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To be the world's most trusted visa consultancy, connecting people 
                    across borders and making global mobility seamless for everyone.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-background">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose GlobalVisa Pro?
              </h2>
              <p className="text-xl text-muted-foreground">
                With years of experience and thousands of successful applications, 
                we've built our reputation on results and client satisfaction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Expert Team</h3>
                    <p className="text-muted-foreground">
                      Our team includes certified immigration consultants, former embassy staff, 
                      and visa specialists with deep knowledge of global immigration laws.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Secure & Confidential</h3>
                    <p className="text-muted-foreground">
                      We maintain the highest security standards for document handling 
                      and ensure complete confidentiality of your personal information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Proven Success Rate</h3>
                    <p className="text-muted-foreground">
                      98% success rate across all visa categories, with over 50,000 
                      successful applications processed to date.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personalized Service</h3>
                    <p className="text-muted-foreground">
                      Every client receives a dedicated consultant who understands their 
                      unique situation and provides tailored guidance throughout the process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Global Presence</h3>
                    <p className="text-muted-foreground">
                      Offices in New York, London, and Dubai, with partnerships worldwide 
                      to serve clients in over 150 countries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Industry Recognition</h3>
                    <p className="text-muted-foreground">
                      Award-winning consultancy recognized by immigration authorities 
                      and industry associations for excellence in service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-primary text-primary-foreground">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-primary-foreground/90">Successful Applications</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">150+</div>
                <div className="text-primary-foreground/90">Countries Served</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-primary-foreground/90">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">9+</div>
                <div className="text-primary-foreground/90">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;