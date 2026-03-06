const axios = require("axios");

const getCategoriesFromTextRazor = async (content, timeout) => {
  const API_KEY = process.env.TEXTRAZOR_API_KEY;
  const API_URL = process.env.TEXTRAZOR_API_URL;

  if (!API_KEY || !API_URL) {
    throw new Error("TextRazor API key or URL not set");
  }

  const categories = {};

  const source = axios.CancelToken.source();
  const timeoutId = setTimeout(() => {
    source.cancel("TextRazor request timed out");
  }, timeout);

  try {
    const params = new URLSearchParams();
    params.append("text", content);
    // Remove 'classifiers' parameter - use default TextRazor categorization
    params.append("extractors", "entities,topics");
    params.append("cleanup.mode", "stripTags");

    console.log("TextRazor Request:", {
      url: API_URL,
      apiKeyPresent: !!API_KEY,
      contentLength: content.length,
      params: {
        text: content.substring(0, 100),
        extractors: "entities,topics",
        "cleanup.mode": "stripTags",
      },
    });

    const response = await axios.post(API_URL, params, {
      headers: {
        "X-TextRazor-Key": API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cancelToken: source.token,
    });

    console.log("TextRazor Response:", {
      status: response.status,
      data: response.data,
    });

    // Check for API errors in the response
    if (response.data.error) {
      throw new Error(`TextRazor API Error: ${response.data.error}`);
    }

    // Extract categories from topics or entities
    if (response.data.response && response.data.response.topics) {
      console.log("TextRazor Topics Found:", response.data.response.topics);
      response.data.response.topics.forEach(({ label, score }) => {
        categories[label] = score;
      });
    } else {
      console.log("No topics found in TextRazor response");
    }

    return categories;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("TextRazor request cancelled");
      return categories;
    } else if (error.response) {
      const { status, statusText, data } = error.response;
      console.error("TextRazor API Error Response:", {
        status,
        statusText,
        data,
        requestContent: content.substring(0, 100), // Log first 100 chars of content
      });
      throw new Error(`Error ${status}: ${statusText}${data?.error ? ` - ${data.error}` : ""}`);
    } else {
      throw new Error(`TextRazor API error: ${error.message}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

const getCategoriesFromClassifierAPI = async (content, timeout) => {
  const classifier_api_url = process.env.CLASSIFIER_API_URL;
  if (!classifier_api_url) {
    throw new Error("Classifier API URL not set");
  }

  const scoreThreshold = 0.2;

  const categories = {};

  const source = axios.CancelToken.source();
  const timeoutId = setTimeout(() => {
    source.cancel("Classifier API request timed out");
  }, timeout);

  try {
    const response = await axios.post(
      classifier_api_url,
      {
        text: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: source.token,
      }
    );

    if (response.data.response.categories) {
      response.data.response.categories.forEach(({ label, score }) => {
        if (score > scoreThreshold) {
          categories[label] = score;
        }
      });
    }

    return categories;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Classifier API request cancelled");
      return categories;
    } else if (error.response) {
      const { status, statusText } = error.response;
      throw new Error(`Error ${status}: ${statusText}`);
    } else {
      throw new Error(`Classifier API error: ${error.message}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

const getCategoriesFromInterfaceAPI = async (content, timeout) => {
  const API_URL = process.env.INTERFACE_API_URL;
  const API_KEY = process.env.INTERFACE_API_KEY;

  const scoreThreshold = 0.2;

  if (!API_KEY || !API_URL) {
    throw new Error("Interface API key or URL not set");
  }

  const CANDIDATE_LABELS = [
    "Programming",
    "Health and Fitness",
    "Travel",
    "Food and Cooking",
    "Music",
    "Sports",
    "Fashion",
    "Art and Design",
    "Business and Entrepreneurship",
    "Education",
  ];

  const categories = {};

  const source = axios.CancelToken.source();
  const timeoutId = setTimeout(() => {
    source.cancel("Request timed out");
  }, timeout);

  try {
    const response = await axios.post(
      API_URL,
      {
        inputs: content,
        parameters: { candidate_labels: CANDIDATE_LABELS },
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        cancelToken: source.token,
      }
    );

    const { labels, scores } = response.data;

    labels.forEach((label, index) => {
      const score = scores[index];
      if (score >= scoreThreshold) {
        categories[label] = score;
      }
    });

    return categories;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Interface API request cancelled");
      return categories;
    } else if (error.response) {
      const { status, statusText } = error.response;
      throw new Error(`Error ${status}: ${statusText}`);
    } else {
      throw new Error(`Interface API error: ${error.message}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

module.exports = {
  getCategoriesFromTextRazor,
  getCategoriesFromClassifierAPI,
  getCategoriesFromInterfaceAPI,
};
