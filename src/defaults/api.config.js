export const env = {
  serverEndpoint: '',
  deployType: 'federation',
  fns: 'http://localhost:8083/fns',
  ras: 'http://localhost:8082/ras',
  ms: 'http://localhost:8084/ms',
  as: 'http://localhost:8081/as',
  local: 'atm-test-site1.lsd.ufcg.edu.br',
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