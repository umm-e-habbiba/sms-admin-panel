import React from 'react'
import Completed from './views/pages/Completed'
import Pending from './views/pages/Pending'
import Failed from './views/pages/Failed'
import Settings from './views/pages/Settings'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/unsubscribed', name: 'Unsubscribed', element: Completed },
  { path: '/active', name: 'Active', element: Pending },
  { path: '/failed', name: 'Failed', element: Failed },
  { path: '/settings', name: 'Settings', element: Settings },
  { path: '/add-users', name: 'Add Users', element: Settings },
]

export default routes
