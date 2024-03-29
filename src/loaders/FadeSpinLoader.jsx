import {CSSProperties} from "react";
import {FadeLoader} from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#205db4",
}

export default function FadeSpinLoader({ loading = false, size = 150, className = 'text-center'}) {
  return (
    <div className={className}>
      <FadeLoader
        color='#2567c5'
        loading={loading}
        size={size}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader" />
    </div>
  )
}
