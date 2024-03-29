import {lazy} from "react";

const
  Login =
    lazy(() => import('../features/auth/view/login')),
  Profile =
    lazy(() => import('../features/account/view/profile')),
  Help =
    lazy(() => import('../features/account/view/help')),
  Dashboard =
    lazy(() => import('../features/dashboard/view/dashboard')),
  Reception =
    lazy(() => import('../features/reception/view/reception')),
  Patients =
    lazy(() => import('../features/patients/view/patients')),
  AddPatient =
    lazy(() => import('../features/patients/view/addPatient')),
  ShowPatient =
    lazy(() => import('../features/patients/view/showPatient')),
  Covenants =
    lazy(() => import('../features/patients/view/covenants')),
  ShowCovenant =
    lazy(() => import('../features/patients/view/showCovenant')),
  Consultations =
    lazy(() => import('../features/consultations/view/consultations')),
  AddConsultation =
    lazy(() => import('../features/consultations/view/addConsultation')),
  ShowConsultation =
    lazy(() => import('../features/consultations/view/showConsultation')),
  Nursing =
    lazy(() => import('../features/nursing/view/nursing')),
  ShowNursing =
    lazy(() => import('../features/nursing/view/showNursing')),
  Lab =
    lazy(() => import('../features/lab/view/lab')),
  ShowLab =
    lazy(() => import('../features/lab/view/showLab')),
  Prescriptions =
    lazy(() => import('../features/prescriptions/view/prescriptions')),
  ShowPrescription =
    lazy(() => import('../features/prescriptions/view/showPrescription')),
  DoctorsPrescriptions =
    lazy(() => import('../features/prescriptions/view/doctorsPrescriptions')),
  DoctorShowPrescription =
    lazy(() => import('../features/prescriptions/view/showDoctorPrescription')),
  Expenses =
    lazy(() => import('../features/finances/view/expenses')),
  ShowExpense =
    lazy(() => import('../features/finances/view/showExpense')),
  Entries =
    lazy(() => import('../features/finances/view/entries')),
  ShowEntry =
    lazy(() => import('../features/finances/view/showEntry')),
  Invoices =
    lazy(() => import('../features/finances/view/invoices')),
  ShowInvoice =
    lazy(() => import('../features/finances/view/showInvoice')),
  Agents =
    lazy(() => import('../features/staff/view/agents')),
  ShowAgent =
    lazy(() => import('../features/staff/view/showAgent')),
  EditAgent =
    lazy(() => import('../features/staff/view/editAgent')),
  AddAgent =
    lazy(() => import('../features/staff/view/addAgent')),
  Departments =
    lazy(() => import('../features/configurations/view/departments')),
  ShowDepartment =
    lazy(() => import('../features/configurations/view/showDepartment')),
  ShowService =
    lazy(() => import('../features/configurations/view/showService')),
  ShowGrade =
    lazy(() => import('../features/configurations/view/showGrade')),
  Users =
    lazy(() => import('../features/staff/view/users')),
  Provinces =
    lazy(() => import('../features/configurations/view/provinces')),
  ShowProvince =
    lazy(() => import('../features/configurations/view/showProvince')),
  Treatments =
    lazy(() => import('../features/configurations/view/treatments')),
  Acts =
    lazy(() => import('../features/configurations/view/acts')),
  Exams =
    lazy(() => import('../features/configurations/view/exams')),
  Beds =
    lazy(() => import('../features/configurations/view/beds')),
  Years =
    lazy(() => import('../features/configurations/view/configs'))

const routes = [
  {
    path: '/',
    routes: [
      {path: '', index: true, element: <Login/>},
      {path: 'login', index: true, element: <Login/>},
    ]
  },
  {
    path: '/app/',
    routes: [
      {path: 'profile', index: true, element: <Profile/>},
      {path: 'help', index: true, element: <Help/>},
      {path: 'dashboard', index: true, element: <Dashboard/>},
      {path: 'reception', element: <Reception/>},
      {path: 'prescriptions', element: <Prescriptions/>},
      {path: 'prescriptions/:id/show', element: <ShowPrescription/>},
      {path: 'doctors-prescriptions', element: <DoctorsPrescriptions/>},
      {path: 'doctors-prescriptions/:id/show', element: <DoctorShowPrescription/>},
      {path: 'patients', element: <Patients/>},
      {path: 'patients/add', element: <AddPatient/>},
      {path: 'patients/:id/show', element: <ShowPatient/>},
      {path: 'covenants', element: <Covenants/>},
      {path: 'covenants/:id/show', element: <ShowCovenant/>},
      {path: 'consultations', element: <Consultations/>},
      {path: 'consultations/add', element: <AddConsultation/>},
      {path: 'consultations/:id/show', element: <ShowConsultation/>},
      {path: 'nursing', element: <Nursing/>},
      {path: 'nursing/:id/show', element: <ShowNursing/>},
      {path: 'lab', element: <Lab/>},
      {path: 'lab/:id/show', element: <ShowLab/>},
      {path: 'expenses', element: <Expenses/>},
      {path: 'expenses/:id/show', element: <ShowExpense/>},
      {path: 'entries', element: <Entries/>},
      {path: 'entries/:id/show', element: <ShowEntry/>},
      {path: 'invoices', element: <Invoices/>},
      {path: 'invoices/:id/show', element: <ShowInvoice/>},
      {path: 'agents', element: <Agents/>},
      {path: 'agents/add', element: <AddAgent/>},
      {path: 'agents/:id/show', element: <ShowAgent/>},
      {path: 'agents/:id/edit', element: <EditAgent/>},
      {path: 'departments', element: <Departments/>},
      {path: 'departments/:id/:slug', element: <ShowDepartment/>},
      {path: 'services/:id/:slug', element: <ShowService/>},
      {path: 'grades/:id/:slug', element: <ShowGrade/>},
      {path: 'users', element: <Users/>},
      {path: 'provinces', element: <Provinces/>},
      {path: 'provinces/:id/:slug', element: <ShowProvince/>},
      {path: 'treatments', element: <Treatments/>},
      {path: 'acts', element: <Acts/>},
      {path: 'exams', element: <Exams/>},
      {path: 'beds', element: <Beds/>},
      {path: 'parameters', element: <Years/>},
    ]
  },
]

export default routes
