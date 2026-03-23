'use client';

import { useState } from 'react';
import { Building2, TrendingDown, Star, ArrowRight } from 'lucide-react';
import { mockBankProposals, formatFullCurrency } from '@/lib/mock-data';
import BankProposals from '../dashboard/BankProposals';

function BankLogo({ bankLogo }: { bankLogo: string }) {
  if (bankLogo === 'BCP') {
    return (
      <div className="w-10 h-10 bg-[#d1005d] rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 31 28.5" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M 30.2187,24.3464 28.0212,7.92758 C 27.9524,7.17115 27.8644,5.87524 27.863,5.86058 L 27.8469,5.62895 H 23.027 l -0.2491,0.03079 v 0.24921 c 0,0.65382 -0.2197,1.28858 -0.4834,1.98931 L 16.9663,21.5127 10.9172,7.31628 C 8.66845,2.11358 5.52308,0.672536 3.87348,0.27526 1.49431,-0.293533 0,0.201962 0,0.201962 c 0,0 1.63348,-0.07623 3.00766,0.922088 2.49051,1.809 2.63702,4.16187 2.23853,7.20081 L 3.25671,23.071 c -0.2637,1.7811 -0.7955,4.7438 -0.80136,4.7731 l -0.05274,0.2932 h 3.38857 l 0.01758,-0.2301 c 0,-0.022 0.18312,-2.2899 0.4395,-4.3011 l 1.7917,-13.4752 5.99484,14.2418 c 0.8321,1.9498 1.3375,2.8704 3.0223,4.1502 l 0.2622,0.1979 7.2445,-18.5444 1.7888,15.1302 c 0.1084,1.1229 0.1889,2.5815 0.1889,2.5962 l 0.0132,0.236 h 4.2398 L 30.7461,27.8456 C 30.7432,27.828 30.4194,25.8973 30.2187,24.3464 Z" fill="#ffffff"/>
        </svg>
      </div>
    );
  }

  if (bankLogo === 'CGD') {
    return (
      <div className="w-10 h-10 bg-[#007dc3] rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 116.01882 102.401" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(-132.55625,-136.525)">
            <path d="M 205.51866,136.525 H 175.4792 c -2.53666,0 -4.93981,1.33507 -6.27488,3.60471 l -15.48701,26.83521 c -1.33503,2.26966 -1.33503,4.93982 0,7.20948 l 23.2305,40.31959 7.34297,-12.68339 c 1.6021,-2.80363 1.6021,-6.27487 0,-9.07854 l -11.74873,-20.4268 c -0.66756,-1.06804 -0.66756,-2.53666 0,-3.60471 l 7.60995,-13.21736 c 0.66758,-1.06803 1.86913,-1.86909 3.07074,-1.86909 h 14.28539 c 1.33507,0 2.53667,0.66754 3.07069,1.86909 l 4.80629,8.27754 c 0.66755,1.0681 1.86915,1.86914 3.07071,1.86914 h 17.75664 l -14.68595,-25.50016 c -0.9346,-2.26964 -3.33774,-3.60471 -6.00785,-3.60471 z" fill="#ffffff"/>
            <path d="m 232.48733,235.32127 15.08645,-26.03416 c 1.33509,-2.26963 1.33509,-4.93981 0,-7.20947 l -15.48693,-26.83515 c -1.33514,-2.26971 -3.73827,-3.60478 -6.27494,-3.60478 h -46.59445 l 7.34296,12.68333 c 1.60208,2.80366 4.53931,4.53932 7.87701,4.53932 h 23.49749 c 1.33511,0 2.53668,0.66752 3.07069,1.86907 l 7.60998,13.21737 c 0.66752,1.06803 0.66752,2.53666 0,3.60468 l -7.20945,12.41631 c -0.66752,1.06804 -1.86914,1.86909 -3.07068,1.86909 h -9.47911 c -1.33509,0 -2.53666,0.66761 -3.07074,1.86917 l -8.945,15.21995 h 29.37185 c 2.67015,0 5.07334,-1.4686 6.27487,-3.60473 z" fill="#ffffff"/>
            <path d="m 133.55758,209.28711 14.95294,26.03416 c 1.33507,2.26964 3.73821,3.60473 6.27488,3.60473 h 31.10748 c 2.53665,0 4.93983,-1.33509 6.27488,-3.60473 l 23.23047,-40.31955 h -14.68588 c -3.20422,0 -6.27492,1.7356 -7.87702,4.53927 l -11.74875,20.4268 c -0.66757,1.06804 -1.86912,1.86909 -3.07069,1.86909 h -15.3535 c -1.33504,0 -2.53666,-0.66753 -3.07069,-1.86909 l -7.20942,-12.41631 c -0.66755,-1.06802 -0.66755,-2.53665 0,-3.60468 l 4.8063,-8.27754 c 0.66751,-1.06809 0.66751,-2.53669 0,-3.60472 l -8.94509,-15.48702 -14.68591,25.50012 c -1.3351,2.13615 -1.3351,4.93984 0,7.20947 z" fill="#ffffff"/>
          </g>
        </svg>
      </div>
    );
  }

  if (bankLogo === 'STD') {
    return (
      <div className="w-10 h-10 bg-[#e52428] rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.8 41.5" width="22" height="22">
          <path d="m31.5,19.1c-.1-1.5-.5-3-1.3-4.3l-6.8-11.9c-.5-.9-.9-1.9-1.1-2.9l-.3.5c-1.7,2.9-1.7,6.6,0,9.5l5.5,9.5c1.7,2.9,1.7,6.6,0,9.5l-.3.5c-.2-1-.6-2-1.1-2.9l-5-8.7-3.2-5.6c-.5-.9-.9-1.9-1.1-2.9l-.3.5c-1.7,2.9-1.7,6.5,0,9.5h0l5.5,9.5c1.7,2.9,1.7,6.6,0,9.5l-.3.5c-.2-1-.6-2-1.1-2.9l-6.9-11.9c-.9-1.6-1.3-3.4-1.3-5.2C5.1,20.8,0,24.9,0,29.6c0,6.6,9.8,11.9,21.9,11.9s21.9-5.3,21.9-11.9c.1-4.5-4.9-8.6-12.3-10.5Z" fill="#ffffff"/>
        </svg>
      </div>
    );
  }

  // Fallback
  return (
    <div className="w-10 h-10 bg-[#0F1B2D] rounded-xl flex items-center justify-center text-[10px] font-bold text-white">
      {bankLogo}
    </div>
  );
}

