import React, { useState, useEffect } from 'react';
import { getTransaction } from "../function/getTransaction";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export const ChartWidget = ({ uid }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [pieFilter, setPieFilter] = useState('All');


  const theme = useTheme();
  const isXxsScreen = useMediaQuery('(max-width:400px)');
  const isXsScreen = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isBelow800px = useMediaQuery('(max-width:799px)');
  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Bar & pie size on screen
  const getChartDimensions = () => {
    if (isXxsScreen) {
      return { 
        barWidth: 350, 
        barHeight: 180, 
        pieWidth: 300,
        pieHeight: 200, 
        gap: 0
      };
    } else if (isXsScreen) {
      return { 
        barWidth: 350, 
        barHeight: 200, 
        pieWidth: 350, 
        pieHeight: 200, 
        gap: 0
      };
    } else if (isSmScreen) {
      return { 
        barWidth: 350, 
        barHeight: 250, 
        pieWidth: 400, 
        pieHeight: 200, 
        gap: 1
      };
    } else if (isMdScreen) {
      return { 
        barWidth: 400, 
        barHeight: 250, 
        pieWidth: 450, 
        pieHeight: 200, 
        gap: 3
      };
    } else {
      return { 
        barWidth: 500, 
        barHeight: 300, 
        pieWidth: 450, 
        pieHeight: 200, 
        gap: 2
      };
    }
  };

  const { barWidth, barHeight, pieWidth, pieHeight, gap } = getChartDimensions();

  // fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await getTransaction(uid);
      setTransactions(fetchedTransactions);
    };
    fetchTransactions();
  }, [uid]);

  const years = ['All Year', ...new Set(transactions.map(t => t.date.split('-')[0]))]
    .sort((a, b) => a === 'All Year' ? -1 : b - a);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const months = selectedYear === 'All Year' || selectedYear === '' 
    ? []
    : [...Array(selectedYear === currentYear.toString() ? currentMonth : 12).keys()]
        .map(i => i + 1);

  // get data for bar chart
  const getBarChartData = () => {
    let xAxisData = [];
    let incomeData = [];
    let expensesData = [];

    if (selectedYear === 'All Year') {
      const yearlyData = {};
      transactions.forEach(t => {
        const year = t.date.split('-')[0];
        yearlyData[year] = yearlyData[year] || { income: 0, expenses: 0 };
        if (t.transaction === 'Income') {
          yearlyData[year].income += t.convertedAmount;
        } else if (t.transaction === 'Expenses') {
          yearlyData[year].expenses += t.convertedAmount;
        }
      });
      xAxisData = Object.keys(yearlyData);
      incomeData = Object.values(yearlyData).map(d => d.income);
      expensesData = Object.values(yearlyData).map(d => d.expenses);
    } else if (selectedYear && !selectedMonth) {
      const monthlyData = Array(12).fill().map(() => ({ income: 0, expenses: 0 }));
      transactions
        .filter(t => t.date.split('-')[0] === selectedYear)
        .forEach(t => {
          const month = parseInt(t.date.split('-')[1]) - 1;
          if (t.transaction === 'Income') {
            monthlyData[month].income += t.convertedAmount;
          } else if (t.transaction === 'Expenses') {
            monthlyData[month].expenses += t.convertedAmount;
          }
        });
      xAxisData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      incomeData = monthlyData.map(d => d.income);
      expensesData = monthlyData.map(d => d.expenses);
    } else {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dailyData = Array(daysInMonth).fill().map(() => ({ income: 0, expenses: 0 }));
      transactions
        .filter(t => {
          const [year, month] = t.date.split('-');
          return year === selectedYear && parseInt(month) === parseInt(selectedMonth);
        })
        .forEach(t => {
          const day = parseInt(t.date.split('-')[2]) - 1;
          if (t.transaction === 'Income') {
            dailyData[day].income += t.convertedAmount;
          } else if (t.transaction === 'Expenses') {
            dailyData[day].expenses += t.convertedAmount;
          }
        });
      xAxisData = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      incomeData = dailyData.map(d => d.income);
      expensesData = dailyData.map(d => d.expenses);
    }

    return { xAxisData, incomeData, expensesData };
  };

  // get data for pie chart
  const getPieChartData = () => {
    const filtered = transactions.filter(t => {
      const [year, month] = t.date.split('-');
      return (selectedYear === 'All Year' || year === selectedYear) &&
             (!selectedMonth || parseInt(month) === parseInt(selectedMonth));
    });

    let pieData;
    if (pieFilter === 'All') {
      const totals = filtered.reduce((acc, t) => {
        if (t.transaction === 'Income') acc.income += t.convertedAmount;
        else if (t.transaction === 'Expenses') acc.expenses += t.convertedAmount;
        return acc;
      }, { income: 0, expenses: 0 });
      pieData = [
        { id: 0, value: totals.income, label: 'Income', color: '#1976d2' },
        { id: 1, value: totals.expenses, label: 'Expenses', color: '#d32f2f' }
      ];
    } else {
      const typeData = {};
      filtered
        .filter(t => t.transaction === pieFilter)
        .forEach(t => {
          typeData[t.type] = (typeData[t.type] || 0) + t.convertedAmount;
        });

      // convert to array & sort by value
      let typeArray = Object.entries(typeData).map(([type, value], index) => ({
        id: index,
        value,
        label: type,
        color: `hsl(${index * 60}, 70%, 50%)`
      })).sort((a, b) => b.value - a.value);

      // grp small slices into "Other"
      const maxSlices = 6;
      if (typeArray.length > maxSlices) {
        const other = typeArray.slice(maxSlices - 1).reduce((acc, curr) => ({
          id: maxSlices,
          value: acc.value + curr.value,
          label: 'Other',
          color: `hsl(${maxSlices * 60}, 70%, 50%)`
        }), { value: 0 });
        typeArray = [...typeArray.slice(0, maxSlices - 1), other];
      }

      pieData = typeArray;
    }

    // calc total sum of all values for %
    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    // add % to each item for display in labels
    return {
      pieData: pieData.map(item => ({
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0,
      })),
      total,
    };
  };

  const { xAxisData, incomeData, expensesData } = getBarChartData();
  const { pieData, total } = getPieChartData();

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexDirection: isXxsScreen ? 'column' : 'row',
      }}>
        <Typography variant="h5" fontWeight="bold">Transaction Charts</Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          {/* year & month dropdown */}
          <FormControl sx={{ minWidth: 100, width: { xs: '100%', sm: 100 } }}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                if (e.target.value === 'All Year') setSelectedMonth('');
              }}
              label="Year"
              sx={{ height: 40, fontSize: '0.9rem' }}
            >
              {years.map(year => (
                <MenuItem key={year} value={year} sx={{ fontSize: '0.9rem' }}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100, width: { xs: '100%', sm: 100 } }}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
              disabled={selectedYear === 'All Year'}
              sx={{ height: 40, fontSize: '0.9rem' }}
            >
              <MenuItem value="" sx={{ fontSize: '0.9rem' }}>All</MenuItem>
              {months.map(month => (
                <MenuItem key={month} value={month} sx={{ fontSize: '0.9rem' }}>
                  {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexDirection: isBelow800px ? 'column' : 'row',
        gap: gap,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: barWidth,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: xAxisData }]}
            series={[
              { data: incomeData, label: 'Income', color: '#1976d2' },
              { data: expensesData, label: 'Expenses', color: '#d32f2f' }
            ]}
            width={barWidth}
            height={barHeight}
          />
        </Box>

        {/* Pie & filter */}
        <Box sx={{ 
          width: '100%',
          maxWidth: pieWidth,
        }}>
          <FormControl sx={{ 
            mb: 2, 
            minWidth: 100,
            width: { xs: '100%', sm: 100 },
            mx: 'auto'
          }}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Filter</InputLabel>
            <Select
              value={pieFilter}
              onChange={(e) => setPieFilter(e.target.value)}
              label="Filter"
              sx={{ height: 30, fontSize: '0.9rem' }}
            >
              <MenuItem value="All" sx={{ fontSize: '0.9rem' }}>All</MenuItem>
              <MenuItem value="Income" sx={{ fontSize: '0.9rem' }}>Income</MenuItem>
              <MenuItem value="Expenses" sx={{ fontSize: '0.9rem' }}>Expenses</MenuItem>
            </Select>
          </FormControl>
          <PieChart
            series={[{
              data: pieData,
              arcLabel: isXxsScreen ? () => '' : (item) => `${item.percentage.toFixed(1)}%`,
              arcLabelMinAngle: 45,
              arcLabelRadius: isXsScreen ? '70%' : '60%',
              innerRadius: 0,
              outerRadius: isXxsScreen ? 80 : 100, // radius to fit labels
              paddingAngle: pieData.length > 4 ? 2 : 0, // padding for many slices
              highlightScope: { faded: 'global', highlighted: 'item' },
            }]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: 'bold',
                fontSize: isXxsScreen ? '0.7rem' : '0.8rem',
              },
            }}
            width={pieWidth}
            height={pieHeight}
            margin={{ right: isXxsScreen ? 100 : 150 }} // space for labels
          />
        </Box>
      </Box>
    </Box>
  );
};