export const findFolderById = (folders, id) => {
  for (const folder of folders) {
    if (folder.id === id) {
      return folder;
    }
    if (folder.subfolders && folder.subfolders.length > 0) {
      const found = findFolderById(folder.subfolders, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};
