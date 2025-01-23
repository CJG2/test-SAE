const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Fonction pour récupérer les fichiers .js dans un répertoire de manière récursive
function getJSFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = [...files, ...getJSFiles(fullPath)];
    } else if (fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  });

  return files;
}

// Liste des fichiers .js dans les répertoires src et backend
const srcFiles = getJSFiles('./src');
const backendFiles = getJSFiles('./backend');
const allFiles = [...srcFiles, ...backendFiles];

// Diviser les fichiers en plusieurs lots pour éviter des chemins trop longs
const batchSize = 50; // Traiter 50 fichiers par lot
const fileBatches = [];
for (let i = 0; i < allFiles.length; i += batchSize) {
  fileBatches.push(allFiles.slice(i, i + batchSize));
}

// Exécuter JSDoc pour chaque lot
fileBatches.forEach((batch, index) => {
  const command = `npx jsdoc ${batch.join(' ')} -d ./../annexes/Livrables_SAE/R3.04_Documentation-S.Thon/part-${index}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error for batch ${index}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr for batch ${index}: ${stderr}`);
      return;
    }
    console.log(`stdout for batch ${index}: ${stdout}`);
  });
});
