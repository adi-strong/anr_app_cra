import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, ReactSelectField} from "../../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import {useGetFuelSitesListQuery, useLazyGetLoadFuelSitesQuery} from "../model/fuel.site.api.service";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {useMemo, useState} from "react";
import {onFieldChange} from "../../../services/form.handler.service";

export default function FSupplyComp2({state, setState, onAddItem, fields, setFields, loader = false}) {
  const {nbPages} = useSelector(state => state.config)
  const {isError: isFuelSiteError, data: sites=[], isLoading: isFuelSiteLoading} = useGetFuelSitesListQuery(nbPages)
  
  const [getLoadFuelSites] = useLazyGetLoadFuelSitesQuery()
  const [options, setOptions] = useState([])
  
  let siteOptions
  
  siteOptions = useMemo(() => {
    let obj = []
    if (!isFuelSiteError && sites.length > 0) {
      obj = sites.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id'],
        siteId: p?.id,
        fuels: p?.fuels && p.fuels?.length > 0 ? p.fuels : [],
      }))
    }
    
    return obj
  }, [isFuelSiteError, sites])
  
  async function onLoadSites(keywords) {
    try {
      const search = await getLoadFuelSites(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSiteChange = e => {
    const site = e
    const siteId = site ? site.siteId : null
    const id = null
    const fuel = null
    const quantity = 0
    
    const fuels = site && site.fuels.length > 0
      ? site.fuels.map(f => ({
        label: f?.name?.toUpperCase(),
        value: f?.name?.toUpperCase(),
        id: f.id,
        isDeleted: !!f?.isDeleted
      }))
      : []
    
    const obj = []
    for (const key in fuels) {
      const f = fuels[key]
      if (f.isDeleted === false) obj.push(f)
    }
    
    setOptions(obj)
    setFields({...fields, id, fuel, site, siteId, quantity})
  }
  
  const onFuelChange = e => {
    const fuel = e
    const id = fuel ? fuel.id : null
    setFields({...fields, id, fuel})
  }
  
  const onSubmit = (e) => {
    e.preventDefault()
    const qty = isNaN(parseFloat(fields?.quantity)) ? 0 : parseFloat(fields.quantity)
    if (!fields?.site) toast.error("Le Site n'est pas sélectionnée.")
    else if (!fields?.fuel) toast.error("Le Carburant n'est pas sélectionnée.")
    else if (qty <= 0.00) toast.error('Quantité invalide.')
    else {
      onAddItem()
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <h4 className='card-title'><i className='bi bi-cart'/> Ajouter</h4>
      
      <Form onSubmit={onSubmit}>
        <div className='mb-3'>
          <Form.Label><code>*</code> Site</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isFuelSiteLoading || loader}
            value={fields.site}
            values={siteOptions}
            onChange={e => onSiteChange(e)}
            onLoadOptions={onLoadSites}
            placeholder='-- --'/>
        </div>
        
        <div className='mb-3'>
          <Form.Label><code>*</code> Carburant</Form.Label>
          <ReactSelectField
            required
            disabled={isFuelSiteLoading || loader || !fields.site}
            value={fields.fuel}
            values={options}
            onChange={e => onFuelChange(e)}
            placeholder='-- --'/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='quantity'><code>*</code> Quantit</Form.Label>
          <InputGroup>
            <Form.Control
              disabled={loader}
              id='quantity'
              type='number'
              name='quantity'
              value={fields.quantity}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <InputGroup.Text>Quantité en litre(s)</InputGroup.Text>
          </InputGroup>
        </div>
        
        <div className='text-end'>
          <Button disabled={loader} variant='dark' type='submit'>
            Ajouter <i className='bi bi-plus'/>
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}
