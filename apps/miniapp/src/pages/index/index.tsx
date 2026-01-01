import { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import { apiFetch } from '../../lib/api'

export default function Index() {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('')

  async function heartbeat() {
    setStatus('…')
    try {
      await apiFetch('/presence/heartbeat', { method: 'POST', token })
      setStatus('Online updated')
    } catch (e: any) {
      setStatus(e?.message ?? 'Failed')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>SosoHelper (WeChat Mini Program shell)</Text>
      <View style={{ marginTop: 12 }}>
        <Text>JWT token</Text>
        <Input
          value={token}
          onInput={(e) => setToken(e.detail.value)}
          placeholder="Paste JWT"
          style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}
        />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button onClick={heartbeat}>Heartbeat</Button>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text>{status}</Text>
      </View>
    </View>
  )
}
