import { writeFile } from 'fs/promises';

const args = process.argv.slice(2);
const [image, containerPort, hostPort] = args;

const fileName = 'Dockerrun.aws.json';

const dockerRun = {
    AWSEBDockerrunVersion: 1,
    // Authentication: {
    //     Bucket: 'amzn-s3-demo-bucket',
    //     Key: 'mydockercfg',
    // },
    Image: {
        Name: image,
        Update: 'true',
    },
    Ports: [
        {
            ContainerPort: containerPort,
            HostPort: hostPort,
        },
    ],
    Command: 'doppler run -- npm run start:prod',
};

const data = JSON.stringify(dockerRun);

await writeFile(fileName, data);
