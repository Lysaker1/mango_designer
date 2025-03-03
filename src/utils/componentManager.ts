/**
 * Component Manager - Single source of truth for bicycle component compatibility
 * Handles wheels, handlebars, and other frame-specific components
 */

// Component type definitions
export interface ComponentConfig {
  path: string;
  type: string;
  price?: number;
}

// Define all wheel configurations
export const wheelConfigs = {
  // Multi-spoke wheel configurations
  multiSpoke: {
    front: {
      rimBrake: {
        path: "/models/Mango_Wheels_Front_MultiSpoke_RimBrake.glb",
        type: "45mm Deep Dish Rim",
        price: 0
      },
      discBrake: {
        path: "/models/Mango_Wheels_Front_MultiSpoke_DiscBrake.glb",
        type: "Cassette Wheel",
        price: 0
      }
    },
    rear: {
      singleCogRimBrake: {
        path: "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb",
        type: "45mm Deep Dish Rim",
        price: 0
      },
      cassetteRimBrake: {
        path: "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_RimBrake.glb",
        type: "Flipflop Wheel",
        price: 0
      },
      cassetteDiscBrake: {
        path: "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_DiscBrake.glb",
        type: "Cassette Wheel",
        price: 0
      }
    }
  },
  
  // 6 Spoke Mag wheel configurations
  sixSpokeMag: {
    front: {
      path: "/models/Mango_Wheels_Front_6SpokeMag.glb",
      type: "6 Spoke Mag Wheel",
      price: 58
    },
    rear: {
      path: "/models/Mango_Wheels_Rear_6SpokeMag.glb",
      type: "6 Spoke Mag Wheel",
      price: 58
    }
  }
};

// Frame-specific default wheel configurations and compatibility
export const frameWheelConfigs = {
  OSS: {
    defaultFront: wheelConfigs.multiSpoke.front.rimBrake,
    defaultRear: wheelConfigs.multiSpoke.rear.singleCogRimBrake,
    compatibleFront: [
      wheelConfigs.multiSpoke.front.rimBrake,
      wheelConfigs.sixSpokeMag.front
    ],
    compatibleRear: [
      wheelConfigs.multiSpoke.rear.singleCogRimBrake,
      wheelConfigs.sixSpokeMag.rear
    ]
  },
  Moosher: {
    defaultFront: wheelConfigs.multiSpoke.front.rimBrake,
    defaultRear: wheelConfigs.multiSpoke.rear.singleCogRimBrake,
    compatibleFront: [
      wheelConfigs.multiSpoke.front.rimBrake,
      wheelConfigs.sixSpokeMag.front
    ],
    compatibleRear: [
      wheelConfigs.multiSpoke.rear.singleCogRimBrake,
      wheelConfigs.sixSpokeMag.rear
    ]
  },
  OG: {
    defaultFront: wheelConfigs.multiSpoke.front.rimBrake,
    defaultRear: wheelConfigs.multiSpoke.rear.cassetteRimBrake,
    compatibleFront: [
      wheelConfigs.multiSpoke.front.rimBrake,
      wheelConfigs.sixSpokeMag.front
    ],
    compatibleRear: [
      wheelConfigs.multiSpoke.rear.cassetteRimBrake
    ]
  },
  DOG: {
    defaultFront: wheelConfigs.multiSpoke.front.discBrake,
    defaultRear: wheelConfigs.multiSpoke.rear.cassetteDiscBrake,
    compatibleFront: [
      wheelConfigs.multiSpoke.front.discBrake
    ],
    compatibleRear: [
      wheelConfigs.multiSpoke.rear.cassetteDiscBrake
    ]
  }
};

// Handlebar configurations
export const handlebarConfigs = {
  styles: {
    Riser: {
      noShifter: {
        path: "/models/Handle1_Riser_NoShifter.glb",
        type: "Riser",
        price: 0
      },
      shifter: {
        path: "/models/Handle1_Riser_Shifter.glb",
        type: "Riser",
        price: 0
      }
    },
    Drop: {
      noShifter: {
        path: "/models/Handle2_Drop_NoShifter.glb",
        type: "Drop",
        price: 0
      },
      shifter: {
        path: "/models/Handle2_Drop_Shifter.glb",
        type: "Drop",
        price: 0
      }
    },
    Track: {
      noShifter: {
        path: "/models/Handle4_Track_NoShifter.glb",
        type: "Track",
        price: 0
      },
      shifter: {
        path: "/models/Handle4_Track_Shifter.glb",
        type: "Track",
        price: 0
      }
    },
    Flat: {
      noShifter: {
        path: "/models/Handle5_Flat_NoShifter.glb",
        type: "Flat",
        price: 0
      },
      shifter: {
        path: "/models/Handle5_Flat_Shifter.glb",
        type: "Flat",
        price: 0
      }
    },
    Cruiser: {
      noShifter: {
        path: "/models/Handle6_Cruiser_NoShifter.glb",
        type: "Cruiser",
        price: 0
      },
      shifter: {
        path: "/models/Handle6_Cruiser_Shifter.glb",
        type: "Cruiser",
        price: 0
      }
    },
    Jeb: {
      noShifter: {
        path: "/models/Handle7_Jeb_NoShifter.glb",
        type: "Jeb",
        price: 0
      },
      shifter: {
        path: "/models/Handle7_Jeb_Shifter.glb",
        type: "Jeb",
        price: 0
      }
    }
  },
  // Handlebar configurations by frame type
  frameHandlebarConfigs: {
    OSS: {
      defaultStyle: "Riser",
      variant: "noShifter"
    },
    Moosher: {
      defaultStyle: "Riser",
      variant: "noShifter"
    },
    OG: {
      defaultStyle: "Riser",
      variant: "shifter"
    },
    DOG: {
      defaultStyle: "Riser",
      variant: "shifter"
    }
  }
};

