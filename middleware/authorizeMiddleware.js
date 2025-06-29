const Repository = require('../models/repoModel');

const authorizeRepoAccess = async (req, res, next) => {
    try {
        const repoId = req.params.id;
        const userId = req.user._id;

        const repository = await Repository.findById(repoId);
        
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        // Check if user is owner or if repo is public
        if (repository.owner.toString() !== userId.toString() && !repository.visibility) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }

        req.repository = repository;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error' });
    }
};

module.exports = { authorizeRepoAccess };