import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

type Glyph =
  | 'shield' | 'key' | 'lock' | 'eye' | 'eyeoff' | 'checkcircle' | 'clock'
  | 'arrowright' | 'chevronright' | 'external' | 'plus' | 'filecheck' | 'alert'
  | 'copy' | 'check' | 'x' | 'sliders' | 'building' | 'usercheck' | 'user'
  | 'calendar' | 'dollar' | 'settings' | 'layers' | 'cpu' | 'refresh' | 'terminal' | 'xcircle';

// Original cut-crystal glyphs, drawn in-house. No icon-library assets.
const shapes: Record<Glyph, ReactNode> = {
  shield: <><path d="m12 2 8 5v10l-8 5-8-5V7l8-5Z" /><path d="m8 10 4-3 4 3v5l-4 3-4-3v-5Z" /><circle cx="12" cy="12" r="1" /><path d="M12 13v3M2 12h2M20 12h2" /></>,
  key: <><circle cx="8.1" cy="15.9" r="3.6" /><path d="m10.8 13.2 8-8M15 8l2 2M17.2 5.8l2 2" /></>,
  lock: <><path d="M6.1 10h11.8v10H6.1z" /><path d="M8.5 10V7.7a3.5 3.5 0 0 1 7 0V10M12 14v2.3" /></>,
  eye: <><path d="M2.5 12s3.3-5.2 9.5-5.2 9.5 5.2 9.5 5.2-3.3 5.2-9.5 5.2S2.5 12 2.5 12Z" /><path d="M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" /></>,
  eyeoff: <><path d="m3 4 18 16M9.7 7.1A10.5 10.5 0 0 1 12 6.8c6.2 0 9.5 5.2 9.5 5.2a17 17 0 0 1-3 3.3M6.2 8.9C3.9 10.3 2.5 12 2.5 12s3.3 5.2 9.5 5.2c.8 0 1.5-.1 2.2-.3" /><path d="M9.6 12a2.4 2.4 0 0 0 2.7 2.3" /></>,
  checkcircle: <><circle cx="12" cy="12" r="8.7" /><path d="m8 12.2 2.5 2.5 5.7-5.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.8" /><path d="M12 7v5l3.3 2" /><path d="M4.8 4.8 3.4 3.4M19.2 4.8l1.4-1.4" /></>,
  arrowright: <><path d="M3 12h16M13 6l6 6-6 6" /></>,
  chevronright: <path d="m9 5 7 7-7 7" />,
  external: <><path d="M13 5h6v6M19 5l-8 8" /><path d="M17 13v5H5V6h5" /></>,
  plus: <><path d="M12 4v16M4 12h16" /><path d="M7 7h10v10H7z" opacity=".35" /></>,
  filecheck: <><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M8.5 14l2.1 2.1 4.7-4.7" /></>,
  alert: <><path d="m12 3 9 16H3L12 3Z" /><path d="M12 9v4M12 16h.01" /></>,
  copy: <><path d="M8 8h11v12H8z" /><path d="M5 16H3V4h12v2" /></>,
  check: <path d="m4.5 12.5 4.2 4.2L19.5 6" />,
  x: <><path d="m6 6 12 12M18 6 6 18" /><path d="M4 4h4M16 4h4M4 20h4M16 20h4" opacity=".45" /></>,
  sliders: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="17" r="2" /></>,
  building: <><path d="M4 20V5l8-2 8 2v15M8 20v-4h8v4M8 8h1M12 8h1M16 8h1M8 11h1M12 11h1M16 11h1" /></>,
  usercheck: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.4-3.2 2.2-4.8 5.5-4.8 1.1 0 2 .2 2.8.6M14 16.5l2 2 4-4" /></>,
  user: <><circle cx="12" cy="8" r="3.3" /><path d="M4.5 20c.5-4 3-6 7.5-6s7 2 7.5 6" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="15" rx="1.5" /><path d="M8 3v5M16 3v5M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
  dollar: <><path d="M12 3v18M16 7.2c-.8-.8-2.1-1.3-3.7-1.3-2.2 0-3.7 1.1-3.7 2.7 0 4.4 7.5 1.9 7.5 6 0 1.7-1.6 2.9-3.9 2.9-1.6 0-3-.5-4-1.5" /></>,
  settings: <><path d="m12 3 1.3 2.2 2.5.5 2.1-1 1.8 1.8-1 2.1.5 2.5L21 12l-1.8.9-.5 2.5 1 2.1-1.8 1.8-2.1-1-2.5.5L12 21l-.9-1.8-2.5-.5-2.1 1-1.8-1.8 1-2.1-.5-2.5L3 12l1.8-.9.5-2.5-1-2.1L7.1 4.7l2.1 1 2.5-.5L12 3Z" /><circle cx="12" cy="12" r="2.8" /></>,
  layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" /><path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3" /><path d="M10 10h4v4h-4z" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14.5-3L4 10M4 5v5h5M4 13a8 8 0 0 0 14.5 3L20 14M20 19v-5h-5" /></>,
  terminal: <><path d="m4 6 6 6-6 6M13 18h7" /></>,
  xcircle: <><circle cx="12" cy="12" r="8.8" /><path d="m9 9 6 6M15 9l-6 6" /></>,
};

export function PrismIcon({ size = 18, className, glyph, ...svgProps }: IconProps & { glyph: Glyph }) {
  return (
    <svg
      {...svgProps}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[glyph]}
    </svg>
  );
}

const makeIcon = (glyph: Glyph) => (props: IconProps) => <PrismIcon glyph={glyph} {...props} />;

export const Shield = makeIcon('shield');
export const Key = makeIcon('key');
export const Lock = makeIcon('lock');
export const Eye = makeIcon('eye');
export const EyeOff = makeIcon('eyeoff');
export const CheckCircle = makeIcon('checkcircle');
export const Clock = makeIcon('clock');
export const ArrowRight = makeIcon('arrowright');
export const ChevronRight = makeIcon('chevronright');
export const ExternalLink = makeIcon('external');
export const Plus = makeIcon('plus');
export const FileCheck = makeIcon('filecheck');
export const AlertCircle = makeIcon('alert');
export const Copy = makeIcon('copy');
export const Check = makeIcon('check');
export const X = makeIcon('x');
export const Sliders = makeIcon('sliders');
export const Building = makeIcon('building');
export const UserCheck = makeIcon('usercheck');
export const User = makeIcon('user');
export const Calendar = makeIcon('calendar');
export const DollarSign = makeIcon('dollar');
export const Settings = makeIcon('settings');
export const Layers = makeIcon('layers');
export const Cpu = makeIcon('cpu');
export const RefreshCw = makeIcon('refresh');
export const Terminal = makeIcon('terminal');
export const XCircle = makeIcon('xcircle');
