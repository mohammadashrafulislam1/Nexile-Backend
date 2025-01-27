import mongoose from "mongoose";

// Schema for Core Values
const CoreValueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
  }
});

// Schema for Why Choose Us
const WhyChooseUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
  }
});

// Schema for Our Impact
const ImpactSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String, 
  },
  image: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    }
  }
});

// Main About Us Schema
const AboutUsSchema = new mongoose.Schema({
  sectionTitle: {
    type: String
  },
  sectionDes: {
    type: String
  },
  metaTitle: {
    type: String
  },
  metaDes: {
    type: String
  },
  intro: {
    tagline: {
      type: String, 
    },
    whoWeAre: {
      type: String,
    }
  },
  ourStory: {
    description: {
      type: String, 
    },
    image: {
      url: {
        type: String, 
      },
      public_id: {
        type: String, 
      }
    }
  },
  ourMission: {
    description: {
      type: String,
    },
    image: {
      url: {
        type: String, 
      },
      public_id: {
        type: String, 
      }
    }
  },
  ourVision: {
    description: {
      type: String,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String, 
      }
    }
  },
  coreValues: [CoreValueSchema], 
  whyChooseUs: [WhyChooseUsSchema], 
  ourImpact: [ImpactSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const AboutModel = mongoose.model('AboutUs', AboutUsSchema);
