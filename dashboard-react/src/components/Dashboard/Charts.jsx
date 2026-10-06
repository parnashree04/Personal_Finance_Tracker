import React from 'react';
import './Charts.css';

const Charts = ({
  transactions = [],
  chartPeriod = 'Daily',
  onPeriodChange
}) => {
  const today = new Date();

  // Convert date to YYYY-MM-DD
  const getDateString = (date) => {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  // Get income and expense for a specific date
  const getTotalsForDate = (dateString) => {
    const dayTransactions = transactions.filter(
      (transaction) =>
        String(transaction.transaction_date).slice(0, 10) ===
        dateString
    );

    const income = dayTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    const expense = dayTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

    return {
      income,
      expense
    };
  };

  // Create chart data according to selected period
  const getChartData = () => {

    // DAILY - LAST 5 DAYS
    if (chartPeriod === 'Daily') {
      return Array.from({ length: 5 }, (_, index) => {
        const date = new Date(today);

        date.setDate(
          today.getDate() - (4 - index)
        );

        const dateString = getDateString(date);
        const totals = getTotalsForDate(dateString);

        return {
          label: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          income: totals.income,
          expense: totals.expense
        };
      });
    }

    // WEEKLY - LAST 7 DAYS
    if (chartPeriod === 'Weekly') {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);

        date.setDate(
          today.getDate() - (6 - index)
        );

        const dateString = getDateString(date);
        const totals = getTotalsForDate(dateString);

        return {
          label: date.toLocaleDateString('en-US', {
            weekday: 'short'
          }),
          income: totals.income,
          expense: totals.expense
        };
      });
    }

    // MONTHLY - CURRENT YEAR
    if (chartPeriod === 'Monthly') {
      return Array.from({ length: 12 }, (_, monthIndex) => {
        let income = 0;
        let expense = 0;

        transactions.forEach((transaction) => {
          const transactionDate = String(
            transaction.transaction_date
          ).slice(0, 10);

          const [year, month] = transactionDate
            .split('-')
            .map(Number);

          if (
            year === today.getFullYear() &&
            month === monthIndex + 1
          ) {
            if (transaction.type === 'income') {
              income += Number(transaction.amount);
            }

            if (transaction.type === 'expense') {
              expense += Number(transaction.amount);
            }
          }
        });

        return {
          label: new Date(
            today.getFullYear(),
            monthIndex,
            1
          ).toLocaleDateString('en-US', {
            month: 'short'
          }),
          income,
          expense
        };
      });
    }

    return [];
  };

  const chartData = getChartData();

  // Find the largest individual value
  const maxChartValue = Math.max(
    ...chartData.flatMap((item) => [
      item.income,
      item.expense
    ]),
    1
  );

  // Keep small transactions visible
  const getBarHeight = (value) => {
    if (value === 0) {
      return 0;
    }

    const percentage =
      (value / maxChartValue) * 100;

    return Math.max(percentage, 4);
  };

  const hasDataInPeriod = chartData.some(
    (item) =>
      item.income > 0 ||
      item.expense > 0
  );

  return (
    <div className="chart-card">

      <div className="chart-header">

        <h3>Income vs Expenses</h3>

        <div className="chart-controls">

          <button
            className={
              chartPeriod === 'Daily'
                ? 'active'
                : ''
            }
            onClick={() =>
              onPeriodChange('Daily')
            }
          >
            Daily
          </button>

          <button
            className={
              chartPeriod === 'Weekly'
                ? 'active'
                : ''
            }
            onClick={() =>
              onPeriodChange('Weekly')
            }
          >
            Weekly
          </button>

          <button
            className={
              chartPeriod === 'Monthly'
                ? 'active'
                : ''
            }
            onClick={() =>
              onPeriodChange('Monthly')
            }
          >
            Monthly
          </button>

        </div>

        <div className="chart-legend">

          <span className="legend-item">
            <span className="dot income"></span>
            Income
          </span>

          <span className="legend-item">
            <span className="dot expense"></span>
            Expense
          </span>

        </div>

      </div>

      {transactions.length === 0 ? (

        <div
          style={{
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            textAlign: 'center'
          }}
        >

          <div
            style={{
              fontSize: '2rem',
              marginBottom: '0.5rem'
            }}
          >
            📊
          </div>

          <strong>
            No transaction data yet
          </strong>

          <span
            style={{
              fontSize: '0.85rem',
              marginTop: '0.25rem'
            }}
          >
            Add income or expenses to see
            your chart.
          </span>

        </div>

      ) : !hasDataInPeriod ? (

        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            textAlign: 'center'
          }}
        >
          No transactions in this period.
        </div>

      ) : (

        <div className="bar-chart">

          {chartData.map((data, index) => (

            <div
              className="bar-group"
              key={`${data.label}-${index}`}
            >

              <div className="bars">

                {/* Income */}
                <div
                  className="bar income"
                  style={{
                    height: `${getBarHeight(
                      data.income
                    )}%`
                  }}
                  title={`Income: ₹${data.income.toLocaleString(
                    'en-IN'
                  )}`}
                ></div>

                {/* Expense */}
                <div
                  className="bar expense"
                  style={{
                    height: `${getBarHeight(
                      data.expense
                    )}%`
                  }}
                  title={`Expense: ₹${data.expense.toLocaleString(
                    'en-IN'
                  )}`}
                ></div>

              </div>

              <span className="month-label">
                {data.label}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Charts;