import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('cars', {
        color: 'red',
        year: 1950,
        engine: '2.0L',
        owner: null || '',
        service: undefined || ''
    });

    const car = await client.hGetAll('cars');

    if (Object.keys(car).length === 0){
        console.log('No car found, repsond with 404.');
        return;
    }
    console.log(car);
};
run();
