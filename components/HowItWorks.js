'use client'

import { useTranslations } from 'next-intl'

const STEP_ICONS = ['🔍', '⛽', '🛒']

export default function HowItWorks() {
  const t = useTranslations('how_it_works')

  const steps = [
    { title: t('step1_title'), text: t('step1_text') },
    { title: t('step2_title'), text: t('step2_text') },
    { title: t('step3_title'), text: t('step3_text') },
  ]

  return (
    <div className="grid sm:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <div key={i} className="text-center">
          <div className="text-4xl mb-3">{STEP_ICONS[i]}</div>
          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.text}</p>
        </div>
      ))}
    </div>
  )
}
