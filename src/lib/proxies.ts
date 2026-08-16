// Formato de Webshare: IP:PORT:USER:PASS
const rawProxies = [
  '198.23.243.226:6361:fbgfnpwd:rzhsae1p7jeu',
  '31.59.20.176:6754:fbgfnpwd:rzhsae1p7jeu',
  '31.56.127.193:7684:fbgfnpwd:rzhsae1p7jeu',
  '45.38.107.97:6014:fbgfnpwd:rzhsae1p7jeu',
  '198.105.121.200:6462:fbgfnpwd:rzhsae1p7jeu',
  '64.137.96.74:6641:fbgfnpwd:rzhsae1p7jeu',
  '38.154.185.97:6370:fbgfnpwd:rzhsae1p7jeu',
  '84.247.60.125:6095:fbgfnpwd:rzhsae1p7jeu',
  '142.111.67.146:5611:fbgfnpwd:rzhsae1p7jeu',
  '191.96.254.138:6185:fbgfnpwd:rzhsae1p7jeu'
]

/**
 * Devuelve la URL formateada de un proxy aleatorio de la lista.
 * Útil para rotar proxies en cada petición de scraping o conexión a APIs.
 * Formato de salida: http://USER:PASS@IP:PORT/
 */
export function getRandomProxyUrl(): string {
  const randomIndex = Math.floor(Math.random() * rawProxies.length)
  const proxy = rawProxies[randomIndex]
  
  const [ip, port, user, pass] = proxy.split(':')
  return `http://${user}:${pass}@${ip}:${port}/`
}
