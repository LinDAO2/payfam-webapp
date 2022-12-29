export type IChartTimeFrame =
| "Today"
| "This week"
| "This Month"
| "This Year"
| "Last 30 days"
| "Last 90 days";


  export interface IBarChartData<T> {
    key: string;
    data: T[];
  }
