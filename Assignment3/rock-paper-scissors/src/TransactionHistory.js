import React from "react";

const TransactionHistory = ({ history }) => {
  if (!history.length) return <p>No transactions yet.</p>;

  return (
    <div>
      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {history.map((txn, index) => (
            <tr key={index}>
              <td>{txn.type}</td>
              <td>{txn.amount || "N/A"} ETH</td>
              <td>{txn.status}</td>
              <td>{txn.timestamp}</td>
              <td>
                <a
                  href={`https://testnet.bscscan.com/tx/${txn.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {txn.transactionHash}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
