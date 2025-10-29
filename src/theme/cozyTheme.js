export const CozyPalette = {
  light: {
    background: '#F6F3EA', // cream
    surface: '#FFFFFF',
    text: '#374151',
    secondaryText: '#6B7280',
    accent: '#FFB4A2',
    sky: '#BEE3F8',
    green: '#CDE8C5',
    shadow: 'rgba(149, 157, 165, 0.2)'
  },
  dark: {
    background: '#0E1422',
    text: '#E8E6E3',
    secondaryText: '#B8C0CC',
    accent: '#FFB070',
    sky: '#6B7AA0',
    green: '#2A3A2E',
    shadow: 'rgba(0, 0, 0, 0.35)'
  }
};

export function gradientForCondition(condition, isDark) {
  const c = String(condition || '').toLowerCase();
  if (c.includes('clear')) {
    return isDark
      ? ['#1A2138', '#2A2F4A']
      : ['#FFF3C4', '#FFE0B5'];
  }
  if (c.includes('cloud')) {
    return isDark
      ? ['#1B2433', '#263143']
      : ['#DDE9F6', '#C7D6EA'];
  }
  if (c.includes('rain') || c.includes('drizzle')) {
    return isDark
      ? ['#0F1B2D', '#1C2A3A']
      : ['#CFE7F3', '#B7D4E7'];
  }
  if (c.includes('thunder')) {
    return isDark
      ? ['#1B1B2F', '#301B3F']
      : ['#E3D1F8', '#F8D1E3'];
  }
  if (c.includes('snow')) {
    return isDark
      ? ['#152030', '#1E2B3C']
      : ['#EAF6FF', '#DCEFFD'];
  }
  return isDark ? ['#101826', '#172235'] : ['#EDEAE3', '#E2E8F0'];
}

export function iconForCondition(condition) {
  const c = String(condition || '').toLowerCase();
  if (c.includes('clear')) return 'weather-sunny';
  if (c.includes('cloud')) return 'weather-cloudy';
  if (c.includes('rain')) return 'weather-rainy';
  if (c.includes('drizzle')) return 'weather-pouring';
  if (c.includes('snow')) return 'weather-snowy';
  if (c.includes('thunder')) return 'weather-lightning';
  if (c.includes('mist') || c.includes('fog')) return 'weather-fog';
  return 'weather-partly-cloudy';
}


