import React from 'react';
import { View } from 'react-native';
import { useEditProfileForm } from '../hooks/useRedux';

interface ProgressIndicatorProps {
  className?: string;
}

export default function ProgressIndicator({ className = "" }: ProgressIndicatorProps) {
  const { editProfile } = useEditProfileForm();
  const { currentStep, totalSteps } = editProfile;

  return (
    <View className={`flex-row items-center justify-center px-6 py-6 ${className}`}>
      <View className="flex-row items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isLast = stepNumber === totalSteps;
          
          return (
            <React.Fragment key={stepNumber}>
              <View 
                className={`w-16 h-1 rounded-full ${
                  isActive ? 'bg-[#E75B3B]' : 'bg-gray-300'
                }`} 
              />
              {!isLast && <View className="w-4" />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}