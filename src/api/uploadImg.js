import requestImg from '@/utils/requestImg'

export function uploadImg(data) {
  return requestImg({
    url: '/oss/uploadFileList',
    method: 'post',
    data
  })
}