'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CONTACT_FAQS } from '@/lib/contact'
import { cn } from '@/lib/utils'

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
      {CONTACT_FAQS.map((faq, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`

        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 sm:px-6 dark:hover:bg-slate-700/40"
              >
                <span
                  className={cn(
                    'font-medium transition-colors',
                    isOpen
                      ? 'text-primary-800 dark:text-primary-200'
                      : 'text-slate-600 hover:text-primary-700 dark:text-slate-100 dark:hover:text-primary-300'
                  )}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200',
                    isOpen && 'rotate-180 text-primary-600 dark:text-primary-400'
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-slate-600 sm:px-6 dark:text-slate-400">{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}