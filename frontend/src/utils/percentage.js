export default function percentage(series, value) {
  const total = series.reduce((sum, v) => sum + v, 0);
  const percent = (value / total) * 100;
  return Math.round(percent);
}
