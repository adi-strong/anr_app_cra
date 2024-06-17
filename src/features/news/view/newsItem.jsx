import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {newsActionItems, newsPriorityColor, newsPriorityLabel} from "../services/news.conf.service";
import {Badge, Dropdown} from "react-bootstrap";
import {subStr} from "../../../services";
import moment from "moment";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useState} from "react";
import NewsAssignmentModal from "../../newsTreatments/view/newsAssignmentModal";

export default function NewsItem({data}) {
  const navigate = useNavigate()
  const {show: theme} = useSelector(state => state.theme)
  const [show, setShow] = useState(false)
  
  const toggleShow = (): void => setShow(!show)
  
  const onNewsActionsFilter = (event, data): void => {
    switch (event) {
      case 'show':
        navigate(`/app/news/${data.id}/show`)
        break
      default:
        toggleShow()
        break
    }
  }
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <tr className={`text-decoration-${data?.isTreated ? 'line-through' : 'none'}line-through`}>
        <td className='align-middle'>
          <Badge bg={newsPriorityColor[data.priority]}>
            {newsPriorityLabel[data.priority]}
          </Badge>
        </td>
        <td className='align-middle'>
          <Link to={`/app/news/${data?.id}/show`}>
            {data?.title ? subStr(30, data?.title) : 'Aucun titre'}
          </Link>
        </td>
        <td className='align-middle'>
          {data?.department && (
            <Badge bg='success'>
              <i className='bi bi-arrow-left-right me-1'/>
              {data.department.name.toUpperCase()}
            </Badge>
          )}
        </td>
        <td className='align-middle'>
          {data?.releasedAt ? moment(data?.releasedAt).calendar() : '-'}
        </td>
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className={`bg-${theme ? 'dark-green-o' : 'white'} border-0 shadow-none`}>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {newsActionItems.length > 0 && newsActionItems.map((f, i) =>
                  <Dropdown.Item
                    key={i}
                    className={f?.className}
                    onClick={() => onNewsActionsFilter(f.event, data)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <NewsAssignmentModal
        show={show}
        onHide={toggleShow}
        data={data}
      />
    </ErrorBoundary>
  )
}
