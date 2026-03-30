'use client'

import { useTranslations } from 'next-intl'
import GaugeBar from '@/components/GaugeBar'

export default function FuelAdvice({ machine }) {
  const t = useTranslations('fuel_advice')
  const tSpecs = useTranslations('specs')

  const is2Stroke = machine.motortype === '2-takt'
  const fuelLabel = machine.e10_geschikt
    ? 'E10 (ongelode benzine)'
    : 'Euro 95 (geen E10)'

  return (
    <div>
      <div className="bg-surface-container-low p-8 rounded mb-8 flex flex-col md:flex-row items-center gap-8">
        <div>
          <span className="text-[10px] font-bold tracking-label text-primary uppercase block mb-1">
            {t('requirement') || 'Brandstofvereiste'}
          </span>
          <h2 className="text-3xl font-bold tracking-tight uppercase leading-none">
            {is2Stroke
              ? t('uses_mix', { ratio: machine.mengverhouding || '1:50' })
              : t('uses_petrol', { fuel: fuelLabel })}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <GaugeBar
            label={tSpecs('motor_type')}
            value={is2Stroke ? 3 : 4}
            max={5}
            displayValue={tSpecs(is2Stroke ? 'two_stroke' : 'four_stroke')}
          />
        </div>
        {machine.mengverhouding && (
          <div>
            <GaugeBar
              label={tSpecs('mix_ratio')}
              value={machine.mengverhouding === '1:25' ? 5 : machine.mengverhouding === '1:40' ? 3 : 2}
              max={5}
              displayValue={machine.mengverhouding}
            />
          </div>
        )}
        <div>
          <GaugeBar
            label={tSpecs('e10')}
            value={machine.e10_geschikt ? 5 : 1}
            max={5}
            displayValue={machine.e10_geschikt === true ? tSpecs('yes') : machine.e10_geschikt === false ? tSpecs('no') : tSpecs('unknown')}
          />
        </div>
      </div>
    </div>
  )
}
