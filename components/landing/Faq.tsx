"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "How do credits work?",
    answer:
      "Credits are used to generate content with our AI. Different features cost different amounts of credits - for example, generating a basic research idea might cost 5 credits, while drafting a full paper might cost 25-50 credits.",
  },
  {
    question: "Can I roll over unused credits?",
    answer:
      "Yes, unused credits roll over month to month up to a maximum of 3 times your monthly allocation.",
  },
  {
    question: "How do I verify I'm a BITS Pilani student?",
    answer:
      "Sign up with your official BITS Pilani email address and we'll automatically verify your student status. Your account will be upgraded to the BITS special plan within 24 hours.",
  },
];

const Faq = () => {
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
        Frequently Asked Questions
      </h3>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem 
              value={`item-${index}`} 
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="p-6 text-lg font-medium text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Faq;
