import React, { lazy, Suspense, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import Loading from '../Loading'

const Line = lazy(() => import('./LineChartWrapper'))

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HistoryChart: React.FC = () => {
  const { historyData, historyError } = useContext(PastLotteryDataContext)
  const theme = useContext(ThemeContext)

  const getDataArray = (kind) => {
    return historyData
      .map((dataPoint) => {
        return dataPoint[kind]
      })
      .reverse()
  }

  const lineStyles = ({ color }) => {
    return {
      borderColor: color,
      fill: false,
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
    }
  }

  const chartData = {
    labels: getDataArray('lotteryNumber'),
    datasets: [
      {
        label: 'Pool Size',
        data: getDataArray('poolSize'),
        yAxisID: 'y-axis-pool',
        ...lineStyles({ color: theme.colors.textSubtle }),
      },
      {
        label: 'Burned',
        data: getDataArray('burned'),
        yAxisID: 'y-axis-burned',
        ...lineStyles({ color: theme.colors.primary }),
      },
    ],
  }

  const axesStyles = ({ color, lineHeight }) => {
    return {
      borderCapStyle: 'round',
      gridLines: { display: false },
      ticks: {
        fontFamily: 'Rubik, sans-serif',
        fontColor: color,
        fontSize: 14,
        lineHeight,
        maxRotation: 0,
        beginAtZero: true,
        autoSkipPadding: 15,
        userCallback: (value) => {
          return value.toLocaleString()
        },
      },
    }
  }


  const options = {
    legend: { display: false },
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-pool',
          ...axesStyles({ color: theme.colors.textSubtle, lineHeight: 1.6 }),
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-burned',
          ...axesStyles({ color: theme.colors.primary, lineHeight: 1.5 }),
        },
      ],
      xAxes: [
        {
          ...axesStyles({ color: theme.colors.contrast, lineHeight: 1 }),
        },
      ],
    },
  }

  return (
    <>
      {historyError && (
        <InnerWrapper>
          <Text>Error fetching data</Text>
        </InnerWrapper>
      )}
      {!historyError && historyData.length >= 1 ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Line data={chartData} options={options} type="line" />
        </Suspense>
      ) : (
        <InnerWrapper>
          <Loading />
        </InnerWrapper>
      )}
    </>
  )
}

export default HistoryChart
