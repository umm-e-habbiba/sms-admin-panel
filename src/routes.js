import React from 'react'
import Completed from './views/pages/Completed'
import Pending from './views/pages/Pending'
import Failed from './views/pages/Failed'
import Settings from './views/pages/Settings'
import AllUser from './views/pages/AllUser'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/unsubscribed', name: 'Opt-Out Users', element: Completed },
  { path: '/active', name: 'SMS Delivered', element: Pending },
  { path: '/failed', name: 'Delivery Failed', element: Failed },
  { path: '/settings', name: 'Settings', element: Settings },
  { path: '/add-users', name: 'Add Users', element: Settings },
  { path: '/all-users', name: 'All Users', element: AllUser },
]

export default routes
