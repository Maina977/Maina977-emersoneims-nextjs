export const formatCurrency = (amount: number, currency: string = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDepth = (meters: number): string => {
  return `${meters.toFixed(0)} meters (${(meters * 3.28084).toFixed(0)} feet)`;
};

export const formatYield = (m3PerHour: number): string => {
  return `${m3PerHour.toFixed(1)} m³/hour (${(m3PerHour * 4.40287).toFixed(1)} GPM)`;
};