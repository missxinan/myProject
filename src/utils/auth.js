import Cookies from 'js-cookie'

const TokenKey = 'jyk_rms'

export function getToken() {
  // return Cookies.get(TokenKey) 
	return sessionStorage.getItem('jyk_rms')
	
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
	return sessionStorage.setItem('jyk_rms',token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
	return sessionStorage.removeItem('jyk_rms')
}
