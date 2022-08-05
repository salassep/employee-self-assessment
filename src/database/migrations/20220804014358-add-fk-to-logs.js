module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint(
      'Logs',
      {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'log_user_id_fkey',
        references: {
          table: 'Users',
          field: 'id',
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'Logs',
      'log_user_id_fkey',
    );
  },
};
