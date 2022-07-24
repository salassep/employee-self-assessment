module.exports = (sequelize, DataTypes) => {
    const Criterion = sequelize.define(
      "Criteria", 
      {
        criteriaId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'id',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,                                                                                                                                    
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,                                                                                                                                    
        },
        position: {
          type: DataTypes.INTEGER,
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
  
    return Criterion;
  };