import DashHeadingCardSection from "./DashHeadingCardSection";
import {useGetCountAgentsQuery} from "../../../staff/model/agent.api.slice";
import {useEffect} from "react";
import toast from "react-hot-toast";

export default function AgentsSection() {
  const {data, isFetching, isError, error, refetch} = useGetCountAgentsQuery()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const onRefresh = async () => await refetch()
  
  return (
    <DashHeadingCardSection
      show
      isVisible
      onRefresh={onRefresh}
      md={3}
      total={!isError && data ? data.countAll : 0}
      nb={!isError && data ? data.countActives : 0}
      loader={isFetching}
      to='/app/active-agents'
      title='Agents'
      wording='Actif(s)'
      icon='bi bi-people'/>
  )
}
