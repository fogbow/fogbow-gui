export const env = {
  fns: 'http://localhost:8083',
  ras: 'http://localhost:8081',
  ms: 'http://localhost:8082',
  as: 'http://localhost:8079',
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
