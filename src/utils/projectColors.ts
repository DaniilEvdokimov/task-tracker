// Function to get a consistent color for a project based on its ID or name
export const getProjectColor = (project: { id: number, name: string } | null): string => {
  if (!project) return "bg-gray-200";

  // List of design-compatible background colors
  const bgColors = [
    "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-red-200", 
    "bg-purple-200", "bg-pink-200", "bg-indigo-200", "bg-teal-200",
    "bg-orange-200", "bg-cyan-200"
  ];

  // Use project ID or hash of name to select a color
  const colorIndex = project.id % bgColors.length;
  return bgColors[colorIndex];
};