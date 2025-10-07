import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Globe,
  Send 
} from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Started With Your Visa Application
          </h2>
          <p className="text-xl text-muted-foreground">
            Contact our visa experts today for a free consultation. 
            We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="visaType">Visa Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourist">Tourist Visa</SelectItem>
                      <SelectItem value="student">Student Visa</SelectItem>
                      <SelectItem value="work">Work Visa</SelectItem>
                      <SelectItem value="business">Business Visa</SelectItem>
                      <SelectItem value="family">Family Visa</SelectItem>
                      <SelectItem value="passport">Passport Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your travel plans and requirements..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full bg-gradient-primary shadow-professional">
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="grid gap-4">
              <Card className="border-0 shadow-card">
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+17373306427</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-card">
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-muted-foreground">danovavisas@gmail.com</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-card">
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-4">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground">+17373306427</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Office Hours */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">Closed</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Emergency support available 24/7 via WhatsApp and Contact
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">New York (HQ)</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Business Ave, Suite 456<br />
                    New York, NY 10001
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">London</h4>
                  <p className="text-sm text-muted-foreground">
                    45 Global Street<br />
                    London, UK SW1A 1AA
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Dubai</h4>
                  <p className="text-sm text-muted-foreground">
                    World Trade Center<br />
                    Dubai, UAE
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;