import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN, GOVERNANCE_TOKEN_SYMBOL, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type UseDepositCollateral = {
  collateral: {
    currency: CurrencyExt;
    isGovernanceToken: boolean;
    price: {
      usd: number;
    };
    balance: {
      amount: string;
      usd: string;
      raw: MonetaryAmount<CurrencyExt>;
    };
    min: {
      amount: string;
      usd: string;
      raw: MonetaryAmount<CurrencyExt>;
    };
  };
  governance: {
    raw: MonetaryAmount<CurrencyExt>;
  };
  fee: {
    amount: string;
    usd: string;
    raw: MonetaryAmount<CurrencyExt>;
  };
};

const useDepositCollateral = (
  collateralCurrency: CollateralCurrencyExt,
  minCollateral: MonetaryAmount<CollateralCurrencyExt>
): UseDepositCollateral => {
  const { getAvailableBalance, getBalance } = useGetBalances();
  const prices = useGetPrices();

  const collateralUSDAmount = getTokenPrice(prices, collateralCurrency.ticker)?.usd || 0;

  const isGovernanceCollateral = collateralCurrency === GOVERNANCE_TOKEN;
  const freeGovernanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const collateralTokenBalance =
    getAvailableBalance(collateralCurrency.ticker) || newMonetaryAmount(0, collateralCurrency);

  return {
    collateral: {
      currency: collateralCurrency,
      isGovernanceToken: isGovernanceCollateral,
      price: {
        usd: collateralUSDAmount
      },
      balance: {
        amount: collateralTokenBalance.toString(),
        usd: displayMonetaryAmountInUSDFormat(collateralTokenBalance, collateralUSDAmount),
        raw: collateralTokenBalance
      },
      min: {
        amount: displayMonetaryAmount(minCollateral),
        usd: displayMonetaryAmountInUSDFormat(minCollateral, collateralUSDAmount),
        raw: minCollateral
      }
    },
    fee: {
      amount: displayMonetaryAmount(TRANSACTION_FEE_AMOUNT),
      usd: displayMonetaryAmountInUSDFormat(
        TRANSACTION_FEE_AMOUNT,
        getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
      ),
      raw: TRANSACTION_FEE_AMOUNT
    },
    governance: {
      raw: freeGovernanceBalance
    }
  };
};

export { useDepositCollateral };
