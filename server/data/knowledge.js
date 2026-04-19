/**
 * Comprehensive Full Stack Knowledge Base
 * This file contains expert-level explanations for core engineering concepts.
 */

const FULL_STACK_KNOWLEDGE = [
    {
        category: "Frontend",
        topics: ["react", "virtual dom", "reconciliation"],
        title: "React Virtual DOM & Reconciliation",
        content: `React maintains a lightweight representation of the real DOM called the Virtual DOM. 
        When state changes, React creates a new VDOM tree and compares it with the previous one (a process called "diffing"). 
        
        ### Key Mechanisms:
        1. **Fiber Architecture:** React's core algorithm for rendering, which allows breaking down rendering work into chunks.
        2. **Heuristic Diffing:** React assumes that two elements of different types will produce different trees and that developers can hint which child elements are stable across renders with a \`key\` prop.
        3. **Batched Updates:** React groups multiple state updates into a single re-render for performance.`
    },
    {
        category: "Frontend",
        topics: ["hooks", "useeffect", "usestate", "usememo"],
        title: "React Hooks Deep Dive",
        content: `Hooks allow you to use state and other React features without writing a class.
        
        ### Core Hooks:
        - **useState:** Preserves values between function calls.
        - **useEffect:** Handles side effects like data fetching or subscriptions. Remember to include a dependency array to avoid infinite loops.
        - **useMemo / useCallback:** Used for performance optimization by memoizing expensive calculations or function references.
        
        ### Rules of Hooks:
        1. Only call hooks at the top level.
        2. Only call hooks from React functions.`
    },
    {
        category: "Backend",
        topics: ["node.js", "event loop", "single threaded"],
        title: "Node.js Event Loop & Architecture",
        content: `Node.js is built on the Chrome V8 engine and uses a non-blocking, event-driven I/O model.
        
        ### The Event Loop Phases:
        1. **Timers:** Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
        2. **Pending Callbacks:** Executes I/O callbacks deferred to the next loop iteration.
        3. **Poll:** Retrieves new I/O events; executes I/O related callbacks.
        4. **Check:** Executes \`setImmediate\` callbacks.
        5. **Close Callbacks:** Executes close events like \`socket.on('close', ...)\`.
        
        *Crucial:* While the JS execution is single-threaded, Node uses the \`libuv\` C++ library to handle asynchronous I/O operations via a thread pool.`
    },
    {
        category: "Backend",
        topics: ["middleware", "express", "api design"],
        title: "Express Middleware & API Best Practices",
        content: `Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.
        
        ### API Best Practices:
        - **RESTful Principles:** Use proper HTTP verbs (GET, POST, PUT, DELETE) and plural nouns for resources.
        - **Error Handling:** Use a centralized error-handling middleware.
        - **Security:** Implement \`helmet\`, rate-limiting, and CORS policies.
        - **Validation:** Use libraries like \`express-validator\` to sanitize inputs before processing.`
    },
    {
        category: "Databases",
        topics: ["sql", "nosql", "mongodb", "postgresql", "acid"],
        title: "SQL vs NoSQL Databases",
        content: `Choosing the right database depends on your data structure and scalability needs.
        
        ### SQL (e.g., PostgreSQL, MySQL):
        - Relational, predefined schema.
        - Vertically scalable.
        - Follows **ACID** (Atomicity, Consistency, Isolation, Durability).
        
        ### NoSQL (e.g., MongoDB, Redis):
        - Non-relational, dynamic schema.
        - Horizontally scalable (sharding).
        - Often follows **BASE** (Basically Available, Soft state, Eventual consistency).`
    },
    {
        category: "System Design",
        topics: ["caching", "redis", "scalability"],
        title: "Caching Strategies & Redis",
        content: `Caching is the process of storing copies of data in a temporary storage location so that they can be accessed more quickly.
        
        ### Common Strategies:
        - **Cache-Aside:** The application checks the cache; if not found, it queries the DB and updates the cache.
        - **Write-Through:** Data is written to both the cache and the DB simultaneously.
        - **TTL (Time to Live):** Ensures that stale data is eventually removed from the cache.
        
        **Redis** is an in-memory data structure store, used as a database, cache, and message broker. It supports strings, hashes, lists, sets, and more.`
    },
    {
        category: "System Design",
        topics: ["microservices", "load balancing", "monolith"],
        title: "Microservices Architecture",
        content: `Moving from a monolith to microservices requires careful consideration of communication and deployment.
        
        ### Core Concepts:
        - **API Gateway:** A single entry point for all clients, handling routing, composition, and protocol translation.
        - **Service Discovery:** Allowing services to find and communicate with each other.
        - **Load Balancing:** Distributing incoming network traffic across a group of backend servers to ensure no single server bears too much demand.`
    },
    {
        category: "DevOps",
        topics: ["docker", "containers", "deployment"],
        title: "Docker & Containerization",
        content: `Docker allows you to package an application with all of its dependencies into a standardized unit for software development.
        
        ### Key Terms:
        - **Dockerfile:** A text document that contains all the commands a user could call on the command line to assemble an image.
        - **Image:** A read-only template with instructions for creating a Docker container.
        - **Container:** A runnable instance of an image.
        - **Docker Compose:** A tool for defining and running multi-container Docker applications.`
    }
];

module.exports = { FULL_STACK_KNOWLEDGE };
