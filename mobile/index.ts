import { registerRootComponent } from 'expo'

// 背景定位任務必須在最外層註冊，App 被系統喚醒時才找得到
import './src/location'
import App from './App'

registerRootComponent(App)
