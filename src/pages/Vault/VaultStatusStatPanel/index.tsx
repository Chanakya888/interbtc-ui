
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { AccountId } from '@polkadot/types/interfaces';
import { VaultExt } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import ErrorFallback from 'components/ErrorFallback';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { BTCToCollateralTokenRate } from 'types/currency.d';
import { StoreType } from 'common/types/util.types';

interface Props {
  vaultAccountId: AccountId;
}

const VaultStatusStatPanel = ({
  vaultAccountId
}: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    data: vaultExt,
    error: vaultExtError
  } = useQuery<VaultExt<BitcoinUnit>, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'get',
      vaultAccountId,
      COLLATERAL_TOKEN_ID_LITERAL
    ],
    genericFetcher<VaultExt<BitcoinUnit>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(vaultExtError);
  // ray test touch <<
  console.log('[VaultStatusStatPanel] vaultExt => ', vaultExt);
  // ray test touch >>

  // ray test touch <<
  const {
    // isIdle: currentActiveBlockNumberIdle,
    // isLoading: currentActiveBlockNumberLoading,
    // data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'system',
      'getCurrentActiveBlockNumber'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(currentActiveBlockNumberError);

  const {
    // isIdle: liquidationCollateralThresholdIdle,
    // isLoading: liquidationCollateralThresholdLoading,
    // data: liquidationCollateralThreshold,
    error: liquidationCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getLiquidationCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(liquidationCollateralThresholdError);

  const {
    // isIdle: secureCollateralThresholdIdle,
    // isLoading: secureCollateralThresholdLoading,
    // data: secureCollateralThreshold,
    error: secureCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getSecureCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(secureCollateralThresholdError);

  const {
    // isIdle: btcToCollateralTokenRateIdle,
    // isLoading: btcToCollateralTokenRateLoading,
    // data: btcToCollateralTokenRate,
    error: btcToCollateralTokenRateError
  } = useQuery<
    BTCToCollateralTokenRate,
    Error
  >(
    [
      GENERIC_FETCHER,
      'oracle',
      'getExchangeRate',
      COLLATERAL_TOKEN
    ],
    genericFetcher<BTCToCollateralTokenRate>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcToCollateralTokenRateError);
  // ray test touch >>

  return (
    <>VaultStatusStatPanel</>
  );
};

export default withErrorBoundary(VaultStatusStatPanel, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
