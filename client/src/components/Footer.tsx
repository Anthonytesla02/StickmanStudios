import { Link } from "wouter";
import { Video } from "lucide-react";
import { SiX, SiLinkedin, SiYoutube } from "react-icons/si";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Documentation", href: "#docs" },
    { name: "API", href: "#api" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
    { name: "Security", href: "#security" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-card/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Video className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-display">StickMotion</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create engaging stickman animation videos with the power of AI. 
              Transform your ideas into visual stories in minutes.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" data-testid="link-twitter">
                <SiX className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="#" aria-label="LinkedIn" data-testid="link-linkedin">
                <SiLinkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="#" aria-label="YouTube" data-testid="link-youtube">
                <SiYoutube className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} StickMotion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
