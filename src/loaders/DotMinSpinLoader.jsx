import {CSSProperties} from "react";
import {DotLoader} from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#205db4",
}

export default function DotMinSpinLoader({ loading = false, size = 20, className = 'text-center'}) {
  return (
    <DotLoader
      color='#2567c5'
      loading={loading}
      size={size}
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader" />
  )
}
