export const Activity = {
  id: "",
  name: "",
  category: "prime" || "studio" || "union" || "junior" || "pixel",
  price: 0,
  duration: 0,
  minAge: 0,
  maxParticipants: 0,
  image: "",
  description: "",
  available: false,
};

export const Category = {
  id: "",
  name: "",
  slug: "prime" || "studio" || "union" || "junior" || "pixel",
  description: "",
  image: "",
  color: "",
};

export const TimeSlot = {
  id: "",
  time: "",
  available: false,
};

export const Booking = {
  id: "",
  activityId: "",
  date: "",
  timeSlot: "",
  participants: 0,
  totalPrice: 0,
};
