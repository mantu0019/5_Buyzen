import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import envConfig from "./src/config/env.js";

const port = envConfig.PORT || 5000;

connectToDb();

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
