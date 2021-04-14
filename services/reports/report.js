import { reporter } from '@api/config'
import { create } from '@report/config'
import moment from 'moment'
import CryptoJS from 'crypto-js'

const storageName = `${(process.env.appName || 'app').toLowerCase()}-reports`

const getReport = () => {
  return new Promise((resolve, reject) => {
    const savedData = localStorage.getItem(storageName)
    if (savedData) {
      try {
        return resolve(JSON.parse(savedData))
      } catch (e) {
        return reject([])
      }
    }
    return resolve([])
  })
}

const removeReport = async (data) => {
  const reports = await getReport()
  const newReports = reports.filter((itm) => itm?.uuid !== data?.uuid)
  localStorage.setItem(storageName, JSON.stringify(newReports))
}

const setNewReport = async (data) => {
  const lastReport = await getReport()
  const newReports = [...lastReport, data]
  localStorage.setItem(storageName, JSON.stringify(newReports))
}

export const startQueueReporter = async (forceStart = false) => {
  const reported = await getReport()
  const isreportStart = JSON.parse(localStorage.getItem('report-queue-start') || 'false')
  const lastReport = reported[0]
  // console.log(lastReport)
  if (lastReport) {
    if (forceStart) {
      localStorage.setItem('report-queue-start', 'true')
      reporter(lastReport)
        .then(() => {
          removeReport(lastReport)
        })
        .then(() => {
          setTimeout(() => document.dispatchEvent(new Event('NextReport')), 1000)
        })
    } else {
      if (!isreportStart) {
        reporter(lastReport)
          .then(() => {
            removeReport(lastReport)
          })
          .then(() => {
            setTimeout(() => document.dispatchEvent(new Event('NextReport')), 1000)
          })
      }
    }
  } else {
    localStorage.setItem('report-queue-start', 'false')
  }
}

export const createReport = async (message, type = 'warning') => {
  const uuid = CryptoJS.SHA256(moment().format()).toString()
  await setNewReport({
    type: type,
    uuid: uuid,
    time: moment().format(),
    url: typeof window != 'undefined' ? window?.location.href : '',
    messages: [create(message)],
  })
  document.dispatchEvent(new Event('DispatchReport'))
}
