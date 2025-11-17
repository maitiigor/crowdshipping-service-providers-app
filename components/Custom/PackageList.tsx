import React from 'react';
import { Image } from 'react-native';
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
        <ThemedView className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
            <ThemedView className="flex-row items-start mb-3">
                {/* Package Image */}
                <ThemedView className="w-16 h-16 bg-orange-100 rounded-lg items-center justify-center mr-3 border border-orange-200">
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
                </ThemedView>

                {/* Package Info */}
                <ThemedView className="flex-1">
                    <ThemedView className="flex-row items-center justify-between mb-1">
                        <ThemedText className="text-lg font-semibold text-gray-900">
                            {pkg.name || `Package ${index + 1}`}
                        </ThemedText>
                        {pkg.fragile && (
                            <ThemedView className="bg-red-100 px-2 py-1 rounded-full">
                                <ThemedText className="text-red-600 text-xs font-medium">Fragile</ThemedText>
                            </ThemedView>
                        )}
                    </ThemedView>

                    {pkg.description && (
                        <ThemedText className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                            {pkg.description}
                        </ThemedText>
                    )}

                    {pkg.category && (
                        <ThemedView className="bg-blue-100 px-2 py-1 rounded-full self-start mb-2">
                            <ThemedText className="text-blue-600 text-xs font-medium">{pkg.category}</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
            </ThemedView>

            {/* Package Details */}
            <ThemedView className="border-t border-gray-200 pt-3">
                <ThemedView className="flex-row justify-between items-center mb-2">
                    <ThemedText className="text-gray-600 text-sm">Weight:</ThemedText>
                    <ThemedText className="text-gray-900 font-medium text-sm">{formatWeight(pkg.weight)}</ThemedText>
                </ThemedView>

                {pkg.dimensions && (
                    <ThemedView className="flex-row justify-between items-center mb-2">
                        <ThemedText className="text-gray-600 text-sm">Dimensions:</ThemedText>
                        <ThemedText className="text-gray-900 font-medium text-sm">{formatDimensions(pkg.dimensions)}</ThemedText>
                    </ThemedView>
                )}

                {pkg.value && (
                    <ThemedView className="flex-row justify-between items-center">
                        <ThemedText className="text-gray-600 text-sm">Value:</ThemedText>
                        <ThemedText className="text-gray-900 font-medium text-sm">{formatValue(pkg.value)}</ThemedText>
                    </ThemedView>
                )}
            </ThemedView>
        </ThemedView>
    );
};

const PackageList: React.FC<PackageListProps> = ({
    packages,
    title = "Packages",
    showTitle = true
}) => {
    if (!packages || packages.length === 0) {
        return (
            <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                {showTitle && (
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                        {title}
                    </ThemedText>
                )}
                <ThemedView className="items-center py-8">
                    <ThemedView className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
                        <ThemedText className="text-gray-400 text-2xl">📦</ThemedText>
                    </ThemedView>
                    <ThemedText className="text-gray-500 text-center">No packages found</ThemedText>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            {showTitle && (
                <ThemedView className="flex-row items-center justify-between mb-4">
                    <ThemedText className="text-lg font-semibold text-gray-900">
                        {title}
                    </ThemedText>
                    <ThemedView className="bg-orange-100 px-3 py-1 rounded-full">
                        <ThemedText className="text-orange-600 font-medium text-sm">
                            {packages.length} {packages.length === 1 ? 'item' : 'items'}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
            )}

            <ThemedView>
                {packages.map((pkg, index) => (
                    <PackageCard
                        key={pkg._id || `package-${index}`}
                        package={pkg}
                        index={index}
                    />
                ))}
            </ThemedView>
        </ThemedView >
    );
};

export default PackageList;
