const app = require("./app");
const mongoose = require("mongoose");

// Remove deprecated options (no longer needed in mongoose 6+)
mongoose.connect(process.env.DB_HOST)
  .then(() => {
    console.log("Connected to MongoDB");
    
    const PORT = process.env.PORT || 3030;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed");
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });