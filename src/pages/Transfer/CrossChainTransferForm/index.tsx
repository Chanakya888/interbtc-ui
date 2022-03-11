
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AvailableBalanceUI from 'components/AvailableBalanceUI';
import Accounts from 'components/Accounts';
import Chains, { ChainOption } from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';
import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import { showAccountModalAction } from 'common/actions/general.actions';
import { displayMonetaryAmount } from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import { ChainType } from 'types/chains';
import STATUSES from 'utils/constants/statuses';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
}

const CrossChainTransferForm = (): JSX.Element => {
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const [fromChain, setFromChain] = React.useState<ChainType | undefined>(undefined);
  const [toChain, setToChain] = React.useState<ChainOption | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [accountSet, setAccountSet] = React.useState<boolean | undefined>(undefined);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  const {
    collateralTokenTransferableBalance,
    parachainStatus,
    address
  } = useSelector((state: StoreType) => state.general);

  const handleChainChange = (chainOption: ChainOption) => {
    setToChain(chainOption);
  };

  const onSubmit = (data: CrossChainTransferFormData) => {
    setSubmitStatus(STATUSES.PENDING);
    console.log(data);
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!accountSet) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  React.useEffect(() => {
    if (!toChain) return;

    setFromChain(
      toChain.type === ChainType.Parachain ?
        ChainType.Relaychain :
        ChainType.Parachain
    );
  }, [toChain]);

  React.useEffect(() => {
    console.log(destination);
  }, [destination]);

  React.useEffect(() => {
    setAccountSet(!!address);
  }, [address]);

  return (
    <form
      className='space-y-8'
      onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>
        {t('transfer_page.cross_chain_transfer_form.title')}
      </FormTitle>
      <div>
        <AvailableBalanceUI
          label={t('transfer_page.cross_chain_transfer_form.balance')}
          balance={displayMonetaryAmount(collateralTokenTransferableBalance)}
          tokenSymbol={COLLATERAL_TOKEN_SYMBOL} />
        <div>
          <TokenField
            id={TRANSFER_AMOUNT}
            name={TRANSFER_AMOUNT}
            ref={register({
              required: {
                value: true,
                message: t('transfer_page.cross_chain_transfer_form.please_enter_amount')
              }
            })}
            error={!!errors[TRANSFER_AMOUNT]}
            helperText={errors[TRANSFER_AMOUNT]?.message}
            label={COLLATERAL_TOKEN_SYMBOL}
            approxUSD='≈ $ 0' />
        </div>
      </div>
      <div>
        Transferring from {fromChain}
      </div>
      <div>
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.to_chain')}
          callbackFunction={handleChainChange}
          defaultChain={ChainType.Parachain} />
      </div>
      <div>
        <Accounts
          label={t('transfer_page.cross_chain_transfer_form.target_account')}
          callbackFunction={setDestination} />
      </div>
      <SubmitButton
        disabled={
          parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)
        }
        pending={submitStatus === STATUSES.PENDING}
        onClick={handleConfirmClick}>
        {accountSet ? (
          t('transfer')
        ) : (
          t('connect_wallet')
        )}
      </SubmitButton>
    </form>
  );
};

export default withErrorBoundary(CrossChainTransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

