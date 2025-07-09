import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Developer',
    company: 'TechCorp',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    content: 'CodeReview has transformed our development process. We catch bugs 3x faster and our code quality has improved dramatically.',
    rating: 5
  },
  {
    name: 'Mike Rodriguez',
    role: 'Engineering Manager',
    company: 'StartupXYZ',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    content: 'The security scanning feature alone has saved us from multiple potential vulnerabilities. Absolutely essential for any serious development team.',
    rating: 5
  },
  {
    name: 'Emily Johnson',
    role: 'Tech Lead',
    company: 'InnovateLabs',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    content: 'Integration was seamless and the insights we get from the analytics dashboard help us make better technical decisions.',
    rating: 5
  },
  {
    name: 'David Park',
    role: 'Full Stack Developer',
    company: 'WebSolutions',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    content: 'As a solo developer, CodeReview gives me the confidence of having a senior developer review my code. Game changer!',
    rating: 5
  },
  {
    name: 'Lisa Wang',
    role: 'DevOps Engineer',
    company: 'CloudFirst',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    content: 'The custom rules feature allows us to enforce our coding standards automatically. No more manual style reviews!',
    rating: 5
  },
  {
    name: 'Alex Thompson',
    role: 'CTO',
    company: 'ScaleUp Inc',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    content: 'CodeReview has become an integral part of our CI/CD pipeline. The ROI in terms of reduced bugs and faster development is incredible.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="container mx-auto max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Developers Worldwide
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join thousands of developers and teams who trust CodeReview to maintain 
            their code quality and accelerate their development process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className="mb-4">
                <Quote className="h-6 w-6 text-cyan-400 mb-3" />
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                  <p className="text-slate-400 text-xs">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}