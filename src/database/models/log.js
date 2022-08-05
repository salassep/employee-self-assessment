module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'Logs',
    {
      logId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      userId: {
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'last_login_at',
      },
    },
    {
      timestamps: false,
    },
  );

  Log.associate = (models) => {
    Log.belongsTo(models.Users, {
      foreignKey: 'user_id',
    });
  };

  return Log;
};
