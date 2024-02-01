# Star-Citizen-Search

  <p>
    Welcome to the Star Citizen Ship/System Search application! This web API allows users to search for Star Citizen ships/systems and retrieve relevant information.
  </p>

  <h2>Usage</h2>

  <p>
    To use the default API, no additional configuration is required. Simply make a GET request to the following endpoint:
  </p>

  <p>
    The API will automatically handle the ship name input and return the corresponding data, which will be saved to the database.

  </p>

  <h2>Configuration</h2>

  <p>
    If you wish to use your own database, set up the connection details in the `.env` file:
  </p>

  <pre> <code>DATABASE_URI="your-database-uri"</code> </pre>

  <h2>TODO List</h2>

  <ul>
    <li>Implement pagination for search results.</li>
    <li>Enhance error handling for invalid queries.</li>
    <li>Add additional ship details to the API response.</li>
    <li>Optimize the code</li>
    <li>Add filtering for ships.. combat, cargo, exploration....</li>
  </ul>

  <h2>Contributing</h2>

  <p>
    We welcome contributions! If you'd like to contribute to this project, please fork the repository and submit a pull request.
  </p>

  <h2>License</h2>

  <p>
    This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.
  </p>
