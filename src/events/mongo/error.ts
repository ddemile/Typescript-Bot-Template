import chalk from 'chalk'
import { MongooseError } from 'mongoose';

export default {
    name: "error",
    execute(err: MongooseError) {
        console.log(chalk.red(`An error occured with the database connection:\n${err}`));
    }
}