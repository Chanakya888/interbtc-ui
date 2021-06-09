
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTable } from 'react-table';
// ray test touch <<
import { Badge } from 'react-bootstrap';
// ray test touch >>
import {
  FaCheck,
  FaHourglass
} from 'react-icons/fa';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import IssueModal from './modal/IssueModal';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import BitcoinTransaction from 'common/components/bitcoin-links/transaction';
import { IssueRequestStatus } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import { formatDateTimePrecise } from 'common/utils/utils';
import { changeIssueIdAction } from 'common/actions/issue.actions';
import { showAccountModalAction } from 'common/actions/general.actions';

// ray test touch <<
const handleCompleted = (status: IssueRequestStatus) => {
  switch (status) {
  case IssueRequestStatus.RequestedRefund:
  case IssueRequestStatus.Completed: {
    return <FaCheck className='inline-block' />;
  }
  case IssueRequestStatus.Cancelled:
  case IssueRequestStatus.Expired: {
    return (
      <Badge
        className='badge-style'
        variant='secondary'>
        cancelled
      </Badge>
    );
  }
  default: {
    return <FaHourglass className='inline-block' />;
  }
  }
};
// ray test touch >>

const IssueRequests = (): JSX.Element => {
  const {
    address,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
  const [issueModalOpen, setIssueModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleIssueModalClose = () => {
    setIssueModalOpen(false);
  };

  const openWizard = () => {
    if (extensions.length && address) {
      setIssueModalOpen(true);
    } else {
      dispatch(showAccountModalAction(true));
    }
  };

  const handleRowClick = (requestId: string) => () => {
    dispatch(changeIssueIdAction(requestId));
    openWizard();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
        accessor: 'timestamp',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }) {
          return (
            <>
              {formatDateTimePrecise(new Date(Number(value)))}
            </>
          );
        }
      },
      {
        Header: t('issue_page.amount'),
        accessor: 'requestedAmountPolkaBTC',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('issue_page.btc_transaction'),
        accessor: 'btcTxId',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }) {
          // ray test touch <<
          return (
            <BitcoinTransaction
              txId={value}
              shorten />
          );
          // ray test touch >>
        }
      },
      {
        Header: t('issue_page.confirmations'),
        accessor: 'confirmations',
        classNames: [
          'text-right'
        ],
        // ray test touch <<
        Cell: function FormattedCell(props) {
          return (
            <>
              {props.row.original.btcTxId === '' ?
                t('not_applicable') :
                Math.max(props.row.original.confirmations, 0)}
            </>
          );
        }
        // ray test touch >>
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: [
          'text-left'
        ],
        // ray test touch <<
        Cell: function FormattedCell({ value }) {
          return (
            <>
              {handleCompleted(value)}
            </>
          );
        }
        // ray test touch >>
      }
    ],
    [t]
  );

  const data = issueRequests;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    }
  );

  return (
    <>
      <InterlayTableContainer
        className={clsx(
          'space-y-6',
          'container',
          'mx-auto'
        )}>
        <div>
          <h2
            className={clsx(
              'text-2xl',
              'font-bold'
            )}>
            {t('issue_page.issue_requests')}
          </h2>
          <p>
            {t('issue_page.click_on_issue_request')}
          </p>
        </div>
        <InterlayTable {...getTableProps()}>
          <InterlayThead>
            {headerGroups.map(headerGroup => (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // eslint-disable-next-line react/jsx-key
                  <InterlayTh
                    {...column.getHeaderProps([
                      {
                        className: clsx(column.classNames),
                        style: column.style
                      }
                    ])}>
                    {column.render('Header')}
                  </InterlayTh>
                ))}
              </InterlayTr>
            ))}
          </InterlayThead>
          <InterlayTbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);

              const {
                className: rowClassName,
                ...restRowProps
              } = row.getRowProps();

              return (
                // eslint-disable-next-line react/jsx-key
                <InterlayTr
                  className={clsx(
                    rowClassName,
                    'cursor-pointer'
                  )}
                  {...restRowProps}
                  onClick={handleRowClick(row.original.id)}>
                  {row.cells.map(cell => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <InterlayTd
                        {...cell.getCellProps([
                          {
                            className: clsx(cell.column.classNames),
                            style: cell.column.style
                          }
                        ])}>
                        {cell.render('Cell')}
                      </InterlayTd>
                    );
                  })}
                </InterlayTr>
              );
            })}
          </InterlayTbody>
        </InterlayTable>
      </InterlayTableContainer>
      <IssueModal
        open={issueModalOpen}
        onClose={handleIssueModalClose} />
    </>
  );
};

export default IssueRequests;
