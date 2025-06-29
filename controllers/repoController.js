const mongoose = require('mongoose');
const Repository = require('../models/repoModel'); // Assuming you have a repository model defined
const User = require('../models/userModel'); // Assuming you have a user model defined
const Issue = require('../models/issueModel'); // Assuming you have an issue model defined

async function createRepository (req, res) { 
    
    const{ owner, name,issues,content,description,visibility} = req.body;
    try{
        if(!name ) {
            return res.status(400).json({error:"Repository name is required"});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({error:"Invalid user ID"});
        }

        if (issues && (!Array.isArray(issues) || !issues.every(id => mongoose.Types.ObjectId.isValid(id)))) {
    return res.status(400).json({ error: "Invalid issue ID(s)" });
}

        const newRepository = new Repository({
            owner,
            name,
            issues,
            content,
            description,
            visibility
        });

        const result= await newRepository.save();

        res.status(201).json({
            message: "Repository created successfully",
            repositoryID: result._id,
        });
    }
    catch (error) {
        console.error("Error creating repository:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function  getAllRepositories  (req, res)  {
    try{
                const repositories = await Repository.find({}).populate("owner").populate("issues");
                res.json(repositories);
    }
    catch (error) {
        console.error("Error fetching repositories:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function  fetchRepositoryById  (req, res)  { 
      const {id} = req.params;
    try{
      const repository= await Repository.find({_id: id})
                .populate("owner")
                .populate("issues");
                res.json(repository);
    }
    catch(error){
  console.error("Error fetching repositories:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function  fetchRepositoryByName  (req, res)  {
    const {name} = req.params;
    try{
      const repository= await Repository.find({name})
                .populate("owner")
                .populate("issues");
                res.json(repository);
    }
    catch(error){
  console.error("Error fetching repositories:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function fetchRepositoryForCurrentUser (req, res)  {
    const userId = req.params.userId;
    try {
       const repositories = await Repository.find({ owner: userId });
       if(!repositories || repositories.length === 0) {
            return res.status(404).json({ error: "No repositories found for the current user" });
        }
        res.json({ message:"Repositories found !", repositories });
    }
    catch (error) {
        console.error("Error fetching repository for current user:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function  updateRepositoryById  (req, res)  {    
    const { id } = req.params;
    const{content,description}= req.body;
    try{
   const repository = await Repository.findById(id);
   if(!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully",
            repository: updatedRepository,
        });
    }
    catch (error) {
        console.error("Error updating repository:", error);
        res.status(500).send("Internal Server Error");
    }
};
async function toggleVisibilityById  (req, res)  {
    const { id } = req.params;
    try{
   const repository = await Repository.findById(id);
   if(!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

       repository.visibility = !repository.visibility; // Toggle visibility

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository visibility toggled successfully",
            repository: updatedRepository,
        });
    }
    catch (error) {
        console.error("Error during toggling visibility:", error);
        res.status(500).send("Internal Server Error");
    };
};
async function deleteRepositoryById  (req, res)  {
    const { id } = req.params;
    try{
      const repository= await Repository.findOneAndDelete(id);
      if(!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.json({
            message: "Repository deleted successfully",
            repositoryID: id,
        });
    }
    catch (error) {
        console.error("Error deleting repository:", error);
        res.status(500).send("Internal Server Error");
    }
};
module.exports = {
    createRepository,   
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,  
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById
};