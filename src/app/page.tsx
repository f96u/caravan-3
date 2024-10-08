'use client'
import outputs from '@/amplify_outputs.json'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import { Clock } from '../components/Clock'
import { Group } from '../components/Group'

Amplify.configure(outputs)

export default function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <Clock />
          <h1>{user?.signInDetails?.loginId}&aposs todos</h1>
          <button onClick={signOut}>Sign out</button>
          <Group />
        </main>
      )}
    </Authenticator>
  )
}
