export interface EnvironmentConfig {
    firebase: {
        serviceAccount: object;
    };
    mongo: {
        appName: string;
        pass: string;
        uri: string;
        user: string;
    };
}
