const app = require('../src/index');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
