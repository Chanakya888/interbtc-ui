import { CollateralCurrencyExt, CollateralIdLiteral } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { CoinPair, CTALink, H3, H4, Stack } from '@/component-library';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { URL_PARAMETERS } from '@/utils/constants/links';

import { withStep } from './Step';
import { StepComponentProps } from './types';

type Props = {
  collateralCurrency: CollateralCurrencyExt;
};

type VaultCreatedStepProps = StepComponentProps & Props;

const VaultCreatedStep = ({ collateralCurrency }: VaultCreatedStepProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();

  return (
    <Stack spacing='double' alignItems='center'>
      <H3>{t('vault.vault_created')}</H3>
      <Stack alignItems='center'>
        <CoinPair
          coinOne={collateralCurrency.ticker as CollateralIdLiteral}
          coinTwo={WRAPPED_TOKEN_SYMBOL}
          size='large'
        />
        <H4 color='tertiary'>
          {collateralCurrency.ticker} - {WRAPPED_TOKEN_SYMBOL}
        </H4>
      </Stack>
      <CTALink size='large' fullWidth to={`${accountAddress}/${collateralCurrency.ticker}/${WRAPPED_TOKEN_SYMBOL}`}>
        {t('vault.view_vault')}
      </CTALink>
    </Stack>
  );
};

const componentStep = 3 as const;

export default withStep(VaultCreatedStep, componentStep);
