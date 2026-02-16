import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import "./index.css";
import './i18n';

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
