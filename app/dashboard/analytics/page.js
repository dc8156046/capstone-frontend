import BiaxialLineChart from '@/components/category_budget.js';
import DateChart from '@/components/category_date.js';

export default function AnalyticsPage() {
  return <div>AnalyticsPage
    <h1>Category_budget</h1>
    <BiaxialLineChart />
    <h1>Category_date</h1>
    <DateChart />
  </div>
  ;
}
