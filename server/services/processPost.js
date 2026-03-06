const { saveLogInfo } = require("../middlewares/logger/logInfo");
const createCategoryFilterService = require("./categoryFilterService");
const Config = require("../models/config.model");

/**
 * Category hierarchy mapping
 * Maps subcategories to their parent categories
 */
const CATEGORY_HIERARCHY = {
  // Programming & Technology
  "Front-end web development": ["Programming"],
  "Back-end web development": ["Programming"],
  "Full-stack web development": ["Programming"],
  "Web development": ["Programming"],
  "Game development": ["Programming"],
  "Mobile app development": ["Programming"],
  "Mobile development": ["Programming"],
  "Android development": ["Programming", "Mobile app development"],
  "iOS development": ["Programming", "Mobile app development"],
  "Machine learning": ["Programming"],
  "Artificial intelligence": ["Programming"],
  "AI": ["Programming"],
  "Data science": ["Programming"],
  "Software engineering": ["Programming"],
  "DevOps": ["Programming"],
  "Cloud computing": ["Programming"],
  "Cybersecurity": ["Programming"],
  "Blockchain": ["Programming"],
  "Python": ["Programming"],
  "JavaScript": ["Programming"],
  "Java": ["Programming"],
  "C++": ["Programming"],
  "C#": ["Programming"],
  "Ruby": ["Programming"],
  "PHP": ["Programming"],
  "Swift": ["Programming"],
  "Kotlin": ["Programming"],
  "Go": ["Programming"],
  "Rust": ["Programming"],
  "React": ["Programming", "Web development"],
  "Angular": ["Programming", "Web development"],
  "Vue.js": ["Programming", "Web development"],
  "Node.js": ["Programming", "Web development"],
  "Django": ["Programming", "Web development"],
  "Flask": ["Programming", "Web development"],
  "Database": ["Programming"],
  "SQL": ["Programming"],
  "NoSQL": ["Programming"],
  "API development": ["Programming"],
  "Web design": ["Programming", "Art and Design"],
  "UI/UX design": ["Programming", "Art and Design"],
  "Software testing": ["Programming"],
  "Debugging": ["Programming"],
  "Algorithms": ["Programming"],
  "Data structures": ["Programming"],
  "System design": ["Programming"],
  
  // Health and Fitness
  "Fitness training": ["Health and Fitness"],
  "Fitness": ["Health and Fitness"],
  "Nutrition": ["Health and Fitness"],
  "Diet": ["Health and Fitness"],
  "Healthy eating": ["Health and Fitness"],
  "Yoga": ["Health and Fitness"],
  "Meditation": ["Health and Fitness"],
  "Exercise": ["Health and Fitness"],
  "Workout": ["Health and Fitness"],
  "Cardio": ["Health and Fitness"],
  "Strength training": ["Health and Fitness"],
  "Weight training": ["Health and Fitness"],
  "Bodybuilding": ["Health and Fitness"],
  "CrossFit": ["Health and Fitness"],
  "Running": ["Health and Fitness", "Sports"],
  "Cycling": ["Health and Fitness", "Sports"],
  "Swimming": ["Health and Fitness", "Sports"],
  "Healthy lifestyle": ["Health and Fitness"],
  "Wellness": ["Health and Fitness"],
  "Mental health": ["Health and Fitness"],
  "Weight loss": ["Health and Fitness"],
  "Muscle building": ["Health and Fitness"],
  "Pilates": ["Health and Fitness"],
  "Aerobics": ["Health and Fitness"],
  "Stretching": ["Health and Fitness"],
  "Home workout": ["Health and Fitness"],
  
  // Travel
  "Travel destinations": ["Travel"],
  "Backpacking": ["Travel"],
  "Adventure travel": ["Travel"],
  "Luxury travel": ["Travel"],
  "Budget travel": ["Travel"],
  "Solo travel": ["Travel"],
  "Family travel": ["Travel"],
  "Tourism": ["Travel"],
  "Vacation": ["Travel"],
  "Holiday": ["Travel"],
  "Trip planning": ["Travel"],
  "Travel tips": ["Travel"],
  "Sightseeing": ["Travel"],
  "National parks": ["Travel"],
  "Beach vacation": ["Travel"],
  "Mountain travel": ["Travel"],
  "City travel": ["Travel"],
  "Road trip": ["Travel"],
  "International travel": ["Travel"],
  "Domestic travel": ["Travel"],
  "Travel photography": ["Travel", "Art and Design"],
  "Cultural travel": ["Travel"],
  "Eco-tourism": ["Travel"],
  "Cruise": ["Travel"],
  "Hiking": ["Travel", "Health and Fitness"],
  "Trekking": ["Travel", "Health and Fitness"],
  "Camping": ["Travel"],
  
  // Food and Cooking
  "Cooking": ["Food and Cooking"],
  "Recipes": ["Food and Cooking"],
  "Baking": ["Food and Cooking"],
  "Pastry": ["Food and Cooking"],
  "Cuisine": ["Food and Cooking"],
  "Gourmet": ["Food and Cooking"],
  "Restaurant": ["Food and Cooking"],
  "Food photography": ["Food and Cooking", "Art and Design"],
  "Culinary arts": ["Food and Cooking"],
  "Chef": ["Food and Cooking"],
  "Home cooking": ["Food and Cooking"],
  "Meal prep": ["Food and Cooking"],
  "Healthy recipes": ["Food and Cooking", "Health and Fitness"],
  "Vegan": ["Food and Cooking", "Health and Fitness"],
  "Vegetarian": ["Food and Cooking", "Health and Fitness"],
  "Desserts": ["Food and Cooking"],
  "Breakfast": ["Food and Cooking"],
  "Dinner": ["Food and Cooking"],
  "Snacks": ["Food and Cooking"],
  "Street food": ["Food and Cooking"],
  "Fast food": ["Food and Cooking"],
  "Organic food": ["Food and Cooking"],
  "Food culture": ["Food and Cooking"],
  "Wine": ["Food and Cooking"],
  "Coffee": ["Food and Cooking"],
  "Tea": ["Food and Cooking"],
  "Grilling": ["Food and Cooking"],
  "BBQ": ["Food and Cooking"],
  "Seafood": ["Food and Cooking"],
  
  // Music
  "Music genres": ["Music"],
  "Classical music": ["Music"],
  "Rock music": ["Music"],
  "Pop music": ["Music"],
  "Hip hop": ["Music"],
  "Jazz": ["Music"],
  "Blues": ["Music"],
  "Country music": ["Music"],
  "Electronic music": ["Music"],
  "EDM": ["Music"],
  "Rap": ["Music"],
  "R&B": ["Music"],
  "Indie music": ["Music"],
  "Metal": ["Music"],
  "Punk": ["Music"],
  "Folk music": ["Music"],
  "Music production": ["Music"],
  "Songwriting": ["Music"],
  "Music theory": ["Music"],
  "Musical instruments": ["Music"],
  "Guitar": ["Music"],
  "Piano": ["Music"],
  "Drums": ["Music"],
  "Singing": ["Music"],
  "Vocals": ["Music"],
  "Concert": ["Music"],
  "Live music": ["Music"],
  "Music festival": ["Music"],
  "Band": ["Music"],
  "Orchestra": ["Music"],
  "DJ": ["Music"],
  "Audio engineering": ["Music"],
  "Music education": ["Music", "Education"],
  
  // Sports
  "Football": ["Sports"],
  "Soccer": ["Sports"],
  "Basketball": ["Sports"],
  "Baseball": ["Sports"],
  "Tennis": ["Sports"],
  "Cricket": ["Sports"],
  "Golf": ["Sports"],
  "Hockey": ["Sports"],
  "Volleyball": ["Sports"],
  "Rugby": ["Sports"],
  "Boxing": ["Sports"],
  "MMA": ["Sports"],
  "Martial arts": ["Sports"],
  "Wrestling": ["Sports"],
  "Track and field": ["Sports"],
  "Marathon": ["Sports"],
  "Olympics": ["Sports"],
  "Sports news": ["Sports"],
  "Sports teams": ["Sports"],
  "Athletes": ["Sports"],
  "Sports training": ["Sports", "Health and Fitness"],
  "Coaching": ["Sports"],
  "Esports": ["Sports", "Programming"],
  "Gaming": ["Sports", "Programming"],
  "Badminton": ["Sports"],
  "Table tennis": ["Sports"],
  "Skiing": ["Sports"],
  "Snowboarding": ["Sports"],
  "Surfing": ["Sports"],
  "Skateboarding": ["Sports"],
  
  // Fashion
  "Fashion trends": ["Fashion"],
  "Fashion design": ["Fashion", "Art and Design"],
  "Clothing": ["Fashion"],
  "Style": ["Fashion"],
  "Streetwear": ["Fashion"],
  "Haute couture": ["Fashion"],
  "Fast fashion": ["Fashion"],
  "Sustainable fashion": ["Fashion"],
  "Men's fashion": ["Fashion"],
  "Women's fashion": ["Fashion"],
  "Accessories": ["Fashion"],
  "Footwear": ["Fashion"],
  "Shoes": ["Fashion"],
  "Sneakers": ["Fashion"],
  "Jewelry": ["Fashion"],
  "Makeup": ["Fashion"],
  "Beauty": ["Fashion"],
  "Cosmetics": ["Fashion"],
  "Skincare": ["Fashion", "Health and Fitness"],
  "Hair styling": ["Fashion"],
  "Fashion photography": ["Fashion", "Art and Design"],
  "Modeling": ["Fashion"],
  "Fashion industry": ["Fashion", "Business and Entrepreneurship"],
  "Luxury brands": ["Fashion"],
  "Vintage fashion": ["Fashion"],
  
  // Art and Design
  "Painting": ["Art and Design"],
  "Drawing": ["Art and Design"],
  "Sculpture": ["Art and Design"],
  "Photography": ["Art and Design"],
  "Digital art": ["Art and Design"],
  "Graphic design": ["Art and Design"],
  "Illustration": ["Art and Design"],
  "Animation": ["Art and Design"],
  "3D modeling": ["Art and Design"],
  "Interior design": ["Art and Design"],
  "Architecture": ["Art and Design"],
  "Fine arts": ["Art and Design"],
  "Visual arts": ["Art and Design"],
  "Crafts": ["Art and Design"],
  "Pottery": ["Art and Design"],
  "Ceramics": ["Art and Design"],
  "Printmaking": ["Art and Design"],
  "Typography": ["Art and Design"],
  "Logo design": ["Art and Design"],
  "Branding": ["Art and Design", "Business and Entrepreneurship"],
  "Color theory": ["Art and Design"],
  "Art history": ["Art and Design", "Education"],
  "Contemporary art": ["Art and Design"],
  "Abstract art": ["Art and Design"],
  "Street art": ["Art and Design"],
  "Graffiti": ["Art and Design"],
  "Calligraphy": ["Art and Design"],
  
  // Business and Entrepreneurship
  "Startup": ["Business and Entrepreneurship"],
  "Entrepreneurship": ["Business and Entrepreneurship"],
  "Small business": ["Business and Entrepreneurship"],
  "Business strategy": ["Business and Entrepreneurship"],
  "Marketing": ["Business and Entrepreneurship"],
  "Digital marketing": ["Business and Entrepreneurship"],
  "Social media marketing": ["Business and Entrepreneurship"],
  "Content marketing": ["Business and Entrepreneurship"],
  "Sales": ["Business and Entrepreneurship"],
  "E-commerce": ["Business and Entrepreneurship"],
  "Business development": ["Business and Entrepreneurship"],
  "Leadership": ["Business and Entrepreneurship"],
  "Management": ["Business and Entrepreneurship"],
  "Finance": ["Business and Entrepreneurship"],
  "Accounting": ["Business and Entrepreneurship"],
  "Investment": ["Business and Entrepreneurship"],
  "Stock market": ["Business and Entrepreneurship"],
  "Cryptocurrency": ["Business and Entrepreneurship", "Programming"],
  "Real estate": ["Business and Entrepreneurship"],
  "Consulting": ["Business and Entrepreneurship"],
  "Freelancing": ["Business and Entrepreneurship"],
  "Networking": ["Business and Entrepreneurship"],
  "Business plan": ["Business and Entrepreneurship"],
  "Venture capital": ["Business and Entrepreneurship"],
  "Innovation": ["Business and Entrepreneurship"],
  "Product management": ["Business and Entrepreneurship"],
  "Human resources": ["Business and Entrepreneurship"],
  "Project management": ["Business and Entrepreneurship"],
  
  // Education
  "Teaching": ["Education"],
  "Learning": ["Education"],
  "Online learning": ["Education"],
  "E-learning": ["Education"],
  "Higher education": ["Education"],
  "University": ["Education"],
  "College": ["Education"],
  "School": ["Education"],
  "K-12 education": ["Education"],
  "Early childhood education": ["Education"],
  "STEM education": ["Education"],
  "Science education": ["Education"],
  "Math education": ["Education"],
  "History education": ["Education"],
  "Language learning": ["Education"],
  "Educational technology": ["Education"],
  "EdTech": ["Education"],
  "Curriculum": ["Education"],
  "Pedagogy": ["Education"],
  "Student life": ["Education"],
  "Academic research": ["Education"],
  "Scholarship": ["Education"],
  "Educational resources": ["Education"],
  "Tutoring": ["Education"],
  "Study tips": ["Education"],
  "Exam preparation": ["Education"],
  "Distance learning": ["Education"],
  "Homeschooling": ["Education"],
  "Vocational training": ["Education"],
  "Professional development": ["Education"],
  "Certification": ["Education"],
};

