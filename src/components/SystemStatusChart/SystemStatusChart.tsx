import React from 'react';
import { useSelector } from 'react-redux';
import { IChartDataPoint, IChartProps, DonutChart } from '@uifabric/charting';
import { StatusEntryTypeEnum } from 'mailinabox-api';
import { getTheme } from '@fluentui/react';
import { selectSummarisedChecks } from '../../features/system/statusSlice';

export const SystemStatusChart: React.FunctionComponent = () => {
  const summarisedChecks = useSelector(selectSummarisedChecks);

  const chartData: IChartDataPoint[] = [
    {
      legend: 'Passed',
      data: summarisedChecks[StatusEntryTypeEnum.Ok],
      color: getTheme().palette.green,
      xAxisCalloutData: 'Passed checks',
    },
    {
      legend: 'Failed',
      data: summarisedChecks[StatusEntryTypeEnum.Error],
      color: getTheme().palette.red,
      xAxisCalloutData: 'Failed checks',
    },
    {
      legend: 'Warning',
      data: summarisedChecks[StatusEntryTypeEnum.Warning],
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
