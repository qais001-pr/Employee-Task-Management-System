/* eslint-disable eol-last */
/* eslint-disable semi */

import React from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { AuthProvider } from './context/auth'
export default function App() {
  return (
    <>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
  )
}