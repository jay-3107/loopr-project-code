import React from 'react';
import type { Transaction } from '../utils/sampleData';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="transaction-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className={transaction.type}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td className={transaction.type === 'income' ? 'income' : 'expense'}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </td>
              <td>
                <span className={`status ${transaction.status}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;