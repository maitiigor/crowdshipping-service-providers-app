import React from 'react';
import { Image, Text, View } from 'react-native';
import { Package } from '../../models';

interface PackageListProps {
    packages: Package[];
    title?: string;
    showTitle?: boolean;
}

interface PackageCardProps {
    package: Package;
    index: number;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, index }) => {
    const formatWeight = (weight: number | string) => {
        if (typeof weight === 'string') return weight;
        return `${weight} kg`;
    };

    const formatDimensions = (dimensions?: { length: number | string; width: number | string; height: number | string }) => {
        if (!dimensions) return 'N/A';
        return `${dimensions.length} × ${dimensions.width} × ${dimensions.height}`;
    };

    const formatValue = (value?: number | string) => {
        if (!value) return 'N/A';
        if (typeof value === 'string') return value;
        return `$${value}`;
    };

    return (
        <View className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
            <View className="flex-row items-start mb-3">
                {/* Package Image */}
                <View className="w-16 h-16 bg-orange-100 rounded-lg items-center justify-center mr-3 border border-orange-200">
                    {pkg.image ? (
                        <Image
                            source={{ uri: pkg.image }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 8,
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../../assets/images/package-sample.png')}
                            style={{
                                width: '80%',
                                height: '80%',
                                borderRadius: 6,
                            }}
                            resizeMode="cover"
                        />
                    )}
                </View>

                {/* Package Info */}
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-lg font-semibold text-gray-900">
                            {pkg.name || `Package ${index + 1}`}
                        </Text>
                        {pkg.fragile && (
                            <View className="bg-red-100 px-2 py-1 rounded-full">
                                <Text className="text-red-600 text-xs font-medium">Fragile</Text>
                            </View>
                        )}
                    </View>
                    
                    {pkg.description && (
                        <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                            {pkg.description}
                        </Text>
                    )}

                    {pkg.category && (
                        <View className="bg-blue-100 px-2 py-1 rounded-full self-start mb-2">
                            <Text className="text-blue-600 text-xs font-medium">{pkg.category}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Package Details */}
            <View className="border-t border-gray-200 pt-3">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-600 text-sm">Weight:</Text>
                    <Text className="text-gray-900 font-medium text-sm">{formatWeight(pkg.weight)}</Text>
                </View>

                {pkg.dimensions && (
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-gray-600 text-sm">Dimensions:</Text>
                        <Text className="text-gray-900 font-medium text-sm">{formatDimensions(pkg.dimensions)}</Text>
                    </View>
                )}

                {pkg.value && (
                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-600 text-sm">Value:</Text>
                        <Text className="text-gray-900 font-medium text-sm">{formatValue(pkg.value)}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const PackageList: React.FC<PackageListProps> = ({ 
    packages, 
    title = "Packages", 
    showTitle = true 
}) => {
    if (!packages || packages.length === 0) {
        return (
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                {showTitle && (
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        {title}
                    </Text>
                )}
                <View className="items-center py-8">
                    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
                        <Text className="text-gray-400 text-2xl">📦</Text>
                    </View>
                    <Text className="text-gray-500 text-center">No packages found</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            {showTitle && (
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-semibold text-gray-900">
                        {title}
                    </Text>
                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                        <Text className="text-orange-600 font-medium text-sm">
                            {packages.length} {packages.length === 1 ? 'item' : 'items'}
                        </Text>
                    </View>
                </View>
            )}

            <View>
                {packages.map((pkg, index) => (
                    <PackageCard 
                        key={pkg._id || `package-${index}`} 
                        package={pkg} 
                        index={index} 
                    />
                ))}
            </View>
        </View>
    );
};

export default PackageList;
