import { Link } from "react-router-dom";
import logoAsset from "@/assets/danova-logo.jpg.asset.json";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.6c-1.3.1-2.6-.3-3.7-1v5.9c0 3.4-2.6 5.6-5.5 5.6A5.5 5.5 0 0 1 5.3 14c0-3.2 2.8-5.7 6.2-5.3v2.8a2.7 2.7 0 0 0-1-.2 2.7 2.7 0 0 0 0 5.4c1.5 0 2.6-1.1 2.6-2.7V3h3.4z" />
  </svg>
);

const socials = [
  { name: "Danova Visas on Facebook", href: "https://www.facebook.com/danovavisas", Icon: Facebook },
  { name: "Danova Visas on Instagram", href: "https://www.instagram.com/danovavisas", Icon: Instagram },
  { name: "Danova Visas on TikTok", href: "https://www.tiktok.com/@danovavisas", Icon: TikTokIcon },
];


const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logoAsset.url} alt="Danova Visas logo" className="h-9 w-9 rounded-lg object-cover" />
              <span className="text-xl font-bold">Danova Visas</span>
            </div>
            <p className="text-background/80 max-w-sm">
              Your trusted partner for global visa solutions. We help clients worldwide 
              achieve their travel and immigration dreams with expert guidance and support.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background hover:bg-primary/20">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background hover:bg-primary/20">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background hover:bg-primary/20">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background hover:bg-primary/20">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-background/80 hover:text-background transition-colors">
                  Tourist Visa
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-background/80 hover:text-background transition-colors">
                  Student Visa
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-background/80 hover:text-background transition-colors">
                  Work Visa
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-background/80 hover:text-background transition-colors">
                  Business Visa
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-background/80 hover:text-background transition-colors">
                  Family Visa
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-background/80 hover:text-background transition-colors">
                  Passport Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-background/80 hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-background/80 hover:text-background transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-background/80 hover:text-background transition-colors">
                  Blog & Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/80 hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/client-portal" className="text-background/80 hover:text-background transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-background/80 hover:text-background transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-background/80">+17373306427</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-background/80">info@danovavisas.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span className="text-background/80">
                  123 Business Ave, Suite 456<br />
                  New York, NY 10001
                </span>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">English</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Español</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Français</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-center md:text-left">
            <div className="text-xs sm:text-sm text-background/80">
              © 2023 Danova Visas
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-background/80">
              <Link to="/privacy" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-background transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-background transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;