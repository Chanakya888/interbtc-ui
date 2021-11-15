const query = (where?: string): string => `
  {
    issuesConnection(orderBy: id_ASC, where: {${where ? `, ${where}` : ''}}) {
      totalCount
    }
  }
`;

export default query;
