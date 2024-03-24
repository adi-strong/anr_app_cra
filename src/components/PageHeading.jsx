import PropTypes from "prop-types";
import {useEffect} from "react";
import {setPageTitle} from "../services";

export default function PageHeading({ title }) {
  useEffect(() => {
    if (title) {
      setPageTitle(title)
    }
  }, [title])
  
  return <></>
}

PageHeading.propTypes = { title: PropTypes.string.isRequired }
