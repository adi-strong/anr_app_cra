import {createSlice} from "@reduxjs/toolkit";

const menus = [
  {
    label: 'Tableau de bord',
    to: '/app/dashboard',
    key: 'dashboard',
    icon: 'bi bi-grid',
    isActive: false,
    isOpen: false,
  },
  {
    label: 'Réception',
    to: '/app/reception',
    key: 'reception',
    icon: 'bi bi-house-door',
    isActive: false,
    isOpen: false,
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
    label: 'Patients',
    to: '#!',
    key: 'patients',
    icon: 'bi bi-people',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Liste Patients', to: '/app/patients'},
      {label: 'Conventions', to: '/app/covenants'},
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
      {label: 'Types de fiches', to: '/app/consultations/types'},
      {label: 'Traitements', to: '/app/treatments'},
      {label: 'Actes médicaux', to: '/app/acts'},
      {label: 'Examens', to: '/app/exams'},
      {label: 'Chambres / Lits', to: '/app/beds'},
      {label: 'Paramètres', to: '/app/parameters'},
    ],
  },
  {
    label: 'Traitements',
    to: '#!',
    key: 'consultations',
    icon: 'bi bi-prescription2',
    isActive: false,
    isOpen: false,
    subItems: [
      {label: 'Consultations', to: '/app/consultations'},
      {label: 'Nursing', to: '/app/nursing'},
      {label: 'Laboratoire', to: '/app/lab'},
      {label: 'Prescriptions', to: '/app/doctors-prescriptions'},
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
      {label: 'Sorties', to: '/app/expenses'},
      {label: 'Entrées', to: '/app/entries'},
      {label: 'Factures', to: '/app/invoices'},
      {label: 'Rapports', to: '/app/finances-reports'},
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
      {label: 'Agents', to: '/app/agents'},
      {label: 'Départements', to: '/app/departments'},
      {label: 'Services', to: '/app/services'},
      {label: 'Grades', to: '/app/grades'},
      {label: 'Fonctions', to: '/app/functions'},
      {label: 'Utilisateurs', to: '/app/users'},
    ],
  },
]

const initialState = {
  menus,
  nbPages: 5,
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
    },
    onSetNbPages: (state, action) => {
      state.nbPages = action.payload
    },
  },
})

export const {
  onSetNbPages,
  onToggleMenu,
  onResetConfig,
  onOpenSubMenu,
  onToggleSubMenu,
} = configSlice.actions

export default configSlice.reducer
