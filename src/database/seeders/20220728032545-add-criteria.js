module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Criteria', [
      {
        name: 'Pro Active',
        description: 'Pro active',
        position: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Empathy',
        description: 'Mutual Respect, Care, Empathy',
        position: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Open Communication Skill',
        description: 'Active Listener, Open-Minded, Effective and Efficient Communication Skill',
        position: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Self Discipline',
        description: 'Self Discipline, and Discipline Everywhere',
        position: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Commitment',
        description: 'Focus on Target and Mission, Commitment and Keep The Word',
        position: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Teamwork',
        description: 'Teamwork, Being Good Team Member, Good Follower, Good Leader',
        position: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Fairness',
        description: 'Fairness, Equality, Without Nepotism, Without Favoritism, Maturity',
        position: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Transparency',
        description: 'Transparency, Without Hidden Agenda, and Comply to Company Rule & Regulation',
        position: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Growth Mindset',
        description: 'Win-Win Problem Solving with Growth Mindset',
        position: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Decision Making',
        description: 'Precise and Right Decision Making, Aware "People vs Problem"',
        position: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Role Model',
        description: 'Act as Role Model and Inspire Others',
        position: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Criteria', null, {});
  },
};
