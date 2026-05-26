const downloadModel = async () => {
  console.log("Downloading embedding model...");
  const { pipeline } = await import("@xenova/transformers");
  await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Model downloaded successfully!");
  process.exit(0);
};

downloadModel();