import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot((/* { app, router, ... } */) => {
  Notify.setDefaults({
    progress: true,
    color: 'primary',
    timeout: 3500,
    position: 'center',
    actions: [{ icon: 'close', color: 'white' }]
  })

  Notify.registerType('message-notification', {
    icon: 'message',
    color: 'grey-7',
    position: 'top-right'
  })
})
