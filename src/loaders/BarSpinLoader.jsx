import {CSSProperties} from "react";
import {BarLoader} from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#205db4",
}

export default function BarSpinLoader({ loading = false, size = 150, className = 'text-center'}) {
  return (
    <div className={className}>
      <BarLoader
        color='#2567c5'
        loading={loading}
        size={size}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader" />
    </div>
  )
}
