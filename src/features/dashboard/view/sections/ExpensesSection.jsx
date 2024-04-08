import DashHeadingCardSection from "./DashHeadingCardSection";
import {useEffect} from "react";
import toast from "react-hot-toast";
import {useGetThisYearExpensesQuery} from "../../../finances/model/expenses.api.slice";

export default function ExpensesSection() {
  const {data, isFetching, isError, error, refetch} = useGetThisYearExpensesQuery()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const onRefresh = async () => await refetch()
  
  return (
    <DashHeadingCardSection
      isVisible
      md={3}
      loader={isFetching}
      onRefresh={onRefresh}
      to='/app/expenses-reports'
      total={!isError && data
        ? <>{data.currency} {parseFloat(data.sum).toFixed(2)}</>
        : <>{!isError && data && data.currency} 0</>}
      title='Dépenses'
      icon='bi bi-currency-exchange'/>
  )
}
