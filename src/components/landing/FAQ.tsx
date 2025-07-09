import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does CodeReview integrate with my existing workflow?',
    answer: 'CodeReview seamlessly integrates with GitHub, GitLab, and Bitbucket through webhooks. Once connected, it automatically analyzes every pull request and provides instant feedback without disrupting your current development process.'
  },
  {
    question: 'What programming languages are supported?',
    answer: 'We support all major programming languages including JavaScript, TypeScript, Python, Java, C#, Go, PHP, Ruby, and more. Our analysis engines are continuously updated to support the latest language features and frameworks.'
  },
  {
    question: 'Can I customize the rules and coding standards?',
    answer: 'Absolutely! Pro and Enterprise plans include custom rule creation, configuration of existing rules, and the ability to import your team\'s specific coding standards. You can also create project-specific configurations.'
  },
  {
    question: 'How accurate are the security vulnerability detections?',
    answer: 'Our security scanner has a 99.2% accuracy rate and is based on the latest CVE databases, OWASP guidelines, and industry best practices. We minimize false positives while ensuring comprehensive coverage of potential security issues.'
  },
  {
    question: 'What happens to my code? Is it secure?',
    answer: 'Your code never leaves your infrastructure. We use secure, encrypted connections and only analyze code metadata and patterns. We\'re SOC 2 compliant and follow strict data protection protocols. Enterprise customers can also opt for on-premise deployment.'
  },
  {
    question: 'How does the pricing work for teams?',
    answer: 'Pricing is per user per month. The Free plan supports up to 3 repositories, Pro is $29/user/month with unlimited repos, and Enterprise is $99/user/month with additional features. All plans include unlimited pull request analysis.'
  },
  {
    question: 'Can I try CodeReview before purchasing?',
    answer: 'Yes! We offer a 14-day free trial for all paid plans with no credit card required. You can also start with our Free plan to test the basic features on up to 3 repositories.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'Free users get community support, Pro users get priority email support with 24-hour response time, and Enterprise customers get dedicated support with SLA guarantees and optional on-site training.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
      <div className="container mx-auto max-w-4xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Asked Questions
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Get answers to common questions about CodeReview and how it can help your team.
          </p>
        </div>

        <div className="space-y-4 w-full">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="bg-slate-800/80 border-slate-700 overflow-hidden hover:bg-slate-800 transition-all duration-200"
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}