
export const reporter = async logs => {
  axios.request('/self/reports', {
    method: 'POST',
    headers: {
      'X-Selft-One-Time-Key': selfSignedKeyGenerator(),
    },
    data: {
      logs: logs,
    },
  })
}
