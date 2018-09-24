export const env = {
    ras: 'http://10.11.4.154:8080',
    fns: 'http://10.11.4.154:8082',
    ms: 'http://10.11.4.154:8081',
    memberId: 'naf1.lsd.ufcg.edu.br',
    authenticationPlugin: 'Ldap',
	credentialFields: {
        userName: {
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
        projectName: {
            type: 'text',
            label: 'Project Name'
        }
    }
};