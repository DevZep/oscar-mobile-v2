import Icon from 'react-native-vector-icons/MaterialIcons'

export default async () => {
  const icons = await Promise.all([
    Icon.getImageSource('person', 30),
    Icon.getImageSource('people', 30),
    Icon.getImageSource('assignment', 30),
    Icon.getImageSource('account-box', 30),
    Icon.getImageSource('web', 30),
    Icon.getImageSource('g-translate', 20),
    Icon.getImageSource('edit', 20),
    Icon.getImageSource('save', 20)
  ])
  const [person, people, assignment, accountBox, web, translation, edit, save] = icons
  return { person, people, assignment, accountBox, web, translation, edit, save }
}
