// convert to YYYY-MM-DD format
export const convertToISODate = (dateString: string): string => {
  const date = new Date(dateString);
  // Get the year, month (0-indexed, so add 1), and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // Return in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
};

// get today's date in YYYY-MM-DD format
export const getTodayDateISO = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};



// const date = new Date("Thu Aug 08 2024 00:00:00 GMT+0600");
// const formattedDate = date.toLocaleDateString("en-US", {
//   year: "numeric",
//   month: "short",
//   day: "2-digit",
// });

// console.log(formattedDate); // Output: Aug 08, 2024