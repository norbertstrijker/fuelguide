'use client'

import { useTranslations } from 'next-intl'

export default function FuelAdvice({ machine }) {
  const t = useTranslations('fuel_advice')
  const tSpecs = useTranslations('specs')

  const is2Stroke = machine.motortype === '2-takt'
  const fuelLabel = machine.e10_geschikt
    ? 'E10 (ongelode benzine)'
    : 'Euro 95 (geen E10)'

  return (
    <div className="bg-gradient-to-r from-groen to-groen-light text-white rounded-xl p-6 sm:p-8">
      <p className="text-xl sm:text-2xl font-bold">
        {is2Stroke
          ? t('uses_mix', { ratio: machine.mengverhouding || '1:50' })
          : t('uses_petrol', { fuel: fuelLabel })}
      </p>
      <div className="mt-3 flex gap-3 flex-wrap">
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
          {machine.e10_geschikt === true && t('e10_yes')}
          {machine.e10_geschikt === false && t('e10_no')}
          {machine.e10_geschikt === null && t('e10_unknown')}
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
          {tSpecs(machine.motortype === '2-takt' ? 'two_stroke' : 'four_stroke')}
        </span>
      </div>
    </div>
  )
}
