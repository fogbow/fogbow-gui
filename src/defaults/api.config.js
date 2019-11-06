export const env = {
  serverEndpoint: '',
  deployType: 'fns-deploy',
  fns: 'http://localhost:8083/fns',
  ras: 'http://localhost:8082/ras',
  ms: 'http://localhost:8084/ms',
  as: 'http://localhost:8081/as',
  local: 'fake.localidentity.member',
  remoteCredentialsUrl: '',
  refreshTime: 5000,
  authenticationPlugin: 'LDAP',
  credentialFields: {
    username: {
      type: 'text',
      label: 'User Name'
    },
    password: {
      type: 'password',
      label: 'Password'
    },
    domain: {
      type: 'text',
      label: 'Domain'
    },
  },
  fnsServiceNames: ['vanilla', 'dfns']
};
