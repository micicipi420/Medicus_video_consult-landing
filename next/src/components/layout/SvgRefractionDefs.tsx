export function SvgRefractionDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="liquid-refract-sm" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={1} seed={92} result="noise" />
          <feGaussianBlur in="noise" stdDeviation={1} result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale={0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid-refract-md" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={92} result="noise" />
          <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale={18} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid-refract-lg" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={92} result="noise" />
          <feGaussianBlur in="noise" stdDeviation={3} result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale={12} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
