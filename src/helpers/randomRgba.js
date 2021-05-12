export default function randomRgba() {
  const r = () => (Math.random() * 256) >> 0;
  return `rgba(${r()}, ${r()}, ${r()}, 1)`;
}