/**
 * Check if a detected category is acceptable for the target community
 * Returns true if:
 * 1. Exact match
 * 2. Detected category's parent includes the target community
 */
const isCategoryAcceptable = (detectedCategory, targetCommunity) => {
  // Exact match
  if (detectedCategory === targetCommunity) {
    return true;
  }

  // Check if target community is a parent of detected category
  const parentCategories = CATEGORY_HIERARCHY[detectedCategory] || [];
  if (parentCategories.includes(targetCommunity)) {
    return true;
  }

  return false;
};

/**
 * @param next - confirmPost (/middlewares/post/confirmPost.js)
 */
const processPost = async (req, res, next) => {
  const { content, communityName } = req.body;
  const { serviceProvider, timeout } = await getSystemPreferences();

  try {
    if (serviceProvider === "disabled") {
      req.failedDetection = false;
      return next();
    }

    const categoryFilterService = createCategoryFilterService(serviceProvider);

    const categories = await categoryFilterService.getCategories(
      content,
      timeout
    );

    if (Object.keys(categories).length > 0) {
      const recommendedCommunity = Object.keys(categories)[0];

      // Check if detected category is acceptable for target community
      if (isCategoryAcceptable(recommendedCommunity, communityName)) {
        req.failedDetection = false;
        next();
      } else {
        const type = "categoryMismatch";
        const info = {
          community: communityName,
          recommendedCommunity,
        };

        return res.status(403).json({ type, info });
      }
    } else {
      req.failedDetection = true;
      next();
    }
  } catch (error) {
    const errorMessage = `Error processing post: ${error.message}`;
    console.error("ProcessPost Error Details:", {
      message: error.message,
      stack: error.stack,
      serviceProvider,
    });
    await saveLogInfo(null, errorMessage, serviceProvider, "error");
    return res.status(500).json({ message: "Error processing post", error: error.message });
  }
};

const getSystemPreferences = async () => {
  try {
    const config = await Config.findOne({}, { _id: 0, __v: 0 });

    if (!config) {
      return {
        serviceProvider: "disabled",
        timeout: 10000,
      };
    }

    const {
      categoryFilteringServiceProvider: serviceProvider = "disabled",
      categoryFilteringRequestTimeout: timeout = 10000,
    } = config;

    return {
      serviceProvider,
      timeout,
    };
  } catch (error) {
    return {
      serviceProvider: "disabled",
      timeout: 10000,
    };
  }
};

module.exports = processPost;
