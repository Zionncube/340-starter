// database/index.js
// Database connection setup using pg module
// Import the Pool class from the pg module
const { Pool } = require("pg")
// Load environment variables from .env file
require("dotenv").config()

// ✅ One pool works both locally and on Render
// Create a new Pool instance with the connection string and SSL configuration
const pool = new Pool({
  // Connection string for the database
  connectionString: process.env.DATABASE_URL,
  // SSL configuration for the database connection
  ssl: { rejectUnauthorized: false }   // Render requires SSL
})


// Export a query function to execute SQL queries against the database
// The query function takes a SQL text and parameters, executes the query, and returns the result
module.exports = {
  // Function to execute a SQL query
  async query (text, params) {
    // Log the query text and parameters for debugging
    try {
      // Execute the query using the pool
      const res = await pool.query(text, params)
      // Log the executed query for debugging
      console.log("executed query", { text })
      // Return the result of the query
      return res
      //
    } catch (err) {
      // Log any errors that occur during query execution
      console.error("query error", { text, err })
      // Rethrow the error to be handled by the caller
      throw err
    }
  }
}

