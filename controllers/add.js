const fs= require("fs").promises;
const path= require("path");

async function addRepo(filePath) {
    const repoPath= path.resolve(process.cwd(), ".kkvGit");
    const stagingPath = path.join(repoPath, "staging");
    try{
await fs.mkdir(stagingPath, { recursive: true });
const filename= path.basename(filePath);
await fs.copyFile(filePath, path.join(stagingPath, filename));
console.log(`File ${filename} added to staging area.`);
    }
    catch(err){
        console.error("Error adding file to repository", err);
    }
}

module.exports={addRepo};