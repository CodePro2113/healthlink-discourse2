
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  Users,
  MessageSquare,
  Newspaper,
  Brain,
  Shield,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Professional Network',
    description: 'Connect with fellow doctors across India, follow specialists, and expand your professional network.'
  },
  {
    icon: MessageSquare,
    title: 'Clinical Discussions',
    description: 'Engage in medical discussions, seek second opinions, and share knowledge in a secure environment.'
  },
  {
    icon: Newspaper,
    title: 'Personalized Feed',
    description: 'Stay updated with the latest research and news tailored to your medical specialty.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Leverage AI for content tagging, research summaries, and customized medical updates.'
  },
  {
    icon: Shield,
    title: 'Private Community',
    description: 'Exclusive platform only for verified Indian medical professionals.'
  }
];

const testimonials = [
  {
    quote: "MedConnect has transformed how I collaborate with colleagues. The specialty-based discussions and research updates keep me informed and connected.",
    author: "Dr. Anjali Sharma",
    role: "Neurologist, AIIMS Delhi"
  },
  {
    quote: "The forum discussions and anonymity features allow me to seek advice on complex cases while maintaining patient confidentiality.",
    author: "Dr. Rahul Verma",
    role: "Pediatrician, Manipal Hospitals"
  },
  {
    quote: "As a doctor in a rural area, MedConnect helps me stay connected with the medical community and access the latest research and opinions.",
    author: "Dr. Meera Patel",
    role: "General Physician, Rajasthan"
  }
];

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.3 }}
    className="group"
  >
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:scale-[1.02]">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground flex-grow">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="text-lg mb-4">"{quote}"</div>
        <div className="mt-auto">
          <p className="font-semibold">{author}</p>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 shadow-sm backdrop-blur-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <span className="bg-primary text-primary-foreground rounded-md px-2 py-1">Med</span>
            <span>Connect</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" className="hidden md:flex">Sign In</Button>
            </Link>
            <Link to="/auth/login?tab=register">
              <Button className="btn-hover">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 mb-4">
                  Exclusive for Indian Doctors
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Connect. Collaborate. <span className="text-primary">Transform.</span>
                </h1>
                <p className="text-xl text-muted-foreground md:pr-12">
                  The premier social networking platform exclusively for Indian medical professionals to connect, share knowledge, and advance healthcare together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/auth/login?tab=register">
                    <Button size="lg" className="btn-hover">
                      Join the Community
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                  <Link to="/feed">
                    <Button size="lg" variant="outline" className="btn-hover">
                      Explore the Platform
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Verified doctors only</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
              >
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                    alt="Medical professionals"
                    className="rounded-2xl shadow-xl w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-black p-4 rounded-xl shadow-lg z-20 max-w-xs glass-card">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">AI-Powered Insights</h3>
                      <p className="text-xs text-muted-foreground">Latest research on cardiac arrhythmias summarized for you</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -left-6 bg-white dark:bg-black p-4 rounded-xl shadow-lg z-20 max-w-xs glass-card">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Clinical Discussions</h3>
                      <p className="text-xs text-muted-foreground">87 doctors discussing new treatment protocols</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="px-3 py-1 text-sm bg-accent/10 text-accent border-accent/20 mb-4">
                Platform Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything doctors need in one place
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A comprehensive platform designed specifically for the needs of Indian medical professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 mb-4">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by doctors across India
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hear from medical professionals who have transformed their practice with MedConnect.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to transform your professional networking?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Join thousands of Indian doctors already collaborating, learning, and growing together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/auth/login?tab=register">
                      <Button size="lg" className="btn-hover">
                        Get Started for Free
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                    <Link to="/feed">
                      <Button size="lg" variant="outline" className="btn-hover">
                        See it in action
                        <ExternalLink size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="lg:text-right">
                  <div className="inline-block bg-background rounded-xl p-6 shadow-lg">
                    <div className="text-4xl font-bold mb-2">10,000+</div>
                    <div className="text-muted-foreground">Indian medical professionals</div>
                    
                    <div className="grid grid-cols-2 gap-6 mt-6 text-left">
                      <div>
                        <div className="text-2xl font-bold mb-1">200+</div>
                        <div className="text-sm text-muted-foreground">Medical specialties</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold mb-1">5,000+</div>
                        <div className="text-sm text-muted-foreground">Clinical discussions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-4">
                <span className="bg-primary text-primary-foreground rounded-md px-2 py-1">Med</span>
                <span>Connect</span>
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                The exclusive social networking platform for Indian medical professionals to connect, share knowledge, and advance healthcare.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/feed" className="text-muted-foreground hover:text-foreground transition-colors">Feed</Link></li>
                <li><Link to="/forum" className="text-muted-foreground hover:text-foreground transition-colors">Forum</Link></li>
                <li><Link to="/network" className="text-muted-foreground hover:text-foreground transition-colors">Network</Link></li>
                <li><Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">Medical News</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/guidelines" className="text-muted-foreground hover:text-foreground transition-colors">Community Guidelines</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">Data Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2023 MedConnect. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
