import { Navigation } from 'react-native-navigation'
import { debounce } from 'lodash'
import { MAIN_COLOR } from '../constants/colors'
import i18n from '../i18n'
import appIcon from '../utils/Icon'

export const startScreen = (screen, props = {}) => {
  Navigation.setRoot({
    root: {
      component: {
        name: screen,
        passProps: props
      }
    }
  })
}

export const loadingScreen = () => {
  Navigation.showOverlay({
    component: {
      id: 'LOADING_SCREEN',
      name: 'oscar.loading'
    }
  })
}

export const pushScreen = debounce((componentId, options = {}) => {
  Navigation.push(componentId, {
    component: {
      name: options.screen,
      passProps: options.props,
      options: {
        bottomTabs: {
          visible: false,
          drawBehind: true
        },
        topBar: {
          visible: options.topBar == undefined ? true : options.topBar,
          drawBehind: options.drawBehind,
          title: {
            text: options.title
          },
          backButton: {
            showTitle: false
          },
          rightButtons: options.rightButtons
        },
        customTransition: options.customTransition
      }
    }
  })
}, 1000, { maxWait: 1000, leading: true, trailing: false })

export const startNgoScreen = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'oscar.ngos',
              options: {
                topBar: {
                  title: {
                    fontFamily: '.SFUIDisplay-Bold',
                    fontSize: 25,
                    text: i18n.t('choose_ngo')
                  }
                }
              }
            }
          }
        ]
      }
    }
  })
}

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    statusBar: {
      style: 'light',
      backgroundColor: '#008282'
    },
    layout: {
      orientation: ['portrait']
    },
    topBar: {
      title: {
        color: '#fff',
        alignment: 'center'
      },
      background: {
        color: MAIN_COLOR,
        translucent: false
      },
      backButton: {
        color: '#fff'
      }
    }
  })
}

export const startTabScreen = async () => {
  const icons = await appIcon()
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'oscar.clients',
                    options: {
                      topBar: {
                        title: {
                          text: i18n.t('client.title')
                        },
                        rightButtons: [
                          {
                            id: 'SEARCH_USER',
                            icon: icons.search,
                            color: '#fff'
                          }
                        ]
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: i18n.t('client.title'),
                  testID: 'CLIENTS_TAB_BAR_BUTTON',
                  icon: icons.person,
                  iconColor: '#808080',
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'oscar.tasks',
                    options: {
                      topBar: {
                        title: {
                          text: i18n.t('task.title')
                        }
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: i18n.t('task.title'),
                  testID: 'TASKS_TAB_BAR_BUTTON',
                  icon: icons.assignment,
                  iconColor: '#808080',
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'oscar.families',
                    options: {
                      topBar: {
                        title: {
                          text: i18n.t('family.title')
                        }
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: i18n.t('family.title'),
                  testID: 'FAMILIES_TAB_BAR_BUTTON',
                  icon: icons.people,
                  iconColor: '#808080',
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'USERS_TAB_BAR_BUTTON',
                    name: 'oscar.users',
                    options: {
                      topBar: {
                        title: {
                          text: i18n.t('user.about_user')
                        },
                        rightButtons: [
                          {
                            id: 'EDIT_USER',
                            icon: icons.edit,
                            color: '#fff'
                          },
                          {
                            id: 'TRANSLATION',
                            icon: icons.translation,
                            color: '#fff'
                          }
                        ]
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: i18n.t('user.title'),
                  icon: icons.accountBox,
                  iconColor: '#808080',
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          }
          // {
          //   stack: {
          //     children: [
          //       {
          //         component: {
          //           name: 'oscar.webView',
          //           options: {
          //             topBar: {
          //               title: {
          //                 text: 'Oscar'
          //               }
          //             }
          //           }
          //         }
          //       }
          //     ],
          //     options: {
          //       bottomTab: {
          //         text: 'Oscar',
          //         testID: 'WEB_TAB_BAR_BUTTON',
          //         icon: icons.web,
          //         selectedIconColor: MAIN_COLOR,
          //         selectedTextColor: MAIN_COLOR
          //       }
          //     }
          //   }
          // }
        ]
      }
    }
  })
}
