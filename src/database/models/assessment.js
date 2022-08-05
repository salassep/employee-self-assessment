module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define(
    'Assessments',
    {
      assessmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Point is required',
          },
          isInt: {
            msg: 'Point must be an integer number',
          },
          min: 1,
          max: 5,
        },
      },
      period: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Period is required',
          },
          notEmpty: {
            msg: 'Period is required',
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
      criterionId: {
        type: DataTypes.INTEGER,
        field: 'criterion_id',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Criterion id is required',
          },
        },
      },
      userId: {
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'User id is required',
          },
        },
      },
      receiverId: {
        type: DataTypes.UUID,
        field: 'receiver_id',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Receiver id is required',
          },
        },
      },
    },
    {
      paranoid: true,
    },
  );

  Assessment.associate = (models) => {
    Assessment.belongsTo(models.Criteria, {
      as: 'criterion',
      foreignKey: 'criterion_id',
    });
    Assessment.belongsTo(models.Users, {
      as: 'sender',
      foreignKey: 'user_id',
    });
    Assessment.belongsTo(models.Users, {
      as: 'receiver',
      foreignKey: 'receiver_id',
    });
  };

  return Assessment;
};
