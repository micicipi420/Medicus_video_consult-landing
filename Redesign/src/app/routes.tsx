import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { OnlineConsultationsPage } from './pages/OnlineConsultationsPage';
import { TreatmentAbroadPage } from './pages/TreatmentAbroadPage';
import { CheckupsPage } from './pages/CheckupsPage';
import { ContactsPage } from './pages/ContactsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'services/online-consultations', Component: OnlineConsultationsPage },
      { path: 'services/treatment-abroad', Component: TreatmentAbroadPage },
      { path: 'services/checkups', Component: CheckupsPage },
      { path: 'contacts', Component: ContactsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
