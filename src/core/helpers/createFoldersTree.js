export const createFolderTree = (folders) => {
  const folderMap = {}; // Словарь для хранения папок по их ID
  const rootFolders = []; // Список папок, которые находятся в корне

  // Преобразуем плоский список папок в словарь, где ключ — ID папки
  folders.forEach((folder) => {
    folder.subfolders = []; // Инициализируем подкаталоги как пустой массив
    folderMap[folder.id] = folder; // Добавляем папку в словарь
  });

  // Проходим по всем папкам и распределяем их по структуре
  folders.forEach((folder) => {
    if (folder.parent === null) {
      rootFolders.push(folder); // Если родитель `null`, это корневая папка
    } else if (folderMap[folder.parent]) {
      folderMap[folder.parent].subfolders.push(folder); // Добавляем как подкаталог
    }
  });

  return rootFolders; // Возвращаем только корневые папки
};
