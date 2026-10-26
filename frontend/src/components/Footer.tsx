import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "Meal Plans", to: "/#meal-plans" },
  { label: "Workouts", to: "/#workouts" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Privacy", to: "/privacy-policy" },
  { label: "Terms", to: "/terms" },
  { label: "Contact", to: "/contact" },
];

const socials = [
  { label: "YouTube", icon: Youtube },
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
];

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white font-poppins text-slate-600">
    <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 md:py-7 lg:px-12">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:justify-between">
        <Link to="/" className="shrink-0" aria-label="Zuno home">
          <img src="/zuno-logo.png" alt="Zuno" className="h-11 w-[132px] object-contain object-left" />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Footer navigation">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-sm font-normal transition-colors hover:text-blue-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center border-t border-slate-200 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0" aria-label="Social media">
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <social.icon className="h-[17px] w-[17px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 text-center">
        <p className="text-xs font-medium text-slate-500">© {new Date().getFullYear()} ZUNO. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
