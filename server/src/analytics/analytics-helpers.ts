export function incrementDateByOneMonth(dateString: string): string {
    // Split the date string into year and month parts
    const [year, month] = dateString.split('-').map(Number);
  
    // Create a Date object with the provided year and month
    const currentDate = new Date(year, month - 1); // Subtract 1 from month since it's 0-based
  
    // Add one month to the current date
    currentDate.setMonth(currentDate.getMonth() + 1);
  
    // Extract the updated year and month
    const updatedYear = currentDate.getFullYear();
    const updatedMonth = currentDate.getMonth() + 1; // Add 1 back to month to match the format
  
    // Format the updated year and month as "YYYY-MM" and return it
    const updatedDateString = `${updatedYear}-${updatedMonth.toString().padStart(2, '0')}`;
    
    return updatedDateString;
  }