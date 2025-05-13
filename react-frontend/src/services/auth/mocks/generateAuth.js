import {
  randFirstName,
  randLastName,
  randEmail,
  randBoolean,
  randUuid,
} from '@ngneat/falso'
import { maybeGenerate } from '~/test/helpers'

export const generateAuth = {
  user: ({
    allowEmpty = false,
    firstName = randFirstName(),
    lastName = randLastName(),
    email = randEmail({firstName, lastName}),
    email_verified = randBoolean(),
    name = `${firstName} ${lastName}`,
    nickname = maybeGenerate(() => `${firstName}o`, allowEmpty),
    picture = maybeGenerate(
      () => 'https://picsum.photos/seed/picsum/200',
      allowEmpty,
    ),
    updated_at = new Date().toISOString(),
  } = {}) => ({
    email,
    email_verified,
    name,
    nickname,
    picture,
    updated_at,
  }),

  accessToken: ({ accessToken = randUuid() } = {}) => {
    return accessToken
  },

  authResponse: ({ allowEmpty = false, user, accessToken } = {}) => ({
    user: generateAuth.user({ allowEmpty, ...user }),
    token: generateAuth.accessToken({ accessToken }),
  }),
}
