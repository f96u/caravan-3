import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Todo: a
    .model({
      id: a.id().required(),
      content: a.string(),
      executionDate: a.date(),
      isDone: a.boolean().default(false),
      prevId: a.integer(),
    })
    .authorization((allow) => [allow.owner()])
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
