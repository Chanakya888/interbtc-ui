import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Alert, DlGroup, Dt } from '@/component-library';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { isBorrowAsset } from '../../utils/is-loan-asset';
import { LTVMeter } from '../LTVMeter.tsx';
import { StyledDd, StyledDl } from './BorrowLimit.style';

type BorrowLimitProps = {
  loanAction: LoanAction;
  asset: LoanAsset;
  actionAmount: MonetaryAmount<CurrencyExt>;
  prices: Prices | undefined;
  shouldDisplayLiquidationAlert?: boolean;
};

const BorrowLimit = ({
  loanAction,
  asset,
  actionAmount,
  prices,
  shouldDisplayLiquidationAlert
}: BorrowLimitProps): JSX.Element | null => {
  const { t } = useTranslation();

  const { data: currentBorrowLimit, getBorrowLimitUSD } = useAccountBorrowLimit();
  const { data: currentLTV, getLTV } = useGetLTV();

  const newBorrowLimit = getBorrowLimitUSD({ type: loanAction, amount: actionAmount, asset });
  const newLTV = getLTV({ type: loanAction, amount: actionAmount });

  if (!currentLTV || !newLTV || !currentBorrowLimit || !newBorrowLimit) {
    return null;
  }

  const hasLiquidationAlert = shouldDisplayLiquidationAlert && isBorrowAsset(loanAction) && newLTV.status === 'error';

  const currentLTVLabel = formatPercentage(currentLTV.value);
  const newLTVLabel = formatPercentage(newLTV.value);

  const currentBorrowLimitLabel = formatUSD(currentBorrowLimit.toNumber(), { compact: true });
  const newBorrowLimitLabel = formatUSD(newBorrowLimit.toNumber(), { compact: true });

  const assetPrice = getTokenPrice(prices, asset.currency.ticker);
  const capacityUSD = asset.availableCapacity.toBig().mul(assetPrice?.usd || 0);
  const isExceedingBorrowingLiquidity = loanAction === 'borrow' && newBorrowLimit.gt(capacityUSD);

  return (
    <StyledDl direction='column'>
      {isExceedingBorrowingLiquidity && (
        <Alert status='warning'>
          The available liquidity to borrow {asset.currency.ticker} is lower than your borrow limit. You can borrow at
          most {displayMonetaryAmount(asset.availableCapacity)} {asset.currency.ticker}.
        </Alert>
      )}
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow Limit</Dt>
        <StyledDd $status={newLTV.status}>
          {currentBorrowLimit && (
            <>
              <span>{currentBorrowLimitLabel}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{newBorrowLimitLabel}</span>
        </StyledDd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>LTV</Dt>
        <StyledDd $status={newLTV.status}>
          {currentLTV && (
            <>
              <span>{currentLTVLabel}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{newLTVLabel}</span>
        </StyledDd>
      </DlGroup>
      <LTVMeter value={newLTV.value} ranges={newLTV.ranges} />
      {hasLiquidationAlert && (
        <Alert status='error'>
          {t('loans.action_liquidation_risk', {
            action: loanAction === 'borrow' ? t('loans.borrowing') : t('loans.withdrawing')
          })}
        </Alert>
      )}
    </StyledDl>
  );
};

export { BorrowLimit };
export type { BorrowLimitProps };
