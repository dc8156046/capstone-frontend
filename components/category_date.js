import * as React from 'react';
import { LineChart } from '@mui/x-charts';


const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function DateChart() {
  return (
    <div className="bg-white p-4 rounded-lg shadow ">
      <h2 className="text-xl font-bold text-[#444444] mb-4">
      {" "}
      Project Category Duration Comparison
      </h2>
      
      <LineChart
        width={500}
        height={300}
        series={[
          { data: pData, label: 'pv', yAxisId: 'leftAxisId' },
          { data: uData, label: 'uv', yAxisId: 'rightAxisId' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
        rightAxis="rightAxisId"
      />
    </div>
  );
}
