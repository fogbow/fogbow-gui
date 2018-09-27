export const env = {
    ras: 'http://10.11.4.198:8080',
    fns: 'http://10.11.4.198:8082',
    ms: 'http://10.11.4.198:8081',
    local: 'atm-test.cloud.lsd.ufcg.edu.br',
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