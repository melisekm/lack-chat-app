import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'nickname'

    const payload = [
      {
        firstname: 'Martin',
        surname: 'Melisek',
        nickname: 'melisekm',
        email: 'tester@test.sk',
        password: '123456',
      },
      {
        firstname: 'David',
        surname: 'Kromka',
        nickname: 'kromkad',
        email: 'test@test.sk',
        password: '123456',
      },
      {
        firstname: 'Ivan',
        surname: 'Prvý',
        nickname: 'xprvy',
        email: 'xprvy@tester.sk',
        password: '123456',
      },
      {
        firstname: 'Jakub',
        surname: 'Druhy',
        nickname: 'xdruhy',
        email: 'xdruhy@tester.sk',
        password: '123456',
      },
      {
        firstname: 'Milan',
        surname: 'Treti',
        nickname: 'xtruhy',
        email: 'xtreti@tester.sk',
        password: '123456',
      },
    ]
    // Write your database queries inside the run method
    await User.updateOrCreateMany(uniqueKey, payload)
  }
}
