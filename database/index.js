// connect to db
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');

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

Question.hasMany(Answer, { foreignKey: 'question_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });

Answer.hasMany(AnswersPhoto, { foreignKey: 'answers_id' });
AnswersPhoto.belongsTo(Answer, { foreignKey: 'answers_id' });

const getAllQuestions = (productId) => (
  Question.findAll({
    attributes: [
      ['id', 'question_id'],
      ['body', 'question_body'],
      ['date_written', 'question_date'],
      'asker_name',
      ['helpful', 'question_helpfulness'],
      'reported',
    ],
    where: {
      product_id: productId,
      reported: false,
    },
    include: [{
      model: Answer,
      required: false,
      include: [{
        model: AnswersPhoto,
        required: false,
      }],
    }],
  })
  // sequelize.query(
  //   `SELECT q.id AS question_id, q.body AS question_body,  q.date_written AS question_date, q.asker_name,
  //     q.helpful AS question_helpfulness, q.reported, a.id, a.body, a.date_written AS date, a.answerer_name,
  //     a.helpful AS helpfulness, ap.url
  //     FROM questions AS q
  //     LEFT JOIN answers AS a
  //     ON q.id = a.question_id AND a.reported=false
  //     LEFT JOIN answers_photos AS ap
  //     ON a.id = ap.answers_id
  //     WHERE q.product_id=${productId} AND q.reported=false`, {
  //     type: QueryTypes.SELECT,
  //     model: Question,
  //   })
    .then((data) => {
      const result = {
        product_id: productId,
        results: data,
      };
      return result;
    })
    .catch((err) => {
      console.log('getAllQuestions err', err);
    })
);

module.exports = {
  getAllQuestions,
};
