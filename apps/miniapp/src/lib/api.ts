import Taro from '@tarojs/taro'

const API_URL = process.env.TARO_APP_API_URL ?? 'https://api.sosohelper.com'

export async function apiFetch(path: string, opts: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; token?: string; body?: any } = {}) {
  const res = await Taro.request({
    url: `${API_URL}${path}`,
    method: opts.method ?? 'GET',
    header: {
      'content-type': 'application/json',
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {})
    },
    data: opts.body
  })

  const json: any = res.data
  if (!json?.ok) throw new Error(json?.error?.message ?? 'Request failed')
  return json
}