/**
 * Gets the default wheel configuration for a specified frame type
 */
export const getDefaultWheelsForFrame = (frameType: string): { front: ComponentConfig, rear: ComponentConfig } => {
  const frameConfig = frameWheelConfigs[frameType as keyof typeof frameWheelConfigs] || frameWheelConfigs.OSS;
  
  return {
    front: { ...frameConfig.defaultFront },
    rear: { ...frameConfig.defaultRear }
  };
};

/**
 * Gets compatible front wheel based on frame type and desired wheel type
 * Ensures compatibility by returning an appropriate wheel if the requested one isn't compatible
 */
export const getCompatibleFrontWheel = (
  frameType: string, 
  requestedWheelPath: string
): ComponentConfig => {
  const frameConfig = frameWheelConfigs[frameType as keyof typeof frameWheelConfigs] || frameWheelConfigs.OSS;
  
  // Look for an exact match in compatible wheels
  const exactMatch = frameConfig.compatibleFront.find(wheel => wheel.path === requestedWheelPath);
  if (exactMatch) {
    return { ...exactMatch };
  }
  
  // If no match, determine what type of wheel was requested and find the closest compatible one
  if (requestedWheelPath.includes("6SpokeMag")) {
    // If 6 spoke was requested but not compatible with this frame, use default
    return { ...frameConfig.defaultFront };
  } else if (requestedWheelPath.includes("DiscBrake")) {
    // If disc brake was requested but not compatible, use default
    return { ...frameConfig.defaultFront };
  } else {
    // For any other case, return the default
    return { ...frameConfig.defaultFront };
  }
};

/**
 * Gets compatible rear wheel based on frame type and desired wheel type
 * Ensures compatibility by returning an appropriate wheel if the requested one isn't compatible
 */
export const getCompatibleRearWheel = (
  frameType: string, 
  requestedWheelPath: string
): ComponentConfig => {
  const frameConfig = frameWheelConfigs[frameType as keyof typeof frameWheelConfigs] || frameWheelConfigs.OSS;
  
  // Look for an exact match in compatible wheels
  const exactMatch = frameConfig.compatibleRear.find(wheel => wheel.path === requestedWheelPath);
  if (exactMatch) {
    return { ...exactMatch };
  }
  
  // If no match, determine what type of wheel was requested and find the closest compatible one
  if (requestedWheelPath.includes("6SpokeMag")) {
    // Check if 6 spoke is compatible with this frame
    const sixSpokeCompatible = frameConfig.compatibleRear.some(wheel => 
      wheel.path === wheelConfigs.sixSpokeMag.rear.path
    );
    
    return sixSpokeCompatible 
      ? { ...wheelConfigs.sixSpokeMag.rear }
      : { ...frameConfig.defaultRear };
  } else if (requestedWheelPath.includes("Cassette")) {
    // If cassette wheel was requested
    if (frameType === "DOG") {
      return { ...wheelConfigs.multiSpoke.rear.cassetteDiscBrake };
    } else if (frameType === "OG") {
      return { ...wheelConfigs.multiSpoke.rear.cassetteRimBrake };
    } else {
      // For frames that don't support cassette, return default
      return { ...frameConfig.defaultRear };
    }
  } else {
    // For any other case, return the default
    return { ...frameConfig.defaultRear };
  }
};

/**
 * Gets the appropriate handlebar configuration for a given frame type and style
 */
export const getHandlebarConfig = (
  frameType: string, 
  handlebarStyle?: string
): ComponentConfig => {
  const frameConfig = handlebarConfigs.frameHandlebarConfigs[frameType as keyof typeof handlebarConfigs.frameHandlebarConfigs] 
    || handlebarConfigs.frameHandlebarConfigs.OSS;
  
  const style = handlebarStyle || frameConfig.defaultStyle;
  const variant = frameConfig.variant;
  
  // Get the correct handlebar configuration
  const handlebarConfig = handlebarConfigs.styles[style as keyof typeof handlebarConfigs.styles]?.[variant as keyof typeof handlebarConfigs.styles.Riser];
  
  // Fallback to default if style not found
  if (!handlebarConfig) {
    return handlebarConfigs.styles.Riser[variant as keyof typeof handlebarConfigs.styles.Riser];
  }
  
  return { ...handlebarConfig };
};

/**
 * Extract handlebar style from path
 */
export const getHandlebarStyleFromPath = (path: string): string => {
  if (path.includes("Handle1_Riser")) return "Riser";
  if (path.includes("Handle2_Drop")) return "Drop";
  if (path.includes("Handle4_Track")) return "Track";
  if (path.includes("Handle5_Flat")) return "Flat";
  if (path.includes("Handle6_Cruiser")) return "Cruiser";
  if (path.includes("Handle7_Jeb")) return "Jeb";
  return "Riser"; // Default
};

/**
 * Get default complete configuration for a given frame type
 * Returns a set of components that should be applied when switching frames
 */
export const getDefaultConfigForFrame = (frameType: string): {
  wheels: { front: ComponentConfig, rear: ComponentConfig },
  handlebar: ComponentConfig
} => {
  const wheels = getDefaultWheelsForFrame(frameType);
  const handlebar = getHandlebarConfig(frameType);
  
  return {
    wheels,
    handlebar
  };
}; 