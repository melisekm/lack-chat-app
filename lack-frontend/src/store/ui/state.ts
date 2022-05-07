export interface UiStateInterface {
  leftDrawerState: boolean;
  rightDrawerState: boolean;
  showNotificationsAddressedToMe: boolean;

}

function state (): UiStateInterface {
  return {
    leftDrawerState: false,
    rightDrawerState: false,
    showNotificationsAddressedToMe: false

  }
}

export default state
