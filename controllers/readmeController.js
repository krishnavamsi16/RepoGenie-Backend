const axios = require('axios');

const generateReadme = async (req, res) => {
  const { repoName, description, techStack } = req.body;

  const prompt = `
You are an AI professional documentation generator.
Create a complete README.md file for this project.

Project Name: ${repoName}
Description: ${description}
Tech Stack: ${techStack}

Include the following sections:
- Introduction
- Features
- Installation
- Usage
- Contribution
- License
`;

  try {
    const response = await axios.post(
      'http://127.0.0.1:11434/api/generate',
      {
        model: 'mistral',
        prompt: prompt,
        stream: false
      }
    );

    const result = response.data;

    if (result && result.response) {
      res.json({ readme: result.response });
    } else {
      res.status(500).json({ error: 'No response from AI model' });
    }

  } catch (error) {
    console.error('Error generating README:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate README' });
  }
};

module.exports = { generateReadme };


