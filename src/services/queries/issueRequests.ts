const query = `
  query ($limit: Int!, $offset: Int) {
    issues(orderBy: request_timestamp_DESC, limit: $limit, offset: $offset) {
      id
      request {
        amountWrapped
        timestamp
        height {
          absolute
          active
        }
      }
      userParachainAddress
      vaultParachainAddress
      vaultBackingAddress
      vaultWalletPubkey
      bridgeFee
      griefingCollateral
      status
      execution {
        height {
          absolute
          active
        }
        amountWrapped
        timestamp
      }
      cancellation {
        timestamp
        height {
          absolute
          active
        }
      }
    }
  }
`;

export default query;
