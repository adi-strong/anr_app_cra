import DashHeadingCardSection from "./DashHeadingCardSection";

export default function ConsultationSection() {
  return (
    <DashHeadingCardSection
      show
      isVisible
      total={18}
      nb={2}
      title='Fiches'
      wording='Completé(e)'
      icon='bi bi-folder-fill'/>
  )
}
