import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      executionDate: a.date(),
      isDone: a.boolean().default(false),
      groupId: a.id(),
      group: a.belongsTo('Group', 'groupId'),
    })
    .authorization((allow) => [allow.owner()]),
  Group: a
    .model({
      name: a.string(),
      order: a.string().array().required(),
      members: a.hasMany('Todo', 'groupId'),
    })
    .authorization(allow => [allow.owner()])
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
