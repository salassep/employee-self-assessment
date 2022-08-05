module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'hr',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'employee',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
