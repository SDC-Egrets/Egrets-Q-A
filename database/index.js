const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(`postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:5432/${process.env.DATABASE}`, {
  logging: false,
});

class Question extends Model {}
Question.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    autoIncrement: true,
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
    autoIncrement: true,
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

const getAllQuestions = (productId, page = 1, count = 5) => (
  sequelize.query(`SELECT json_build_object(
    'product_id', ${productId},
    'results', array_to_json(array_agg(json_build_object(
        'question_id', id,
        'question_body', body,
        'question_date', to_timestamp(date_written / 1000),
        'asker_name', asker_name,
        'question_helpfulness', helpful,
        'reported', reported,
        'answers', (
      SELECT json_object_agg(id, tmp)
          FROM (
          SELECT id as id, json_build_object('id', id, 'body', body,
          'date', to_timestamp(date_written / 1000), 'answerer_name', answerer_name,
          'helpfulness', helpful, 'photos', (
          SELECT array_to_json(array_agg(url))
          FROM answers_photos
          WHERE answers_id = a.id)) AS tmp
          FROM answers AS a
          WHERE question_id = q.id AND reported = false) ap )))))
  FROM questions AS q
  WHERE product_id = ${productId} AND reported = false
  LIMIT ${count} OFFSET ${(page - 1) * 5};`, {
    type: QueryTypes.SELECT,
  })
);

const getAllAnswers = (questionId, page = 1, count = 5) => (
  Answer.findAll({
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
);

const addOneQuestion = (productId, body, name, email) => (
  Question.create({
    product_id: productId,
    body,
    date_written: Math.floor(new Date().getTime()),
    asker_name: name,
    asker_email: email,
    reported: false,
    helpful: 0,
  })
);

const addOneAnswer = (questionId, body, name, email, photos = []) => (
  Answer.create({
    question_id: questionId,
    body,
    date_written: Math.floor(new Date().getTime()),
    answerer_name: name,
    answerer_email: email,
    reported: false,
    helpful: 0,
  })
    .then((data) => {
      let answers_id = data.id;
      const promises = [];
      photos.forEach((url) => {
        promises.push(AnswersPhoto.create({
          answers_id,
          url,
        }));
      });
      return Promise.all(promises);
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
    },
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
