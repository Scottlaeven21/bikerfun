'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-biker-dark rounded-2xl border-2 border-biker-gray hover:border-biker-yellow transition-all duration-300 overflow-hidden"
        >
          {/* Question Button */}
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left group"
          >
            <span className="text-lg font-bold text-white group-hover:text-biker-yellow transition-colors pr-4">
              {item.question}
            </span>
            <svg
              className={`w-6 h-6 text-biker-yellow transition-transform duration-300 flex-shrink-0 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Answer Content */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              openIndex === index
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-6 pb-5 text-biker-light leading-relaxed border-t border-biker-gray pt-4">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
