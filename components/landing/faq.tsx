"use client"

import { useState } from 'react';

export const FAQ = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const accordionData = [
    {
      question: "Can I cancel at anytime?",
      answer: "Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback."
    },
    {
      question: "My team has credits. How do we use them?",
      answer: "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details."
    },
    {
      question: "How does Preline's pricing work?",
      answer: "Our subscriptions are tiered. Understanding the task at hand and ironing out the wrinkles is key."
    },
    {
      question: "How secure is Preline?",
      answer: "Protecting the data you trust to Preline is our first priority. This part is really crucial in keeping the project in line to completion."
    },
    {
      question: "How do I get access to a theme I purchased?",
      answer: "If you lose the link for a theme you purchased, don't panic! We've got you covered. You can login to your account, tap your avatar in the upper right corner, and tap Purchases. If you didn't create a login or can't remember the information, you can use our handy Redownload page, just remember to use the same email you originally made your purchases with."
    },
    {
      question: "Upgrade License Type",
      answer: "There may be times when you need to upgrade your license from the original type you purchased and we have a solution that ensures you can apply your original purchase cost to the new license purchase."
    }
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Frequently<br />asked questions</h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-gray-400">Answers to the most frequently asked questions.</p>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {accordionData.map((item, index) => (
              <div className="pt-6 pb-3" key={index}>
                <button
                  className="group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  onClick={() => toggleAccordion(index)}
                  aria-controls={`accordion-content-${index}`}
                  aria-expanded={activeAccordion === index}
                >
                  {item.question}
                  <svg
                    className={`block flex-shrink-0 w-5 h-5 text-gray-600 group-hover:text-gray-500 dark:text-gray-400 ${
                      activeAccordion === index ? "hidden" : "block"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                  <svg
                    className={`hidden flex-shrink-0 w-5 h-5 text-gray-600 group-hover:text-gray-500 dark:text-gray-400 ${
                      activeAccordion === index ? "block" : "hidden"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </button>
                <div
                  id={`accordion-content-${index}`}
                  className={`overflow-hidden transition-[height] duration-300 ${
                    activeAccordion === index ? "block" : "hidden"
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



