// Formato de IP:PORT (sin credenciales)
const rawProxies = [
  '198.23.243.226:6361',
  '31.59.20.176:6754',
  '31.56.127.193:7684',
  '45.38.107.97:6014',
  '198.105.121.200:6462',
  '64.137.96.74:6641',
  '38.154.185.97:6370',
  '84.247.60.125:6095',
  '142.111.67.146:5611',
  '191.96.254.138:6185'
]

/**
 * Devuelve la URL formateada de un proxy aleatorio de la lista.
 * Utiliza variables de entorno para las credenciales.
 */
export function getRandomProxyUrl(): string {
  const randomIndex = Math.floor(Math.random() * rawProxies.length)
  const proxy = rawProxies[randomIndex]
  
  const [ip, port] = proxy.split(':')
  const user = process.env.PROXY_USER || ''
  const pass = process.env.PROXY_PASS || ''
  
  if (!user || !pass) {
    console.warn('PROXY_USER o PROXY_PASS no configurados en las variables de entorno.')
  }
  
  return `http://${user}:${pass}@${ip}:${port}/`
}
