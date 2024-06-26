const generateInitYears = (start_year) => {
  const month = 12;
  const endYear = new Date().getFullYear() - 1;
  const startYear = parseInt(start_year) ? parseInt(start_year) : endYear - 2; // 3개년

  const result = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearMonth = `${year}${month}`;
    result.push(yearMonth);
  }

  return result;
};

module.exports = generateInitYears;
