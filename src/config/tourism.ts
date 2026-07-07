export type SelectOption = {
  label: string;
  value: string;
  description?: string;
};

export const onboardingCopy = {
  splashTitle: "India Tourism",
  splashTagline: "Discover India, One Journey at a Time.",
  guestLabel: "Continue as Guest",
  googleLabel: "Continue with Google",
  signInLabel: "Sign In",
  signUpLabel: "Sign Up",
  stateStepTitle: "Where do you want to begin?",
  stateStepDescription: "Choose from all 28 states and 8 union territories of India.",
  districtStepDescription: "Pick a district or explore the entire state.",
  stateListLabel: "All States & Union Territories",
  districtListLabel: "Districts",
  exploreEntireStateTitle: "Explore Entire State",
  exploreEntireStateDescription: "Browse destinations across the full state",
} as const;

export const regionUiCopy = {
  stateSelectPlaceholder: "Choose a state or union territory",
  stateSearchPlaceholder: "Search states and union territories",
  districtSelectPlaceholder: "Choose a district",
  districtSelectLoadingPlaceholder: "Loading districts…",
  districtListLabel: "Districts",
  districtSearchPlaceholder: "Search districts",
  noStatesFoundTitle: "No regions found",
  noStatesFoundDescription: "Try a different spelling or clear the search.",
  noDistrictsFoundTitle: "No districts found",
  noDistrictsFoundDescription: "Try a different spelling or choose Explore Entire State.",
  districtsLoadingTitle: "Loading districts",
  districtsLoadingDescription: "Fetching districts for the selected region.",
  districtsEmptyTitle: "No districts available",
  districtsEmptyDescription: "Choose Explore Entire State to continue.",
} as const;
