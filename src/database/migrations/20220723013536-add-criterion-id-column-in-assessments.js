module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Assessments',
      'criterion_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Criteria',
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
      'criterion_id',
    );
  },
};
