export interface EnvironmentConfig {
    firebase: {
        serviceAccount: object;
    };
    mongo: {
        appName: string;
        pass: string;
        uri: string;
        user: string;
        dbName: string;
    };
    brevo: {
        apiKey: string;
    };
}
