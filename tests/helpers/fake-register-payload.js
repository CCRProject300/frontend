import Faker from 'faker'

export default (data = {}) => {
  return Object.assign({
    firstName: Faker.name.firstName(),
    lastName: Faker.name.lastName(),
    companyName: Faker.company.companyName(),
    email: Faker.internet.email(),
    password: Faker.internet.password()
  }, data)
}
