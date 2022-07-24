module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
      "Roles", 
      {
        roleId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'id',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,                                                                                                                                    
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
      }
    );
  
    return Role;
  };