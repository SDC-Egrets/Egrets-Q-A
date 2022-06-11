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
  },
  url: DataTypes.TEXT,
}, {
  modelName: 'photo',
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
    benchmark: true,
    logging: console.log,
    attributes: [
      ['id', 'question_id'],
      ['body', 'question_body'],
      [sequelize.fn('to_timestamp', sequelize.literal('question.date_written / 1000')), 'question_date'],
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
      attributes: [
        'id',
        'body',
        [sequelize.fn('to_timestamp', sequelize.literal('answers.date_written / 1000')), 'date'],
        'answerer_name',
        ['helpful', 'helpfulness'],
      ],
      where: {
        reported: false,
      },
      include: [{
        model: AnswersPhoto,
        required: false,
        attributes: [
          'url',
        ],
      }],
    }],
  })
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

const getAllAnswers = (questionId, page = 1, count = 5) => (
  Answer.findAll({
    benchmark: true,
    logging: console.log,
    attributes: [
      ['id', 'answer_id'],
      'body',
      [sequelize.fn('to_timestamp', sequelize.literal('date_written / 1000')), 'date'],
      'answerer_name',
      ['helpful', 'helpfulness'],
    ],
    offset: (page - 1) * 5,
    limit: count,
    where: {
      question_id: questionId,
      reported: false,
    },
    include: [{
      model: AnswersPhoto,
      required: false,
      attributes: [
        'id',
        'url',
      ],
    }],
  })
    .then((data) => {
      const result = {
        question: questionId,
        page,
        count,
        results: data,
      };
      return result;
    })
    .catch((err) => {
      console.log('getAllQuestions err', err);
    })
);

const addOneQuestion = (productId, body, name, email, id) => (
  // id should not be included
  Question.create({
    id,
    product_id: productId,
    body,
    date_written: Math.floor(new Date().getTime()),
    asker_name: name,
    asker_email: email,
  })
);

const addOneAnswer = (questionId, body, name, email, photos, id) => (
  // id should not be included
  Answer.create({
    id,
    question_id: questionId,
    body,
    date_written: Math.floor(new Date().getTime()),
    answerer_name: name,
    answerer_email: email,
  })
);

const markQHelpful = (questionId) => (
  Question.update({
    helpful: sequelize.literal('helpful + 1'),
  }, {
    where: {
      id: questionId,
    },
  })
);

const reportQuestion = (questionId) => (
  Question.update({
    reported: true,
  }, {
    where: {
      id: questionId,
    },
  })
);

const markAHelpful = (answerId) => (
  Answer.update({
    helpful: sequelize.literal('helpful + 1'),
  }, {
    where: {
      id: answerId,
    }
  })
);

const reportAnswer = (answerId) => (
  Answer.update({
    reported: true,
  }, {
    where: {
      id: answerId,
    },
  })
);

module.exports = {
  getAllQuestions,
  getAllAnswers,
  addOneQuestion,
  addOneAnswer,
  markQHelpful,
  reportQuestion,
  markAHelpful,
  reportAnswer,
};
