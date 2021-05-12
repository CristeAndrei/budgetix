export default function randomRgba() {
  const r = () => (Math.random() * 256) >> 0;
  const color = `rgba(${r()}, ${r()}, ${r()}, 1)`;
  return color;
}
