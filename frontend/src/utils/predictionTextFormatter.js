export default function formatText(inputText) {
  const capitalize = inputText.charAt(0).toUpperCase() + inputText.slice(1);
  const split = capitalize.split("_");
  const joinText = split.join(" ");
  return joinText;
}
