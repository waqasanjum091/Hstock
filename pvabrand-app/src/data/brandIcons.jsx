const brandIcons = {
  instagram: {
    name: 'Instagram',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="url(#ig)"/>
        <defs><linearGradient id="ig" x1="0" y1="48" x2="48" y2="0"><stop stopColor="#FEDA75"/><stop offset=".2" stopColor="#FA7E1E"/><stop offset=".4" stopColor="#D62976"/><stop offset=".6" stopColor="#962FBF"/><stop offset="1" stopColor="#4F5BD5"/></linearGradient></defs>
        <circle cx="24" cy="24" r="8" stroke="white" strokeWidth="2.5" fill="none"/>
        <circle cx="35" cy="13" r="2" fill="white"/>
        <rect x="3" y="3" width="42" height="42" rx="10" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  gmail: {
    name: 'Gmail',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M8 14L24 26L40 14" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="8" y="14" width="32" height="22" rx="3" stroke="#34A853" strokeWidth="2" fill="none"/>
        <path d="M8 14V36" stroke="#4285F4" strokeWidth="2"/>
        <path d="M40 14V36" stroke="#FBBC05" strokeWidth="2"/>
        <path d="M8 36L18 26" stroke="#34A853" strokeWidth="2"/>
        <path d="M40 36L30 26" stroke="#EA4335" strokeWidth="2"/>
      </svg>
    ),
  },
  tiktok: {
    name: 'TikTok',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#010101"/>
        <path d="M33 8C33 8 34.5 14 39 15.5V21C36 21 33.5 19.5 33 18V28C33 33 29 37 24 37C19 37 15 33 15 28C15 23 19 19 24 19V24.5C21.5 24.5 19.5 26.5 19.5 29C19.5 31.5 21.5 33.5 24 33.5C26.5 33.5 28.5 31.5 28.5 29V8H33Z" fill="white"/>
        <path d="M32.5 7.5C32.5 7.5 34 13.5 38.5 15V20.5C35.5 20.5 33 19 32.5 17.5V27.5C32.5 32.5 28.5 36.5 23.5 36.5C18.5 36.5 14.5 32.5 14.5 27.5C14.5 22.5 18.5 18.5 23.5 18.5V24C21 24 19 26 19 28.5C19 31 21 33 23.5 33C26 33 28 31 28 28.5V7.5H32.5Z" fill="#25F4EE"/>
        <path d="M33.5 8.5C33.5 8.5 35 14.5 39.5 16V21.5C36.5 21.5 34 20 33.5 18.5V28.5C33.5 33.5 29.5 37.5 24.5 37.5C19.5 37.5 15.5 33.5 15.5 28.5C15.5 23.5 19.5 19.5 24.5 19.5V25C22 25 20 27 20 29.5C20 32 22 34 24.5 34C27 34 29 32 29 29.5V8.5H33.5Z" fill="#FE2C55"/>
      </svg>
    ),
  },
  twitter: {
    name: 'X / Twitter',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <path d="M14 14L22.5 25L14 34H16.5L23.5 26.5L29 34H36L27 21.5L35 14H32.5L26 21L21 14H14ZM17.5 16H20.5L32.5 32H29.5L17.5 16Z" fill="white"/>
      </svg>
    ),
  },
  facebook: {
    name: 'Facebook',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#1877F2"/>
        <path d="M32 24H28V36H23V24H20V20H23V17.5C23 14.5 25 12 29 12H32V16H29.5C28.5 16 28 16.5 28 17.5V20H32L31.5 24Z" fill="white"/>
      </svg>
    ),
  },
  linkedin: {
    name: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#0A66C2"/>
        <rect x="11" y="21" width="5" height="15" rx="1" fill="white"/>
        <circle cx="13.5" cy="16" r="2.5" fill="white"/>
        <path d="M20 21H25V23C25.8 21.8 27.5 21 29.5 21C33.5 21 34 23.5 34 27V36H29V28.5C29 26.5 28.5 25 26.5 25C24.5 25 24 26.5 24 28.5V36H20V21Z" fill="white"/>
      </svg>
    ),
  },
  youtube: {
    name: 'YouTube',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#FF0000"/>
        <path d="M38 18.5C37.5 16.5 36 15 34 14.5C31 13.5 24 13.5 24 13.5C24 13.5 17 13.5 14 14.5C12 15 10.5 16.5 10 18.5C9.5 21.5 9.5 24 9.5 24C9.5 24 9.5 26.5 10 29.5C10.5 31.5 12 33 14 33.5C17 34.5 24 34.5 24 34.5C24 34.5 31 34.5 34 33.5C36 33 37.5 31.5 38 29.5C38.5 26.5 38.5 24 38.5 24C38.5 24 38.5 21.5 38 18.5Z" fill="white"/>
        <path d="M21 28.5L28 24L21 19.5V28.5Z" fill="#FF0000"/>
      </svg>
    ),
  },
  reddit: {
    name: 'Reddit',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#FF4500"/>
        <circle cx="24" cy="27" r="9" fill="white"/>
        <circle cx="20" cy="26" r="2" fill="#FF4500"/>
        <circle cx="28" cy="26" r="2" fill="#FF4500"/>
        <path d="M20 31C20 31 22 33 24 33C26 33 28 31 28 31" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="32" cy="18" r="3" fill="white"/>
        <path d="M24 18C24 18 24 14 28 14" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="31" cy="14" r="1.5" fill="#FF4500"/>
      </svg>
    ),
  },
  discord: {
    name: 'Discord',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#5865F2"/>
        <path d="M18.5 16C20.5 15.5 22.5 15.5 24 15.5C25.5 15.5 27.5 15.5 29.5 16C31 16.5 32.5 18 32.8 19.5C33 20.5 33 22 33 23C33 24 32.8 25 32.5 26C31.5 28 29 30 24 30C19 30 16.5 28 15.5 26C15.2 25 15 24 15 23C15 22 15.2 20.5 15.5 19.5C15.8 18 17 16.5 18.5 16Z" fill="white"/>
        <circle cx="20.5" cy="22" r="2" fill="#5865F2"/>
        <circle cx="27.5" cy="22" r="2" fill="#5865F2"/>
      </svg>
    ),
  },
  spotify: {
    name: 'Spotify',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#1DB954"/>
        <circle cx="24" cy="24" r="14" fill="#191414"/>
        <path d="M18 20C22 18.5 27 18.5 31 20.5" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M19 24C22.5 22.5 26.5 22.5 30 24" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M20.5 28C23 27 26 27 28.5 28" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  netflix: {
    name: 'Netflix',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <path d="M16 14V34L20 14V34L24 14L28 34V14L32 34V14" stroke="#E50914" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  binance: {
    name: 'Binance',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#F0B90B"/>
        <path d="M24 14L18 20L21 23L24 20L27 23L30 20L24 14Z" fill="#1E2329"/>
        <path d="M24 22L18 28L21 31L24 28L27 31L30 28L24 22Z" fill="#1E2329"/>
        <path d="M15 17L12 20L15 23L18 20L15 17Z" fill="#1E2329"/>
        <path d="M33 25L30 28L33 31L36 28L33 25Z" fill="#1E2329"/>
      </svg>
    ),
  },
  coinbase: {
    name: 'Coinbase',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#0052FF"/>
        <circle cx="24" cy="24" r="10" fill="white"/>
        <circle cx="24" cy="24" r="4" fill="#0052FF"/>
      </svg>
    ),
  },
  paypal: {
    name: 'PayPal',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M20 34L22 22H28C31 22 33 20 32.5 17.5C32 15 29 14 26 14H19L14 34H20Z" fill="#003087"/>
        <path d="M22 36L24 24H30C33 24 35 22 34.5 19.5C34 17 31 16 28 16H21L16 36H22Z" fill="#009CDE"/>
      </svg>
    ),
  },
  amazon: {
    name: 'Amazon',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M14 28C18 32 26 34 34 30" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M34 28V30L36 30" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <text x="24" y="24" textAnchor="middle" fill="#232F3E" fontFamily="Arial" fontWeight="bold" fontSize="14">a</text>
      </svg>
    ),
  },
  apple: {
    name: 'Apple ID',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M28 12C26.5 10.5 24.5 10 23 10C21 10 19.5 11 18.5 11C17.5 11 16 10 14 10.5C12 11 10 13 10 17C10 19.5 11 22 12.5 23.5C14 25 15 26 17 26C19 26 20 24.5 22.5 24.5C25 24.5 26 26 28 26C30 26 31 25 32.5 23.5C33.5 22.5 34 21.5 34 21.5C34 21.5 31 20 31 17C31 14.5 33 13 34 12.5C32 11 29.5 11 28 12Z" fill="#333"/>
        <path d="M23 11.5C24 10 25.5 9 27 9C27.5 11 26.5 13 25.5 14C24.5 15.5 23 16 22 16C21.5 14 22 12.5 23 11.5Z" fill="#333"/>
      </svg>
    ),
  },
  icloud: {
    name: 'iCloud',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="url(#ic)"/>
        <defs><linearGradient id="ic" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#36D1DC"/><stop offset="1" stopColor="#5B86E5"/></linearGradient></defs>
        <path d="M14 30C11 30 9 28 9 25.5C9 23 11 21 13.5 21C13.8 21 14 21 14.3 21.1C15.5 18 18.5 16 22 16C26.5 16 30 19 30.7 23C30.8 23 30.9 23 31 23C34.3 23 37 25.7 37 29C37 32.3 34.3 35 31 35H16C14.9 35 14 34.1 14 33V30Z" fill="white"/>
      </svg>
    ),
  },
  microsoft: {
    name: 'Microsoft',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <rect x="11" y="11" width="10" height="10" fill="#F25022"/>
        <rect x="23" y="11" width="10" height="10" fill="#7FBA00"/>
        <rect x="11" y="23" width="10" height="10" fill="#00A4EF"/>
        <rect x="23" y="23" width="10" height="10" fill="#FFB900"/>
      </svg>
    ),
  },
  telegram: {
    name: 'Telegram',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#2AABEE"/>
        <path d="M12 24L36 14L30 36L24 28L20 32L22 26L32 18L12 24Z" fill="white"/>
        <path d="M22 32L24 28L30 36L22 32Z" fill="#C6DAED"/>
      </svg>
    ),
  },
  whatsapp: {
    name: 'WhatsApp',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#25D366"/>
        <path d="M24 12C17.4 12 12 17.4 12 24C12 26.6 12.8 29 14.2 30.9L12.5 37L18.8 35.4C20.6 36.4 22.7 37 24 37C30.6 37 36 31.6 36 25C36 18.4 30.6 12 24 12Z" fill="white"/>
        <path d="M19 19C19.4 17.8 20.5 17 21.5 17C22.5 17 23.5 17.5 24 18.5C24.5 19.5 24 20 23.5 20.5C23 21 24 23 26 25C28 27 29.5 27.5 30 27C30.5 26.5 31 26 31.5 26.5C32 27 32.5 28 32 29C31.5 30 30 31.5 28 32C26 32.5 22 31 19 27C16 23 15 19 19 19Z" fill="#25D366"/>
      </svg>
    ),
  },
  youtube_premium: {
    name: 'YouTube Premium',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#FF0000"/>
        <path d="M38 18.5C37.5 16.5 36 15 34 14.5C31 13.5 24 13.5 24 13.5C24 13.5 17 13.5 14 14.5C12 15 10.5 16.5 10 18.5C9.5 21.5 9.5 24 9.5 24C9.5 24 9.5 26.5 10 29.5C10.5 31.5 12 33 14 33.5C17 34.5 24 34.5 24 34.5C24 34.5 31 34.5 34 33.5C36 33 37.5 31.5 38 29.5C38.5 26.5 38.5 24 38.5 24C38.5 24 38.5 21.5 38 18.5Z" fill="white"/>
        <path d="M21 28.5L28 24L21 19.5V28.5Z" fill="#FF0000"/>
        <circle cx="38" cy="14" r="4" fill="#FF0000" stroke="white" strokeWidth="1"/>
        <text x="38" y="16.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">P</text>
      </svg>
    ),
  },
  prime_video: {
    name: 'Amazon Prime',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#00A8E1"/>
        <text x="24" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">prime</text>
        <path d="M16 28C16 28 20 32 26 30C28 29 30 26 30 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M28 26L30 26L30 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  apple_tv: {
    name: 'Apple TV Plus',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <text x="24" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">tv+</text>
        <path d="M19 18C19 18 21 14 24 14C27 14 29 18 29 18" stroke="#A3AAAE" strokeWidth="1" fill="none"/>
      </svg>
    ),
  },
  disney: {
    name: 'Disney+',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#113CCF"/>
        <text x="24" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">D+</text>
      </svg>
    ),
  },
  hbo: {
    name: 'HBO Max',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <text x="24" y="28" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">HBO</text>
      </svg>
    ),
  },
  twitch: {
    name: 'Twitch',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#9146FF"/>
        <path d="M16 14H34V28L30 32H22L18 36V32H16V14Z" fill="white"/>
        <rect x="24" y="20" width="2" height="5" fill="#9146FF"/>
        <rect x="29" y="20" width="2" height="5" fill="#9146FF"/>
      </svg>
    ),
  },
  threads: {
    name: 'Threads',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <circle cx="24" cy="24" r="8" stroke="white" strokeWidth="2.5" fill="none"/>
        <path d="M20 28C20 30 22 32 26 31C29 30 30 28 30 25" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  pinterest: {
    name: 'Pinterest',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#E60023"/>
        <path d="M24 12C17.4 12 12 17.4 12 24C12 29 15 33 19 35C19 33 20 30 21 28C21 28 20 27 20 25C20 22 22 20 24 20C26 20 27 21.5 27 23.5C27 26 25 28 24 28C22.5 28 22 26.5 22.5 25L24 19C24.5 17 26 16 28 16C31 16 33 18.5 33 22C33 26 31 30 28 30C25 30 24 28 24 26L23 22C22.5 23.5 21 25 20 25C18 25 16 23 16 20C16 16 19 12 24 12Z" fill="white"/>
      </svg>
    ),
  },
  google: {
    name: 'Google',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M24 20V28H33C32.5 31 30 33 27 34C24 35 20 34 17 32C14 30 12 27 12 24C12 21 14 18 17 16C20 14 23 14 24 15L28 11C25.5 9 22 8 18 8C11 8 6 13 6 19C6 25 10 30 16 32C19 33 22 34 24 34C31 34 36 29 36 23C36 22 36 21 35.5 20H24Z" fill="#4285F4"/>
        <path d="M6 19C6 13 11 8 18 8C22 8 25.5 9 28 11L24 15C23 14 20 14 17 16C14 18 12 21 12 24L6 19Z" fill="#EA4335"/>
        <path d="M18 8C22 8 25.5 9 28 11L24 15C23 14 20 14 17 16L18 8Z" fill="#EA4335"/>
        <path d="M16 32C14 30 12 27 12 24L17 16C14 18 12 21 12 24C12 27 14 30 16 32Z" fill="#FBBC05"/>
        <path d="M24 34C20 34 17 32 16 32L12 24C12 27 14 30 16 32C19 33 22 34 24 34Z" fill="#34A853"/>
      </svg>
    ),
  },
  gemini: {
    name: 'Gemini',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M24 12L28 20L36 24L28 28L24 36L20 28L12 24L20 20L24 12Z" fill="url(#gem)"/>
        <defs><linearGradient id="gem" x1="12" y1="12" x2="36" y2="36"><stop stopColor="#1C7CF4"/><stop offset="1" stopColor="#1DA1F2"/></linearGradient></defs>
      </svg>
    ),
  },
  claude: {
    name: 'Claude',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#D4A574"/>
        <circle cx="24" cy="24" r="10" fill="#D4A574" stroke="#C9956B" strokeWidth="1"/>
        <circle cx="24" cy="24" r="6" fill="#E8C9A8"/>
      </svg>
    ),
  },
  deepseek: {
    name: 'DeepSeek',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#4D6BFE"/>
        <circle cx="24" cy="24" r="10" fill="white"/>
        <circle cx="24" cy="24" r="4" fill="#4D6BFE"/>
      </svg>
    ),
  },
  copilot: {
    name: 'Copilot',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="url(#cop)"/>
        <defs><linearGradient id="cop" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#7B61FF"/><stop offset="1" stopColor="#00BCF2"/></linearGradient></defs>
        <circle cx="24" cy="24" r="8" fill="white"/>
        <circle cx="24" cy="24" r="4" fill="url(#cop)"/>
      </svg>
    ),
  },
  perplexity: {
    name: 'Perplexity',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#20808D"/>
        <circle cx="24" cy="24" r="8" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="24" r="3" fill="white"/>
      </svg>
    ),
  },
  cursor: {
    name: 'Cursor',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#000"/>
        <path d="M16 14L32 24L16 34V14Z" fill="white"/>
        <path d="M20 18L32 24L20 30V18Z" fill="#333"/>
      </svg>
    ),
  },
  other_ai: {
    name: 'Other AI Accounts',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="url(#ai)"/>
        <defs><linearGradient id="ai" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#667EEA"/><stop offset="1" stopColor="#764BA2"/></linearGradient></defs>
        <text x="24" y="29" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">AI</text>
      </svg>
    ),
  },
  steam: {
    name: 'Steam',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="12" fill="#1B2838"/>
        <circle cx="24" cy="24" r="10" fill="#66C0F4"/>
        <circle cx="24" cy="24" r="5" fill="#1B2838"/>
        <circle cx="24" cy="24" r="2" fill="#66C0F4"/>
      </svg>
    ),
  },
}

export default brandIcons
