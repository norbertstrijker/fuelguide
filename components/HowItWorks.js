'use client'

import { useTranslations } from 'next-intl'
import { Search, Fuel, ShoppingCart } from 'lucide-react'

const STEP_ICONS = [Search, Fuel, ShoppingCart]

export default function HowItWorks() {
  const t = useTranslations('how_it_works')

  const steps = [
    { title: t('step1_title'), text: t('step1_text') },
    { title: t('step2_title'), text: t('step2_text') },
    { title: t('step3_title'), text: t('step3_text') },
  ]

  return (
    <div className="grid sm:grid-cols-3 gap-8">
      {steps.map((step, i) => {
        const Icon = STEP_ICONS[i]
        return (
          <div key={i} className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-container-low rounded flex items-center justify-center">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 tracking-tight">{step.title}</h3>
            <p className="text-on-secondary-container text-sm">{step.text}</p>
          </div>
        )
      })}
    </div>
  )
}
