export function GenerateRandomBg() {
  // Generate random RGB values within a range that ensures light colors (close to white)
  const r = Math.floor(Math.random() * 150) + 100; // R component (100-255)
  const g = Math.floor(Math.random() * 150) + 100; // G component (100-255)
  const b = Math.floor(Math.random() * 150) + 100; // B component (100-255)

  // Convert RGB values to hexadecimal format
  const colorCode = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  return colorCode;
}
