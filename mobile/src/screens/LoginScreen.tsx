import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native'

import { login, setToken, type Me } from '../api'
import { Button, Card, s } from '../ui'

export default function LoginScreen({ onLogin }: { onLogin: (me: Me) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    try {
      const r = await login(username.trim(), password)
      if (r.user.role !== 'driver') {
        Alert.alert('這不是司機帳號', '請用司機帳號登入')
        return
      }
      await setToken(r.access_token)
      onLogin(r.user)
    } catch (e) {
      Alert.alert('登入失敗', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView style={[s.screen, { justifyContent: 'center', padding: 24 }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Card style={{ gap: 14, padding: 24 }}>
        <View>
          <Text style={s.title}>安心行 司機</Text>
          <Text style={s.muted}>請用車行給你的帳號登入</Text>
        </View>
        <TextInput style={s.input} placeholder="帳號" autoCapitalize="none" value={username} onChangeText={setUsername} />
        <TextInput style={s.input} placeholder="密碼" secureTextEntry value={password} onChangeText={setPassword} />
        <Button title="登入" onPress={submit} loading={busy} />
      </Card>
    </KeyboardAvoidingView>
  )
}
