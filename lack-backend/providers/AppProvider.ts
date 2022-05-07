import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // bind our implementation of MessageRepository to container
    this.app.container.singleton(
      'Repositories/MessageRepository',
      (container) => {
        return container.make('App/Repositories/MessageRepository')
      }
    )

    this.app.container.singleton('Repositories/UserRepository', (container) => {
      return container.make('App/Repositories/UserRepository')
    })

    // naozaj krasne, ked tu repo nie je zaregistrovane a skusime ho injectnut
    // do controllera, tak to spapa exception a vobec nikde sa neukaze nic
    this.app.container.singleton('Repositories/KickRepository', (container) => {
      return container.make('App/Repositories/KickRepository')
    })

    this.app.container.singleton(
      'Repositories/ChannelRepository',
      (container) => {
        return container.make('App/Repositories/ChannelRepository')
      }
    )
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
