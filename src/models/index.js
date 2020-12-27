import Sequelize from 'sequelize';
import User from './user';
import Message from './message';

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      dialect: 'postgres',
    },
  );
}

const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Message: Message(sequelize, Sequelize.DataTypes),
};
 
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;