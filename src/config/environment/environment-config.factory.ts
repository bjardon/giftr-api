import { EnvironmentConfig } from './environment-config.interface';

export const ENVIRONMENT_CONFIGURATION_FACTORY = (): EnvironmentConfig => {
    return {
        firebase: {
            serviceAccount:
                JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) ?? {},
        },
        mongo: {
            appName: process.env.MONGO_NAME ?? '',
            pass: process.env.MONGO_PASS ?? '',
            uri: process.env.MONGO_URI ?? '',
            user: process.env.MONGO_USER ?? '',
        },
    };
};
