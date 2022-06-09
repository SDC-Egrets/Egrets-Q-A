const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://localhost:5432/postgres');

// test if connection is ok
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database:', error);
//   });

// Working with Legacy Tables
class Question extends Model {}
Question.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_written: DataTypes.BIGINT,
  asker_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  asker_email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  reported: DataTypes.BOOLEAN,
  helpful: DataTypes.INTEGER,
}, {
  modelName: 'question',
  tableName: 'questions',
  sequelize,
  timestamps: false,
});

class Answer extends Model {}
Answer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Question,
      key: 'id',
    },
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_written: DataTypes.BIGINT,
  answerer_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  answerer_email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  reported: DataTypes.BOOLEAN,
  helpful: DataTypes.INTEGER,
}, {
  modelName: 'answer',
  tableName: 'answers',
  sequelize,
  timestamps: false,
});

class AnswersPhoto extends Model {}
AnswersPhoto.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  answers_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Answer,
      key: 'id',
    },
  },
  url: DataTypes.TEXT,
}, {
  modelName: 'answersPhoto',
  tableName: 'answers_photos',
  sequelize,
  timestamps: false,
});

Question.findAll({
  where: {
    product_id: 2,
  },
})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('findAll err', err);
  });
