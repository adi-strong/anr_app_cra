import DashHeadingCardSection from "./DashHeadingCardSection";
import {useEffect} from "react";
import toast from "react-hot-toast";
import {useGetCountUsersQuery} from "../../../staff/model/user.api.slice";

export default function AccountstSection() {
  const {data, isFetching, isError, error, refetch} = useGetCountUsersQuery()
  
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
      md={3}
      onRefresh={onRefresh}
      to='/app/users'
      total={!isError && data ? data.countAll : 0}
      nb={!isError && data ? data.countActives : 0}
      loader={isFetching}
      wording='Actif(s)'
      title='Comptes utilisateurs'
      icon='bi bi-people-fill'/>
  )
}
