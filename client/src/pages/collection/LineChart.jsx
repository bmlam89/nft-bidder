import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)
const LineChart = (props) => {
  let data = {
    type: 'line',
    labels: props.collection.timeseries.map(() => ''),
    datasets: [{
      data: props.collection.timeseries.map(data => data.floor_price).concat([props.collection.stats.floor_price]),
      pointRadius: 0,
      borderColor: props.collection.dailyChange < 0 ? 'red' : props.collection.dailyChange > 0 ? 'green' : 'white',
      borderWidth: 2,
      borderJoinStyle: 'round',
      tension: .1,
    }]      
  };
  let options = {
    aspectRatio: 1.75,
    responsive:true,
    layout: {
      padding: 8
    },
    scales:{
      x:{
        grid: {
          color: 'transparent',
          drawBorder: true,
          borderColor: 'rgb(63 63 70)',
          circular: true,
        },
        ticks:{
          callback: (val,idx) => {
            return idx % 12 === 0 ? '    ' : ' '
          },
          display: false,
        }
      },
      y:{
        grid: {
          color: 'rgb(63 63 70)',
          drawBorder: true,
          borderColor: 'rgb(63 63 70)',
          circular: true,
          tickLength: 2
        },
        ticks:{
          callback: (val,idx) => {
            return idx % 2 === 0 ? +val.toFixed(2) : ''
          },
        }
      }
    }
  }
  
  return ( 
    <div 
      key='line-chart-wrapper'
      className='flex shadow-sm shadow-slate-700 pr-1 pb-4'
    >
      <Line data={ data } options={ options }/> 
    </div>
  )
};

export default LineChart;


  /*let now = new Date(Date.now());
  now.setMinutes(now.getMinutes()+30);
  now.setMinutes(0,0,0);
  let current = new Date(Date.now());
  current.setMinutes(current.getMinutes()+30);
  current.setMinutes(0,0,0);
  current = (new Date(current)).toLocaleString('en-US', { hour: 'numeric', hour12: true });
  //let timestamp = idx % 8 === 1 ? timestamp.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' }) : '';*/