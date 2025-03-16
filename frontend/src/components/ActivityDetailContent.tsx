// src/components/ActivityDetailContent.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { groundImages } from "../data/groundImages";

export interface Activity {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  minAge: number;
  // add any other properties you need
}

interface ActivityDetailContentProps {
  activity: Activity;
}

const ActivityDetailContent: React.FC<ActivityDetailContentProps> = ({ activity }) => {
  const facilityImages =
    (groundImages[activity.name as keyof typeof groundImages] as string[]) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to="/book"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Booking
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            {facilityImages.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Facility Images
                </h2>
                <ImageCarousel images={[...facilityImages]} />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              About this {activity.category === "social" ? "Venue" : "Activity"}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{activity.description}</p>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">
                What's Included
              </h3>
              <ul className="mt-4 space-y-4 text-gray-600">
                {activity.category === "social" ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Dedicated event coordinator
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Basic setup and cleanup
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Tables and chairs
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Basic sound system
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Professional equipment and safety gear provided
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Expert instructors and supervision
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Comprehensive safety briefing
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500">•</span>
                      Suitable for {activity.minAge}+ years
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Guidelines</h3>
              <ul className="mt-4 space-y-4 text-gray-600">
                {activity.category === "social" ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-3 text-amber-500">•</span>
                      Outside catering allowed with prior approval
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-amber-500">•</span>
                      Decorations must be approved beforehand
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-amber-500">•</span>
                      No confetti or glitter allowed
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="mr-3 text-amber-500">•</span>
                      Minimum age requirement: {activity.minAge} years
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-amber-500">•</span>
                      Follow instructor guidance at all times
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-amber-500">•</span>
                      Wear appropriate clothing and footwear
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* Optionally, you could add extra content in the third column */}
      </div>
    </div>
  );
};

export default ActivityDetailContent;
