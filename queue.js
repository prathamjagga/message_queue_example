const Queue = require("bull");
const axios = require("axios");

// Initialize the queue
const myQueue = new Queue("myQueue");

// Define the job
myQueue.add(
  "postData",
  { data: "example payload" },
  {
    attempts: 10, // Number of times to retry if job fails
    backoff: {
      type: "exponential",
      delay: 1000, // Delay in milliseconds between retries
    },
    removeOnComplete: true, // Remove job from queue after completion
  }
);

// Define the job processor
myQueue.process("postData", async (job) => {
  try {
    await axios.post("https://example-api.com/data", job.data);
    console.log("Data posted successfully");
  } catch (error) {
    console.error(`Error posting data: ${error.message}`);

    // Throw error to trigger job retry
    throw error;
  }
});
