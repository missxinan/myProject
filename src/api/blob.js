import requestblob from '@/utils/requestblob'
import requestImg from '@/utils/requestImg'
export function exportBlob(url,data) {
  return requestblob({
    url: url,
    method: 'post',
    data
  })
}
export function exportBlobExcel(url,data) {
  return requestblob({
    url: url,
    method: 'post',
    data
  })
}
export function exportBlobUserExcel(url,data) {
  return requestblob({
    url: url,
    method: 'post',
    data
  })
}
export function exportBlobChannelNoExcel(url,data) {
  return requestblob({
    url: url,
    method: 'post',
    data
  })
}
export function requestfile(url,data) {
  return requestImg({
    url: url,
    method: 'post',
    data
  })
}

