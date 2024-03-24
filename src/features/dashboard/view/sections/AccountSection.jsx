import DashHeadingCardSection from "./DashHeadingCardSection";

export default function AccountSection() {
  return (
    <DashHeadingCardSection
      isVisible
      show
      wording='Valide(s)'
      total={20}
      nb={16}
      title='Comptes Utilisaeurs'
      icon='bi bi-person-circle'/>
  )
}
