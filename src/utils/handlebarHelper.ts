/**
 * Returns the appropriate handlebar path based on frame type and current handlebar path
 */
export const getHandlebarPath = (frameType: string, currentPath: string): string => {
  // Extract handlebar style from the current path
  let handlebarStyle = "";
  
  if (currentPath.includes("Handle1_Riser")) {
    handlebarStyle = "Riser";
  } else if (currentPath.includes("Handle2_Drop")) {
    handlebarStyle = "Drop";
  } else if (currentPath.includes("Handle4_Track")) {
    handlebarStyle = "Track";
  } else if (currentPath.includes("Handle5_Flat")) {
    handlebarStyle = "Flat";
  } else if (currentPath.includes("Handle6_Cruiser")) {
    handlebarStyle = "Cruiser";
  } else if (currentPath.includes("Handle7_Jeb")) {
    handlebarStyle = "Jeb";
  }
  
  // For Moosher and OSS frames, use NoShifter versions
  // For OG and DOG frames, use Shifter versions
  const suffix = (frameType === "OSS" || frameType === "Moosher") ? "NoShifter" : "Shifter";
  
  // Map handlebar style to the correct file path pattern
  let result;
  switch (handlebarStyle) {
    case "Riser":
      result = `/models/Handle1_Riser_${suffix}.glb`;
      break;
    case "Drop":
      result = `/models/Handle2_Drop_${suffix}.glb`;
      break;
    case "Track":
      result = `/models/Handle4_Track_${suffix}.glb`;
      break;
    case "Flat":
      result = `/models/Handle5_Flat_${suffix}.glb`;
      break;
    case "Cruiser":
      result = `/models/Handle6_Cruiser_${suffix}.glb`;
      break;
    case "Jeb":
      result = `/models/Handle7_Jeb_${suffix}.glb`;
      break;
    default:
      // Fallback to Riser as default
      result = `/models/Handle1_Riser_${suffix}.glb`;
  }
  
  console.log('handlebarHelper:', { 
    frameType, 
    currentPath, 
    handlebarStyle, 
    suffix, 
    result 
  });
  
  return result;
}; 