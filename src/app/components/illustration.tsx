import React, { ReactElement } from 'react';

interface IllustrationProps {
  hourOfDay: number;
}

interface GradientColors {
  dark: string;
  light: string;
  start: number;
  stop: number;
}

export default function Illustration({ hourOfDay }: IllustrationProps): ReactElement {
  const colors: GradientColors[] = [
    { dark: '#2f3644', light: '#455362', start: 0, stop: 5 },
    { dark: '#ba9862', light: '#f4c366', start: 5, stop: 10 },
    { dark: '#d8e8e9', light: '#eff5f7', start: 10, stop: 19 },
    { dark: '#eeb1ac', light: '#ffcabe', start: 19, stop: 22 },
    { dark: '#2f3644', light: '#455362', start: 22, stop: 25 }
  ];

  const color = colors.find(c => hourOfDay >= c.start && hourOfDay <= c.stop) || colors[0];

  return (
    <svg
      height={ 300 }
      width={ 300 }
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="100%" y2="0%">
          <stop offset="0%" stopColor={ color.dark } />
          <stop offset="100%" stopColor={ color.light } />
        </linearGradient>

        <clipPath id="mask">
            <path d="M 10 10 H 90 V 90 H 10"/>
        </clipPath>
      </defs>

      <g>
        <rect width="100" height="100" fill="url(#gradient)" />
        <g>
            <rect x="5" y="60" width="20" height="40" fill="rgba(0,0,0,0.1)" />
            <rect x="27" y="50" width="10" height="50" fill="rgba(0,0,0,0.1)" />
            <rect x="41" y="45" width="12" height="55" fill="rgba(0,0,0,0.1)" />
            <rect x="55" y="53" width="12" height="47" fill="rgba(0,0,0,0.1)" />
            <rect x="72" y="53" width="18" height="47" fill="rgba(0,0,0,0.1)" />
            <rect x="85" y="35" width="12" height="65" fill="rgba(0,0,0,0.07)" />
        </g>
      </g>
    </svg>
  );
}
