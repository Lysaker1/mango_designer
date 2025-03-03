/**
 * Returns the appropriate front wheel path based on frame type and selected wheel type
 */
export const getFrontWheelPath = (frameType: string, selectedType?: string): string => {
  // If user selected the 6 Spoke Mag Wheel specifically
  if (selectedType === "6 Spoke Mag Wheel") {
    return "/models/Mango_Wheels_Front_6SpokeMag.glb";
  }
  
  // Default wheels based on frame type
  if (frameType === "DOG") {
    return "/models/Mango_Wheels_Front_MultiSpoke_DiscBrake.glb";
  } else {
    // OG, OSS, or Moosher
    return "/models/Mango_Wheels_Front_MultiSpoke_RimBrake.glb";
  }
};

/**
 * Returns the appropriate rear wheel path based on frame type and selected wheel type
 */
export const getRearWheelPath = (frameType: string, selectedType?: string): string => {
  // If user selected the 6 Spoke Mag Wheel specifically
  if (selectedType === "6 Spoke Mag Wheel") {
    return "/models/Mango_Wheels_Rear_6SpokeMag.glb";
  }
  
  // Default wheels based on frame type
  if (frameType === "DOG") {
    return "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_DiscBrake.glb";
  } else if (frameType === "OG") {
    return "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_RimBrake.glb";
  } else {
    // OSS or Moosher
    return "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb";
  }
};

/**
 * Returns the appropriate wheel type description based on frame type and position
 */
export const getWheelType = (frameType: string, wheelPosition: string): string => {
  if (wheelPosition === "Front Wheel") {
    return "45mm Deep Dish Rim";
  } else if (wheelPosition === "Rear Wheel") {
    if (frameType === "DOG") {
      return "Cassette Wheel";
    } else if (frameType === "OG") {
      return "Flipflop Wheel";
    } else {
      // OSS or Moosher
      return "45mm Deep Dish Rim";
    }
  }
  return "";
}; 