const getFormatUSDNotation = (amount: number) => {
  const amountLength = amount.toFixed(0).length;

  return amountLength >= 6 ? 'compact' : 'standard';
};

const formatUSD = (amount: number, options?: { compact?: boolean }): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: options?.compact ? getFormatUSDNotation(amount) : undefined
  });

  return format(amount);
};

export { formatUSD };
