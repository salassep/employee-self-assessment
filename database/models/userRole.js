module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "User_roles", 
    {
      userRoleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id',
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false
      },
    }
  );

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.Roles, {
      foreignKey: 'role_id',
    });
    UserRole.belongsTo(models.Users, {
      foreignKey: 'user_id',
    });
  };

  return UserRole;
};
  