export default function BankProposalsPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F1B2D]">Propostas Bancárias</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Comparação e análise de propostas por banco parceiro</p>
        </div>
      </div>

      {/* Bank summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {mockBankProposals.map((proposal) => (
          <div
            key={proposal.id}
            className={`bg-white rounded-xl border shadow-card p-5 relative overflow-hidden ${
              proposal.recommended ? 'border-[#2563EB]' : 'border-[#E8ECF0]'
            }`}
          >
            {proposal.recommended && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563EB]" />
            )}
            {proposal.recommended && (
              <div className="flex items-center gap-1.5 mb-3">
                <Star className="w-3 h-3 text-[#2563EB] fill-[#2563EB]" />
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wide">Recomendado</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <BankLogo bankLogo={proposal.bankLogo} />
              <div>
                <p className="text-sm font-bold text-[#0F1B2D]">{proposal.bank}</p>
                <p className="text-[10px] text-[#9CA3AF]">Score: {proposal.score}/100</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'TAEG', value: `${proposal.taeg}%`, highlight: proposal.recommended },
                { label: 'Prestação', value: formatFullCurrency(proposal.monthlyPayment), highlight: false },
                { label: 'Spread', value: `+${proposal.spread}%`, highlight: false },
                { label: 'Custo Total', value: formatFullCurrency(proposal.totalCost), highlight: false },
              ].map((item) => (
                <div key={item.label} className="bg-[#F8FAFC] rounded-lg p-2">
                  <p className="text-[9px] text-[#9CA3AF]">{item.label}</p>
                  <p
                    className="text-sm font-bold mt-0.5"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: item.highlight ? '#2563EB' : '#0F1B2D',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Full comparison table */}
      <BankProposals />
    </div>
  );
}
