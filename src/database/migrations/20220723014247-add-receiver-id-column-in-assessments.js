module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Assessments',
      'receiver_id',
      {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'Assessments',
      'receiver_id',
    );
  },
};
