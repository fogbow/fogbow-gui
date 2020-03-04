export const env = {
  serverEndpoint: '',
  deployType: 'basic-site',
  fns: 'http://localhost:8083/fns',
  ras: 'http://localhost:8080/ras',
  ms: 'http://localhost:8084/ms',
  as: 'http://localhost:8081/as',
  local: 'jlss.lsd.ufcg.edu.br',
  remoteCredentialsUrl: '',
  refreshTime: 5000,
  authenticationPlugin: 'KeystoneV3',
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
