import DashHeadingCardSection from "./DashHeadingCardSection";
import {useEffect} from "react";
import toast from "react-hot-toast";
import {useGetCountMissionsQuery} from "../../../staff/model/mission.api.service";

export default function MissionsSection() {
  const {data, isFetching, isError, error, refetch} = useGetCountMissionsQuery()
  
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
      md={3}
      onRefresh={onRefresh}
      wording='Terminée(s)'
      loader={isFetching}
      total={!isError && data ? data.countAll : 0}
      nb={!isError && data ? data.countFinished : 0}
      title='Missions'
      icon='bi bi-person-circle'/>
  )
}
