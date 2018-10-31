export const env = {
  fns: 'http://localhost:8081',
  ras: 'http://localhost:8080',
  ms: 'http://localhost:8082',
  local: 'fake-localidentity-member',
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
