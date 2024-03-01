const { StatusCodes } = require("http-status-codes");
const fs = require('fs');
const path = require('path');
const relativePath = '../../data';
  const fileName = 'data.json';
  const filePath = path.join(__dirname, relativePath, fileName);

const data = (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
          return;
        }
        try {
          const jsonData = JSON.parse(data);
    
          res.status(StatusCodes.OK).json(jsonData);
        } catch (jsonError) {
          console.error(jsonError);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error parsing JSON' });
        }
      });
};

module.exports = {
  data,
};
