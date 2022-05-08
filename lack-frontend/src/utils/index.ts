import { Dialog, Notify, AppVisibility } from 'quasar'
import { Channel, SerializedMessage } from 'src/contracts'

export function absDifference (first: number, sec: number) {
  return Math.abs(first - sec)
}

export function trimString (string: string | null, length: number) {
  if (string === null) {
    return ''
  }
  return string.length > length
    ? string.substring(0, length) + '...'
    : string
}

export const getNegativeNotification = (message: string) => {
  Notify.create({
    color: 'negative',
    message
  })
}

export const getPositiveNotification = (message: string) => {
  Notify.create({
    color: 'positive',
    message
  })
}

export const openConfirmDialog = (msg: string, onConfirm: () => void) => {
  Dialog.create({
    title: 'Confirm',
    message: msg,
    cancel: true
  }).onOk(() => {
    onConfirm()
  })
}

export function formatDate (date: string|Date) {
  const parsedDate = new Date(date)
  return parsedDate.toLocaleString('en-GB')
}

export const dummyChannel: Channel = {
  adminId: 0,
  joinedAt: new Date().toISOString(),
  id: 0,
  name: '',
  isPublic: false
}

export const getMessageNotification = (message: SerializedMessage, channel: string) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification')
    return
  }
  if (Notification.permission === 'granted') {
    createAPINotification(message, channel)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          createAPINotification(message, channel)
        }
      })
  }
}

const createAPINotification = (message: SerializedMessage, channel: string) => {
  if (!AppVisibility.appVisible) {
    // eslint-disable-next-line no-new
    new Notification(`${message.author.nickname} (#${channel})`, {
      body: trimString(message.content, 30)
    })
  }
}
