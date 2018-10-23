export const env = {
  fns: 'http://10.11.4.34:8082',
  ms: 'http://10.11.4.34:8081',
  local: 'atm-test.cloud.lsd.ufcg.edu.br',
  remoteEndpoint: '',
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
    projectname: {
      type: 'text',
      label: 'Project Name'
    }
  }
};
