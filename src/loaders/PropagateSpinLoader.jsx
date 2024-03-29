import {CSSProperties} from "react";
import {PropagateLoader} from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#205db4",
}

export default function PropagateSpinLoader({ loading = false, className = 'text-center'}) {
  return (
    <div className={className}>
      <PropagateLoader
        color='#2567c5'
        loading={loading}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader" />
    </div>
  )
}
