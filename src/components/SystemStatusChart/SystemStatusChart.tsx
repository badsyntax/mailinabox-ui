import { getTheme } from '@fluentui/react';
import { DonutChart, IChartDataPoint, IChartProps } from '@uifabric/charting';
import { StatusEntryType } from 'mailinabox-api';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectSummarisedChecks } from '../../features/system/statusSlice';

export const SystemStatusChart: React.FunctionComponent = () => {
  const summarisedChecks = useSelector(selectSummarisedChecks);

  const chartData: IChartDataPoint[] = [
    {
      legend: 'Passed',
      data: summarisedChecks[StatusEntryType.Ok],
      color: getTheme().palette.green,
      xAxisCalloutData: 'Passed checks',
    },
    {
      legend: 'Failed',
      data: summarisedChecks[StatusEntryType.Error],
      color: getTheme().palette.red,
      xAxisCalloutData: 'Failed checks',
    },
    {
      legend: 'Warning',
      data: summarisedChecks[StatusEntryType.Warning],
      color: getTheme().palette.yellow,
      xAxisCalloutData: 'Warning checks',
    },
  ];
  const data: IChartProps = {
    chartTitle: 'Status Checks',
    chartData,
  };
  return (
    <DonutChart
      data={data}
      innerRadius={30}
      legendsOverflowText={'overflow checks'}
      legendsOverflowProps={{ vertical: false, overflowSide: 'start' }}
      hideLegend={false}
      height={116}
      width={230}
    />
  );
};
