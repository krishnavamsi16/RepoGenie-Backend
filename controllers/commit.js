const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');//uuid is used to generate unique commit IDs, we use v4 version because it's for daily usecases, v4 is fast, secure,simple
async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), ".kkvGit");
    const stagedPath = path.join(repoPath, "staging"); 
    const commitsPath = path.join(repoPath, "commits");
    try{
        const commitID = uuidv4();
        const commitDir = path.join(commitsPath, commitID);
        await fs.mkdir(commitDir, { recursive: true });
        const files = await fs.readdir(stagedPath);
        for (const file of files) {
            
            await fs.copyFile(path.join(stagedPath, file),path.join(commitDir, file));
        }
        await  fs.writeFile(path.join(commitDir,"commit.json"), JSON.stringify({message, date: new Date().toISOString()}));
        console.log(`commit ${commitID} created with message: ${message}`);
    }
    catch(err) {
        console.error("Error committing changes:", err);
        return;
    }
    console.log("Changes committed successfully.");
}
module.exports = { commitRepo };