module.exports = (sequelize, DataTypes) => {
    const Assessment = sequelize.define(
      "Assessments", 
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
        },
        period: {
          type: DataTypes.DATEONLY,
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
        criterionId: {
					type: DataTypes.INTEGER,
          field: 'criterion_id',
					allowNull: false
        },
        userId: {
					type: DataTypes.UUID,
          field: 'user_id',
					allowNull: false
        },
        receiverId: {
					type: DataTypes.UUID,
          field: 'receiver_id',
					allowNull: false
        },
      }
    );

    Assessment.associate = (models) => {
			Assessment.belongsTo(models.Criteria, {
				foreignKey: 'criterion_id',
			});
			Assessment.belongsTo(models.Users, {
				foreignKey: 'user_id',
			});
			Assessment.belongsTo(models.Users, {
				foreignKey: 'receiver_id',
			});
    }
  
    return Assessment;
  };