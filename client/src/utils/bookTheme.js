const categoryThemes = {
  教材: "theme-blue",
  计算机教材: "theme-indigo",
  编程书: "theme-teal",
  考研资料: "theme-purple",
  备考资料: "theme-orange",
  公共课教材: "theme-green"
};

const tagColors = ["tag-coral", "tag-mint", "tag-lilac", "tag-amber", "tag-sky", "tag-rose"];

export function getBookTheme(category = "") {
  return categoryThemes[category] || "theme-slate";
}

export function getTagColorClass(tag, index = 0) {
  const hash = [...String(tag)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return tagColors[(hash + index) % tagColors.length];
}

export function getInitial(name = "") {
  return name.trim().slice(0, 1) || "同";
}
