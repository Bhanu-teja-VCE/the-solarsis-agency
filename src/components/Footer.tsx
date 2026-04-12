import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-[#0a0a0a] pt-16 pb-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 flex items-center justify-center" aria-hidden="true">
                <div className="w-2 h-2 bg-background rounded-full" />
              </div>
              <span className="font-display font-bold text-xl tracking-wide">Solarsis Agency</span>
            </div>
            <p className="text-white/50 max-w-sm text-sm leading-relaxed">
              Solarsis Agency is an AI automation company based in Hyderabad, India. We build custom AI software, RAG solutions, and intelligent workflows that accelerate business growth globally.
            </p>
          </div>
          
          <nav aria-label="Footer Navigation">
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><a href="#hero" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>

          <div>
            <h4 className="font-semibold mb-4 text-white">Connect</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><a href="mailto:hello@solarsis.ai" className="hover:text-white transition-colors">hello@solarsis.ai</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Book a Call</a></li>
              <li className="flex gap-4 pt-2">
                <a href="https://twitter.com/solarsisagency" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                <a href="https://www.linkedin.com/company/solarsis" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
                <a href="https://github.com/solarsis" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub"><Github className="w-5 h-5" /></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Solarsis Agency. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

