const mongoose = require('mongoose');
const Repository = require('../models/repoModel'); // Assuming you have a repository model defined
const User = require('../models/userModel'); // Assuming you have a user model defined
const Issue = require('../models/issueModel'); // Assuming you have an issue model defined
async function createIssue (req, res)  {
    const {title,description}= req.body;
    const {id} = req.params;
    try{
    const issue= new Issue({
        title,
        description,
        repository: id,
    });
    await issue.save();

    res.status(201).json(issue);
}
    catch (error) {
        console.error("Error creating issue:", error);  
        res.status(500).send("Internal Server Error");
    }
};
async function updateIssueById (req, res) {
      const {id} = req.params;
      const {title,description,status}= req.body;
      try{
  const issue = await Issue.findById(id);
  if (!issue) {
        return res.status(404).json({ error: "Issue not found" });
      }

      issue.title = title ;
      issue.description = description;
        issue.status = status;
        await issue.save();
        res.json({message: "Issue updated successfully"});
    }
    catch (error) {
        console.error("Error updating issue:", error);  
        res.status(500).send("Internal Server Error");
    }
};
async function deleteIssueById (req, res)  {
    const {id} = req.params;
    try{
        const issue = await Issue.findByIdAndDelete(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json({ message: "Issue deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting issue:", error);  
        res.status(500).send("Internal Server Error");
    }
};
async function getAllIssues  (req, res) {
    const {id} = req.params;
    try{
        const issues = await Issue.find({repository: id});
        if (!issues) {
            return res.status(404).json({ error: "No issues found for this repository" });
        }

        res.status(200).json(issues);
    }
        
    
    catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function getIssueById (req, res)  {
   const {id} = req.params;
    try{
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }           
        res.json(issue);
    }
    catch (error) {
        console.error("Error fetching issue:", error);
        res.status(500).send("Internal Server Error");
    }
};
module.exports = {  
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};