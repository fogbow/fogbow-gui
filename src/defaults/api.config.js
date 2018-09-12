export const env = {
    ras: 'http://localhost:8080',
    fns: 'http://10.11.4.192:8082',
    ms: 'http://10.11.4.192:8081',
    memberId: 'naf1.lsd.ufcg.edu.br',
    authenticationPlugin: 'Ldap',
	credentialFields: {
        username: {
            type:'text',
            label: 'Username'
        },
        password: {
            type: 'password',
            label: 'Password'
        }
    }
};