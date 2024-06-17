import {createSlice} from "@reduxjs/toolkit";

const menus = [
  /*{
    label: 'Tableau de bord',
    to: '/app/dashboard',
    key: 'dashboard',
    icon: 'bi bi-grid',
    isActive: false,
    isOpen: false,
  },*/
  {
    label: 'Tableau de bord',
    to: '#!',
    key: 'dashboard',
    icon: 'bi bi-grid',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Analytique', to: '/app/dashboard'},
      {label: 'Informations', to: '/app/news'},
      {label: 'Traitements', to: '/app/news-treatments'},
    ],
  },
  /*{
    label: 'Réception',
    to: '/app/reception',
    key: 'reception',
    icon: 'bi bi-house-door',
    isActive: false,
    isOpen: false,
  },*/
  {
    label: 'Carburants',
    to: '#!',
    key: 'fuels',
    icon: 'bi bi-fuel-pump',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Rapports', to: '/app/fuels-reports'},
      {label: 'Stock', to: '/app/fuels-stock'},
      {label: 'Approvisionnement', to: '/app/fuels-supply'},
      {label: 'Ravitaillement', to: '/app/refueling'},
    ],
  },
  {
    label: 'Ordonnaces',
    to: '/app/prescriptions',
    key: 'prescriptions',
    icon: 'bi bi-file-earmark-text',
    isActive: false,
    isOpen: false,
  },
  {
    label: 'Patrimoines',
    to: '#!',
    key: 'patrimony',
    icon: 'bi bi-stars',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Roulants', to: '/app/vehicles'},
      {label: 'Propriétés', to: '/app/properties'},
    ],
  },
  {
    label: 'Configurations',
    to: '#!',
    key: 'configurations',
    icon: 'bi bi-gear',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Générales', to: '/app/parameters'},
      {label: 'Provinces', to: '/app/provinces'},
      {label: 'Départements', to: '/app/departments'},
      {label: 'Types de dossiers', to: '/app/folder-types'},
      {label: 'Types pro.', to: '/app/property-types'},
      {label: "Type d'activités", to: '/app/society-types'},
      {label: 'Types de V.', to: '/app/vehicles-types'},
    ],
  },
  {
    label: 'RST & TIC',
    to: '#!',
    key: 'recovery',
    icon: 'bi bi-building-down',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Rapports', to: '/app/recovery-reports'},
      {label: 'Sociétés', to: '/app/societies'},
      {label: 'Contrôle sécuritaire', to: '/app/security-control'},
    ],
  },
  {
    label: 'Nursing',
    to: '/app/nursing',
    key: 'nursing',
    icon: 'bi bi-heart-pulse',
    isActive: false,
    isOpen: false,
  },
  {
    label: 'Finances',
    to: '#!',
    key: 'finances',
    icon: 'bi bi-piggy-bank',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Rapports', to: '/app/expenses-reports'},
      {label: 'Sorties', to: '/app/expenses'},
      // {label: 'Entrées', to: '/app/entries'},
      // {label: 'Factures', to: '/app/invoices'},
      // {label: 'Rapports', to: '/app/finances-reports'},
    ],
  },
  {
    label: 'Personnel',
    to: '#!',
    key: 'staff',
    icon: 'bi bi-person',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Rapports', to: '/app/agents-reports'},
      {label: 'Agents', to: '/app/agents'},
      {label: 'Affectations', to: '/app/assignments'},
      {label: 'Salaires', to: '/app/salaries'},
      {label: 'Fonctions', to: '/app/jobs'},
      {label: 'Utilisateurs', to: '/app/users'},
    ],
  },
]

const initialState = {
  menus,
  nbPages: 25,
  provinceOptions: [],
  departentOptions: [],
  // currencies,
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    onToggleMenu: (state, action) =>  {
      const menuKey = action.payload.menuKey
      const items = [...state.menus]
      for (const i in items) {
        if (items[i].key === menuKey) {
          items[i].isActive = true
          items[i].isOpen = true
        }
        if (items[i].key !== menuKey) {
          items[i].isActive = false
          items[i].isOpen = false
        }
      }
      state.menus = items
    },
    onToggleSubMenu: (state, action) => {
      const index = action.payload.toString()
      const items = state.menus
      for (const key in items) {
        if (key !== index) {
          items[key].isActive = false
          items[key].isOpen = false
        }
      }
      items[index].isActive = !items[index].isActive
      items[index].isActive = !items[index].isOpen
      // state.menus = items
    },
    onOpenSubMenu: (state, action) => {
      const index = action.payload.toString()
      const items = state.menus
      for (const key in items) {
        if (key !== index) {
          items[key].isOpen = false
        }
      }
      items[index].isOpen = !items[index].isOpen
    },
    onResetConfig: state => {
      state.menus = menus
      state.provinceOptions = []
      state.departentOptions = []
    },
    handleGetProvinceOptions: (state, action) => {
      let obj = []
      const options = action.payload
      if (options && options?.length > 0) {
        obj = options?.map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id']
        }))
      }
      
      state.provinceOptions = obj
    },
    handleGetDepartmentOptions: (state, action) => {
      let obj = []
      const options = action.payload
      if (options && options?.length > 0) {
        obj = options?.map(p => ({
          label: p?.name?.toUpperCase(),
          value: p['@id'],
          grades: p?.grades && p.grades.length > 0 ? p.grades : [],
        }))
      }
      
      state.provinceOptions = obj
    },
    onSetNbPages: (state, action) => {
      state.nbPages = action.payload
    },
  },
})

export const {
  handleGetDepartmentOptions,
  handleGetProvinceOptions,
  onSetNbPages,
  onToggleMenu,
  onResetConfig,
  onOpenSubMenu,
  onToggleSubMenu,
} = configSlice.actions

export default configSlice.reducer
