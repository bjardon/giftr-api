import { writeFile } from 'fs/promises';

const args = process.argv.slice(2).reduce((result, item, index, args) => {
    if (!item.startsWith('--')) return result;
    return { ...result, [item.replace('--', '')]: args[index + 1] };
}, {});

const { image, port } = args;
if (!image || !port) throw 'Invalid arguments. Provide both --image and --port';

const [containerPort, hostPort] = port.split(':');
if (!containerPort || !hostPort)
    throw 'Invalid port mapping. Use container:host format';

const fileName = 'Dockerrun.aws.json';
const dockerRun = {
    AWSEBDockerrunVersion: '1',
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

console.log('Generated Dockerrun.aws.json:', dockerRun);

const data = JSON.stringify(dockerRun);
await writeFile(fileName, data);
